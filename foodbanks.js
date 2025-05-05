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
    accepts: [
      "Fresh Produce",
      "Canned Goods",
      "Bakery Items",
      "Dairy Products",
    ],
    latitude: 40.7128,
    longitude: -74.006,
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
    longitude: -73.9851,
  },
  {
    id: 3,
    name: "Second Harvest Food Bank",
    address: "789 Pine St, Everywhere, USA",
    phone: "(555) 456-7890",
    email: "donate@secondharvest.org",
    website: "www.secondharvest.org",
    hours: "Mon-Fri: 8am-6pm",
    accepts: [
      "Fresh Produce",
      "Canned Goods",
      "Bakery Items",
      "Prepared Foods",
    ],
    latitude: 40.7829,
    longitude: -73.9654,
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
    longitude: -73.984,
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
    longitude: -73.9857,
  },
];

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  if (!localStorage.getItem("isLoggedIn")) {
    window.location.href = "login.html";
    return;
  }

  // Initialize map
  initMap();

  // Display food banks
  displayFoodBanks(FOOD_BANKS);

  // Add search functionality
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredFoodBanks = FOOD_BANKS.filter(
      (foodbank) =>
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
  const mapContainer = document.getElementById("map");
  mapContainer.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; background-color: #2a2a2a; color: white; border-radius: 8px;">
            <p>Map would be displayed here with food bank locations</p>
        </div>
    `;
}

// Display food banks in the list
function displayFoodBanks(foodBanks) {
  const foodbankList = document.getElementById("foodbankList");
  foodbankList.innerHTML = "";

  if (foodBanks.length === 0) {
    foodbankList.innerHTML = "<p>No food banks found matching your search.</p>";
    return;
  }

  foodBanks.forEach((foodbank) => {
    const foodbankCard = document.createElement("div");
    foodbankCard.className = "foodbank-card";
    foodbankCard.innerHTML = `
            <h3>${foodbank.name}</h3>
            <div class="foodbank-details">
                <p><i class="fas fa-map-marker-alt"></i> ${foodbank.address}</p>
                <p><i class="fas fa-phone"></i> ${foodbank.phone}</p>
                <p><i class="fas fa-envelope"></i> ${foodbank.email}</p>
                <p><i class="fas fa-globe"></i> ${foodbank.website}</p>
                <p><i class="fas fa-clock"></i> ${foodbank.hours}</p>
                <p><i class="fas fa-check-circle"></i> Accepts: ${foodbank.accepts.join(
                  ", "
                )}</p>
            </div>
            <button class="donate-btn" onclick="initiateDonation(${
              foodbank.id
            })">
                <i class="fas fa-hand-holding-heart"></i> Initiate Donation
            </button>
        `;
    foodbankList.appendChild(foodbankCard);
  });
}

// Function to initiate a donation
function initiateDonation(foodbankId) {
  const foodbank = FOOD_BANKS.find((fb) => fb.id === foodbankId);
  if (foodbank) {
    // Create and show the donation modal
    const modal = document.createElement("div");
    modal.className = "donation-modal";
    modal.innerHTML = `
            <div class="donation-modal-content">
                <h2>Confirm Donation to ${foodbank.name}</h2>
                <div class="donation-form">
                    <div class="form-group">
                        <label>Items Available for Pickup:</label>
                        <div class="items-list">
                            <div class="item-input">
                                <input type="text" placeholder="Item name" class="item-name">
                                <input type="number" placeholder="Quantity" class="item-quantity" min="1">
                                <button class="add-item-btn"><i class="fas fa-plus"></i></button>
                            </div>
                        </div>
                        <button class="add-more-items-btn">Add More Items</button>
                    </div>
                    <div class="form-group">
                        <label>Pickup Time:</label>
                        <input type="datetime-local" id="pickupTime" required>
                    </div>
                    <div class="form-group">
                        <label>Special Instructions:</label>
                        <textarea placeholder="Any special handling instructions..."></textarea>
                    </div>
                    <div class="modal-buttons">
                        <button class="cancel-btn">Cancel</button>
                        <button class="confirm-btn">Confirm Donation</button>
                    </div>
                </div>
            </div>
        `;

    // Add modal styles
    const style = document.createElement("style");
    style.textContent = `
            .donation-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .donation-modal-content {
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 8px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
            }
            .donation-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .items-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            .item-input {
                display: flex;
                gap: 0.5rem;
            }
            .item-input input {
                padding: 0.5rem;
                border-radius: 4px;
                border: 1px solid var(--border-color);
                background: var(--dark-bg);
                color: var(--text-primary);
            }
            .add-item-btn, .add-more-items-btn {
                padding: 0.5rem;
                border-radius: 4px;
                border: none;
                background: var(--primary-color);
                color: white;
                cursor: pointer;
            }
            .modal-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                margin-top: 1rem;
            }
            .cancel-btn, .confirm-btn {
                padding: 0.5rem 1rem;
                border-radius: 4px;
                border: none;
                cursor: pointer;
            }
            .cancel-btn {
                background: var(--dark-bg);
                color: var(--text-primary);
            }
            .confirm-btn {
                background: var(--primary-color);
                color: white;
            }
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1001;
            }
            .loading-content {
                background: var(--card-bg);
                padding: 2rem;
                border-radius: 8px;
                text-align: center;
            }
            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 5px solid var(--border-color);
                border-top: 5px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Add event listeners for the modal
    const addMoreItemsBtn = modal.querySelector(".add-more-items-btn");
    const confirmBtn = modal.querySelector(".confirm-btn");
    const cancelBtn = modal.querySelector(".cancel-btn");

    addMoreItemsBtn.addEventListener("click", () => {
      const itemsList = modal.querySelector(".items-list");
      const newItemInput = document.createElement("div");
      newItemInput.className = "item-input";
      newItemInput.innerHTML = `
                <input type="text" placeholder="Item name" class="item-name">
                <input type="number" placeholder="Quantity" class="item-quantity" min="1">
                <button class="remove-item-btn"><i class="fas fa-minus"></i></button>
            `;
      itemsList.appendChild(newItemInput);

      // Add remove functionality
      newItemInput
        .querySelector(".remove-item-btn")
        .addEventListener("click", () => {
          newItemInput.remove();
        });
    });

    confirmBtn.addEventListener("click", () => {
      // Get all items
      const items = [];
      modal.querySelectorAll(".item-input").forEach((input) => {
        const name = input.querySelector(".item-name").value;
        const quantity = input.querySelector(".item-quantity").value;
        if (name && quantity) {
          items.push({ name, quantity: parseInt(quantity) });
        }
      });

      if (items.length === 0) {
        alert("Please add at least one item for donation");
        return;
      }

      const pickupTime = modal.querySelector("#pickupTime").value;
      if (!pickupTime) {
        alert("Please select a pickup time");
        return;
      }

      // Show loading animation
      const loadingOverlay = document.createElement("div");
      loadingOverlay.className = "loading-overlay";
      loadingOverlay.innerHTML = `
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <h3>Processing Donation Request</h3>
                    <p>Please wait while we notify the food bank...</p>
                </div>
            `;
      document.body.appendChild(loadingOverlay);

      // Simulate API call to food bank
      setTimeout(() => {
        loadingOverlay.remove();
        modal.remove();

        // Show success message with ETA
        const eta = new Date(pickupTime);
        const successModal = document.createElement("div");
        successModal.className = "donation-modal";
        successModal.innerHTML = `
                    <div class="donation-modal-content">
                        <h2>Donation Request Sent!</h2>
                        <p>Your donation request has been sent to ${
                          foodbank.name
                        }.</p>
                        <p>Estimated Pickup Time: ${eta.toLocaleString()}</p>
                        <p>Items to be picked up:</p>
                        <ul>
                            ${items
                              .map(
                                (item) =>
                                  `<li>${item.name} (${item.quantity})</li>`
                              )
                              .join("")}
                        </ul>
                        <div class="modal-buttons">
                            <button class="confirm-btn" onclick="this.parentElement.parentElement.parentElement.remove()">Close</button>
                        </div>
                    </div>
                `;
        document.body.appendChild(successModal);
      }, 2000);
    });

    cancelBtn.addEventListener("click", () => {
      modal.remove();
    });
  }
}
