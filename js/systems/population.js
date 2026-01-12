// Sistema de Población

class PopulationSystem {
    constructor(game) {
        this.game = game;
        
        // Estado de población
        this.state = {
            total: 1000000,
            ageDistribution: {
                young: 30, // 0-18
                adult: 50, // 19-65
                elderly: 20 // 65+
            },
            birthRate: 12, // por cada 1000 habitantes
            deathRate: 8, // por cada 1000 habitantes
            
            // Empleo
            employmentRate: 60, // Porcentaje de población trabajadora empleada
            unemploymentRate: 5,
            
            // Educación
            educationLevel: 50, // 0-100
            educationInvestment: 15,
            
            // Salud
            healthLevel: 60, // 0-100
            healthInvestment: 15,
            lifeExpectancy: 75,
            
            // Calidad de vida
            happiness: 50, // 0-100
            
            // Migración
            migrationRate: 0 // por mil habitantes
        };
    }

    init() {
        // Inicializar valores
    }

    // Obtener población total
    getTotalPopulation() {
        return this.state.total;
    }

    // Obtener nivel de educación
    getEducationLevel() {
        return this.state.educationLevel;
    }

    // Obtener felicidad
    getHappiness() {
        return this.state.happiness;
    }

    // Calcular calidad de vida
    getQualityOfLife() {
        const education = this.state.educationLevel;
        const health = this.state.healthLevel;
        const employment = this.state.employmentRate;
        const happiness = this.state.happiness;
        
        return (education * 0.25 + health * 0.25 + employment * 0.25 + happiness * 0.25);
    }

    // Actualizar sistema
    update() {
        // Crecimiento natural
        this.updateNaturalGrowth();
        
        // Migración
        this.updateMigration();
        
        // Empleo
        this.updateEmployment();
        
        // Educación
        this.updateEducation();
        
        // Salud
        this.updateHealth();
        
        // Felicidad
        this.updateHappiness();
        
        // Actualizar distribución de edad
        this.updateAgeDistribution();
    }

    // Actualizar crecimiento natural
    updateNaturalGrowth() {
        const births = (this.state.total * this.state.birthRate) / 1000 / 365;
        const deaths = (this.state.total * this.state.deathRate) / 1000 / 365;
        
        this.state.total += (births - deaths);
        this.state.total = Math.max(1000, this.state.total); // Mínimo 1000 habitantes
    }

    // Actualizar migración
    updateMigration() {
        // Factores que afectan migración
        const qualityOfLife = this.getQualityOfLife();
        const gdpPerCapita = this.game.systems.economy.getGDP() / this.state.total;
        const employmentOpportunity = this.state.employmentRate / 100;
        
        // Calcular tasa de migración
        // Valores positivos = inmigración, negativos = emigración
        const migrationFactor = (qualityOfLife / 100 - 0.5) * 2 + 
                                (gdpPerCapita / 5000 - 1) * 0.5 +
                                (employmentOpportunity - 0.5) * 2;
        
        this.state.migrationRate = Helpers.clamp(migrationFactor * 5, -10, 10);
        
        // Aplicar migración
        const migration = (this.state.total * this.state.migrationRate) / 1000 / 365;
        this.state.total += migration;
        this.state.total = Math.max(1000, this.state.total);
    }

    // Actualizar empleo
    updateEmployment() {
        const gdp = this.game.systems.economy.getGDP();
        const gdpGrowth = this.game.systems.economy.state.sectors.manufacturing.growth;
        
        // Tasa de empleo afectada por crecimiento económico
        const targetEmployment = 60 + gdpGrowth * 2;
        this.state.employmentRate = Helpers.lerp(
            this.state.employmentRate,
            targetEmployment,
            0.01
        );
        
        // Calcular desempleo
        this.state.unemploymentRate = 100 - this.state.employmentRate;
    }

    // Actualizar educación
    updateEducation() {
        const investment = this.game.systems.economy.state.spending.education;
        const infrastructureBonus = this.game.systems.infrastructure ? 
            this.game.systems.infrastructure.getEducationBonus() : 0;
        
        // Mejora educativa basada en inversión
        const educationGrowth = (investment / 20) * 0.1 + infrastructureBonus * 0.05;
        this.state.educationLevel = Helpers.clamp(
            this.state.educationLevel + educationGrowth,
            0,
            100
        );
        
        // Mejorar esperanza de vida con educación
        this.state.lifeExpectancy = 60 + (this.state.educationLevel * 0.3);
    }

    // Actualizar salud
    updateHealth() {
        const investment = this.game.systems.economy.state.spending.health;
        const infrastructureBonus = this.game.systems.infrastructure ?
            this.game.systems.infrastructure.getHealthBonus() : 0;
        
        // Mejora de salud basada en inversión
        const healthGrowth = (investment / 20) * 0.1 + infrastructureBonus * 0.05;
        this.state.healthLevel = Helpers.clamp(
            this.state.healthLevel + healthGrowth,
            0,
            100
        );
        
        // Reducir tasa de mortalidad con mejor salud
        const baseDeathRate = 8;
        this.state.deathRate = baseDeathRate - (this.state.healthLevel / 100) * 3;
        this.state.deathRate = Helpers.clamp(this.state.deathRate, 3, 15);
    }

    // Actualizar felicidad
    updateHappiness() {
        let happinessChange = 0;
        
        // Factores positivos
        const qualityOfLife = this.getQualityOfLife();
        happinessChange += (qualityOfLife / 100 - 0.5) * 0.5;
        
        // Empleo
        if (this.state.employmentRate > 60) {
            happinessChange += 0.1;
        } else {
            happinessChange -= 0.1;
        }
        
        // Salud
        if (this.state.healthLevel > 70) {
            happinessChange += 0.1;
        }
        
        // Educación
        if (this.state.educationLevel > 70) {
            happinessChange += 0.1;
        }
        
        // Política
        if (this.game.systems.politics) {
            const approval = this.game.systems.politics.getApproval();
            happinessChange += (approval / 100 - 0.5) * 0.3;
        }
        
        // Aplicar cambio
        this.state.happiness = Helpers.clamp(
            this.state.happiness + happinessChange,
            0,
            100
        );
    }

    // Actualizar distribución de edad
    updateAgeDistribution() {
        // Simplificado: mantener proporciones aproximadas
        // En un juego más complejo, esto sería más detallado
    }

    // Establecer inversión en educación
    setEducationInvestment(percentage) {
        this.game.systems.economy.setSpending('education', percentage);
    }

    // Establecer inversión en salud
    setHealthInvestment(percentage) {
        this.game.systems.economy.setSpending('health', percentage);
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

