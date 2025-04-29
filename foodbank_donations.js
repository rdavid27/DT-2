// Check authentication
function checkAuth() {
    if (localStorage.getItem('isFoodBankLoggedIn') !== 'true') {
        window.location.href = 'foodbank_login.html';
        return false;
    }
    return true;
}

// Mock data for testing
const mockDonations = [
    {
        id: 1,
        restaurant: "Italian Restaurant",
        items: "Pasta, Bread, Salad",
        quantity: "15 portions",
        pickupTime: "2024-03-20 14:00",
        status: "Pending",
        contact: "John Smith",
        phone: "555-0123",
        address: "123 Main St, City",
        notes: "Please bring containers for the pasta"
    },
    {
        id: 2,
        restaurant: "Asian Fusion",
        items: "Rice, Vegetables",
        quantity: "20 portions",
        pickupTime: "2024-03-20 15:30",
        status: "Confirmed",
        contact: "Sarah Lee",
        phone: "555-0124",
        address: "456 Oak Ave, City",
        notes: "Vegetables are pre-cut"
    },
    {
        id: 3,
        restaurant: "Mexican Grill",
        items: "Beans, Rice, Tortillas",
        quantity: "25 portions",
        pickupTime: "2024-03-20 16:00",
        status: "Pending",
        contact: "Maria Garcia",
        phone: "555-0125",
        address: "789 Pine St, City",
        notes: "All items are vegetarian"
    },
    {
        id: 4,
        restaurant: "Burger Joint",
        items: "Buns, Patties, Vegetables",
        quantity: "30 portions",
        pickupTime: "2024-03-21 10:00",
        status: "Completed",
        contact: "Mike Johnson",
        phone: "555-0126",
        address: "321 Elm St, City",
        notes: "Patties are frozen"
    },
    {
        id: 5,
        restaurant: "Pizza Place",
        items: "Pizza, Breadsticks",
        quantity: "20 portions",
        pickupTime: "2024-03-21 11:30",
        status: "Cancelled",
        contact: "Tom Wilson",
        phone: "555-0127",
        address: "654 Maple Dr, City",
        notes: "Cancelled due to power outage"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    // Get DOM elements
    const donationsList = document.getElementById('donationsList');
    const searchInput = document.getElementById('searchDonations');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const exportBtn = document.querySelector('.export-btn');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const modal = document.getElementById('donationModal');
    const closeModal = document.querySelector('.close-modal');
    const donationDetails = document.getElementById('donationDetails');
    const confirmDonationBtn = document.getElementById('confirmDonation');
    const cancelDonationBtn = document.getElementById('cancelDonation');
    const completeDonationBtn = document.getElementById('completeDonation');

    // Pagination variables
    let currentPage = 1;
    const itemsPerPage = 10;
    let filteredDonations = [...mockDonations];

    // Populate donations table
    function populateDonations(donations) {
        donationsList.innerHTML = '';
        
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedDonations = donations.slice(startIndex, endIndex);

        paginatedDonations.forEach(donation => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.restaurant}</td>
                <td>${donation.items}</td>
                <td>${donation.quantity}</td>
                <td>${formatDateTime(donation.pickupTime)}</td>
                <td><span class="status-badge ${donation.status.toLowerCase()}">${donation.status}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${donation.id}">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                </td>
            `;
            donationsList.appendChild(row);
        });

        // Update pagination
        updatePagination(donations.length);
    }

    // Update pagination controls
    function updatePagination(totalItems) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // Filter donations
    function filterDonations() {
        const searchTerm = searchInput.value.toLowerCase();
        const statusValue = statusFilter.value;
        const dateValue = dateFilter.value;

        filteredDonations = mockDonations.filter(donation => {
            const matchesSearch = donation.restaurant.toLowerCase().includes(searchTerm) ||
                                donation.items.toLowerCase().includes(searchTerm);
            
            const matchesStatus = statusValue === 'all' || donation.status.toLowerCase() === statusValue;
            
            const matchesDate = filterByDate(donation.pickupTime, dateValue);
            
            return matchesSearch && matchesStatus && matchesDate;
        });

        currentPage = 1;
        populateDonations(filteredDonations);
    }

    // Filter by date
    function filterByDate(dateStr, filterValue) {
        if (filterValue === 'all') return true;
        
        const date = new Date(dateStr);
        const now = new Date();
        
        switch (filterValue) {
            case 'today':
                return date.toDateString() === now.toDateString();
            case 'week':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return date >= weekAgo && date <= now;
            case 'month':
                const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                return date >= monthAgo && date <= now;
            default:
                return true;
        }
    }

    // Show donation details
    function showDonationDetails(donationId) {
        const donation = mockDonations.find(d => d.id === parseInt(donationId));
        if (!donation) return;

        donationDetails.innerHTML = `
            <div class="detail-group">
                <h3>Restaurant Information</h3>
                <p><strong>Name:</strong> ${donation.restaurant}</p>
                <p><strong>Contact:</strong> ${donation.contact}</p>
                <p><strong>Phone:</strong> ${donation.phone}</p>
                <p><strong>Address:</strong> ${donation.address}</p>
            </div>
            <div class="detail-group">
                <h3>Donation Details</h3>
                <p><strong>Items:</strong> ${donation.items}</p>
                <p><strong>Quantity:</strong> ${donation.quantity}</p>
                <p><strong>Pickup Time:</strong> ${formatDateTime(donation.pickupTime)}</p>
                <p><strong>Status:</strong> <span class="status-badge ${donation.status.toLowerCase()}">${donation.status}</span></p>
                <p><strong>Notes:</strong> ${donation.notes}</p>
            </div>
        `;

        // Show/hide action buttons based on status
        confirmDonationBtn.style.display = donation.status === 'Pending' ? 'block' : 'none';
        cancelDonationBtn.style.display = ['Pending', 'Confirmed'].includes(donation.status) ? 'block' : 'none';
        completeDonationBtn.style.display = donation.status === 'Confirmed' ? 'block' : 'none';

        // Set up action buttons
        confirmDonationBtn.onclick = () => updateDonationStatus(donationId, 'Confirmed');
        cancelDonationBtn.onclick = () => updateDonationStatus(donationId, 'Cancelled');
        completeDonationBtn.onclick = () => updateDonationStatus(donationId, 'Completed');

        modal.style.display = 'block';
    }

    // Update donation status
    function updateDonationStatus(donationId, newStatus) {
        const donation = mockDonations.find(d => d.id === parseInt(donationId));
        if (!donation) return;

        donation.status = newStatus;
        filterDonations();
        modal.style.display = 'none';
        
        // Show success message
        alert(`Donation status updated to ${newStatus}`);
    }

    // Export donations data
    function exportDonations() {
        const csvContent = [
            ['Restaurant', 'Items', 'Quantity', 'Pickup Time', 'Status', 'Contact', 'Phone', 'Address', 'Notes'],
            ...filteredDonations.map(d => [
                d.restaurant,
                d.items,
                d.quantity,
                d.pickupTime,
                d.status,
                d.contact,
                d.phone,
                d.address,
                d.notes
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `donations_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
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

    // Event listeners
    searchInput.addEventListener('input', filterDonations);
    statusFilter.addEventListener('change', filterDonations);
    dateFilter.addEventListener('change', filterDonations);
    exportBtn.addEventListener('click', exportDonations);
    
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            populateDonations(filteredDonations);
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            populateDonations(filteredDonations);
        }
    });

    // Modal event listeners
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // View button click handler
    donationsList.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn) {
            showDonationDetails(viewBtn.dataset.id);
        }
    });

    // Initial population
    populateDonations(mockDonations);
}); 