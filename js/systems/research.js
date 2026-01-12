// Sistema de Investigación

class ResearchSystem {
    constructor(game) {
        this.game = game;
        
        // Estado de investigación
        this.state = {
            researchPoints: 0,
            researchPointsPerDay: 10,
            
            // Árbol de tecnologías
            technologies: {
                // Tecnología Médica
                basicMedicine: { unlocked: true, researched: true, cost: 0 },
                advancedMedicine: { unlocked: true, researched: false, cost: 500 },
                medicalResearch: { unlocked: false, researched: false, cost: 1000, requires: 'advancedMedicine' },
                geneTherapy: { unlocked: false, researched: false, cost: 2000, requires: 'medicalResearch' },
                
                // Infraestructura
                basicInfrastructure: { unlocked: true, researched: true, cost: 0 },
                modernInfrastructure: { unlocked: true, researched: false, cost: 600 },
                smartCities: { unlocked: false, researched: false, cost: 1500, requires: 'modernInfrastructure' },
                megaProjects: { unlocked: false, researched: false, cost: 3000, requires: 'smartCities' },
                
                // Energía Renovable
                solarPower: { unlocked: true, researched: false, cost: 400 },
                windPower: { unlocked: true, researched: false, cost: 400 },
                nuclearPower: { unlocked: true, researched: false, cost: 800 },
                fusionPower: { unlocked: false, researched: false, cost: 5000, requires: 'nuclearPower' },
                
                // Tecnología Militar
                basicDefense: { unlocked: true, researched: true, cost: 0 },
                modernDefense: { unlocked: true, researched: false, cost: 700 },
                advancedDefense: { unlocked: false, researched: false, cost: 2000, requires: 'modernDefense' },
                
                // Espacio
                spaceProgram: { unlocked: true, researched: false, cost: 1000 },
                satelliteTechnology: { unlocked: false, researched: false, cost: 2000, requires: 'spaceProgram' },
                moonColony: { unlocked: false, researched: false, cost: 10000, requires: 'satelliteTechnology' }
            },
            
            // Tecnologías en investigación
            researching: null
        };
    }

    init() {
        // Inicializar
    }

    // Actualizar sistema
    update() {
        // Generar puntos de investigación
        this.generateResearchPoints();
        
        // Progresar investigación actual
        this.progressResearch();
    }

    // Generar puntos de investigación
    generateResearchPoints() {
        const investment = this.game.systems.economy.state.spending.research;
        const basePoints = this.state.researchPointsPerDay;
        const investmentMultiplier = investment / 5; // 5% base
        
        this.state.researchPointsPerDay = basePoints * investmentMultiplier;
        this.state.researchPoints += this.state.researchPointsPerDay / 365;
    }

    // Progresar investigación
    progressResearch() {
        if (!this.state.researching) return;
        
        const tech = this.state.technologies[this.state.researching];
        if (!tech) {
            this.state.researching = null;
            return;
        }
        
        // Consumir puntos
        const pointsNeeded = tech.cost - (tech.progress || 0);
        if (this.state.researchPoints >= pointsNeeded) {
            this.state.researchPoints -= pointsNeeded;
            tech.progress = tech.cost;
            tech.researched = true;
            this.unlockDependentTechs(this.state.researching);
            this.state.researching = null;
            
            if (typeof Notifications !== 'undefined') {
                Notifications.show(`¡Tecnología ${this.state.researching} completada!`, 'success');
            }
        } else {
            tech.progress = (tech.progress || 0) + this.state.researchPoints;
            this.state.researchPoints = 0;
        }
    }

    // Desbloquear tecnologías dependientes
    unlockDependentTechs(techName) {
        Object.keys(this.state.technologies).forEach(key => {
            const tech = this.state.technologies[key];
            if (tech.requires === techName && !tech.unlocked) {
                tech.unlocked = true;
            }
        });
    }

    // Iniciar investigación
    startResearch(techName) {
        const tech = this.state.technologies[techName];
        if (!tech) return false;
        
        if (!tech.unlocked) {
            if (typeof Notifications !== 'undefined') {
                Notifications.show('Tecnología no desbloqueada', 'warning');
            }
            return false;
        }
        
        if (tech.researched) {
            if (typeof Notifications !== 'undefined') {
                Notifications.show('Tecnología ya investigada', 'warning');
            }
            return false;
        }
        
        if (this.state.researching) {
            if (typeof Notifications !== 'undefined') {
                Notifications.show('Ya hay una tecnología en investigación', 'warning');
            }
            return false;
        }
        
        this.state.researching = techName;
        return true;
    }

    // Obtener bonus tecnológico
    getTechBonus() {
        let bonus = 0;
        
        Object.keys(this.state.technologies).forEach(key => {
            const tech = this.state.technologies[key];
            if (tech.researched) {
                // Bonus según tipo de tecnología
                if (key.includes('Medicine')) bonus += 5;
                if (key.includes('Infrastructure')) bonus += 5;
                if (key.includes('Power')) bonus += 3;
                if (key.includes('Defense')) bonus += 2;
            }
        });
        
        return bonus;
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

