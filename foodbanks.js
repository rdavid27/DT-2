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

// Add CSS for notifications
const notificationStyle = document.createElement("style");
notificationStyle.textContent = `
    .notification-icon {
        position: relative;
        margin: 0 10px;
    }
    #notificationBtn {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
    }
    .notification-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #e53e3e;
        color: white;
        border-radius: 50%;
        width: 18px;
        height: 18px;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .notification-center {
        display: none;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 350px;
        background: var(--card-bg, #23272f);
        box-shadow: -2px 0 10px rgba(0,0,0,0.2);
        z-index: 1002;
        transition: all 0.3s ease;
    }
    .notification-content {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .notification-header {
        padding: 1rem;
        border-bottom: 1px solid var(--border-color, #333);
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .notification-header h2 {
        margin: 0;
    }
    .notification-header button {
        background: none;
        border: none;
        color: var(--text-primary, #fff);
        font-size: 1.2rem;
        cursor: pointer;
    }
    .notification-list {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
    }
    .notification-item {
        background: var(--dark-bg, #181c22);
        margin-bottom: 1rem;
        padding: 1rem;
        border-radius: 8px;
        border-left: 4px solid;
    }
    .notification-item.accepted {
        border-left-color: #10b981;
    }
    .notification-item.rejected {
        border-left-color: #ef4444;
    }
    .notification-item.pending {
        border-left-color: #f59e0b;
    }
    .notification-item h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }
    .notification-item p {
        margin: 0.25rem 0;
    }
    .notification-item .time {
        font-size: 0.8rem;
        color: #aaa;
        text-align: right;
        margin-top: 0.5rem;
    }
    .empty-notification {
        color: #aaa;
        text-align: center;
        padding: 2rem;
    }
`;
document.head.appendChild(notificationStyle);

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

  // Set up notification center
  setupNotificationCenter();

  // Check for notifications
  showRestaurantNotifications();
  updateNotificationBadge();
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

// Set up notification center functionality
function setupNotificationCenter() {
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationCenter = document.getElementById("notificationCenter");
  const closeNotificationsBtn = document.getElementById("closeNotifications");

  // Show notification center when button is clicked
  notificationBtn.addEventListener("click", () => {
    notificationCenter.style.display = "block";
    displayNotificationHistory();
    // Clear badge count
    localStorage.setItem("unreadNotifications", "0");
    updateNotificationBadge();
  });

  // Close notification center
  closeNotificationsBtn.addEventListener("click", () => {
    notificationCenter.style.display = "none";
  });

  // Close when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === notificationCenter) {
      notificationCenter.style.display = "none";
    }
  });
}

// Display notification history
function displayNotificationHistory() {
  const notificationList = document.getElementById("notificationList");
  const notificationHistory = JSON.parse(
    localStorage.getItem("notificationHistory") || "[]"
  );

  if (notificationHistory.length === 0) {
    notificationList.innerHTML =
      '<div class="empty-notification">No notifications yet</div>';
    return;
  }

  notificationList.innerHTML = "";

  // Sort by time, newest first
  notificationHistory.sort((a, b) => new Date(b.time) - new Date(a.time));

  notificationHistory.forEach((notification) => {
    const item = document.createElement("div");
    item.className = `notification-item ${notification.status}`;

    item.innerHTML = `
            <h3>${notification.title}</h3>
            <p>${notification.message}</p>
            ${notification.details ? `<p>${notification.details}</p>` : ""}
            <div class="time">${formatTimeAgo(notification.time)}</div>
        `;

    notificationList.appendChild(item);
  });
}

// Format time ago
function formatTimeAgo(time) {
  const now = new Date();
  const past = new Date(time);
  const diffMs = now - past;
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (diffSec < 60) return `${diffSec} seconds ago`;
  if (diffMin < 60) return `${diffMin} minutes ago`;
  if (diffHour < 24) return `${diffHour} hours ago`;
  if (diffDay < 30) return `${diffDay} days ago`;

  return past.toLocaleDateString();
}

// Update notification badge
function updateNotificationBadge() {
  const badge = document.getElementById("notificationBadge");
  const count = parseInt(localStorage.getItem("unreadNotifications") || "0");

  badge.textContent = count;
  badge.style.display = count > 0 ? "flex" : "none";
}

// Show notifications to restaurant if present
function showRestaurantNotifications() {
  const notifications = JSON.parse(
    localStorage.getItem("restaurantNotifications") || "[]"
  );
  if (notifications.length > 0) {
    // Update unread count
    const currentUnread = parseInt(
      localStorage.getItem("unreadNotifications") || "0"
    );
    localStorage.setItem(
      "unreadNotifications",
      currentUnread + notifications.length
    );
    updateNotificationBadge();

    // Add to notification history
    const history = JSON.parse(
      localStorage.getItem("notificationHistory") || "[]"
    );

    notifications.forEach((note) => {
      // Add to history
      history.push({
        title: `Donation ${
          note.status === "accepted" ? "Accepted" : "Rejected"
        }`,
        message: `Your donation to ${note.foodbankName} has been ${note.status}.`,
        details:
          note.status === "accepted"
            ? `Pickup Time: ${new Date(note.pickupTime).toLocaleString()}`
            : "",
        status: note.status,
        time: new Date().toISOString(),
      });

      // Show popup notification
      const modal = document.createElement("div");
      modal.className = "donation-modal";
      modal.innerHTML = `
                <div class="donation-modal-content">
                    <h2>Donation ${
                      note.status === "accepted" ? "Accepted" : "Rejected"
                    }</h2>
                    <p>Your donation to ${note.foodbankName} has been <b>${
        note.status
      }</b>.</p>
                    ${
                      note.status === "accepted"
                        ? `<p>Pickup Time: ${new Date(
                            note.pickupTime
                          ).toLocaleString()}</p>`
                        : ""
                    }
                    <button class="confirm-btn" onclick="this.parentElement.parentElement.remove()">Close</button>
                </div>
            `;
      document.body.appendChild(modal);
    });

    // Save history and clear notifications
    localStorage.setItem("notificationHistory", JSON.stringify(history));
    localStorage.removeItem("restaurantNotifications");
  }
}

// Display food banks in the list
function displayFoodBanks(foodBanks) {
  const foodbankList = document.getElementById("foodbankList");
  foodbankList.innerHTML = "";
    
    if (foodBanks.length === 0) {
    foodbankList.innerHTML = "<p>No food banks found matching your search.</p>";
    return;
  }

  // Get donated food banks
  const donatedFoodBanks = getDonatedFoodBanks();

  foodBanks.forEach((foodbank) => {
    // Skip if this food bank is in active donations
    if (donatedFoodBanks.includes(foodbank.id)) {
        return;
    }
    
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

  // Add "Your Donations" section if there are active donations
  addActiveDonationsSection(donatedFoodBanks);
}

// Get list of food bank IDs that have pending/accepted donations
function getDonatedFoodBanks() {
  const donationRequests = JSON.parse(
    localStorage.getItem("donationRequests") || "[]"
  );
  const activeDonations = donationRequests.filter(
    (d) => d.status === "pending" || d.status === "accepted"
  );
  return activeDonations.map((d) => d.foodbankId);
}

// Add a section for active donations
function addActiveDonationsSection(donatedFoodBankIds) {
  if (donatedFoodBankIds.length === 0) return;

  const container = document.querySelector(".foodbanks-container");

  // Check if section already exists
  let activeDonationsSection = document.getElementById(
    "activeDonationsSection"
  );
  if (!activeDonationsSection) {
    // Create the section
    activeDonationsSection = document.createElement("div");
    activeDonationsSection.id = "activeDonationsSection";
    activeDonationsSection.className = "active-donations-section";
    activeDonationsSection.innerHTML = `
            <h2>Your Active Donations</h2>
            <div id="activeDonationsList" class="active-donations-list"></div>
        `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
            .active-donations-section {
                background: var(--card-bg, #23272f);
                border-radius: 8px;
                padding: 20px;
                margin-top: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .active-donations-section h2 {
                margin-top: 0;
                margin-bottom: 20px;
                color: var(--primary-color, #4f8cff);
            }
            .active-donations-list {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }
            .active-donation-card {
                background: var(--dark-bg, #181c22);
                border-radius: 8px;
                padding: 15px;
                border-left: 4px solid;
            }
            .active-donation-card.pending {
                border-left-color: #f59e0b;
            }
            .active-donation-card.accepted {
                border-left-color: #10b981;
            }
            .active-donation-card h3 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 0;
            }
            .active-donation-card .status {
                font-size: 0.8rem;
                padding: 0.2rem 0.6rem;
                border-radius: 12px;
            }
            .active-donation-card .status.pending {
                background: #fef3c7;
                color: #92400e;
            }
            .active-donation-card .status.accepted {
                background: #dcfce7;
                color: #166534;
            }
        `;
    document.head.appendChild(style);

    // Insert after map and food bank list
    container.appendChild(activeDonationsSection);
  }

  // Get active donations
  const donationRequests = JSON.parse(
    localStorage.getItem("donationRequests") || "[]"
  );
  const activeDonations = donationRequests.filter(
    (d) => d.status === "pending" || d.status === "accepted"
  );

  // Display active donations
  const activeDonationsList = document.getElementById("activeDonationsList");
  activeDonationsList.innerHTML = "";

  activeDonations.forEach((donation) => {
    const foodbank = FOOD_BANKS.find((fb) => fb.id === donation.foodbankId);
    if (!foodbank) return;

    const card = document.createElement("div");
    card.className = `active-donation-card ${donation.status}`;
    card.innerHTML = `
            <h3>
                ${foodbank.name}
                <span class="status ${donation.status}">${
      donation.status.charAt(0).toUpperCase() + donation.status.slice(1)
    }</span>
            </h3>
            <p><i class="fas fa-clock"></i> Pickup: ${new Date(
              donation.pickupTime
            ).toLocaleString()}</p>
            <p><i class="fas fa-box"></i> Items: ${donation.items
              .map((i) => `${i.name} (${i.quantity})`)
              .join(", ")}</p>
        `;
    activeDonationsList.appendChild(card);
  });
}

// Poll for notifications every 2 seconds for real-time updates
setInterval(() => {
  showRestaurantNotifications();
  updateNotificationBadge();
}, 2000);

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

      // Get special instructions
      const specialInstructions = modal.querySelector("textarea").value;

      // Get restaurant info (from localStorage or prompt for demo)
      const restaurantName = "Restaurant Test";

      // Prepare the donation request object
      const donationRequest = {
        id: Date.now(),
        foodbankId,
        foodbankName: "Food Bank Test",
        restaurantName,
        items,
        pickupTime,
        specialInstructions,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      const existingRequests = JSON.parse(
        localStorage.getItem("donationRequests") || "[]"
      );
      existingRequests.push(donationRequest);
      localStorage.setItem(
        "donationRequests",
        JSON.stringify(existingRequests)
      );

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
