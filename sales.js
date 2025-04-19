// DOM Elements
const salesTableBody = document.getElementById('salesTableBody');
const addSaleBtn = document.getElementById('addSaleBtn');
const saleModal = document.getElementById('saleModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const saleForm = document.getElementById('saleForm');
const confirmModal = document.getElementById('confirmModal');
const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const modalTitle = document.getElementById('modalTitle');
const menuItemSelect = document.getElementById('menuItem');
const monthlyRevenue = document.getElementById('monthlyRevenue');
const monthlyItemsSold = document.getElementById('monthlyItemsSold');
const bestSellingItem = document.getElementById('bestSellingItem');
const quantityInput = document.getElementById('quantity');
const dateInput = document.getElementById('date');

// State
let sales = DataStore.getSales() || [];
let menuItems = DataStore.getMenuItems() || [];
let editingId = null;

// Format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get menu item by ID
function getMenuItem(id) {
    return menuItems.find(item => item.id === id);
}

// Get sales from the last 30 days
function getLastMonthSales() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return sales.filter(sale => new Date(sale.date) >= thirtyDaysAgo);
}

// Calculate monthly analytics
function calculateMonthlyAnalytics() {
    const lastMonthSales = getLastMonthSales();
    
    // Calculate total revenue and items sold
    const totals = lastMonthSales.reduce((acc, sale) => {
        const menuItem = getMenuItem(sale.menuItemId);
        if (menuItem) {
            acc.revenue += menuItem.price * sale.quantity;
            acc.items += sale.quantity;
        }
        return acc;
    }, { revenue: 0, items: 0 });

    // Find best-selling item
    const itemSales = {};
    lastMonthSales.forEach(sale => {
        const menuItem = getMenuItem(sale.menuItemId);
        if (menuItem) {
            if (!itemSales[menuItem.id]) {
                itemSales[menuItem.id] = {
                    name: menuItem.name,
                    quantity: 0,
                    revenue: 0
                };
            }
            itemSales[menuItem.id].quantity += sale.quantity;
            itemSales[menuItem.id].revenue += menuItem.price * sale.quantity;
        }
    });

    const bestSeller = Object.values(itemSales).reduce((best, current) => {
        return current.quantity > best.quantity ? current : best;
    }, { name: '-', quantity: 0, revenue: 0 });

    return {
        totals,
        bestSeller,
        itemSales
    };
}

// Update analytics display
function updateAnalytics() {
    const analytics = calculateMonthlyAnalytics();
    
    // Update elements only if they exist
    const monthlyRevenueElement = document.getElementById('monthlyRevenue');
    const monthlyItemsSoldElement = document.getElementById('monthlyItemsSold');
    const bestSellingItemElement = document.getElementById('bestSellingItem');
    
    if (monthlyRevenueElement) {
        monthlyRevenueElement.textContent = formatCurrency(analytics.totals.revenue);
    }
    
    if (monthlyItemsSoldElement) {
        monthlyItemsSoldElement.textContent = analytics.totals.items;
    }
    
    if (bestSellingItemElement) {
        bestSellingItemElement.textContent = `${analytics.bestSeller.name} (${analytics.bestSeller.quantity} sales)`;
    }
}

// Render sales table
function renderSales() {
    const analytics = calculateMonthlyAnalytics();
    salesTableBody.innerHTML = '';

    Object.values(analytics.itemSales).forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${formatCurrency(item.revenue)}</td>
            <td>${formatCurrency(item.revenue / item.quantity)}</td>
        `;
        salesTableBody.appendChild(row);
    });

    updateAnalytics();
}

// Populate menu items dropdown
function populateMenuItems() {
    menuItemSelect.innerHTML = '<option value="">Select a menu item</option>';
    menuItems.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} - ${formatCurrency(item.price)}`;
        menuItemSelect.appendChild(option);
    });
}

// Show modal
function showModal(title = 'Add New Sale') {
    modalTitle.textContent = title;
    saleModal.style.display = 'flex';
    saleModal.classList.add('show');
    populateMenuItems();
    dateInput.value = new Date().toISOString().slice(0, 16);
}

// Hide modal
function hideModal() {
    saleModal.classList.remove('show');
    saleModal.style.display = 'none';
    saleForm.reset();
    editingId = null;
    const pricePreview = document.getElementById('pricePreview');
    if (pricePreview) {
        pricePreview.textContent = formatCurrency(0);
    }
}

// Show confirmation modal
function showConfirmModal() {
    confirmModal.style.display = 'flex';
    confirmModal.classList.add('show');
}

// Hide confirmation modal
function hideConfirmModal() {
    confirmModal.classList.remove('show');
    confirmModal.style.display = 'none';
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    
    const menuItemId = parseInt(menuItemSelect.value);
    const quantity = parseInt(quantityInput.value);
    const date = dateInput.value;
    const menuItem = menuItems.find(item => item.id === menuItemId);

    if (!menuItemId || !quantity || !date || !menuItem) {
        alert('Please fill in all fields');
        return;
    }

    try {
        if (editingId) {
            // Update existing sale
            const updatedSale = {
                id: editingId,
                menuItemId,
                quantity,
                date,
                total: menuItem.price * quantity
            };
            DataStore.updateSale(updatedSale);
        } else {
            // Add new sale
            const newSale = {
                menuItemId,
                quantity,
                date,
                total: menuItem.price * quantity
            };
            DataStore.addSale(newSale);
        }
        
        // Update state
        sales = DataStore.getSales();
        
        // Update all displays
        updateSalesDisplay();
        updateDashboardCards();
        hideModal();
    } catch (error) {
        console.error('Error saving sale:', error);
        alert('Error saving sale. Please try again.');
    }
}

// Handle edit
function handleEdit(id) {
    const sale = sales.find(s => s.id === id);
    if (sale) {
        editingId = id;
        menuItemSelect.value = sale.menuItemId;
        quantityInput.value = sale.quantity;
        dateInput.value = sale.date;
        updatePricePreview();
        showModal('Edit Sale');
    }
}

// Handle delete
function handleDelete(id) {
    try {
        DataStore.deleteSale(id);
        updateSalesDisplay();
        hideConfirmModal();
    } catch (error) {
        console.error('Error deleting sale:', error);
        alert('Error deleting sale. Please try again.');
    }
}

// Event delegation for edit and delete buttons
salesTableBody.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    const id = parseInt(target.dataset.id);
    if (!id) return;

    if (target.classList.contains('edit-btn')) {
        handleEdit(id);
    } else if (target.classList.contains('delete-btn')) {
        showConfirmModal();
        confirmDeleteBtn.onclick = () => handleDelete(id);
    }
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === saleModal) hideModal();
    if (e.target === confirmModal) hideConfirmModal();
});

// Initialize
if (menuItemSelect) {
    populateMenuItems();
}
if (salesTableBody) {
    renderSales();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Sales page loaded, initializing...');
    
    try {
        // Initialize state
        sales = DataStore.getSales();
        menuItems = DataStore.getMenuItems();
        
        // Initialize sales data
        initializeSalesData();
        console.log('Sales data initialized');
        
        // Initialize event listeners
        initializeEventListeners();
        console.log('Event listeners initialized');
        
        // Update dashboard cards immediately
        updateDashboardCards();
        
        // Set up auto-refresh every 5 minutes
        setInterval(() => {
            sales = DataStore.getSales();
            menuItems = DataStore.getMenuItems();
            updateSalesDisplay();
            updateDashboardCards();
        }, 5 * 60 * 1000);
    } catch (error) {
        console.error('Error initializing sales page:', error);
    }
});

// Initialize sales data
function initializeSalesData() {
    try {
        updateSalesDisplay();
    } catch (error) {
        console.error('Error initializing sales data:', error);
    }
}

// Update all sales displays
function updateSalesDisplay() {
    try {
        // Get fresh data
        sales = DataStore.getSales();
        menuItems = DataStore.getMenuItems();
        
        // Update all components
        updateSummaryCards();
        updateCharts();
        updateRecentOrders();
        updateTopItems();
        updateSalesTable();
        
        console.log('All sales displays updated successfully');
    } catch (error) {
        console.error('Error updating sales displays:', error);
    }
}

// Update summary cards
function updateSummaryCards() {
    try {
        // Today's sales
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todaySales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= today && saleDate < tomorrow;
        });
        
        const todayTotal = todaySales.reduce((sum, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return sum + (menuItem ? menuItem.price * sale.quantity : 0);
        }, 0);
        
        const todayOrders = todaySales.length;
        
        const todaySalesElement = document.getElementById('todaySales');
        const todayOrdersElement = document.getElementById('todayOrders');
        
        if (todaySalesElement && todayOrdersElement) {
            todaySalesElement.textContent = formatCurrency(todayTotal);
            todayOrdersElement.textContent = `${todayOrders} orders`;
        }
        
        // This week's sales
        const now = new Date();
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay()); // Start from Sunday
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7); // End on Saturday
        
        const weekSales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= weekStart && saleDate < weekEnd;
        });
        
        const weekTotal = weekSales.reduce((sum, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return sum + (menuItem ? menuItem.price * sale.quantity : 0);
        }, 0);
        
        const weekOrders = weekSales.length;
        
        const weekSalesElement = document.getElementById('weekSales');
        const weekOrdersElement = document.getElementById('weekOrders');
        
        if (weekSalesElement && weekOrdersElement) {
            weekSalesElement.textContent = formatCurrency(weekTotal);
            weekOrdersElement.textContent = `${weekOrders} orders`;
        }
        
        // This month's sales
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
        monthStart.setHours(0, 0, 0, 0);
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1); // First day of next month
        
        const monthSales = sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= monthStart && saleDate < nextMonth;
        });
        
        const monthTotal = monthSales.reduce((sum, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return sum + (menuItem ? menuItem.price * sale.quantity : 0);
        }, 0);
        
        const monthOrders = monthSales.length;
        
        const monthSalesElement = document.getElementById('monthSales');
        const monthOrdersElement = document.getElementById('monthOrders');
        
        if (monthSalesElement && monthOrdersElement) {
            monthSalesElement.textContent = formatCurrency(monthTotal);
            monthOrdersElement.textContent = `${monthOrders} orders`;
        }
    } catch (error) {
        console.error('Error updating summary cards:', error);
    }
}

// Chart instances
let salesTrendChart;
let categoryDistributionChart;
let topItemsChart;

// Function to create sales trend chart
function createSalesTrendChart() {
    const ctx = document.getElementById('salesTrendChart').getContext('2d');
    
    // Get last 7 days of sales
    const last7Days = Array.from({length: 7}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
    }).reverse();

    // Calculate daily sales
    const dailySales = last7Days.map(date => {
        const daySales = sales.filter(sale => sale.date.startsWith(date));
        return daySales.reduce((sum, sale) => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            return sum + (menuItem ? menuItem.price * sale.quantity : 0);
        }, 0);
    });

    salesTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
            datasets: [{
                label: 'Daily Sales',
                data: dailySales,
                borderColor: '#00a8ff',
                backgroundColor: 'rgba(0, 168, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Sales Trend (Last 7 Days)',
                    color: '#ffffff',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                }
            }
        }
    });
}

// Function to create category distribution chart
function createCategoryDistributionChart() {
    const ctx = document.getElementById('categoryDistributionChart').getContext('2d');
    
    // Calculate sales by category
    const categorySales = {};
    sales.forEach(sale => {
        const menuItem = menuItems.find(item => item.id === sale.menuItemId);
        if (menuItem) {
            const category = menuItem.category;
            const saleTotal = menuItem.price * sale.quantity;
            categorySales[category] = (categorySales[category] || 0) + saleTotal;
        }
    });

    categoryDistributionChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categorySales),
            datasets: [{
                data: Object.values(categorySales),
                backgroundColor: [
                    '#00a8ff',
                    '#0097e6',
                    '#0097e6',
                    '#0097e6',
                    '#0097e6'
                ],
                borderColor: '#242424',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#b3b3b3'
                    }
                },
                title: {
                    display: true,
                    text: 'Sales by Category',
                    color: '#ffffff',
                    font: {
                        size: 16
                    }
                }
            }
        }
    });
}

// Function to create top items chart
function createTopItemsChart() {
    const ctx = document.getElementById('topItemsChart').getContext('2d');
    
    // Calculate sales by menu item
    const itemSales = {};
    sales.forEach(sale => {
        const menuItem = menuItems.find(item => item.id === sale.menuItemId);
        if (menuItem) {
            const saleTotal = menuItem.price * sale.quantity;
            itemSales[menuItem.name] = (itemSales[menuItem.name] || 0) + saleTotal;
        }
    });

    // Get top 5 items
    const topItems = Object.entries(itemSales)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

    topItemsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topItems.map(([name]) => name),
            datasets: [{
                label: 'Sales',
                data: topItems.map(([,total]) => total),
                backgroundColor: '#00a8ff',
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Top 5 Selling Items',
                    color: '#ffffff',
                    font: {
                        size: 16
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#b3b3b3'
                    }
                }
            }
        }
    });
}

// Function to update all charts
function updateCharts() {
    if (salesTrendChart) salesTrendChart.destroy();
    if (categoryDistributionChart) categoryDistributionChart.destroy();
    if (topItemsChart) topItemsChart.destroy();

    createSalesTrendChart();
    createCategoryDistributionChart();
    createTopItemsChart();
}

// Update recent orders
function updateRecentOrders() {
    try {
        const ordersList = document.getElementById('recentOrders');
        if (!ordersList) {
            console.error('Recent orders container not found');
            return;
        }

        const sales = DataStore.getSales();
        const menuItems = DataStore.getMenuItems();
        
        // Get 5 most recent sales
        const recentSales = sales
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
            .map(sale => {
                const menuItem = menuItems.find(item => item.id === sale.menuItemId);
                return {
                    id: `ORD-${String(sale.id).padStart(3, '0')}`,
                    date: formatDate(sale.date),
                    items: [menuItem.name],
                    total: sale.total,
                    status: 'completed'
                };
            });

        ordersList.innerHTML = recentSales.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <span class="order-id">${order.id}</span>
                    <span class="order-date">${order.date}</span>
                </div>
                <div class="order-items">
                    ${order.items.map(item => `<span class="item-tag">${item}</span>`).join('')}
                </div>
                <div class="order-footer">
                    <span class="order-total">${formatCurrency(order.total)}</span>
                    <span class="order-status ${order.status}">${order.status}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating recent orders:', error);
    }
}

// Update top items
function updateTopItems() {
    try {
        const topItemsList = document.getElementById('topItems');
        if (!topItemsList) {
            console.error('Top items container not found');
            return;
        }

        topItemsList.innerHTML = topItems.map(item => `
            <div class="top-item">
                <span class="item-name">${item.name}</span>
                <div class="item-stats">
                    <span>${item.orders} orders</span>
                    <span>${formatCurrency(item.revenue)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error updating top items:', error);
    }
}

// Update sales table
function updateSalesTable() {
    try {
        const tableBody = document.getElementById('salesTableBody');
        if (!tableBody) {
            console.error('Sales table body not found');
            return;
        }

        // Calculate sales data for each menu item
        const itemSales = {};
        sales.forEach(sale => {
            const menuItem = menuItems.find(item => item.id === sale.menuItemId);
            if (menuItem) {
                if (!itemSales[menuItem.id]) {
                    itemSales[menuItem.id] = {
                        name: menuItem.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                itemSales[menuItem.id].quantity += sale.quantity;
                itemSales[menuItem.id].revenue += menuItem.price * sale.quantity;
            }
        });

        // Sort items by revenue in descending order
        const sortedItems = Object.values(itemSales).sort((a, b) => b.revenue - a.revenue);

        // Update the table
        tableBody.innerHTML = sortedItems.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCurrency(item.revenue)}</td>
                <td>${formatCurrency(item.revenue / item.quantity)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error updating sales table:', error);
    }
}

// Initialize event listeners
function initializeEventListeners() {
    const addSaleBtn = document.getElementById('addSaleBtn');
    const saleModal = document.getElementById('saleModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const saleForm = document.getElementById('saleForm');
    const menuItemSelect = document.getElementById('menuItem');
    const quantityInput = document.getElementById('quantity');
    const dateInput = document.getElementById('date');
    const pricePreview = document.getElementById('pricePreview');
    const confirmModal = document.getElementById('confirmModal');
    const closeConfirmModalBtn = document.getElementById('closeConfirmModalBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (!addSaleBtn || !saleModal || !closeModalBtn || !cancelBtn || !saleForm || 
        !menuItemSelect || !quantityInput || !dateInput || !pricePreview ||
        !confirmModal || !closeConfirmModalBtn || !cancelDeleteBtn || !confirmDeleteBtn) {
        console.error('Required elements not found');
        return;
    }

    // Populate menu items dropdown
    const menuItems = DataStore.getMenuItems();
    menuItemSelect.innerHTML = '<option value="">Select a menu item</option>' +
        menuItems.map(item => `
            <option value="${item.id}">${item.name} - ${formatCurrency(item.price)}</option>
        `).join('');

    // Update price preview when menu item or quantity changes
    function updatePricePreview() {
        const menuItemId = parseInt(menuItemSelect.value);
        const quantity = parseInt(quantityInput.value) || 0;
        const menuItem = menuItems.find(item => item.id === menuItemId);
        
        if (menuItem) {
            const total = menuItem.price * quantity;
            pricePreview.textContent = formatCurrency(total);
        } else {
            pricePreview.textContent = formatCurrency(0);
        }
    }

    menuItemSelect.addEventListener('change', updatePricePreview);
    quantityInput.addEventListener('input', updatePricePreview);

    // Modal controls
    addSaleBtn.addEventListener('click', () => {
        console.log('Add sale button clicked');
        saleForm.reset();
        dateInput.value = new Date().toISOString().slice(0, 16);
        pricePreview.textContent = formatCurrency(0);
        saleModal.style.display = 'flex';
        saleModal.classList.add('show');
    });

    const hideModal = () => {
        saleModal.classList.remove('show');
        saleModal.style.display = 'none';
        saleForm.reset();
        pricePreview.textContent = formatCurrency(0);
    };

    closeModalBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // Handle form submission
    saleForm.addEventListener('submit', handleSubmit);

    // Confirmation modal controls
    closeConfirmModalBtn.addEventListener('click', hideConfirmModal);
    cancelDeleteBtn.addEventListener('click', hideConfirmModal);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeSalesData,
        updateSummaryCards,
        updateCharts,
        updateRecentOrders,
        updateTopItems
    };
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