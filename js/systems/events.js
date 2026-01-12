// Sistema de Eventos

class EventsSystem {
    constructor(game) {
        this.game = game;
        
        // Estado de eventos
        this.state = {
            lastEventDay: 0,
            eventInterval: 30, // Días entre eventos
            activeEvents: []
        };
        
        // Banco de eventos
        this.events = [
            {
                id: 'economic_boom',
                name: 'Auge Económico',
                description: 'Un boom económico temporal aumenta el PIB en 10%',
                type: 'positive',
                probability: 0.1,
                effects: {
                    economy: { gdp: 1.1, duration: 90 }
                }
            },
            {
                id: 'recession',
                name: 'Recesión Económica',
                description: 'Una recesión económica reduce el PIB en 15%',
                type: 'negative',
                probability: 0.15,
                effects: {
                    economy: { gdp: 0.85, duration: 180 },
                    politics: { approval: -10 }
                }
            },
            {
                id: 'natural_disaster',
                name: 'Desastre Natural',
                description: 'Un desastre natural causa daños a la infraestructura',
                type: 'negative',
                probability: 0.08,
                effects: {
                    infrastructure: { quality: -20 },
                    economy: { budget: -500000 },
                    politics: { approval: -5 }
                }
            },
            {
                id: 'oil_discovery',
                name: 'Descubrimiento de Petróleo',
                description: 'Se descubrió un nuevo yacimiento de petróleo',
                type: 'positive',
                probability: 0.05,
                effects: {
                    resources: { oil: 500000 },
                    economy: { gdp: 1.05 }
                }
            },
            {
                id: 'pandemic',
                name: 'Pandemia',
                description: 'Una pandemia afecta la salud de la población',
                type: 'negative',
                probability: 0.03,
                effects: {
                    population: { health: -15, deathRate: 2 },
                    economy: { gdp: 0.9, duration: 365 },
                    politics: { approval: -15 }
                }
            },
            {
                id: 'tech_breakthrough',
                name: 'Avance Tecnológico',
                description: 'Un avance tecnológico acelera la investigación',
                type: 'positive',
                probability: 0.12,
                effects: {
                    research: { pointsPerDay: 2.0, duration: 60 }
                }
            },
            {
                id: 'diplomatic_success',
                name: 'Éxito Diplomático',
                description: 'Un éxito diplomático mejora las relaciones internacionales',
                type: 'positive',
                probability: 0.1,
                effects: {
                    politics: { approval: 10, stability: 5 }
                }
            },
            {
                id: 'corruption_scandal',
                name: 'Escándalo de Corrupción',
                description: 'Un escándalo de corrupción reduce la aprobación',
                type: 'negative',
                probability: 0.07,
                effects: {
                    politics: { approval: -20, stability: -10 }
                }
            }
        ];
    }

    init() {
        // Inicializar
    }

    // Verificar eventos
    checkEvents() {
        const daysSinceLastEvent = this.game.state.date.day - this.state.lastEventDay;
        
        if (daysSinceLastEvent >= this.state.eventInterval) {
            this.triggerRandomEvent();
            this.state.lastEventDay = this.game.state.date.day;
        }
        
        // Actualizar eventos activos
        this.updateActiveEvents();
    }

    // Disparar evento aleatorio
    triggerRandomEvent() {
        // Seleccionar evento basado en probabilidad
        const availableEvents = this.events.filter(event => {
            // Verificar condiciones (simplificado)
            return Math.random() < event.probability;
        });
        
        if (availableEvents.length === 0) return;
        
        const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
        this.activateEvent(event);
    }

    // Activar evento
    activateEvent(event) {
        // Aplicar efectos inmediatos
        this.applyEventEffects(event);
        
        // Si tiene duración, agregar a eventos activos
        if (event.effects && Object.values(event.effects).some(e => e.duration)) {
            this.state.activeEvents.push({
                ...event,
                startDay: this.game.state.date.day,
                activeEffects: JSON.parse(JSON.stringify(event.effects))
            });
        }
        
        // Mostrar notificación
        if (typeof Notifications !== 'undefined') {
            Notifications.show(event.name + ': ' + event.description, event.type === 'positive' ? 'success' : 'danger');
        }
    }

    // Aplicar efectos del evento
    applyEventEffects(event) {
        if (!event.effects) return;
        
        // Efectos económicos
        if (event.effects.economy) {
            const effects = event.effects.economy;
            if (effects.gdp) {
                // Aplicar efecto multiplicador al PIB
                const currentGDP = this.game.systems.economy.getGDP();
                this.game.systems.economy._gdp = currentGDP * effects.gdp;
            }
            if (effects.budget) {
                this.game.systems.economy.state.budget += effects.budget;
            }
        }
        
        // Efectos políticos
        if (event.effects.politics) {
            const effects = event.effects.politics;
            if (effects.approval !== undefined) {
                this.game.systems.politics.state.approval = Helpers.clamp(
                    this.game.systems.politics.state.approval + effects.approval,
                    0, 100
                );
            }
            if (effects.stability !== undefined) {
                this.game.systems.politics.state.stability = Helpers.clamp(
                    this.game.systems.politics.state.stability + effects.stability,
                    0, 100
                );
            }
        }
        
        // Efectos de población
        if (event.effects.population) {
            const effects = event.effects.population;
            if (effects.health !== undefined) {
                this.game.systems.population.state.healthLevel = Helpers.clamp(
                    this.game.systems.population.state.healthLevel + effects.health,
                    0, 100
                );
            }
            if (effects.deathRate !== undefined) {
                this.game.systems.population.state.deathRate += effects.deathRate;
            }
        }
        
        // Efectos de infraestructura
        if (event.effects.infrastructure) {
            const effects = event.effects.infrastructure;
            if (effects.quality !== undefined) {
                Object.keys(this.game.systems.infrastructure.state.buildings).forEach(type => {
                    this.game.systems.infrastructure.state.buildings[type].quality = Helpers.clamp(
                        this.game.systems.infrastructure.state.buildings[type].quality + effects.quality,
                        0, 100
                    );
                });
            }
        }
        
        // Efectos de recursos
        if (event.effects.resources) {
            const effects = event.effects.resources;
            if (effects.oil !== undefined) {
                this.game.systems.resources.state.oil.amount += effects.oil;
            }
        }
        
        // Efectos de investigación
        if (event.effects.research) {
            const effects = event.effects.research;
            if (effects.pointsPerDay !== undefined) {
                this.game.systems.research.state.researchPointsPerDay *= effects.pointsPerDay;
            }
        }
    }

    // Actualizar eventos activos
    updateActiveEvents() {
        this.state.activeEvents = this.state.activeEvents.filter(eventData => {
            const daysActive = this.game.state.date.day - eventData.startDay;
            const maxDuration = Math.max(...Object.values(eventData.activeEffects).map(e => e.duration || 0));
            
            // Si excedió la duración, remover
            if (daysActive >= maxDuration) {
                // Remover efectos temporales
                if (eventData.activeEffects.research && eventData.activeEffects.research.pointsPerDay) {
                    this.game.systems.research.state.researchPointsPerDay /= eventData.activeEffects.research.pointsPerDay;
                }
                if (eventData.activeEffects.economy && eventData.activeEffects.economy.gdp) {
                    // Revertir efecto multiplicador del PIB
                    const currentGDP = this.game.systems.economy.getGDP();
                    this.game.systems.economy._gdp = currentGDP / eventData.activeEffects.economy.gdp;
                }
                return false;
            }
            
            return true;
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

