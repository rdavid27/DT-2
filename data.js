// Centralized data storage
const DATA_KEYS = {
    MENU_ITEMS: 'menuItems',
    INGREDIENTS: 'ingredients',
    SALES: 'sales',
    USER: 'user'
};

// Data management functions
const DataStore = {
    // Initialize data
    init() {
        if (!this.getData(DATA_KEYS.MENU_ITEMS)) {
            this.setData(DATA_KEYS.MENU_ITEMS, []);
        }
        if (!this.getData(DATA_KEYS.INGREDIENTS)) {
            this.setData(DATA_KEYS.INGREDIENTS, []);
        }
        if (!this.getData(DATA_KEYS.SALES)) {
            this.setData(DATA_KEYS.SALES, []);
        }
    },

    // Clear all data
    clearAllData() {
        Object.values(DATA_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        this.init();
    },

    // Get data from localStorage
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error getting data for key ${key}:`, error);
            return null;
        }
    },

    // Set data in localStorage
    setData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error(`Error setting data for key ${key}:`, error);
        }
    },

    // Menu Items
    getMenuItems() {
        return this.getData(DATA_KEYS.MENU_ITEMS) || [];
    },

    addMenuItem(item) {
        const items = this.getMenuItems();
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        const newItem = { ...item, id: newId };
        items.push(newItem);
        this.setData(DATA_KEYS.MENU_ITEMS, items);
        return newItem;
    },

    updateMenuItem(updatedItem) {
        const items = this.getMenuItems();
        const index = items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            items[index] = updatedItem;
            this.setData(DATA_KEYS.MENU_ITEMS, items);
            return items[index];
        }
        return null;
    },

    deleteMenuItem(id) {
        const items = this.getMenuItems();
        const filteredItems = items.filter(item => item.id !== id);
        this.setData(DATA_KEYS.MENU_ITEMS, filteredItems);
    },

    // Ingredients
    getIngredients() {
        return this.getData(DATA_KEYS.INGREDIENTS) || [];
    },

    addIngredient(ingredient) {
        const ingredients = this.getIngredients();
        const newId = Math.max(...ingredients.map(i => i.id), 0) + 1;
        const newIngredient = { ...ingredient, id: newId };
        ingredients.push(newIngredient);
        this.setData(DATA_KEYS.INGREDIENTS, ingredients);
        return newIngredient;
    },

    updateIngredient(updatedIngredient) {
        const ingredients = this.getIngredients();
        const index = ingredients.findIndex(item => item.id === updatedIngredient.id);
        if (index !== -1) {
            ingredients[index] = updatedIngredient;
            this.setData(DATA_KEYS.INGREDIENTS, ingredients);
            return ingredients[index];
        }
        return null;
    },

    deleteIngredient(id) {
        const ingredients = this.getIngredients();
        const filteredIngredients = ingredients.filter(item => item.id !== id);
        this.setData(DATA_KEYS.INGREDIENTS, filteredIngredients);
    },

    // Sales
    getSales() {
        return this.getData(DATA_KEYS.SALES) || [];
    },

    addSale(sale) {
        const sales = this.getSales();
        const newId = Math.max(...sales.map(s => s.id), 0) + 1;
        const newSale = { ...sale, id: newId };
        sales.push(newSale);
        this.setData(DATA_KEYS.SALES, sales);
        return newSale;
    },

    // Analytics
    getSalesAnalytics() {
        const sales = this.getSales();
        const menuItems = this.getMenuItems();
        
        // Calculate daily sales
        const dailySales = this.calculateDailySales(sales, menuItems);
        
        // Calculate weekly sales
        const weeklySales = this.calculateWeeklySales(sales, menuItems);
        
        // Calculate monthly sales
        const monthlySales = this.calculateMonthlySales(sales, menuItems);
        
        // Calculate top items
        const topItems = this.calculateTopItems(sales, menuItems);
        
        return {
            daily: dailySales,
            weekly: weeklySales,
            monthly: monthlySales,
            topItems: topItems
        };
    },

    calculateDailySales(sales, menuItems) {
        const dailyMap = new Map();
        
        sales.forEach(sale => {
            const date = new Date(sale.date).toISOString().split('T')[0];
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            
            if (!dailyMap.has(date)) {
                dailyMap.set(date, { total: 0, orders: 0 });
            }
            
            const daily = dailyMap.get(date);
            daily.total += sale.total;
            daily.orders += sale.quantity;
        });
        
        return Array.from(dailyMap.entries()).map(([date, data]) => ({
            date,
            total: data.total,
            orders: data.orders
        }));
    },

    calculateWeeklySales(sales, menuItems) {
        const weeklyMap = new Map();
        
        sales.forEach(sale => {
            const date = new Date(sale.date);
            const weekNumber = this.getWeekNumber(date);
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            
            if (!weeklyMap.has(weekNumber)) {
                weeklyMap.set(weekNumber, { total: 0, orders: 0 });
            }
            
            const weekly = weeklyMap.get(weekNumber);
            weekly.total += sale.total;
            weekly.orders += sale.quantity;
        });
        
        return Array.from(weeklyMap.entries()).map(([week, data]) => ({
            week,
            total: data.total,
            orders: data.orders
        }));
    },

    calculateMonthlySales(sales, menuItems) {
        const monthlyMap = new Map();
        
        sales.forEach(sale => {
            const date = new Date(sale.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            
            if (!monthlyMap.has(monthKey)) {
                monthlyMap.set(monthKey, { total: 0, orders: 0 });
            }
            
            const monthly = monthlyMap.get(monthKey);
            monthly.total += sale.total;
            monthly.orders += sale.quantity;
        });
        
        return Array.from(monthlyMap.entries()).map(([month, data]) => ({
            month,
            total: data.total,
            orders: data.orders
        }));
    },

    calculateTopItems(sales, menuItems) {
        const itemMap = new Map();
        
        sales.forEach(sale => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            if (!menuItem) return;
            
            if (!itemMap.has(menuItem.id)) {
                itemMap.set(menuItem.id, {
                    id: menuItem.id,
                    name: menuItem.name,
                    total: 0,
                    orders: 0
                });
            }
            
            const item = itemMap.get(menuItem.id);
            item.total += sale.total;
            item.orders += sale.quantity;
        });
        
        return Array.from(itemMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    },

    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }
};

// Initialize data store
DataStore.init();

// Export the DataStore object
window.DataStore = DataStore; 