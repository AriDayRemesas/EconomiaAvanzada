// Sistema Político

class PoliticsSystem {
    constructor(game) {
        this.game = game;
        
        // Estado político
        this.state = {
            approval: 50, // 0-100
            stability: 70, // 0-100
            
            // Elecciones
            electionYear: 4,
            yearsUntilElection: 4,
            
            // Diplomacia
            diplomaticRelations: {
                countryA: 50,
                countryB: 50,
                countryC: 50
            },
            
            // Partidos
            parties: [
                { name: 'Partido Liberal', support: 35, ideology: 'liberal' },
                { name: 'Partido Conservador', support: 30, ideology: 'conservative' },
                { name: 'Partido Progresista', support: 25, ideology: 'progressive' },
                { name: 'Partido Verde', support: 10, ideology: 'green' }
            ],
            
            currentParty: 0 // Índice del partido en el poder
        };
    }

    init() {
        // Inicializar
    }

    // Obtener aprobación
    getApproval() {
        return this.state.approval;
    }

    // Obtener estabilidad
    getStability() {
        return this.state.stability;
    }

    // Actualizar sistema
    update() {
        // Actualizar aprobación
        this.updateApproval();
        
        // Actualizar estabilidad
        this.updateStability();
        
        // Actualizar elecciones
        this.updateElections();
        
        // Actualizar diplomacia
        this.updateDiplomacy();
    }

    // Actualizar aprobación
    updateApproval() {
        let approvalChange = 0;
        
        // Factores económicos
        const gdp = this.game.systems.economy.getGDP();
        const budget = this.game.systems.economy.getBudget();
        const debt = this.game.systems.economy.getDebt();
        
        // Crecimiento económico positivo aumenta aprobación
        const gdpGrowth = this.game.systems.economy.state.sectors.manufacturing.growth;
        approvalChange += gdpGrowth * 0.5;
        
        // Presupuesto positivo ayuda
        if (budget > 0) {
            approvalChange += 0.1;
        } else {
            approvalChange -= 0.2;
        }
        
        // Deuda alta reduce aprobación
        const debtRatio = debt / gdp;
        if (debtRatio > 0.6) {
            approvalChange -= 0.3;
        }
        
        // Factores sociales
        const happiness = this.game.systems.population.getHappiness();
        approvalChange += (happiness / 100 - 0.5) * 0.5;
        
        const employment = this.game.systems.population.state.employmentRate;
        if (employment > 60) {
            approvalChange += 0.1;
        } else {
            approvalChange -= 0.2;
        }
        
        // Estabilidad política
        approvalChange += (this.state.stability / 100 - 0.5) * 0.3;
        
        // Aplicar cambio
        this.state.approval = Helpers.clamp(
            this.state.approval + approvalChange,
            0,
            100
        );
    }

    // Actualizar estabilidad
    updateStability() {
        let stabilityChange = 0;
        
        // Aprobación afecta estabilidad
        stabilityChange += (this.state.approval / 100 - 0.5) * 0.5;
        
        // Empleo
        const unemployment = this.game.systems.population.state.unemploymentRate;
        if (unemployment > 10) {
            stabilityChange -= 0.2;
        }
        
        // Calidad de vida
        const qualityOfLife = this.game.systems.population.getQualityOfLife();
        stabilityChange += (qualityOfLife / 100 - 0.5) * 0.3;
        
        // Aplicar cambio
        this.state.stability = Helpers.clamp(
            this.state.stability + stabilityChange,
            0,
            100
        );
    }

    // Actualizar elecciones
    updateElections() {
        // Avanzar tiempo hasta elecciones
        if (this.game.state.date.month === 1 && this.game.state.date.day === 1) {
            this.state.yearsUntilElection--;
            
            // Si llegó el año de elecciones
            if (this.state.yearsUntilElection <= 0) {
                this.holdElection();
                this.state.yearsUntilElection = this.state.electionYear;
            }
        }
    }

    // Realizar elecciones
    holdElection() {
        // Calcular probabilidad de ganar basada en aprobación
        const winProbability = this.state.approval / 100;
        
        if (Math.random() < winProbability) {
            // Ganar elecciones
            if (typeof Notifications !== 'undefined') {
                Notifications.show('¡Has ganado las elecciones!', 'success');
            }
        } else {
            // Perder elecciones
            if (typeof Notifications !== 'undefined') {
                Notifications.show('Has perdido las elecciones. Fin del juego.', 'danger');
            }
            // Pausar juego
            if (this.game) {
                this.game.pause();
            }
        }
    }

    // Actualizar diplomacia
    updateDiplomacy() {
        // Simulación simple de relaciones diplomáticas
        Object.keys(this.state.diplomaticRelations).forEach(country => {
            const current = this.state.diplomaticRelations[country];
            
            // Variación aleatoria pequeña
            const change = (Math.random() - 0.5) * 0.5;
            this.state.diplomaticRelations[country] = Helpers.clamp(
                current + change,
                0,
                100
            );
        });
    }

    // Obtener estado
    getState() {
        return JSON.parse(JSON.stringify(this.state));
    }

    // Cargar estado
    loadState(state) {
        if (state) {
            this.state = JSON.parse(JSON.stringify(state));
        }
    }
}

