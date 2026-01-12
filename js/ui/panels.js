// Paneles de Gestión

const Panels = {
    game: null,

    init(gameInstance) {
        this.game = gameInstance;
        this.initPanels();
        this.update();
    },

    initPanels() {
        // Inicializar todos los paneles
        this.initEconomyPanel();
        this.initPopulationPanel();
        this.initPoliticsPanel();
        this.initResearchPanel();
        this.initResourcesPanel();
        this.initInfrastructurePanel();
        this.initEventsPanel();
    },

    // Panel de Economía
    initEconomyPanel() {
        const panel = document.getElementById('economy-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="panel-header">
                <h2>💰 Economía</h2>
            </div>
            
            <div class="panel-section">
                <div class="section-title">Presupuesto</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Presupuesto Actual</div>
                        <div class="metric-value" id="economy-budget">$0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Deuda Nacional</div>
                        <div class="metric-value" id="economy-debt">$0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">PIB</div>
                        <div class="metric-value" id="economy-gdp">$0</div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Impuestos</div>
                <div class="section-content">
                    <div class="control-group">
                        <div class="control-label">
                            <span>Impuesto sobre la Renta</span>
                            <span class="control-value" id="income-tax-value">20%</span>
                        </div>
                        <input type="range" min="0" max="50" value="20" class="slider" id="income-tax-slider">
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>IVA</span>
                            <span class="control-value" id="vat-value">15%</span>
                        </div>
                        <input type="range" min="0" max="30" value="15" class="slider" id="vat-slider">
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Impuesto Corporativo</span>
                            <span class="control-value" id="corporate-tax-value">25%</span>
                        </div>
                        <input type="range" min="0" max="40" value="25" class="slider" id="corporate-tax-slider">
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Gastos Gubernamentales</div>
                <div class="section-content">
                    <div class="control-group">
                        <div class="control-label">
                            <span>Educación</span>
                            <span class="control-value" id="spending-education-value">15%</span>
                        </div>
                        <input type="range" min="0" max="50" value="15" class="slider" id="spending-education-slider">
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Salud</span>
                            <span class="control-value" id="spending-health-value">15%</span>
                        </div>
                        <input type="range" min="0" max="50" value="15" class="slider" id="spending-health-slider">
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Infraestructura</span>
                            <span class="control-value" id="spending-infrastructure-value">15%</span>
                        </div>
                        <input type="range" min="0" max="50" value="15" class="slider" id="spending-infrastructure-slider">
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Defensa</span>
                            <span class="control-value" id="spending-defense-value">10%</span>
                        </div>
                        <input type="range" min="0" max="50" value="10" class="slider" id="spending-defense-slider">
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Investigación</span>
                            <span class="control-value" id="spending-research-value">5%</span>
                        </div>
                        <input type="range" min="0" max="30" value="5" class="slider" id="spending-research-slider">
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Bienestar Social</span>
                            <span class="control-value" id="spending-welfare-value">10%</span>
                        </div>
                        <input type="range" min="0" max="50" value="10" class="slider" id="spending-welfare-slider">
                    </div>
                </div>
            </div>
        `;

        // Event listeners
        document.getElementById('income-tax-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.game.systems.economy.setTax('income', value);
            document.getElementById('income-tax-value').textContent = value + '%';
        });

        document.getElementById('vat-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.game.systems.economy.setTax('vat', value);
            document.getElementById('vat-value').textContent = value + '%';
        });

        document.getElementById('corporate-tax-slider').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.game.systems.economy.setTax('corporate', value);
            document.getElementById('corporate-tax-value').textContent = value + '%';
        });

        ['education', 'health', 'infrastructure', 'defense', 'research', 'welfare'].forEach(category => {
            const slider = document.getElementById(`spending-${category}-slider`);
            const valueDisplay = document.getElementById(`spending-${category}-value`);
            if (slider && valueDisplay) {
                slider.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    this.game.systems.economy.setSpending(category, value);
                    valueDisplay.textContent = value + '%';
                });
            }
        });
    },

    // Panel de Población
    initPopulationPanel() {
        const panel = document.getElementById('population-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="panel-header">
                <h2>👥 Población</h2>
            </div>
            
            <div class="panel-section">
                <div class="section-title">Estadísticas</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Población Total</div>
                        <div class="metric-value" id="population-total">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Tasa de Empleo</div>
                        <div class="metric-value" id="population-employment">0%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Nivel de Educación</div>
                        <div class="metric-value" id="population-education">0%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Nivel de Salud</div>
                        <div class="metric-value" id="population-health">0%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Felicidad</div>
                        <div class="metric-value" id="population-happiness">0%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Calidad de Vida</div>
                        <div class="metric-value" id="population-quality">0</div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Demografía</div>
                <div class="section-content">
                    <div class="control-group">
                        <div class="control-label">
                            <span>Tasa de Natalidad</span>
                            <span class="control-value" id="birth-rate-value">12</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Tasa de Mortalidad</span>
                            <span class="control-value" id="death-rate-value">8</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Tasa de Migración</span>
                            <span class="control-value" id="migration-rate-value">0</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>Esperanza de Vida</span>
                            <span class="control-value" id="life-expectancy-value">75</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Panel de Política
    initPoliticsPanel() {
        const panel = document.getElementById('politics-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="panel-header">
                <h2>🏛️ Política</h2>
            </div>
            
            <div class="panel-section">
                <div class="section-title">Estado Político</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Aprobación Ciudadana</div>
                        <div class="metric-value" id="politics-approval">50%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Estabilidad Política</div>
                        <div class="metric-value" id="politics-stability">70%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Años hasta Elecciones</div>
                        <div class="metric-value" id="politics-elections">4</div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Diplomacia</div>
                <div class="section-content">
                    <div class="control-group">
                        <div class="control-label">
                            <span>País A</span>
                            <span class="control-value" id="diplomacy-countryA">50</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>País B</span>
                            <span class="control-value" id="diplomacy-countryB">50</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <div class="control-label">
                            <span>País C</span>
                            <span class="control-value" id="diplomacy-countryC">50</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Panel de Investigación
    initResearchPanel() {
        const panel = document.getElementById('research-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="panel-header">
                <h2>🔬 Investigación</h2>
            </div>
            
            <div class="panel-section">
                <div class="section-title">Investigación Actual</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Puntos de Investigación</div>
                        <div class="metric-value" id="research-points">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Puntos por Día</div>
                        <div class="metric-value" id="research-per-day">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Investigando</div>
                        <div class="metric-value" id="research-current">Ninguna</div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Tecnologías</div>
                <div class="section-content" id="research-technologies">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>
        `;
    },

    // Panel de Recursos
    initResourcesPanel() {
        const panel = document.getElementById('resources-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="panel-header">
                <h2>⚡ Recursos</h2>
            </div>
            
            <div class="panel-section">
                <div class="section-title">Recursos Naturales</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Petróleo</div>
                        <div class="metric-value" id="resource-oil">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Gas</div>
                        <div class="metric-value" id="resource-gas">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Minerales</div>
                        <div class="metric-value" id="resource-minerals">0</div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Energía</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Producción</div>
                        <div class="metric-value" id="energy-production">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Consumo</div>
                        <div class="metric-value" id="energy-consumption">0</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Renovable</div>
                        <div class="metric-value" id="energy-renewable">0%</div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Alimentos y Agua</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Seguridad Alimentaria</div>
                        <div class="metric-value" id="food-security">100%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Seguridad del Agua</div>
                        <div class="metric-value" id="water-security">100%</div>
                    </div>
                </div>
            </div>
        `;
    },

    // Panel de Infraestructura
    initInfrastructurePanel() {
        const panel = document.getElementById('infrastructure-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="panel-header">
                <h2>🏗️ Infraestructura</h2>
            </div>
            
            <div class="panel-section">
                <div class="section-title">Calidad General</div>
                <div class="section-content">
                    <div class="metric-card">
                        <div class="metric-label">Calidad de Infraestructura</div>
                        <div class="metric-value" id="infrastructure-quality">50%</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Costo de Mantenimiento</div>
                        <div class="metric-value" id="infrastructure-maintenance">$0</div>
                    </div>
                </div>
            </div>

            <div class="panel-section">
                <div class="section-title">Construcción</div>
                <div class="section-content" id="infrastructure-buildings">
                    <!-- Se llena dinámicamente -->
                </div>
            </div>
        `;
    },

    // Panel de Eventos
    initEventsPanel() {
        const panel = document.getElementById('events-panel');
        if (!panel) return;

        panel.innerHTML = `
            <div class="panel-header">
                <h2>📰 Eventos</h2>
            </div>
            
            <div class="panel-section">
                <div class="section-title">Eventos Activos</div>
                <div class="section-content" id="events-active">
                    <p>No hay eventos activos actualmente.</p>
                </div>
            </div>
        `;
    },

    update() {
        if (!this.game) return;

        this.updateEconomyPanel();
        this.updatePopulationPanel();
        this.updatePoliticsPanel();
        this.updateResearchPanel();
        this.updateResourcesPanel();
        this.updateInfrastructurePanel();
        this.updateEventsPanel();
    },

    updateEconomyPanel() {
        const economy = this.game.systems.economy;
        
        const budgetEl = document.getElementById('economy-budget');
        if (budgetEl) budgetEl.textContent = Helpers.formatCurrency(economy.getBudget());
        
        const debtEl = document.getElementById('economy-debt');
        if (debtEl) debtEl.textContent = Helpers.formatCurrency(economy.getDebt());
        
        const gdpEl = document.getElementById('economy-gdp');
        if (gdpEl) gdpEl.textContent = Helpers.formatCurrency(economy.getGDP());
    },

    updatePopulationPanel() {
        const population = this.game.systems.population;
        const state = population.state;
        
        const elements = {
            'population-total': Helpers.formatNumber(state.total),
            'population-employment': state.employmentRate.toFixed(1) + '%',
            'population-education': state.educationLevel.toFixed(1) + '%',
            'population-health': state.healthLevel.toFixed(1) + '%',
            'population-happiness': state.happiness.toFixed(1) + '%',
            'population-quality': population.getQualityOfLife().toFixed(1),
            'birth-rate-value': state.birthRate.toFixed(2),
            'death-rate-value': state.deathRate.toFixed(2),
            'migration-rate-value': state.migrationRate.toFixed(2),
            'life-expectancy-value': state.lifeExpectancy.toFixed(1)
        };
        
        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });
    },

    updatePoliticsPanel() {
        const politics = this.game.systems.politics;
        const state = politics.state;
        
        const elements = {
            'politics-approval': state.approval.toFixed(1) + '%',
            'politics-stability': state.stability.toFixed(1) + '%',
            'politics-elections': state.yearsUntilElection,
            'diplomacy-countryA': state.diplomaticRelations.countryA.toFixed(1),
            'diplomacy-countryB': state.diplomaticRelations.countryB.toFixed(1),
            'diplomacy-countryC': state.diplomaticRelations.countryC.toFixed(1)
        };
        
        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });
    },

    updateResearchPanel() {
        const research = this.game.systems.research;
        const state = research.state;
        
        const pointsEl = document.getElementById('research-points');
        if (pointsEl) pointsEl.textContent = Helpers.formatNumber(state.researchPoints);
        
        const perDayEl = document.getElementById('research-per-day');
        if (perDayEl) perDayEl.textContent = Helpers.formatNumber(state.researchPointsPerDay);
        
        const currentEl = document.getElementById('research-current');
        if (currentEl) {
            currentEl.textContent = state.researching || 'Ninguna';
        }
        
        // Actualizar lista de tecnologías
        const techListEl = document.getElementById('research-technologies');
        if (techListEl) {
            techListEl.innerHTML = '';
            Object.keys(state.technologies).forEach(techKey => {
                const tech = state.technologies[techKey];
                const item = document.createElement('div');
                item.className = 'list-item';
                
                let status = '';
                if (tech.researched) status = '✓ Completada';
                else if (state.researching === techKey) status = '🔬 Investigando';
                else if (!tech.unlocked) status = '🔒 Bloqueada';
                else status = 'Disponible';
                
                const progress = tech.progress ? (tech.progress / tech.cost * 100).toFixed(0) : 0;
                
                item.innerHTML = `
                    <div class="list-item-info">
                        <div class="list-item-title">${techKey.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div class="list-item-desc">Costo: ${Helpers.formatNumber(tech.cost)} | ${status}</div>
                        ${state.researching === techKey ? `<div class="list-item-desc">Progreso: ${progress}%</div>` : ''}
                    </div>
                    <div class="list-item-actions">
                        ${!tech.researched && tech.unlocked && !state.researching ? 
                            `<button class="btn btn-primary" onclick="game.systems.research.startResearch('${techKey}')">Investigár</button>` : 
                            ''}
                    </div>
                `;
                techListEl.appendChild(item);
            });
        }
    },

    updateResourcesPanel() {
        const resources = this.game.systems.resources;
        const state = resources.state;
        
        const elements = {
            'resource-oil': Helpers.formatNumber(state.oil.amount),
            'resource-gas': Helpers.formatNumber(state.gas.amount),
            'resource-minerals': Helpers.formatNumber(state.minerals.amount),
            'energy-production': Helpers.formatNumber(state.energyProduction),
            'energy-consumption': Helpers.formatNumber(state.energyConsumption),
            'energy-renewable': state.renewableEnergy.toFixed(1) + '%',
            'food-security': state.foodSecurity.toFixed(1) + '%',
            'water-security': state.waterSecurity.toFixed(1) + '%'
        };
        
        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });
    },

    updateInfrastructurePanel() {
        const infrastructure = this.game.systems.infrastructure;
        const state = infrastructure.state;
        
        const qualityEl = document.getElementById('infrastructure-quality');
        if (qualityEl) qualityEl.textContent = infrastructure.getQuality().toFixed(1) + '%';
        
        const maintenanceEl = document.getElementById('infrastructure-maintenance');
        if (maintenanceEl) maintenanceEl.textContent = Helpers.formatCurrency(infrastructure.getMaintenanceCost() * 365);
        
        // Actualizar lista de edificios
        const buildingsEl = document.getElementById('infrastructure-buildings');
        if (buildingsEl) {
            buildingsEl.innerHTML = '';
            Object.keys(state.buildings).forEach(type => {
                const building = state.buildings[type];
                const item = document.createElement('div');
                item.className = 'list-item';
                
                item.innerHTML = `
                    <div class="list-item-info">
                        <div class="list-item-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                        <div class="list-item-desc">Cantidad: ${building.count} | Calidad: ${building.quality.toFixed(1)}%</div>
                    </div>
                    <div class="list-item-actions">
                        <button class="btn btn-primary" onclick="game.systems.infrastructure.buildBuilding('${type}', 1)">Construir</button>
                    </div>
                `;
                buildingsEl.appendChild(item);
            });
        }
    },

    updateEventsPanel() {
        const events = this.game.systems.events;
        const activeEl = document.getElementById('events-active');
        
        if (activeEl) {
            if (events.state.activeEvents.length === 0) {
                activeEl.innerHTML = '<p>No hay eventos activos actualmente.</p>';
            } else {
                activeEl.innerHTML = '';
                events.state.activeEvents.forEach(eventData => {
                    const item = document.createElement('div');
                    item.className = 'list-item';
                    item.innerHTML = `
                        <div class="list-item-info">
                            <div class="list-item-title">${eventData.name}</div>
                            <div class="list-item-desc">${eventData.description}</div>
                        </div>
                    `;
                    activeEl.appendChild(item);
                });
            }
        }
    }
};

