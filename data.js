// Datos de ejemplo y configuración para Ferretería Litoral
class SampleDataManager {
    constructor() {
        this.sampleProducts = [
            {
                sku: 'HER-001',
                name: 'Martillo de Garra 16oz',
                description: 'Martillo con mango de fibra de vidrio, cabeza de acero forjado',
                categoryId: 1,
                price: 25.99,
                stock: 15,
                minStock: 5,
                brand: 'Stanley'
            },
            {
                sku: 'HER-002',
                name: 'Destornillador Phillips #2',
                description: 'Destornillador con mango ergonómico y punta magnética',
                categoryId: 1,
                price: 8.50,
                stock: 30,
                minStock: 10,
                brand: 'DeWalt'
            },
            {
                sku: 'CON-001',
                name: 'Cemento Portland 50kg',
                description: 'Cemento tipo I para construcción general',
                categoryId: 2,
                price: 12.75,
                stock: 45,
                minStock: 20,
                brand: 'Holcim'
            },
            {
                sku: 'CON-002',
                name: 'Varilla de Hierro 3/8"',
                description: 'Varilla corrugada de 6 metros de longitud',
                categoryId: 2,
                price: 18.90,
                stock: 25,
                minStock: 15,
                brand: 'Gerdau'
            },
            {
                sku: 'PLO-001',
                name: 'Tubería PVC 4" x 6m',
                description: 'Tubería de PVC sanitario para desagüe',
                categoryId: 3,
                price: 35.40,
                stock: 12,
                minStock: 8,
                brand: 'Tigre'
            },
            {
                sku: 'PLO-002',
                name: 'Codo PVC 90° 4"',
                description: 'Codo de 90 grados para tubería de 4 pulgadas',
                categoryId: 3,
                price: 4.25,
                stock: 50,
                minStock: 20,
                brand: 'Tigre'
            },
            {
                sku: 'ELE-001',
                name: 'Cable THW 12 AWG',
                description: 'Cable eléctrico de cobre para instalaciones residenciales',
                categoryId: 4,
                price: 2.80,
                stock: 200,
                minStock: 50,
                brand: 'Condumex'
            },
            {
                sku: 'ELE-002',
                name: 'Interruptor Sencillo',
                description: 'Interruptor de una vía color blanco',
                categoryId: 4,
                price: 3.50,
                stock: 75,
                minStock: 25,
                brand: 'Leviton'
            },
            {
                sku: 'PIN-001',
                name: 'Pintura Látex Blanco 1 Galón',
                description: 'Pintura látex para interiores y exteriores',
                categoryId: 5,
                price: 28.90,
                stock: 20,
                minStock: 10,
                brand: 'Sherwin Williams'
            },
            {
                sku: 'PIN-002',
                name: 'Brocha 3 Pulgadas',
                description: 'Brocha de cerdas naturales para pintura',
                categoryId: 5,
                price: 12.50,
                stock: 35,
                minStock: 15,
                brand: 'Purdy'
            },
            {
                sku: 'HER-003',
                name: 'Taladro Inalámbrico 18V',
                description: 'Taladro con batería de litio y cargador incluido',
                categoryId: 1,
                price: 189.99,
                stock: 8,
                minStock: 3,
                brand: 'Makita'
            },
            {
                sku: 'HER-004',
                name: 'Sierra Circular 7.25"',
                description: 'Sierra circular para cortar madera y materiales',
                categoryId: 1,
                price: 145.00,
                stock: 5,
                minStock: 2,
                brand: 'Black & Decker'
            },
            {
                sku: 'CON-003',
                name: 'Ladrillo Rojo Común',
                description: 'Ladrillo de arcilla cocida para construcción',
                categoryId: 2,
                price: 0.45,
                stock: 1500,
                minStock: 500,
                brand: 'Ladrillera San José'
            },
            {
                sku: 'PLO-003',
                name: 'Llave de Paso 1/2"',
                description: 'Válvula de bola para control de agua',
                categoryId: 3,
                price: 15.75,
                stock: 18,
                minStock: 8,
                brand: 'FV'
            },
            {
                sku: 'ELE-003',
                name: 'Tomacorriente Doble',
                description: 'Tomacorriente con tierra, color blanco',
                categoryId: 4,
                price: 6.80,
                stock: 40,
                minStock: 15,
                brand: 'Leviton'
            }
        ];

        this.sampleSales = [
            {
                invoiceNumber: 'FAC-001',
                customerName: 'Constructora ABC',
                total: 285.50,
                items: [
                    { productId: 3, quantity: 10, unitPrice: 12.75 },
                    { productId: 4, quantity: 8, unitPrice: 18.90 }
                ],
                notes: 'Entrega programada para mañana'
            },
            {
                invoiceNumber: 'FAC-002',
                customerName: 'Juan Pérez',
                total: 58.90,
                items: [
                    { productId: 1, quantity: 1, unitPrice: 25.99 },
                    { productId: 2, quantity: 2, unitPrice: 8.50 },
                    { productId: 10, quantity: 1, unitPrice: 12.50 }
                ],
                notes: ''
            },
            {
                invoiceNumber: 'FAC-003',
                customerName: 'Eléctricos Modernos',
                total: 112.40,
                items: [
                    { productId: 7, quantity: 40, unitPrice: 2.80 }
                ],
                notes: 'Cliente frecuente - descuento aplicado'
            }
        ];

        this.sampleExpenses = [
            {
                description: 'Alquiler del local comercial',
                category: 'Alquiler',
                amount: 800.00,
                receipt: 'REC-2024-001',
                notes: 'Pago mensual correspondiente a enero'
            },
            {
                description: 'Compra de inventario - Cemento',
                category: 'Compras',
                amount: 1250.00,
                receipt: 'FAC-PROV-045',
                notes: 'Compra a proveedor Holcim'
            },
            {
                description: 'Servicio de electricidad',
                category: 'Servicios',
                amount: 180.50,
                receipt: 'ELE-001-2024',
                notes: 'Consumo del mes anterior'
            },
            {
                description: 'Mantenimiento de vehículo de reparto',
                category: 'Mantenimiento',
                amount: 320.00,
                receipt: 'SER-AUTO-123',
                notes: 'Cambio de aceite y revisión general'
            },
            {
                description: 'Publicidad en redes sociales',
                category: 'Marketing',
                amount: 150.00,
                receipt: 'PUB-FACE-001',
                notes: 'Campaña publicitaria en Facebook'
            }
        ];
    }

    loadSampleData() {
        const dataManager = window.app?.dataManager;
        if (!dataManager) {
            console.error('DataManager no está disponible');
            return false;
        }

        // Verificar si ya hay datos
        if (dataManager.getProducts().length > 0) {
            return false; // Ya hay datos, no cargar ejemplos
        }

        try {
            // Cargar productos de ejemplo
            this.sampleProducts.forEach(product => {
                dataManager.addProduct(product);
            });

            // Cargar ventas de ejemplo (ajustando fechas)
            this.sampleSales.forEach((sale, index) => {
                const saleDate = new Date();
                saleDate.setDate(saleDate.getDate() - (index * 5)); // Distribuir en diferentes días
                
                const saleData = {
                    ...sale,
                    date: saleDate.toISOString()
                };
                
                dataManager.addSale(saleData, sale.items);
            });

            // Cargar gastos de ejemplo (ajustando fechas)
            this.sampleExpenses.forEach((expense, index) => {
                const expenseDate = new Date();
                expenseDate.setDate(expenseDate.getDate() - (index * 3)); // Distribuir en diferentes días
                
                const expenseData = {
                    ...expense,
                    date: expenseDate.toISOString()
                };
                
                dataManager.addExpense(expenseData);
            });

            return true;
        } catch (error) {
            console.error('Error al cargar datos de ejemplo:', error);
            return false;
        }
    }

    clearAllData() {
        if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
            localStorage.clear();
            location.reload();
        }
    }

    exportData() {
        const dataManager = window.app?.dataManager;
        if (!dataManager) return;

        const exportData = {
            categories: dataManager.getCategories(),
            products: dataManager.getProducts(),
            sales: dataManager.getSales(),
            expenses: dataManager.getExpenses(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ferreteria-litoral-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                if (!importData.version || !importData.categories) {
                    alert('Archivo de respaldo inválido');
                    return;
                }

                if (confirm('¿Estás seguro de que quieres importar estos datos? Se reemplazarán todos los datos actuales.')) {
                    // Limpiar datos actuales
                    localStorage.clear();
                    
                    // Importar nuevos datos
                    localStorage.setItem('categories', JSON.stringify(importData.categories));
                    localStorage.setItem('products', JSON.stringify(importData.products));
                    localStorage.setItem('sales', JSON.stringify(importData.sales));
                    localStorage.setItem('expenses', JSON.stringify(importData.expenses));
                    
                    alert('Datos importados correctamente. La página se recargará.');
                    location.reload();
                }
            } catch (error) {
                alert('Error al importar el archivo. Asegúrate de que sea un archivo de respaldo válido.');
                console.error('Error de importación:', error);
            }
        };
        reader.readAsText(file);
    }

    generateReport(type = 'general') {
        const dataManager = window.app?.dataManager;
        if (!dataManager) return;

        const metrics = dataManager.getDashboardMetrics();
        const products = dataManager.getProducts();
        const sales = dataManager.getSales();
        const expenses = dataManager.getExpenses();

        let reportContent = '';
        
        switch (type) {
            case 'inventory':
                reportContent = this.generateInventoryReport(products);
                break;
            case 'sales':
                reportContent = this.generateSalesReport(sales, metrics);
                break;
            case 'financial':
                reportContent = this.generateFinancialReport(metrics, sales, expenses);
                break;
            default:
                reportContent = this.generateGeneralReport(metrics, products, sales, expenses);
        }

        this.downloadReport(reportContent, `reporte-${type}-${new Date().toISOString().split('T')[0]}.txt`);
    }

    generateInventoryReport(products) {
        let report = '=== REPORTE DE INVENTARIO - FERRETERÍA LITORAL ===\n\n';
        report += `Fecha: ${new Date().toLocaleDateString()}\n`;
        report += `Total de productos: ${products.length}\n\n`;

        // Productos con poco stock
        const lowStock = products.filter(p => p.stock <= (p.minStock || 5));
        if (lowStock.length > 0) {
            report += '--- PRODUCTOS CON POCO STOCK ---\n';
            lowStock.forEach(product => {
                report += `${product.name} (${product.sku}): ${product.stock} unidades (Mín: ${product.minStock || 5})\n`;
            });
            report += '\n';
        }

        // Inventario por categoría
        report += '--- INVENTARIO POR CATEGORÍA ---\n';
        const categories = [...new Set(products.map(p => p.category?.name).filter(Boolean))];
        categories.forEach(categoryName => {
            const categoryProducts = products.filter(p => p.category?.name === categoryName);
            const totalValue = categoryProducts.reduce((sum, p) => sum + (p.stock * p.price), 0);
            report += `${categoryName}: ${categoryProducts.length} productos, Valor: $${totalValue.toLocaleString()}\n`;
        });

        return report;
    }

    generateSalesReport(sales, metrics) {
        let report = '=== REPORTE DE VENTAS - FERRETERÍA LITORAL ===\n\n';
        report += `Fecha: ${new Date().toLocaleDateString()}\n`;
        report += `Total de ventas: ${sales.length}\n`;
        report += `Ventas del mes: $${metrics.monthlySales.toLocaleString()}\n\n`;

        // Ventas recientes
        report += '--- VENTAS RECIENTES ---\n';
        sales.slice(-10).forEach(sale => {
            report += `${sale.invoiceNumber} - ${sale.customerName || 'Cliente general'} - $${sale.total} - ${new Date(sale.date).toLocaleDateString()}\n`;
        });

        return report;
    }

    generateFinancialReport(metrics, sales, expenses) {
        let report = '=== REPORTE FINANCIERO - FERRETERÍA LITORAL ===\n\n';
        report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
        
        report += '--- RESUMEN DEL MES ---\n';
        report += `Ingresos: $${metrics.monthlySales.toLocaleString()}\n`;
        report += `Gastos: $${metrics.monthlyExpenses.toLocaleString()}\n`;
        report += `Ganancia neta: $${metrics.netProfit.toLocaleString()}\n\n`;

        // Gastos por categoría
        report += '--- GASTOS POR CATEGORÍA ---\n';
        const expensesByCategory = {};
        expenses.forEach(expense => {
            const month = new Date(expense.date).getMonth();
            const currentMonth = new Date().getMonth();
            if (month === currentMonth) {
                expensesByCategory[expense.category] = (expensesByCategory[expense.category] || 0) + expense.amount;
            }
        });

        Object.entries(expensesByCategory).forEach(([category, total]) => {
            report += `${category}: $${total.toLocaleString()}\n`;
        });

        return report;
    }

    generateGeneralReport(metrics, products, sales, expenses) {
        let report = '=== REPORTE GENERAL - FERRETERÍA LITORAL ===\n\n';
        report += `Fecha: ${new Date().toLocaleDateString()}\n\n`;
        
        report += '--- MÉTRICAS PRINCIPALES ---\n';
        report += `Total productos: ${metrics.totalProducts}\n`;
        report += `Productos con poco stock: ${metrics.lowStockCount}\n`;
        report += `Ventas del mes: $${metrics.monthlySales.toLocaleString()}\n`;
        report += `Gastos del mes: $${metrics.monthlyExpenses.toLocaleString()}\n`;
        report += `Ganancia neta: $${metrics.netProfit.toLocaleString()}\n\n`;

        // Últimas actividades
        report += '--- ÚLTIMAS ACTIVIDADES ---\n';
        report += 'Ventas recientes:\n';
        sales.slice(-5).forEach(sale => {
            report += `  ${sale.invoiceNumber} - $${sale.total} - ${new Date(sale.date).toLocaleDateString()}\n`;
        });
        
        report += '\nGastos recientes:\n';
        expenses.slice(-5).forEach(expense => {
            report += `  ${expense.description} - $${expense.amount} - ${new Date(expense.date).toLocaleDateString()}\n`;
        });

        return report;
    }

    downloadReport(content, filename) {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Funciones globales para el manejo de datos
window.sampleDataManager = new SampleDataManager();

// Función para inicializar datos de ejemplo
window.initializeSampleData = function() {
    if (window.sampleDataManager.loadSampleData()) {
        window.app?.notifications?.show('Datos de ejemplo cargados correctamente', 'success');
        window.app?.loadDashboard();
        if (window.app?.currentPage === 'inventory') {
            window.app?.loadInventory();
        }
    } else {
        window.app?.notifications?.show('Ya existen datos en el sistema', 'warning');
    }
};

// Función para limpiar todos los datos
window.clearAllData = function() {
    window.sampleDataManager.clearAllData();
};

// Función para exportar datos
window.exportData = function() {
    window.sampleDataManager.exportData();
};

// Función para importar datos
window.importData = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            window.sampleDataManager.importData(file);
        }
    };
    input.click();
};

// Función para generar reportes
window.generateReport = function(type = 'general') {
    window.sampleDataManager.generateReport(type);
};