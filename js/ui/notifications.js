// Sistema de Notificaciones

const Notifications = {
    container: null,
    notifications: [],

    init() {
        this.container = document.getElementById('notifications-container');
        if (!this.container) {
            console.warn('Contenedor de notificaciones no encontrado');
        }
    },

    show(message, type = 'info', duration = 5000) {
        if (!this.container) {
            console.log(`[${type.toUpperCase()}] ${message}`);
            return;
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-header">${this.getHeader(type)}</div>
            <div class="notification-body">${message}</div>
        `;

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Remover después de la duración
        setTimeout(() => {
            this.remove(notification);
        }, duration);

        // Auto-remover al hacer click
        notification.addEventListener('click', () => {
            this.remove(notification);
        });
    },

    remove(notification) {
        if (notification && notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                const index = this.notifications.indexOf(notification);
                if (index > -1) {
                    this.notifications.splice(index, 1);
                }
            }, 300);
        }
    },

    getHeader(type) {
        const headers = {
            success: '✓ Éxito',
            warning: '⚠ Advertencia',
            danger: '✕ Error',
            info: 'ℹ Información'
        };
        return headers[type] || headers.info;
    },

    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }
};

// Añadir animación de salida al CSS (se añadirá dinámicamente si es necesario)
if (document.styleSheets.length > 0) {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

