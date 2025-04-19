// Mock data - In a real application, this would come from an API
const mockData = {
    revenue: 125000,
    cost: 75000,
    profit: 50000
};

// Function to format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Function to animate value changes
function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const animate = () => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = formatCurrency(end);
            return;
        }
        element.textContent = formatCurrency(Math.round(current));
        requestAnimationFrame(animate);
    };

    animate();
}

// Function to update financial metrics
function updateFinancialMetrics() {
    const revenueElement = document.getElementById('totalRevenue');
    const costElement = document.getElementById('totalCost');
    const profitElement = document.getElementById('totalProfit');

    // Animate each value
    animateValue(revenueElement, 0, mockData.revenue, 2000);
    animateValue(costElement, 0, mockData.cost, 2000);
    animateValue(profitElement, 0, mockData.profit, 2000);
}

// Simulate real-time updates (every 30 seconds)
function simulateRealTimeUpdates() {
    setInterval(() => {
        // Randomly adjust values by ±5%
        mockData.revenue *= (1 + (Math.random() * 0.1 - 0.05));
        mockData.cost *= (1 + (Math.random() * 0.1 - 0.05));
        mockData.profit = mockData.revenue - mockData.cost;
        
        updateFinancialMetrics();
    }, 30000);
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    updateFinancialMetrics();
    simulateRealTimeUpdates();
});

// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}); 