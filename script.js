// Sistema de gestión para Ferretería Litoral con Firebase
// Import Firebase functions
import { 
    signInWithGoogle, 
    signOutUser, 
    onAuthChanged,
    saveProduct as firebaseSaveProduct,
    getProducts as firebaseGetProducts,
    updateProduct as firebaseUpdateProduct,
    deleteProduct as firebaseDeleteProduct,
    saveSale as firebaseSaveSale,
    getSales as firebaseGetSales,
    saveExpense as firebaseSaveExpense,
    getExpenses as firebaseGetExpenses,
    updateExpense as firebaseUpdateExpense,
    deleteExpense as firebaseDeleteExpense,
    saveCategory as firebaseSaveCategory,
    getCategories as firebaseGetCategories
} from './firebase-config.js';

class FirebaseDataManager {
    constructor() {
        this.currentUser = null;
        this.authStateChanged = false;
        this.categories = [];
        this.products = [];
        this.sales = [];
        this.expenses = [];
        this.initializeAuth();
    }

    async initializeAuth() {
        return new Promise((resolve) => {
            onAuthChanged(async (user) => {
                this.currentUser = user;
                this.authStateChanged = true;
                
                if (user) {
                    console.log('Usuario autenticado:', user.displayName || user.email);
                    await this.loadAllData();
                    app.showMainApp();
                } else {
                    console.log('Usuario no autenticado');
                    app.showLogin();
                }
                resolve(user);
            });
        });
    }

    async loadAllData() {
        if (!this.currentUser) return;
        
        try {
            // Load categories first
            this.categories = await firebaseGetCategories(this.currentUser);
            if (this.categories.length === 0) {
                await this.initializeDefaultCategories();
                this.categories = await firebaseGetCategories(this.currentUser);
            }

            // Load other data
            this.products = await firebaseGetProducts(this.currentUser);
            this.sales = await firebaseGetSales(this.currentUser);
            this.expenses = await firebaseGetExpenses(this.currentUser);

        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    async initializeDefaultCategories() {
        const defaultCategories = [
            { name: 'Herramientas', description: 'Herramientas manuales y eléctricas' },
            { name: 'Construcción', description: 'Materiales de construcción' },
            { name: 'Plomería', description: 'Tuberías y accesorios de plomería' },
            { name: 'Eléctrico', description: 'Cables y componentes eléctricos' },
            { name: 'Pintura', description: 'Pinturas y herramientas de pintura' }
        ];

        for (const category of defaultCategories) {
            await firebaseSaveCategory(this.currentUser, category);
        }
    }

    // Category methods
    getCategories() {
        return this.categories;
    }

    // Product methods
    getProducts() {
        return this.products.map(product => ({
            ...product,
            category: this.categories.find(cat => cat.id === product.categoryId)
        }));
    }

    async addProduct(productData) {
        if (!this.currentUser) throw new Error('Usuario no autenticado');
        
        const product = await firebaseSaveProduct(this.currentUser, productData);
        this.products.push(product);
        return product;
    }

    async updateProduct(id, updates) {
        if (!this.currentUser) throw new Error('Usuario no autenticado');
        
        await firebaseUpdateProduct(this.currentUser, id, updates);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products[index] = { ...this.products[index], ...updates };
        }
    }

    async deleteProduct(id) {
        if (!this.currentUser) throw new Error('Usuario no autenticado');
        
        await firebaseDeleteProduct(this.currentUser, id);
        this.products = this.products.filter(p => p.id !== id);
    }

    getLowStockProducts() {
        return this.products.filter(product => product.stock <= (product.minStock || 5));
    }

    // Sales methods
    getSales() {
        return this.sales;
    }

    async addSale(saleData, items) {
        if (!this.currentUser) throw new Error('Usuario no autenticado');
        
        const sale = {
            ...saleData,
            items: items,
            total: items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
        };

        const savedSale = await firebaseSaveSale(this.currentUser, sale);
        this.sales.unshift(savedSale);

        // Update product stock
        for (const item of items) {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                const newStock = product.stock - item.quantity;
                await this.updateProduct(product.id, { stock: newStock });
            }
        }

        return savedSale;
    }

    // Expense methods
    getExpenses() {
        return this.expenses;
    }

    async addExpense(expenseData) {
        if (!this.currentUser) throw new Error('Usuario no autenticado');
        
        const expense = await firebaseSaveExpense(this.currentUser, expenseData);
        this.expenses.unshift(expense);
        return expense;
    }

    async updateExpense(id, updates) {
        if (!this.currentUser) throw new Error('Usuario no autenticado');
        
        await firebaseUpdateExpense(this.currentUser, id, updates);
        const index = this.expenses.findIndex(e => e.id === id);
        if (index !== -1) {
            this.expenses[index] = { ...this.expenses[index], ...updates };
        }
    }

    async deleteExpense(id) {
        if (!this.currentUser) throw new Error('Usuario no autenticado');
        
        await firebaseDeleteExpense(this.currentUser, id);
        this.expenses = this.expenses.filter(e => e.id !== id);
    }

    // Dashboard metrics
    getDashboardMetrics() {
        const totalProducts = this.products.length;
        const lowStockProducts = this.getLowStockProducts().length;
        
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        
        const monthlySales = this.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
        });
        
        const monthlyExpenses = this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
        });
        
        const totalSales = monthlySales.reduce((sum, sale) => sum + sale.total, 0);
        const totalExpenses = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
            totalProducts,
            lowStockProducts,
            monthlySales: monthlySales.length,
            totalSales,
            totalExpenses,
            profit: totalSales - totalExpenses
        };
    }

    getSalesData(months = 6) {
        const data = [];
        const now = new Date();
        
        for (let i = months - 1; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthSales = this.sales.filter(sale => {
                const saleDate = new Date(sale.date);
                return saleDate.getMonth() === date.getMonth() && 
                       saleDate.getFullYear() === date.getFullYear();
            });
            
            data.push({
                month: date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                sales: monthSales.reduce((sum, sale) => sum + sale.total, 0)
            });
        }
        
        return data;
    }

    getCategorySalesData() {
        const categoryData = {};
        
        this.sales.forEach(sale => {
            if (sale.items) {
                sale.items.forEach(item => {
                    const product = this.products.find(p => p.id === item.productId);
                    if (product && product.category) {
                        const categoryName = product.category.name;
                        categoryData[categoryName] = (categoryData[categoryName] || 0) + (item.quantity * item.price);
                    }
                });
            }
        });
        
        return Object.entries(categoryData).map(([name, value]) => ({ name, value }));
    }
}

class NotificationManager {
    constructor() {
        this.container = document.getElementById('toastContainer');
    }

    show(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close">&times;</button>
        `;

        this.container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, duration);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    getIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

class FerreteriApp {
    constructor() {
        this.dataManager = new FirebaseDataManager();
        this.notifications = new NotificationManager();
        this.currentPage = 'login';
        this.init();
    }

    async init() {
        this.setupEventListeners();
        // Authentication will be handled by FirebaseDataManager
    }

    setupEventListeners() {
        // Login button
        document.getElementById('loginBtn')?.addEventListener('click', () => this.loginWithGoogle());
        
        // Logout button
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.logout());
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal .close, .modal .btn-secondary').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Form submissions
        document.getElementById('productForm')?.addEventListener('submit', (e) => this.saveProduct(e));
        document.getElementById('saleForm')?.addEventListener('submit', (e) => this.saveSale(e));
        document.getElementById('expenseForm')?.addEventListener('submit', (e) => this.saveExpense(e));

        // Other buttons
        document.getElementById('addProductBtn')?.addEventListener('click', () => this.openProductModal());
        document.getElementById('addSaleBtn')?.addEventListener('click', () => this.openSaleModal());
        document.getElementById('addExpenseBtn')?.addEventListener('click', () => this.openExpenseModal());
        document.getElementById('addSaleItemBtn')?.addEventListener('click', () => this.addSaleItem());
        document.getElementById('generateReportBtn')?.addEventListener('click', () => this.generateReport());

        // Search functionality
        document.getElementById('productSearch')?.addEventListener('input', () => this.filterProducts());
    }

    showLogin() {
        document.getElementById('loginSection').style.display = 'flex';
        document.getElementById('mainApp').style.display = 'none';
    }

    showMainApp() {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        this.navigateTo('dashboard');
    }

    async loginWithGoogle() {
        try {
            const user = await signInWithGoogle();
            console.log('Login exitoso:', user.displayName || user.email);
            this.notifications.show(`Bienvenido ${user.displayName || user.email}`, 'success');
        } catch (error) {
            console.error('Error en login:', error);
            this.notifications.show('Error al iniciar sesión. Intenta de nuevo.', 'error');
        }
    }

    async logout() {
        try {
            await signOutUser();
            this.notifications.show('Sesión cerrada correctamente', 'success');
        } catch (error) {
            console.error('Error en logout:', error);
            this.notifications.show('Error al cerrar sesión', 'error');
        }
    }

    navigateTo(page) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
        
        // Show selected page
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.style.display = 'block';
            this.currentPage = page;
            
            // Update navigation
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-page') === page) {
                    item.classList.add('active');
                }
            });
            
            // Load page data
            this.loadPageData(page);
        }
    }

    async loadPageData(page) {
        try {
            switch (page) {
                case 'dashboard':
                    await this.loadDashboard();
                    break;
                case 'inventory':
                    await this.loadInventory();
                    break;
                case 'sales':
                    await this.loadSales();
                    break;
                case 'expenses':
                    await this.loadExpenses();
                    break;
                case 'reports':
                    await this.loadReports();
                    break;
            }
        } catch (error) {
            console.error(`Error loading ${page}:`, error);
            this.notifications.show(`Error cargando ${page}`, 'error');
        }
    }

    async loadDashboard() {
        const metrics = this.dataManager.getDashboardMetrics();
        
        // Update metric cards
        document.getElementById('totalProducts').textContent = metrics.totalProducts;
        document.getElementById('lowStockProducts').textContent = metrics.lowStockProducts;
        document.getElementById('monthlySales').textContent = metrics.monthlySales;
        document.getElementById('totalSalesAmount').textContent = Utils.formatCurrency(metrics.totalSales);
        document.getElementById('totalExpensesAmount').textContent = Utils.formatCurrency(metrics.totalExpenses);
        document.getElementById('monthlyProfit').textContent = Utils.formatCurrency(metrics.profit);
        
        // Update low stock alert
        await this.loadLowStockProducts();
        
        // Draw sales chart
        this.drawSalesChart();
    }

    async loadLowStockProducts() {
        const lowStockProducts = this.dataManager.getLowStockProducts();
        const container = document.getElementById('lowStockList');
        
        if (lowStockProducts.length === 0) {
            container.innerHTML = '<p class="text-muted">No hay productos con stock bajo</p>';
            return;
        }
        
        container.innerHTML = lowStockProducts.map(product => `
            <div class="low-stock-item">
                <span>${product.name}</span>
                <span class="stock-count">${product.stock} unidades</span>
            </div>
        `).join('');
    }

    drawSalesChart() {
        const canvas = document.getElementById('salesChart');
        if (!canvas) return;
        
        const salesData = this.dataManager.getSalesData(6);
        const chartData = {
            labels: salesData.map(d => d.month),
            datasets: [{
                label: 'Ventas Mensuales',
                data: salesData.map(d => d.sales),
                color: '#3498db'
            }]
        };
        
        window.chartManager.drawLineChart(canvas, chartData, {
            title: 'Ventas de los Últimos 6 Meses',
            currency: true
        });
    }

    async loadInventory() {
        await this.loadCategories();
        await this.loadProducts();
    }

    async loadCategories() {
        const categories = this.dataManager.getCategories();
        const container = document.getElementById('categoriesList');
        
        container.innerHTML = categories.map(category => `
            <div class="category-item">
                <h4>${category.name}</h4>
                <p>${category.description}</p>
            </div>
        `).join('');
        
        // Update product form categories
        const categorySelect = document.getElementById('productCategory');
        if (categorySelect) {
            categorySelect.innerHTML = '<option value="">Seleccionar categoría</option>' +
                categories.map(cat => `<option value="${cat.id}">${cat.name}</option>`).join('');
        }
        
        // Update sale form categories for filtering
        const saleProductSelect = document.getElementById('saleProduct');
        if (saleProductSelect) {
            this.updateSaleProductOptions();
        }
    }

    async loadProducts() {
        const products = this.dataManager.getProducts();
        const container = document.getElementById('productsList');
        
        container.innerHTML = products.map(product => `
            <tr>
                <td>${product.sku}</td>
                <td>${product.name}</td>
                <td>${product.category ? product.category.name : 'Sin categoría'}</td>
                <td>${product.stock}</td>
                <td>${Utils.formatCurrency(product.price)}</td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="app.openProductModal('${product.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteProduct('${product.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    filterProducts() {
        const searchTerm = document.getElementById('productSearch').value.toLowerCase();
        const rows = document.querySelectorAll('#productsList tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    async openProductModal(productId = null) {
        const modal = document.getElementById('productModal');
        const form = document.getElementById('productForm');
        const title = modal.querySelector('.modal-title');
        
        if (productId) {
            // Edit mode
            const product = this.dataManager.products.find(p => p.id === productId);
            if (product) {
                title.textContent = 'Editar Producto';
                form.sku.value = product.sku;
                form.name.value = product.name;
                form.description.value = product.description || '';
                form.category.value = product.categoryId;
                form.price.value = product.price;
                form.cost.value = product.cost || '';
                form.stock.value = product.stock;
                form.minStock.value = product.minStock || '';
                form.supplier.value = product.supplier || '';
                form.setAttribute('data-edit-id', productId);
            }
        } else {
            // Add mode
            title.textContent = 'Agregar Producto';
            form.reset();
            form.removeAttribute('data-edit-id');
            form.sku.value = Utils.generateSKU('PROD');
        }
        
        modal.style.display = 'block';
    }

    async saveProduct(e) {
        e.preventDefault();
        const form = e.target;
        const editId = form.getAttribute('data-edit-id');
        
        const productData = {
            sku: form.sku.value,
            name: form.name.value,
            description: form.description.value,
            categoryId: form.category.value,
            price: parseFloat(form.price.value),
            cost: parseFloat(form.cost.value) || 0,
            stock: parseInt(form.stock.value),
            minStock: parseInt(form.minStock.value) || 5,
            supplier: form.supplier.value
        };
        
        try {
            if (editId) {
                await this.dataManager.updateProduct(editId, productData);
                this.notifications.show('Producto actualizado correctamente', 'success');
            } else {
                await this.dataManager.addProduct(productData);
                this.notifications.show('Producto agregado correctamente', 'success');
            }
            
            this.closeModals();
            await this.loadProducts();
            this.updateSaleProductOptions();
        } catch (error) {
            console.error('Error saving product:', error);
            this.notifications.show('Error al guardar producto', 'error');
        }
    }

    async deleteProduct(productId) {
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await this.dataManager.deleteProduct(productId);
                this.notifications.show('Producto eliminado correctamente', 'success');
                await this.loadProducts();
                this.updateSaleProductOptions();
            } catch (error) {
                console.error('Error deleting product:', error);
                this.notifications.show('Error al eliminar producto', 'error');
            }
        }
    }

    async loadSales() {
        const sales = this.dataManager.getSales();
        const container = document.getElementById('salesList');
        
        container.innerHTML = sales.map(sale => `
            <tr>
                <td>${sale.invoiceNumber}</td>
                <td>${Utils.formatDate(sale.date)}</td>
                <td>${sale.customerName || 'Cliente general'}</td>
                <td>${sale.items ? sale.items.length : 0}</td>
                <td>${Utils.formatCurrency(sale.total)}</td>
                <td class="actions">
                    <button class="btn btn-sm btn-info" onclick="app.viewSaleDetails('${sale.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    openSaleModal() {
        const modal = document.getElementById('saleModal');
        const form = document.getElementById('saleForm');
        
        form.reset();
        form.invoiceNumber.value = Utils.generateInvoiceNumber();
        form.date.value = new Date().toISOString().split('T')[0];
        
        // Clear items
        document.getElementById('saleItems').innerHTML = '';
        this.updateSaleTotal();
        
        modal.style.display = 'block';
    }

    addSaleItem() {
        const container = document.getElementById('saleItems');
        const itemDiv = document.createElement('div');
        itemDiv.className = 'sale-item';
        itemDiv.innerHTML = `
            <select name="productId" required>
                <option value="">Seleccionar producto</option>
                ${this.dataManager.getProducts().map(p => 
                    `<option value="${p.id}" data-price="${p.price}" data-stock="${p.stock}">
                        ${p.name} - Stock: ${p.stock} - ${Utils.formatCurrency(p.price)}
                    </option>`
                ).join('')}
            </select>
            <input type="number" name="quantity" placeholder="Cantidad" min="1" required onchange="app.updateSaleTotal()">
            <input type="number" name="price" placeholder="Precio" step="0.01" required readonly>
            <button type="button" class="btn btn-danger btn-sm" onclick="app.removeSaleItem(this)">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        container.appendChild(itemDiv);
        
        // Update price when product changes
        itemDiv.querySelector('select').addEventListener('change', (e) => this.updateItemPrice(e.target));
    }

    removeSaleItem(button) {
        button.closest('.sale-item').remove();
        this.updateSaleTotal();
    }

    updateItemPrice(select) {
        const option = select.selectedOptions[0];
        const priceInput = select.closest('.sale-item').querySelector('input[name="price"]');
        const quantityInput = select.closest('.sale-item').querySelector('input[name="quantity"]');
        
        if (option && option.dataset.price) {
            priceInput.value = option.dataset.price;
            quantityInput.max = option.dataset.stock;
        }
        
        this.updateSaleTotal();
    }

    updateSaleTotal() {
        const items = document.querySelectorAll('#saleItems .sale-item');
        let total = 0;
        
        items.forEach(item => {
            const quantity = parseFloat(item.querySelector('input[name="quantity"]').value) || 0;
            const price = parseFloat(item.querySelector('input[name="price"]').value) || 0;
            total += quantity * price;
        });
        
        document.getElementById('saleTotal').textContent = Utils.formatCurrency(total);
    }

    async saveSale(e) {
        e.preventDefault();
        const form = e.target;
        
        const items = Array.from(document.querySelectorAll('#saleItems .sale-item')).map(item => ({
            productId: item.querySelector('select[name="productId"]').value,
            quantity: parseInt(item.querySelector('input[name="quantity"]').value),
            price: parseFloat(item.querySelector('input[name="price"]').value)
        }));
        
        if (items.length === 0) {
            this.notifications.show('Debe agregar al menos un producto', 'warning');
            return;
        }
        
        const saleData = {
            invoiceNumber: form.invoiceNumber.value,
            date: form.date.value,
            customerName: form.customerName.value,
            customerPhone: form.customerPhone.value,
            notes: form.notes.value
        };
        
        try {
            await this.dataManager.addSale(saleData, items);
            this.notifications.show('Venta registrada correctamente', 'success');
            this.closeModals();
            await this.loadSales();
            
            // Refresh other views if necessary
            if (this.currentPage === 'dashboard') {
                await this.loadDashboard();
            }
        } catch (error) {
            console.error('Error saving sale:', error);
            this.notifications.show('Error al guardar venta', 'error');
        }
    }

    updateSaleProductOptions() {
        const selects = document.querySelectorAll('#saleItems select[name="productId"]');
        const products = this.dataManager.getProducts();
        const options = '<option value="">Seleccionar producto</option>' +
            products.map(p => 
                `<option value="${p.id}" data-price="${p.price}" data-stock="${p.stock}">
                    ${p.name} - Stock: ${p.stock} - ${Utils.formatCurrency(p.price)}
                </option>`
            ).join('');
        
        selects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = options;
            select.value = currentValue;
        });
    }

    async loadExpenses() {
        const expenses = this.dataManager.getExpenses();
        const container = document.getElementById('expensesList');
        
        container.innerHTML = expenses.map(expense => `
            <tr>
                <td>${Utils.formatDate(expense.date)}</td>
                <td>${expense.category}</td>
                <td>${expense.description}</td>
                <td>${Utils.formatCurrency(expense.amount)}</td>
                <td class="actions">
                    <button class="btn btn-sm btn-primary" onclick="app.openExpenseModal('${expense.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="app.deleteExpense('${expense.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    openExpenseModal(expenseId = null) {
        const modal = document.getElementById('expenseModal');
        const form = document.getElementById('expenseForm');
        const title = modal.querySelector('.modal-title');
        
        if (expenseId) {
            const expense = this.dataManager.expenses.find(e => e.id === expenseId);
            if (expense) {
                title.textContent = 'Editar Gasto';
                form.date.value = expense.date;
                form.category.value = expense.category;
                form.description.value = expense.description;
                form.amount.value = expense.amount;
                form.notes.value = expense.notes || '';
                form.setAttribute('data-edit-id', expenseId);
            }
        } else {
            title.textContent = 'Agregar Gasto';
            form.reset();
            form.removeAttribute('data-edit-id');
            form.date.value = new Date().toISOString().split('T')[0];
        }
        
        modal.style.display = 'block';
    }

    async saveExpense(e) {
        e.preventDefault();
        const form = e.target;
        const editId = form.getAttribute('data-edit-id');
        
        const expenseData = {
            date: form.date.value,
            category: form.category.value,
            description: form.description.value,
            amount: parseFloat(form.amount.value),
            notes: form.notes.value
        };
        
        try {
            if (editId) {
                await this.dataManager.updateExpense(editId, expenseData);
                this.notifications.show('Gasto actualizado correctamente', 'success');
            } else {
                await this.dataManager.addExpense(expenseData);
                this.notifications.show('Gasto agregado correctamente', 'success');
            }
            
            this.closeModals();
            await this.loadExpenses();
            
            if (this.currentPage === 'dashboard') {
                await this.loadDashboard();
            }
        } catch (error) {
            console.error('Error saving expense:', error);
            this.notifications.show('Error al guardar gasto', 'error');
        }
    }

    async deleteExpense(expenseId) {
        if (confirm('¿Estás seguro de que deseas eliminar este gasto?')) {
            try {
                await this.dataManager.deleteExpense(expenseId);
                this.notifications.show('Gasto eliminado correctamente', 'success');
                await this.loadExpenses();
                
                if (this.currentPage === 'dashboard') {
                    await this.loadDashboard();
                }
            } catch (error) {
                console.error('Error deleting expense:', error);
                this.notifications.show('Error al eliminar gasto', 'error');
            }
        }
    }

    async loadReports() {
        // Implementation for reports page
        this.loadTopProducts();
    }

    loadTopProducts() {
        const salesData = this.dataManager.getSales();
        const productSales = {};
        
        salesData.forEach(sale => {
            if (sale.items) {
                sale.items.forEach(item => {
                    const product = this.dataManager.products.find(p => p.id === item.productId);
                    if (product) {
                        if (!productSales[product.name]) {
                            productSales[product.name] = 0;
                        }
                        productSales[product.name] += item.quantity;
                    }
                });
            }
        });
        
        const topProducts = Object.entries(productSales)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);
        
        const container = document.getElementById('topProductsList');
        container.innerHTML = topProducts.map(([name, quantity], index) => `
            <div class="top-product-item">
                <span class="rank">${index + 1}</span>
                <span class="name">${name}</span>
                <span class="quantity">${quantity} vendidos</span>
            </div>
        `).join('');
    }

    generateReport() {
        // Implementation for report generation
        const reportType = document.getElementById('reportType').value;
        
        try {
            const sampleData = new SampleDataManager();
            sampleData.generateReport(reportType);
        } catch (error) {
            console.error('Error generating report:', error);
            this.notifications.show('Error al generar reporte', 'error');
        }
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    viewSaleDetails(saleId) {
        const sale = this.dataManager.sales.find(s => s.id === saleId);
        if (sale) {
            alert(`Detalles de la venta:\n\nFactura: ${sale.invoiceNumber}\nFecha: ${Utils.formatDate(sale.date)}\nCliente: ${sale.customerName || 'Cliente general'}\nTotal: ${Utils.formatCurrency(sale.total)}`);
        }
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new FerreteriApp();
});

// Make app globally available for onclick handlers
window.app = app;