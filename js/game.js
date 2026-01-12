// Motor principal del juego

class Game {
    constructor() {
        this.isPaused = false;
        this.speed = 1; // 1 = normal, 2 = x2, 4 = x4
        this.gameLoop = null;
        this.tickInterval = 1000; // 1 segundo por tick
        
        // Estado del juego
        this.state = {
            date: {
                year: 1,
                month: 1,
                day: 1
            },
            // Los sistemas inicializarán sus estados
        };
        
        // Referencias a los sistemas
        this.systems = {};
        
        // Historial para gráficos
        this.history = {
            gdp: [],
            population: [],
            approval: [],
            happiness: [],
            budget: [],
            dates: []
        };
    }

    // Inicializar el juego
    init() {
        // Inicializar sistemas
        this.systems.economy = new EconomySystem(this);
        this.systems.population = new PopulationSystem(this);
        this.systems.politics = new PoliticsSystem(this);
        this.systems.research = new ResearchSystem(this);
        this.systems.resources = new ResourcesSystem(this);
        this.systems.infrastructure = new InfrastructureSystem(this);
        this.systems.events = new EventsSystem(this);
        
        // Inicializar sistemas
        Object.values(this.systems).forEach(system => {
            if (system.init) system.init();
        });
        
        // Inicializar UI
        if (typeof Dashboard !== 'undefined') Dashboard.init(this);
        if (typeof Panels !== 'undefined') Panels.init(this);
        if (typeof Notifications !== 'undefined') Notifications.init();
        
        // Cargar partida guardada o crear nueva
        this.loadGame();
        
        // Configurar controles
        this.setupControls();
        
        // Iniciar guardado automático
        Storage.startAutoSave(() => this.getGameState());
        
        // Iniciar loop del juego
        this.start();
    }

    // Configurar controles de interfaz
    setupControls() {
        // Controles de tiempo
        document.getElementById('pause-btn').addEventListener('click', () => this.pause());
        document.getElementById('play-btn').addEventListener('click', () => this.setSpeed(1));
        document.getElementById('speed2-btn').addEventListener('click', () => this.setSpeed(2));
        document.getElementById('speed4-btn').addEventListener('click', () => this.setSpeed(4));
        
        // Controles de guardado
        document.getElementById('save-btn').addEventListener('click', () => this.save());
        document.getElementById('load-btn').addEventListener('click', () => this.load());
        
        // Navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const panel = btn.getAttribute('data-panel');
                this.switchPanel(panel);
            });
        });
    }

    // Pausar el juego
    pause() {
        this.isPaused = true;
        this.stop();
        this.updateTimeControls();
    }

    // Establecer velocidad
    setSpeed(speed) {
        this.speed = speed;
        this.isPaused = false;
        this.start();
        this.updateTimeControls();
    }

    // Actualizar controles de tiempo visualmente
    updateTimeControls() {
        document.querySelectorAll('.btn-control').forEach(btn => btn.classList.remove('active'));
        
        if (this.isPaused) {
            document.getElementById('pause-btn').classList.add('active');
        } else {
            if (this.speed === 1) document.getElementById('play-btn').classList.add('active');
            if (this.speed === 2) document.getElementById('speed2-btn').classList.add('active');
            if (this.speed === 4) document.getElementById('speed4-btn').classList.add('active');
        }
    }

    // Iniciar loop del juego
    start() {
        if (this.gameLoop) return;
        
        this.gameLoop = setInterval(() => {
            if (!this.isPaused) {
                this.tick();
            }
        }, this.tickInterval / this.speed);
    }

    // Detener loop del juego
    stop() {
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    }

    // Un tick del juego
    tick() {
        // Avanzar tiempo
        this.advanceTime();
        
        // Actualizar sistemas
        Object.values(this.systems).forEach(system => {
            if (system.update) system.update();
        });
        
        // Guardar en historial
        this.updateHistory();
        
        // Actualizar UI
        this.updateUI();
        
        // Verificar eventos
        this.systems.events.checkEvents();
    }

    // Avanzar tiempo
    advanceTime() {
        this.state.date.day++;
        
        if (this.state.date.day > 30) {
            this.state.date.day = 1;
            this.state.date.month++;
            
            if (this.state.date.month > 12) {
                this.state.date.month = 1;
                this.state.date.year++;
            }
        }
        
        // Actualizar display de fecha
        const dateDisplay = document.getElementById('current-date');
        if (dateDisplay) {
            dateDisplay.textContent = Helpers.formatDate(
                this.state.date.year,
                this.state.date.month,
                this.state.date.day
            );
        }
    }

    // Actualizar historial
    updateHistory() {
        const gdp = this.systems.economy.getGDP();
        const population = this.systems.population.getTotalPopulation();
        const approval = this.systems.politics.getApproval();
        const happiness = this.systems.population.getHappiness();
        const budget = this.systems.economy.getBudget();
        
        this.history.gdp.push(gdp);
        this.history.population.push(population);
        this.history.approval.push(approval);
        this.history.happiness.push(happiness);
        this.history.budget.push(budget);
        this.history.dates.push({
            year: this.state.date.year,
            month: this.state.date.month,
            day: this.state.date.day
        });
        
        // Mantener solo últimos 100 puntos
        const maxHistory = 100;
        if (this.history.gdp.length > maxHistory) {
            Object.keys(this.history).forEach(key => {
                if (Array.isArray(this.history[key])) {
                    this.history[key].shift();
                }
            });
        }
    }

    // Actualizar UI
    updateUI() {
        if (typeof Dashboard !== 'undefined') {
            Dashboard.update();
        }
        if (typeof Panels !== 'undefined') {
            Panels.update();
        }
    }

    // Cambiar de panel
    switchPanel(panelName) {
        // Ocultar todos los paneles
        document.querySelectorAll('.panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Mostrar panel seleccionado
        const panel = document.getElementById(`${panelName}-panel`);
        if (panel) {
            panel.classList.add('active');
        }
        
        // Actualizar navegación
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-panel') === panelName) {
                btn.classList.add('active');
            }
        });
    }

    // Obtener estado completo del juego
    getGameState() {
        const gameState = {
            date: { ...this.state.date },
            history: JSON.parse(JSON.stringify(this.history))
        };
        
        // Obtener estados de todos los sistemas
        Object.keys(this.systems).forEach(key => {
            if (this.systems[key].getState) {
                gameState[key] = this.systems[key].getState();
            }
        });
        
        return gameState;
    }

    // Cargar estado del juego
    loadGameState(gameState) {
        if (!gameState) return;
        
        // Cargar fecha
        if (gameState.date) {
            this.state.date = { ...gameState.date };
        }
        
        // Cargar historial
        if (gameState.history) {
            this.history = JSON.parse(JSON.stringify(gameState.history));
        }
        
        // Cargar estados de sistemas
        Object.keys(this.systems).forEach(key => {
            if (this.systems[key].loadState && gameState[key]) {
                this.systems[key].loadState(gameState[key]);
            }
        });
        
        // Actualizar UI
        this.updateUI();
        this.updateTimeControls();
        
        const dateDisplay = document.getElementById('current-date');
        if (dateDisplay) {
            dateDisplay.textContent = Helpers.formatDate(
                this.state.date.year,
                this.state.date.month,
                this.state.date.day
            );
        }
    }

    // Guardar partida
    save() {
        const saved = Storage.saveGame(this.getGameState());
        if (saved && typeof Notifications !== 'undefined') {
            Notifications.show('Partida guardada exitosamente', 'success');
        } else if (typeof Notifications !== 'undefined') {
            Notifications.show('Error al guardar partida', 'danger');
        }
    }

    // Cargar partida
    load() {
        const gameState = Storage.loadGame();
        if (gameState) {
            this.loadGameState(gameState);
            if (typeof Notifications !== 'undefined') {
                Notifications.show('Partida cargada exitosamente', 'success');
            }
        } else if (typeof Notifications !== 'undefined') {
            Notifications.show('No se encontró partida guardada', 'warning');
        }
    }

    // Cargar juego al iniciar
    loadGame() {
        const gameState = Storage.loadGame();
        if (gameState) {
            // Preguntar si quiere cargar
            if (confirm('¿Deseas cargar la partida guardada?')) {
                this.loadGameState(gameState);
                return;
            }
        }
        
        // Inicializar nuevo juego
        this.newGame();
    }

    // Nuevo juego
    newGame() {
        // Los sistemas ya están inicializados con valores por defecto
        this.updateUI();
    }
}

// Inicializar juego cuando la página cargue
let game;
window.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    game.init();
});

