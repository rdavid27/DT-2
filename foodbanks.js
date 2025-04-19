// Sample food bank data (in a real application, this would come from an API)
const FOOD_BANKS = [
    {
        id: 1,
        name: "Community Food Bank",
        address: "123 Main St, Anytown, USA",
        phone: "(555) 123-4567",
        email: "info@communityfoodbank.org",
        website: "www.communityfoodbank.org",
        hours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm",
        accepts: ["Fresh Produce", "Canned Goods", "Bakery Items", "Dairy Products"],
        latitude: 40.7128,
        longitude: -74.0060
    },
    {
        id: 2,
        name: "Hope Food Pantry",
        address: "456 Oak Ave, Somewhere, USA",
        phone: "(555) 987-6543",
        email: "contact@hopefoodpantry.org",
        website: "www.hopefoodpantry.org",
        hours: "Mon-Sun: 8am-8pm",
        accepts: ["Fresh Produce", "Meat", "Dairy Products", "Prepared Foods"],
        latitude: 40.7589,
        longitude: -73.9851
    },
    {
        id: 3,
        name: "Second Harvest Food Bank",
        address: "789 Pine St, Everywhere, USA",
        phone: "(555) 456-7890",
        email: "donate@secondharvest.org",
        website: "www.secondharvest.org",
        hours: "Mon-Fri: 8am-6pm",
        accepts: ["Fresh Produce", "Canned Goods", "Bakery Items", "Prepared Foods"],
        latitude: 40.7829,
        longitude: -73.9654
    },
    {
        id: 4,
        name: "Food for All",
        address: "321 Elm St, Nowhere, USA",
        phone: "(555) 234-5678",
        email: "info@foodforall.org",
        website: "www.foodforall.org",
        hours: "Mon-Sat: 9am-4pm",
        accepts: ["Fresh Produce", "Canned Goods", "Dairy Products"],
        latitude: 40.7549,
        longitude: -73.9840
    },
    {
        id: 5,
        name: "Feeding Families",
        address: "654 Maple Dr, Anywhere, USA",
        phone: "(555) 876-5432",
        email: "help@feedingfamilies.org",
        website: "www.feedingfamilies.org",
        hours: "Mon-Fri: 10am-7pm, Sat: 9am-1pm",
        accepts: ["Fresh Produce", "Meat", "Dairy Products", "Prepared Foods"],
        latitude: 40.7484,
        longitude: -73.9857
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize map
    initMap();
    
    // Display food banks
    displayFoodBanks(FOOD_BANKS);
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredFoodBanks = FOOD_BANKS.filter(foodbank => 
            foodbank.name.toLowerCase().includes(searchTerm) || 
            foodbank.address.toLowerCase().includes(searchTerm)
        );
        displayFoodBanks(filteredFoodBanks);
    });
});

// Initialize map with food bank locations
function initMap() {
    // In a real application, you would use a mapping library like Google Maps or Leaflet
    // For this example, we'll just show a placeholder
    const mapContainer = document.getElementById('map');
    mapContainer.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #2a2a2a; color: white; border-radius: 8px;">
            <p>Map would be displayed here with food bank locations</p>
        </div>
    `;
}

// Display food banks in the list
function displayFoodBanks(foodBanks) {
    const foodbankList = document.getElementById('foodbankList');
    foodbankList.innerHTML = '';
    
    if (foodBanks.length === 0) {
        foodbankList.innerHTML = '<p>No food banks found matching your search.</p>';
        return;
    }
    
    foodBanks.forEach(foodbank => {
        const foodbankCard = document.createElement('div');
        foodbankCard.className = 'foodbank-card';
        foodbankCard.innerHTML = `
            <h3>${foodbank.name}</h3>
            <div class="foodbank-details">
                <p><i class="fas fa-map-marker-alt"></i> ${foodbank.address}</p>
                <p><i class="fas fa-phone"></i> ${foodbank.phone}</p>
                <p><i class="fas fa-envelope"></i> ${foodbank.email}</p>
                <p><i class="fas fa-globe"></i> ${foodbank.website}</p>
                <p><i class="fas fa-clock"></i> ${foodbank.hours}</p>
                <p><i class="fas fa-check-circle"></i> Accepts: ${foodbank.accepts.join(', ')}</p>
            </div>
            <button class="donate-btn" onclick="initiateDonation(${foodbank.id})">
                <i class="fas fa-hand-holding-heart"></i> Initiate Donation
            </button>
        `;
        foodbankList.appendChild(foodbankCard);
    });
}

// Function to initiate a donation (would be implemented in a real application)
function initiateDonation(foodbankId) {
    const foodbank = FOOD_BANKS.find(fb => fb.id === foodbankId);
    if (foodbank) {
        alert(`Donation initiated with ${foodbank.name}. In a real application, this would open a form to schedule a donation.`);
    }
} 