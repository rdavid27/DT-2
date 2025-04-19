// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Function to update dashboard cards
function updateDashboardCards() {
    try {
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        
        // Calculate start of week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        
        // Calculate end of week (Saturday)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);
        
        // Calculate start of month
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // Calculate end of month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        
        // Get all sales and menu items
        const sales = DataStore.getSales();
        const menuItems = DataStore.getMenuItems();
        
        // Calculate today's sales
        const todaySales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startOfDay && saleDate < endOfDay;
        });
        const todayTotal = todaySales.reduce((sum, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return sum + (menuItem ? menuItem.price * sale.quantity : 0);
        }, 0);
        
        // Calculate this week's sales
        const weekSales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startOfWeek && saleDate < endOfWeek;
        });
        const weekTotal = weekSales.reduce((sum, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return sum + (menuItem ? menuItem.price * sale.quantity : 0);
        }, 0);
        
        // Calculate this month's sales
        const monthSales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startOfMonth && saleDate < endOfMonth;
        });
        const monthTotal = monthSales.reduce((sum, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return sum + (menuItem ? menuItem.price * sale.quantity : 0);
        }, 0);
        
        // Update dashboard cards
        const todaySalesElement = document.getElementById('todaySales');
        const todayOrdersElement = document.getElementById('todayOrders');
        const weekSalesElement = document.getElementById('weekSales');
        const weekOrdersElement = document.getElementById('weekOrders');
        const monthSalesElement = document.getElementById('monthSales');
        const monthOrdersElement = document.getElementById('monthOrders');
        
        if (todaySalesElement) todaySalesElement.textContent = formatCurrency(todayTotal);
        if (todayOrdersElement) todayOrdersElement.textContent = `${todaySales.length} orders`;
        if (weekSalesElement) weekSalesElement.textContent = formatCurrency(weekTotal);
        if (weekOrdersElement) weekOrdersElement.textContent = `${weekSales.length} orders`;
        if (monthSalesElement) monthSalesElement.textContent = formatCurrency(monthTotal);
        if (monthOrdersElement) monthOrdersElement.textContent = `${monthSales.length} orders`;
        
        console.log('Dashboard cards updated successfully');
    } catch (error) {
        console.error('Error updating dashboard cards:', error);
    }
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard initialized');
    updateDashboardCards();
    
    // Set up auto-refresh every 5 minutes
    setInterval(updateDashboardCards, 5 * 60 * 1000);
}); 