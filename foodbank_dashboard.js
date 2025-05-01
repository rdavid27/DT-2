// Check authentication
function checkAuth() {
    if (localStorage.getItem('isFoodBankLoggedIn') !== 'true') {
        window.location.href = 'foodbank_login.html';
        return false;
    }
    return true;
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    // Set food bank name
    const foodBankName = localStorage.getItem('foodBankName');
    document.getElementById('foodBankName').textContent = foodBankName;

    // Mock data for testing (in a real application, this would come from a backend)
    const mockDonations = [
        {
            id: 1,
            restaurant: "Italian Restaurant",
            items: "Pasta, Bread, Salad",
            quantity: "15 portions",
            pickupTime: "2024-03-20 14:00",
            status: "Pending"
        },
        {
            id: 2,
            restaurant: "Asian Fusion",
            items: "Rice, Vegetables",
            quantity: "20 portions",
            pickupTime: "2024-03-20 15:30",
            status: "Confirmed"
        },
        {
            id: 3,
            restaurant: "Mexican Grill",
            items: "Beans, Rice, Tortillas",
            quantity: "25 portions",
            pickupTime: "2024-03-20 16:00",
            status: "Pending"
        }
    ];

    // Update dashboard stats
    updateDashboardStats(mockDonations);

    // Populate recent donations table
    populateRecentDonations(mockDonations);
});

// Update dashboard statistics
function updateDashboardStats(donations) {
    const activeDonations = donations.filter(d => d.status === "Pending").length;
    document.getElementById('activeDonations').textContent = activeDonations;

    // Mock partner count
    document.getElementById('partnerCount').textContent = "5";

    // Calculate upcoming pickups (next 24 hours)
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const upcomingPickups = donations.filter(d => {
        const pickupTime = new Date(d.pickupTime);
        return pickupTime >= now && pickupTime <= next24Hours;
    }).length;
    document.getElementById('upcomingPickups').textContent = upcomingPickups;
}

// Populate recent donations table
function populateRecentDonations(donations) {
    const tbody = document.getElementById('recentDonationsList');
    tbody.innerHTML = '';

    donations.forEach(donation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${donation.restaurant}</td>
            <td>${donation.items}</td>
            <td>${donation.quantity}</td>
            <td>${formatDateTime(donation.pickupTime)}</td>
            <td><span class="status-badge ${donation.status.toLowerCase()}">${donation.status}</span></td>
            <td>
                <button class="action-btn confirm-btn" data-id="${donation.id}" ${donation.status === 'Confirmed' ? 'disabled' : ''}>
                    <i class="fas fa-check"></i> Confirm
                </button>
                <button class="action-btn details-btn" data-id="${donation.id}">
                    <i class="fas fa-info-circle"></i> Details
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.confirm-btn').forEach(btn => {
        btn.addEventListener('click', () => confirmDonation(btn.dataset.id));
    });

    document.querySelectorAll('.details-btn').forEach(btn => {
        btn.addEventListener('click', () => showDonationDetails(btn.dataset.id));
    });
}

// Format date and time
function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Confirm donation
function confirmDonation(donationId) {
    // In a real application, this would make an API call
    console.log(`Confirming donation ${donationId}`);
    
    const modal = document.getElementById('successModal');
    const closeSuccess = document.getElementById('closeSuccess');

    // Show the modal
    modal.style.display = 'block';

    // Handle clicking outside the modal
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Handle close success button
    closeSuccess.onclick = () => {
        modal.style.display = 'none';
    };
}

// Show donation details
function showDonationDetails(donationId) {
    // In a real application, this would fetch detailed information
    console.log(`Showing details for donation ${donationId}`);
    alert('Donation details would be shown in a modal');
} 