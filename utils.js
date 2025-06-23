// Utilidades adicionales para Ferretería Litoral
class Utils {
    // Formateo de números y monedas
    static formatCurrency(amount) {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }

    static formatNumber(number) {
        return new Intl.NumberFormat('es-ES').format(number);
    }

    // Formateo de fechas
    static formatDate(date, format = 'short') {
        const d = new Date(date);
        const options = {
            short: { year: 'numeric', month: '2-digit', day: '2-digit' },
            long: { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            },
            time: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }
        };
        
        return d.toLocaleDateString('es-ES', options[format] || options.short);
    }

    // Validaciones
    static validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static validateSKU(sku) {
        // SKU debe tener formato XXX-### (3 letras, guión, 3 números)
        const regex = /^[A-Z]{3}-\d{3}$/;
        return regex.test(sku);
    }

    static validatePhone(phone) {
        // Formato: ###-###-#### o similar
        const regex = /^[\d\-\(\)\+\s]{10,}$/;
        return regex.test(phone);
    }

    // Generadores
    static generateSKU(categoryName) {
        const prefix = categoryName.substring(0, 3).toUpperCase();
        const number = Math.floor(Math.random() * 999) + 1;
        return `${prefix}-${number.toString().padStart(3, '0')}`;
    }

    static generateInvoiceNumber() {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const random = Math.floor(Math.random() * 9999) + 1;
        return `FAC-${year}${month}-${random.toString().padStart(4, '0')}`;
    }

    // Cálculos de negocio
    static calculateProfitMargin(costPrice, salePrice) {
        if (costPrice <= 0) return 0;
        return ((salePrice - costPrice) / costPrice) * 100;
    }

    static calculateDiscount(originalPrice, discountPercent) {
        return originalPrice * (discountPercent / 100);
    }

    static calculateTax(amount, taxRate = 0.18) {
        return amount * taxRate;
    }

    // Análisis de datos
    static getTopSellingProducts(salesData, limit = 5) {
        const productSales = {};
        
        salesData.forEach(sale => {
            sale.items.forEach(item => {
                if (productSales[item.productId]) {
                    productSales[item.productId].quantity += item.quantity;
                    productSales[item.productId].revenue += item.subtotal;
                } else {
                    productSales[item.productId] = {
                        productId: item.productId,
                        quantity: item.quantity,
                        revenue: item.subtotal
                    };
                }
            });
        });

        return Object.values(productSales)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, limit);
    }

    static getMonthlyTrend(data, months = 6) {
        const trend = [];
        const currentDate = new Date();
        
        for (let i = months - 1; i >= 0; i--) {
            const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthData = data.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getMonth() === month.getMonth() && 
                       itemDate.getFullYear() === month.getFullYear();
            });
            
            trend.push({
                month: this.formatDate(month, 'short'),
                count: monthData.length,
                total: monthData.reduce((sum, item) => sum + (item.total || item.amount || 0), 0)
            });
        }
        
        return trend;
    }

    // Manipulación de arrays
    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    static sortBy(array, key, order = 'asc') {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            
            if (order === 'desc') {
                return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
            }
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        });
    }

    // Almacenamiento y cache
    static saveToCache(key, data, ttl = 3600000) { // TTL en milisegundos (1 hora por defecto)
        const item = {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        };
        localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    }

    static getFromCache(key) {
        try {
            const item = JSON.parse(localStorage.getItem(`cache_${key}`));
            if (!item) return null;
            
            if (Date.now() - item.timestamp > item.ttl) {
                localStorage.removeItem(`cache_${key}`);
                return null;
            }
            
            return item.data;
        } catch (error) {
            return null;
        }
    }

    static clearCache() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('cache_')) {
                localStorage.removeItem(key);
            }
        });
    }

    // Exportación de datos
    static exportToCSV(data, filename, headers = null) {
        if (!data.length) return;
        
        const csvHeaders = headers || Object.keys(data[0]);
        const csvContent = [
            csvHeaders.join(','),
            ...data.map(row => 
                csvHeaders.map(header => {
                    const value = row[header];
                    // Escapar comillas y comas
                    return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
                        ? `"${value.replace(/"/g, '""')}"` 
                        : value;
                }).join(',')
            )
        ].join('\n');

        this.downloadFile(csvContent, filename, 'text/csv');
    }

    static exportToJSON(data, filename) {
        const jsonContent = JSON.stringify(data, null, 2);
        this.downloadFile(jsonContent, filename, 'application/json');
    }

    static downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Búsqueda y filtrado
    static fuzzySearch(items, query, searchFields) {
        if (!query) return items;
        
        const queryLower = query.toLowerCase();
        
        return items.filter(item => {
            return searchFields.some(field => {
                const value = item[field];
                return value && value.toString().toLowerCase().includes(queryLower);
            });
        });
    }

    static filterByDateRange(items, startDate, endDate, dateField = 'date') {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return items.filter(item => {
            const itemDate = new Date(item[dateField]);
            return itemDate >= start && itemDate <= end;
        });
    }

    // Validación de inventario
    static checkStockLevels(products) {
        return {
            outOfStock: products.filter(p => p.stock === 0),
            lowStock: products.filter(p => p.stock > 0 && p.stock <= (p.minStock || 5)),
            adequateStock: products.filter(p => p.stock > (p.minStock || 5))
        };
    }

    static calculateReorderQuantity(product, leadTimeDays = 7, dailySalesAvg = 1) {
        const safetyStock = dailySalesAvg * leadTimeDays;
        const reorderPoint = safetyStock + (product.minStock || 5);
        
        if (product.stock <= reorderPoint) {
            return Math.max(product.minStock * 2, safetyStock * 2);
        }
        
        return 0;
    }

    // Notificaciones del sistema
    static showNotification(title, message, type = 'info') {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                tag: type
            });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    // Detección de dispositivos
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    static isOnline() {
        return navigator.onLine;
    }

    // Debugging y logging
    static log(message, data = null, level = 'info') {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        
        console[level](logMessage, data || '');
        
        // Guardar en localStorage para debugging
        const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
        logs.push({ timestamp, level, message, data });
        
        // Mantener solo los últimos 100 logs
        if (logs.length > 100) {
            logs.splice(0, logs.length - 100);
        }
        
        localStorage.setItem('app_logs', JSON.stringify(logs));
    }

    static getLogs() {
        return JSON.parse(localStorage.getItem('app_logs') || '[]');
    }

    static clearLogs() {
        localStorage.removeItem('app_logs');
    }

    // Performance
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Hacer disponible globalmente
window.Utils = Utils;

// Configurar logging automático de errores
window.addEventListener('error', (e) => {
    Utils.log(`Error: ${e.message}`, {
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        stack: e.error?.stack
    }, 'error');
});

// Logging de advertencias de consola
const originalWarn = console.warn;
console.warn = function(...args) {
    Utils.log('Console warning', args, 'warn');
    originalWarn.apply(console, args);
};