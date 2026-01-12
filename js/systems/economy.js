// Sistema Económico

class EconomySystem {
    constructor(game) {
        this.game = game;
        
        // Estado económico
        this.state = {
            // Presupuesto
            budget: 1000000, // Presupuesto inicial
            debt: 0,
            
            // Impuestos (porcentajes)
            incomeTax: 20, // Impuesto sobre la renta
            vat: 15, // IVA
            corporateTax: 25, // Impuesto corporativo
            
            // Inflación
            inflation: 2, // Porcentaje anual
            
            // Comercio
            exports: 500000,
            imports: 450000,
            tradeBalance: 50000,
            
            // Sectores económicos
            sectors: {
                agriculture: { size: 20, growth: 2 },
                manufacturing: { size: 30, growth: 3 },
                services: { size: 40, growth: 4 },
                technology: { size: 10, growth: 5 }
            },
            
            // Gastos gubernamentales
            spending: {
                education: 15,
                health: 15,
                infrastructure: 15,
                defense: 10,
                research: 5,
                welfare: 10,
                other: 30
            }
        };
    }

    init() {
        this._gdp = null; // Inicializar PIB
        this.updateGDP();
    }

    // Calcular PIB
    getGDP() {
        if (!this._gdp) {
            this.updateGDP();
        }
        return this._gdp || 5000000;
    }

    updateGDP() {
        const population = this.game.systems.population.getTotalPopulation();
        const baseGDP = population * 5000; // PIB base per cápita
        
        // Modificadores
        let modifier = 1;
        
        // Efecto de infraestructura
        if (this.game.systems.infrastructure) {
            const infraQuality = this.game.systems.infrastructure.getQuality();
            modifier *= (0.7 + infraQuality / 100);
        }
        
        // Efecto de educación
        const educationLevel = this.game.systems.population.getEducationLevel();
        modifier *= (0.8 + educationLevel / 100);
        
        // Efecto de tecnología
        if (this.game.systems.research) {
            const techBonus = this.game.systems.research.getTechBonus();
            modifier *= (1 + techBonus / 100);
        }
        
        // Efecto de recursos
        if (this.game.systems.resources) {
            const resourceBonus = this.game.systems.resources.getEconomicBonus();
            modifier *= (1 + resourceBonus / 100);
        }
        
        // Calcular PIB
        this._gdp = baseGDP * modifier;
        
        // Aplicar inflación
        const inflationEffect = 1 + (this.state.inflation / 100) / 365;
        this._gdp *= Math.pow(inflationEffect, this.game.state.date.day);
    }

    // Calcular ingresos
    calculateIncome() {
        const gdp = this.getGDP();
        const population = this.game.systems.population.getTotalPopulation();
        
        // Ingresos por impuestos
        const incomeFromTaxes = gdp * (this.state.incomeTax / 100) * 0.3 +
                                gdp * (this.state.vat / 100) * 0.4 +
                                gdp * (this.state.corporateTax / 100) * 0.3;
        
        // Ingresos por comercio
        const tradeIncome = this.state.tradeBalance * 0.5;
        
        // Otros ingresos
        const otherIncome = gdp * 0.05;
        
        return incomeFromTaxes + tradeIncome + otherIncome;
    }

    // Calcular gastos
    calculateExpenses() {
        const gdp = this.getGDP();
        const baseSpending = gdp * 0.25; // 25% del PIB en gasto público
        
        const expenses = {
            education: baseSpending * (this.state.spending.education / 100),
            health: baseSpending * (this.state.spending.health / 100),
            infrastructure: baseSpending * (this.state.spending.infrastructure / 100),
            defense: baseSpending * (this.state.spending.defense / 100),
            research: baseSpending * (this.state.spending.research / 100),
            welfare: baseSpending * (this.state.spending.welfare / 100),
            other: baseSpending * (this.state.spending.other / 100)
        };
        
        // Gastos de mantenimiento de infraestructura
        if (this.game.systems.infrastructure) {
            expenses.infrastructureMaintenance = this.game.systems.infrastructure.getMaintenanceCost();
        }
        
        // Intereses de deuda
        expenses.debtInterest = this.state.debt * 0.02 / 365;
        
        return Object.values(expenses).reduce((sum, val) => sum + val, 0);
    }

    // Actualizar sistema
    update() {
        // Calcular ingresos y gastos
        const income = this.calculateIncome();
        const expenses = this.calculateExpenses();
        
        // Actualizar presupuesto
        this.state.budget += (income - expenses);
        
        // Si hay déficit, aumentar deuda
        if (income < expenses) {
            this.state.debt += (expenses - income);
        } else {
            // Reducir deuda con superávit
            const surplus = income - expenses;
            this.state.debt = Math.max(0, this.state.debt - surplus * 0.3);
        }
        
        // Actualizar comercio
        this.updateTrade();
        
        // Actualizar sectores
        this.updateSectors();
        
        // Actualizar inflación
        this.updateInflation();
        
        // Actualizar PIB
        this.updateGDP();
    }

    // Actualizar comercio
    updateTrade() {
        const gdp = this.getGDP();
        
        // Exportaciones base
        const baseExports = gdp * 0.1;
        this.state.exports = baseExports * (1 + this.state.sectors.manufacturing.growth / 100);
        
        // Importaciones
        const baseImports = gdp * 0.09;
        this.state.imports = baseImports;
        
        // Balance comercial
        this.state.tradeBalance = this.state.exports - this.state.imports;
    }

    // Actualizar sectores
    updateSectors() {
        Object.keys(this.state.sectors).forEach(sector => {
            const growth = this.state.sectors[sector].growth;
            this.state.sectors[sector].size *= (1 + growth / 100 / 365);
        });
        
        // Normalizar para que sumen 100
        const total = Object.values(this.state.sectors).reduce((sum, s) => sum + s.size, 0);
        Object.keys(this.state.sectors).forEach(sector => {
            this.state.sectors[sector].size = (this.state.sectors[sector].size / total) * 100;
        });
    }

    // Actualizar inflación
    updateInflation() {
        const baseInflation = 2;
        
        // Factores que afectan inflación
        let inflationChange = 0;
        
        // Déficit aumenta inflación
        const income = this.calculateIncome();
        const expenses = this.calculateExpenses();
        if (expenses > income) {
            inflationChange += 0.1;
        }
        
        // Deuda alta aumenta inflación
        const gdp = this.getGDP();
        const debtRatio = this.state.debt / gdp;
        if (debtRatio > 0.6) {
            inflationChange += 0.2;
        }
        
        this.state.inflation = Helpers.clamp(baseInflation + inflationChange, -5, 20);
    }

    // Obtener presupuesto
    getBudget() {
        return this.state.budget;
    }

    // Obtener deuda
    getDebt() {
        return this.state.debt;
    }

    // Establecer impuesto
    setTax(type, value) {
        if (type === 'income') this.state.incomeTax = Helpers.clamp(value, 0, 50);
        if (type === 'vat') this.state.vat = Helpers.clamp(value, 0, 30);
        if (type === 'corporate') this.state.corporateTax = Helpers.clamp(value, 0, 40);
    }

    // Establecer gasto
    setSpending(category, percentage) {
        if (this.state.spending[category] !== undefined) {
            this.state.spending[category] = Helpers.clamp(percentage, 0, 100);
        }
    }

    // Obtener estado
    getState() {
        const state = JSON.parse(JSON.stringify(this.state));
        state._gdp = this._gdp; // Incluir PIB en el estado
        return state;
    }

    // Cargar estado
    loadState(state) {
        if (state) {
            this.state = JSON.parse(JSON.stringify(state));
            if (state._gdp !== undefined) {
                this._gdp = state._gdp;
            }
        }
    }
}

