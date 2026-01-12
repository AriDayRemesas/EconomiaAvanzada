// Sistema de Infraestructura

class InfrastructureSystem {
    constructor(game) {
        this.game = game;
        
        // Estado de infraestructura
        this.state = {
            // Edificios y construcciones
            buildings: {
                schools: { count: 100, quality: 50 },
                universities: { count: 10, quality: 50 },
                hospitals: { count: 50, quality: 50 },
                roads: { count: 1000, quality: 50 }, // km
                airports: { count: 5, quality: 50 },
                ports: { count: 10, quality: 50 }
            },
            
            // Calidad general
            overallQuality: 50, // 0-100
            
            // Mantenimiento
            maintenanceCost: 100000
        };
    }

    init() {
        this.updateQuality();
        this.updateMaintenanceCost();
    }

    // Actualizar sistema
    update() {
        // Degradación natural
        this.updateDegradation();
        
        // Actualizar calidad
        this.updateQuality();
        
        // Actualizar costos de mantenimiento
        this.updateMaintenanceCost();
    }

    // Construir edificio
    buildBuilding(type, count = 1) {
        if (!this.state.buildings[type]) return false;
        
        const cost = this.getBuildingCost(type) * count;
        const budget = this.game.systems.economy.getBudget();
        
        if (budget < cost) {
            if (typeof Notifications !== 'undefined') {
                Notifications.show('Presupuesto insuficiente', 'danger');
            }
            return false;
        }
        
        // Deducir costo
        this.game.systems.economy.state.budget -= cost;
        
        // Construir
        this.state.buildings[type].count += count;
        
        // Mejorar calidad ligeramente
        this.state.buildings[type].quality = Math.min(100, this.state.buildings[type].quality + 1);
        
        this.updateQuality();
        
        if (typeof Notifications !== 'undefined') {
            Notifications.show(`${count} ${type} construidos`, 'success');
        }
        
        return true;
    }

    // Obtener costo de construcción
    getBuildingCost(type) {
        const costs = {
            schools: 50000,
            universities: 500000,
            hospitals: 300000,
            roads: 10000, // por km
            airports: 5000000,
            ports: 1000000
        };
        return costs[type] || 0;
    }

    // Mantener edificios
    maintainBuildings(type, amount) {
        if (!this.state.buildings[type]) return false;
        
        const cost = amount * this.getMaintenanceCost(type);
        const budget = this.game.systems.economy.getBudget();
        
        if (budget < cost) {
            return false;
        }
        
        this.game.systems.economy.state.budget -= cost;
        this.state.buildings[type].quality = Math.min(100, this.state.buildings[type].quality + amount / 10);
        
        this.updateQuality();
        return true;
    }

    // Obtener costo de mantenimiento por tipo
    getMaintenanceCost(type) {
        const costs = {
            schools: 1000,
            universities: 10000,
            hospitals: 5000,
            roads: 100,
            airports: 50000,
            ports: 10000
        };
        return costs[type] || 0;
    }

    // Actualizar degradación
    updateDegradation() {
        Object.keys(this.state.buildings).forEach(type => {
            const building = this.state.buildings[type];
            
            // Degradación natural
            const degradationRate = 0.01;
            building.quality = Math.max(0, building.quality - degradationRate);
            
            // Si no hay mantenimiento adecuado, degradación más rápida
            const maintenanceSpending = this.game.systems.economy.state.spending.infrastructure;
            if (maintenanceSpending < 10) {
                building.quality = Math.max(0, building.quality - degradationRate * 2);
            }
        });
    }

    // Actualizar calidad general
    updateQuality() {
        let totalQuality = 0;
        let count = 0;
        
        Object.keys(this.state.buildings).forEach(type => {
            totalQuality += this.state.buildings[type].quality;
            count++;
        });
        
        this.state.overallQuality = count > 0 ? totalQuality / count : 50;
    }

    // Actualizar costos de mantenimiento
    updateMaintenanceCost() {
        let totalCost = 0;
        
        Object.keys(this.state.buildings).forEach(type => {
            const building = this.state.buildings[type];
            const unitCost = this.getMaintenanceCost(type);
            totalCost += building.count * unitCost / 365; // Costo diario
        });
        
        this.state.maintenanceCost = totalCost;
    }

    // Obtener costo de mantenimiento total
    getMaintenanceCost() {
        return this.state.maintenanceCost;
    }

    // Obtener calidad
    getQuality() {
        return this.state.overallQuality;
    }

    // Bonus educativo
    getEducationBonus() {
        const schools = this.state.buildings.schools;
        const universities = this.state.buildings.universities;
        
        const schoolBonus = (schools.count / 100) * (schools.quality / 100) * 20;
        const universityBonus = (universities.count / 10) * (universities.quality / 100) * 30;
        
        return schoolBonus + universityBonus;
    }

    // Bonus de salud
    getHealthBonus() {
        const hospitals = this.state.buildings.hospitals;
        return (hospitals.count / 50) * (hospitals.quality / 100) * 30;
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

