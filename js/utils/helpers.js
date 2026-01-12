// Utilidades generales

const Helpers = {
    // Formatear números con separadores de miles
    formatNumber(num) {
        if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toFixed(0);
    },

    // Formatear moneda
    formatCurrency(amount) {
        const sign = amount >= 0 ? '+' : '-';
        return sign + '$' + this.formatNumber(Math.abs(amount));
    },

    // Formatear porcentaje
    formatPercent(value) {
        const sign = value >= 0 ? '+' : '';
        return sign + value.toFixed(2) + '%';
    },

    // Formatear fecha del juego
    formatDate(year, month, day) {
        return `Año ${year}, Mes ${month}, Día ${day}`;
    },

    // Clamp: limita un valor entre min y max
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    // Interpolación lineal
    lerp(start, end, t) {
        return start + (end - start) * t;
    },

    // Número aleatorio entre min y max
    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    // Número entero aleatorio entre min y max (incluidos)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // Redondear a n decimales
    round(value, decimals = 2) {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    },

    // Calcular cambio porcentual
    percentChange(oldValue, newValue) {
        if (oldValue === 0) return 0;
        return ((newValue - oldValue) / oldValue) * 100;
    },

    // Generar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Debounce: ejecutar función después de un delay
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

