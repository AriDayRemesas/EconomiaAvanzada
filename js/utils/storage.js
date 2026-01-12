// Sistema de guardado y carga de partidas

const Storage = {
    STORAGE_KEY: 'country_simulator_save',
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos

    // Guardar estado del juego
    saveGame(gameState) {
        try {
            const saveData = {
                version: '1.0',
                timestamp: Date.now(),
                gameState: gameState
            };
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Error guardando partida:', error);
            return false;
        }
    },

    // Cargar estado del juego
    loadGame() {
        try {
            const saveData = localStorage.getItem(this.STORAGE_KEY);
            if (!saveData) return null;
            
            const parsed = JSON.parse(saveData);
            return parsed.gameState;
        } catch (error) {
            console.error('Error cargando partida:', error);
            return null;
        }
    },

    // Verificar si existe una partida guardada
    hasSave() {
        return localStorage.getItem(this.STORAGE_KEY) !== null;
    },

    // Eliminar partida guardada
    deleteSave() {
        try {
            localStorage.removeItem(this.STORAGE_KEY);
            return true;
        } catch (error) {
            console.error('Error eliminando partida:', error);
            return false;
        }
    },

    // Guardar en slot específico
    saveToSlot(slot, gameState) {
        try {
            const saveData = {
                version: '1.0',
                timestamp: Date.now(),
                gameState: gameState
            };
            localStorage.setItem(`${this.STORAGE_KEY}_slot_${slot}`, JSON.stringify(saveData));
            return true;
        } catch (error) {
            console.error('Error guardando en slot:', error);
            return false;
        }
    },

    // Cargar de slot específico
    loadFromSlot(slot) {
        try {
            const saveData = localStorage.getItem(`${this.STORAGE_KEY}_slot_${slot}`);
            if (!saveData) return null;
            
            const parsed = JSON.parse(saveData);
            return parsed.gameState;
        } catch (error) {
            console.error('Error cargando de slot:', error);
            return null;
        }
    },

    // Iniciar guardado automático
    startAutoSave(gameStateGetter) {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        
        this.autoSaveInterval = setInterval(() => {
            const gameState = gameStateGetter();
            if (gameState) {
                this.saveGame(gameState);
            }
        }, this.AUTO_SAVE_INTERVAL);
    },

    // Detener guardado automático
    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }
};

