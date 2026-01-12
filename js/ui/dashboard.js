// Dashboard Principal

const Dashboard = {
    game: null,
    gdpChart: null,
    populationChart: null,

    init(gameInstance) {
        this.game = gameInstance;
        this.initCharts();
        this.update();
    },

    initCharts() {
        // Gráfico de PIB
        const gdpCtx = document.getElementById('gdp-chart');
        if (gdpCtx) {
            this.gdpChart = new Chart(gdpCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'PIB',
                        data: [],
                        borderColor: '#2563eb',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#f1f5f9' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#cbd5e1' },
                            grid: { color: '#334155' }
                        },
                        y: {
                            ticks: { color: '#cbd5e1' },
                            grid: { color: '#334155' }
                        }
                    }
                }
            });
        }

        // Gráfico de Población
        const populationCtx = document.getElementById('population-chart');
        if (populationCtx) {
            this.populationChart = new Chart(populationCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Población',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#f1f5f9' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#cbd5e1' },
                            grid: { color: '#334155' }
                        },
                        y: {
                            ticks: { color: '#cbd5e1' },
                            grid: { color: '#334155' }
                        }
                    }
                }
            });
        }
    },

    update() {
        if (!this.game) return;

        // Actualizar métricas
        this.updateMetrics();
        
        // Actualizar gráficos
        this.updateCharts();
    },

    updateMetrics() {
        const economy = this.game.systems.economy;
        const population = this.game.systems.population;
        const politics = this.game.systems.politics;

        // PIB
        const gdp = economy.getGDP();
        const gdpPrev = this.game.history.gdp[this.game.history.gdp.length - 2] || gdp;
        const gdpChange = Helpers.percentChange(gdpPrev, gdp);
        this.updateMetric('gdp-value', Helpers.formatCurrency(gdp));
        this.updateMetric('gdp-change', Helpers.formatPercent(gdpChange), gdpChange >= 0);

        // Población
        const pop = population.getTotalPopulation();
        const popPrev = this.game.history.population[this.game.history.population.length - 2] || pop;
        const popChange = Helpers.percentChange(popPrev, pop);
        this.updateMetric('population-value', Helpers.formatNumber(pop));
        this.updateMetric('population-change', Helpers.formatPercent(popChange), popChange >= 0);

        // Aprobación
        const approval = politics.getApproval();
        const approvalPrev = this.game.history.approval[this.game.history.approval.length - 2] || approval;
        const approvalChange = approval - approvalPrev;
        this.updateMetric('approval-value', approval.toFixed(1) + '%');
        this.updateMetric('approval-change', Helpers.formatPercent(approvalChange), approvalChange >= 0);

        // Presupuesto
        const budget = economy.getBudget();
        this.updateMetric('budget-value', Helpers.formatCurrency(budget));
        const income = economy.calculateIncome();
        const expenses = economy.calculateExpenses();
        const balance = income - expenses;
        this.updateMetric('budget-change', Helpers.formatCurrency(balance), balance >= 0);

        // Felicidad
        const happiness = population.getHappiness();
        const happinessPrev = this.game.history.happiness[this.game.history.happiness.length - 2] || happiness;
        const happinessChange = happiness - happinessPrev;
        this.updateMetric('happiness-value', happiness.toFixed(1) + '%');
        this.updateMetric('happiness-change', Helpers.formatPercent(happinessChange), happinessChange >= 0);

        // Calidad de vida
        const quality = population.getQualityOfLife();
        const qualityPrev = this.getPreviousQuality();
        const qualityChange = quality - qualityPrev;
        this.updateMetric('quality-value', quality.toFixed(1));
        this.updateMetric('quality-change', (qualityChange >= 0 ? '+' : '') + qualityChange.toFixed(2), qualityChange >= 0);
    },

    updateMetric(id, value, isPositive = null) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
            
            // Actualizar clase de cambio
            const changeElement = document.getElementById(id.replace('-value', '-change'));
            if (changeElement && isPositive !== null) {
                changeElement.className = 'metric-change ' + (isPositive ? 'positive' : 'negative');
            }
        }
    },

    updateCharts() {
        if (!this.game.history.gdp.length) return;

        // Actualizar gráfico de PIB
        if (this.gdpChart) {
            const labels = this.game.history.dates.map(d => 
                `Año ${d.year}, M${d.month}, D${d.day}`
            );
            this.gdpChart.data.labels = labels;
            this.gdpChart.data.datasets[0].data = this.game.history.gdp;
            this.gdpChart.update('none');
        }

        // Actualizar gráfico de Población
        if (this.populationChart) {
            const labels = this.game.history.dates.map(d => 
                `Año ${d.year}, M${d.month}, D${d.day}`
            );
            this.populationChart.data.labels = labels;
            this.populationChart.data.datasets[0].data = this.game.history.population;
            this.populationChart.update('none');
        }
    },

    getPreviousQuality() {
        // Calcular calidad previa (simplificado)
        return this.game.systems.population.getQualityOfLife();
    }
};

