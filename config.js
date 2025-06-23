// Configuración de la aplicación Ferretería Litoral
const AppConfig = {
    // Información de la empresa
    company: {
        name: 'Ferretería Litoral',
        slogan: 'Sistema de Gestión Empresarial',
        version: '1.0.0',
        buildDate: '2025-06-23'
    },

    // Configuración de la aplicación
    app: {
        autoSave: true,
        autoSaveInterval: 5000, // 5 segundos
        maxBackups: 5,
        language: 'es',
        currency: 'USD',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'America/Mexico_City'
    },

    // Configuración de inventario
    inventory: {
        defaultMinStock: 5,
        lowStockThreshold: 10,
        autoGenerateSKU: true,
        skuPrefix: {
            'Herramientas': 'HER',
            'Construcción': 'CON',
            'Plomería': 'PLO',
            'Eléctrico': 'ELE',
            'Pintura': 'PIN'
        }
    },

    // Configuración de ventas
    sales: {
        autoGenerateInvoice: true,
        invoicePrefix: 'FAC',
        defaultCustomer: 'Cliente General',
        requireCustomerName: false,
        autoUpdateStock: true,
        allowNegativeStock: false
    },

    // Configuración de reportes
    reports: {
        defaultPeriod: 'month',
        includeGraphics: true,
        exportFormat: 'json',
        maxReportItems: 1000
    },

    // Configuración de UI
    ui: {
        theme: 'light',
        sidebarCollapsed: false,
        animationsEnabled: true,
        notificationDuration: 3000,
        autoHideNotifications: true,
        chartAnimationDuration: 800
    },

    // Configuración de datos
    data: {
        enableLocalStorage: true,
        enableAutoBackup: true,
        backupInterval: 86400000, // 24 horas
        maxLocalStorageSize: 10485760, // 10MB
        compressionEnabled: false
    },

    // Configuración de seguridad
    security: {
        enableSessionTimeout: false,
        sessionTimeout: 3600000, // 1 hora
        enableDataEncryption: false,
        maxLoginAttempts: 3
    },

    // Configuración de features
    features: {
        enableAdvancedReports: true,
        enableDataExport: true,
        enableDataImport: true,
        enableNotifications: true,
        enableOfflineMode: true,
        enableDarkMode: false,
        enableMultiCurrency: false,
        enableBarcodeScan: false,
        enablePrintReceipts: false
    },

    // Configuración de validaciones
    validation: {
        strictSKUFormat: false,
        requireProductDescription: false,
        requireExpenseReceipt: false,
        validateEmailFormat: true,
        validatePhoneFormat: false,
        minimumPasswordLength: 6
    },

    // Configuración de formatos
    formats: {
        currency: {
            symbol: '$',
            precision: 2,
            thousands: ',',
            decimal: '.',
            format: '%s%v' // %s = symbol, %v = value
        },
        date: {
            short: 'DD/MM/YYYY',
            long: 'DD [de] MMMM [de] YYYY',
            time: 'DD/MM/YYYY HH:mm'
        },
        number: {
            thousands: ',',
            decimal: '.'
        }
    },

    // Configuración de categorías por defecto
    defaultCategories: [
        { name: 'Herramientas', description: 'Herramientas manuales y eléctricas' },
        { name: 'Construcción', description: 'Materiales de construcción' },
        { name: 'Plomería', description: 'Productos de plomería' },
        { name: 'Eléctrico', description: 'Materiales eléctricos' },
        { name: 'Pintura', description: 'Pinturas y accesorios' }
    ],

    // Configuración de categorías de gastos
    expenseCategories: [
        'Alquiler',
        'Servicios',
        'Compras',
        'Marketing',
        'Mantenimiento',
        'Transporte',
        'Seguros',
        'Impuestos',
        'Otros'
    ],

    // Configuración de colores del tema
    colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#06b6d4',
        light: '#f8fafc',
        dark: '#1e293b'
    },

    // Configuración de gráficos
    charts: {
        defaultType: 'bar',
        animationDuration: 800,
        responsive: true,
        maintainAspectRatio: false,
        colors: ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'],
        gridLines: true,
        showLegend: true,
        showTooltips: true
    },

    // Configuración de tablas
    tables: {
        itemsPerPage: 25,
        showPagination: true,
        sortable: true,
        searchable: true,
        exportable: true
    },

    // Configuración de notificaciones
    notifications: {
        position: 'top-right',
        duration: 3000,
        maxVisible: 5,
        showProgress: true,
        enableSound: false,
        types: {
            success: { icon: 'fas fa-check-circle', color: '#10b981' },
            warning: { icon: 'fas fa-exclamation-triangle', color: '#f59e0b' },
            error: { icon: 'fas fa-times-circle', color: '#ef4444' },
            info: { icon: 'fas fa-info-circle', color: '#06b6d4' }
        }
    },

    // URLs y endpoints (para futuras integraciones)
    api: {
        baseUrl: '',
        timeout: 30000,
        retries: 3,
        endpoints: {
            products: '/api/products',
            sales: '/api/sales',
            expenses: '/api/expenses',
            reports: '/api/reports'
        }
    },

    // Configuración de desarrollo
    development: {
        enableDebugMode: false,
        enableConsoleLogging: true,
        enablePerformanceMonitoring: false,
        mockDataEnabled: false
    }
};

// Funciones de configuración
const ConfigManager = {
    // Obtener configuración
    get(path) {
        return path.split('.').reduce((obj, key) => obj && obj[key], AppConfig);
    },

    // Establecer configuración
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, AppConfig);
        target[lastKey] = value;
        this.save();
    },

    // Cargar configuración desde localStorage
    load() {
        try {
            const saved = localStorage.getItem('app_config');
            if (saved) {
                const savedConfig = JSON.parse(saved);
                Object.assign(AppConfig, savedConfig);
            }
        } catch (error) {
            console.warn('Error loading configuration:', error);
        }
    },

    // Guardar configuración en localStorage
    save() {
        try {
            localStorage.setItem('app_config', JSON.stringify(AppConfig));
        } catch (error) {
            console.warn('Error saving configuration:', error);
        }
    },

    // Resetear configuración a valores por defecto
    reset() {
        localStorage.removeItem('app_config');
        location.reload();
    },

    // Aplicar tema
    applyTheme(theme = 'light') {
        AppConfig.ui.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        this.save();
    },

    // Aplicar configuraciones de UI
    applyUIConfig() {
        // Aplicar tema
        this.applyTheme(AppConfig.ui.theme);
        
        // Configurar animaciones
        if (!AppConfig.ui.animationsEnabled) {
            document.documentElement.style.setProperty('--animation-duration', '0ms');
        }
        
        // Configurar notificaciones
        if (AppConfig.notifications.enableSound) {
            // Habilitar sonidos de notificación
        }
    },

    // Validar configuración
    validate() {
        const errors = [];
        
        // Validar límites numéricos
        if (AppConfig.app.autoSaveInterval < 1000) {
            errors.push('Intervalo de autoguardado muy bajo');
        }
        
        if (AppConfig.inventory.defaultMinStock < 0) {
            errors.push('Stock mínimo no puede ser negativo');
        }
        
        // Validar formatos
        if (!AppConfig.formats.currency.symbol) {
            errors.push('Símbolo de moneda requerido');
        }
        
        return errors;
    },

    // Obtener información del sistema
    getSystemInfo() {
        return {
            appVersion: AppConfig.company.version,
            buildDate: AppConfig.company.buildDate,
            browser: navigator.userAgent,
            language: navigator.language,
            online: navigator.onLine,
            localStorage: this.getStorageInfo(),
            features: AppConfig.features
        };
    },

    // Obtener información de almacenamiento
    getStorageInfo() {
        try {
            const used = new Blob(Object.values(localStorage)).size;
            const available = AppConfig.data.maxLocalStorageSize - used;
            return {
                used: used,
                available: available,
                percentage: (used / AppConfig.data.maxLocalStorageSize) * 100
            };
        } catch (error) {
            return { error: 'No se pudo calcular el uso de almacenamiento' };
        }
    }
};

// Inicializar configuración al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    ConfigManager.load();
    ConfigManager.applyUIConfig();
    
    // Validar configuración
    const errors = ConfigManager.validate();
    if (errors.length > 0) {
        console.warn('Errores de configuración:', errors);
    }
});

// Hacer disponible globalmente
window.AppConfig = AppConfig;
window.ConfigManager = ConfigManager;

// Auto-guardado de configuración
if (AppConfig.app.autoSave) {
    setInterval(() => {
        ConfigManager.save();
    }, AppConfig.app.autoSaveInterval);
}