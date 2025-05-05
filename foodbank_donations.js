// Check authentication
function checkAuth() {
  if (localStorage.getItem("isFoodBankLoggedIn") !== "true") {
    window.location.href = "foodbank_login.html";
    return false;
  }
  return true;
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) return;

  // Set up logout button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("isFoodBankLoggedIn");
    localStorage.removeItem("foodBankId");
    localStorage.removeItem("foodBankName");
    window.location.href = "foodbank_login.html";
  });

  const requestsContainer = document.getElementById("donationRequests");
  const searchInput = document.getElementById("searchInput");
  const statusBtns = document.querySelectorAll(".filter-btn");

  // Load from localStorage
  loadDonationRequests();

  // Handle status filter
  statusBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      statusBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      displayDonationRequests();
    });
  });

  // Handle search
  searchInput.addEventListener("input", () => {
    displayDonationRequests();
  });

  // Expose handler globally for inline onclick
  window.handleDonationRequest = function (requestId, action) {
    const requests = JSON.parse(
      localStorage.getItem("donationRequests") || "[]"
    );
    const requestIndex = requests.findIndex((r) => r.id === requestId);

    if (requestIndex === -1) return;

    // Show loading animation
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className = "loading-overlay";
    loadingOverlay.style.display = "flex";
    loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <h2>Processing Request</h2>
        <p>Please wait while we update the donation status...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);

    setTimeout(() => {
      loadingOverlay.remove();

      // Update the request status
      requests[requestIndex].status = action;
      localStorage.setItem("donationRequests", JSON.stringify(requests));

      // Show confirmation modal
      const confirmationModal = document.createElement("div");
      confirmationModal.className = "confirmation-modal";
      confirmationModal.style.display = "flex";

      // Different message based on action
      let actionMessage = "";
      let iconClass = "";

      switch (action) {
        case "accepted":
          actionMessage =
            "The restaurant has been notified of your confirmation.";
          iconClass = "fas fa-check-circle";
          break;
        case "rejected":
          actionMessage = "The donation request has been rejected.";
          iconClass = "fas fa-times-circle";
          break;
        case "completed":
          actionMessage = "The donation has been marked as completed.";
          iconClass = "fas fa-check-double";
          break;
      }

      confirmationModal.innerHTML = `
        <div class="modal-content">
          <h2><i class="${iconClass}" style="color: ${
        action === "rejected" ? "#f87171" : "#34d399"
      }"></i> Request ${capitalizeFirstLetter(action)}</h2>
          <p>${actionMessage}</p>
          ${
            action === "accepted"
              ? `<p>Estimated Pickup Time: ${formatDateTime(
                  requests[requestIndex].pickupTime
                )}</p>`
              : ""
          }
          <button class="close-btn" id="closeConfirmation">
            <i class="fas fa-check"></i> Close
          </button>
        </div>
      `;

      document.body.appendChild(confirmationModal);

      // Handle close button
      document
        .getElementById("closeConfirmation")
        .addEventListener("click", () => {
          confirmationModal.remove();
          displayDonationRequests();
        });
    }, 1000);
  };

  // Poll for real-time updates every 5 seconds
  setInterval(loadDonationRequests, 5000);
});

// Load donation requests from localStorage
function loadDonationRequests() {
  // Retrieve from localStorage or initialize empty array
  let donationRequests = JSON.parse(
    localStorage.getItem("donationRequests") || "[]"
  );

  // If no requests exist, add some sample data
  if (donationRequests.length === 0) {
    // Get the mock data from foodbank_dashboard.js
    const mockDonations = [
      {
        id: 1,
        restaurant: "Italian Restaurant",
        items: [
          { name: "Pasta", quantity: 10 },
          { name: "Bread", quantity: 15 },
          { name: "Salad", quantity: 15 },
        ],
        pickupTime: "2024-03-20 14:00",
        status: "pending",
        restaurantName: "Italian Restaurant",
        contact: "Mario Rossi",
        phone: "(555) 123-4567",
        address: "123 Pasta Lane, Cityville",
        specialInstructions: "Please use the back entrance for pickup",
      },
      {
        id: 2,
        restaurant: "Asian Fusion",
        items: [
          { name: "Rice", quantity: 20 },
          { name: "Vegetables", quantity: 15 },
          { name: "Spring Rolls", quantity: 30 },
        ],
        pickupTime: "2024-03-20 15:30",
        status: "accepted",
        restaurantName: "Asian Fusion",
        contact: "Lucy Chen",
        phone: "(555) 987-6543",
        address: "456 Fusion Avenue, Townsville",
        specialInstructions: "Food packaged in individual containers",
      },
      // More sample data from the dashboard
      {
        id: 3,
        restaurant: "Mexican Grill",
        items: [
          { name: "Beans", quantity: 25 },
          { name: "Rice", quantity: 25 },
          { name: "Tortillas", quantity: 50 },
          { name: "Salsa", quantity: 15 },
        ],
        pickupTime: "2024-03-20 16:00",
        status: "pending",
        restaurantName: "Mexican Grill",
        contact: "Carlos Martinez",
        phone: "(555) 789-0123",
        address: "789 Taco Street, Metropolis",
        specialInstructions: "Includes vegetarian options",
      },
      {
        id: 4,
        restaurant: "Fresh Bakery",
        items: [
          { name: "Bread", quantity: 20 },
          { name: "Pastries", quantity: 15 },
          { name: "Cakes", quantity: 5 },
        ],
        pickupTime: "2024-03-21 09:00",
        status: "pending",
        restaurantName: "Fresh Bakery",
        contact: "Emma Thompson",
        phone: "(555) 321-7890",
        address: "321 Bakery Road, Villageton",
        specialInstructions:
          "Baked fresh this morning, best consumed within 2 days",
      },
      {
        id: 5,
        restaurant: "Seafood Harbor",
        items: [
          { name: "Fish", quantity: 18 },
          { name: "Rice", quantity: 18 },
          { name: "Mixed Vegetables", quantity: 18 },
        ],
        pickupTime: "2024-03-21 11:30",
        status: "accepted",
        restaurantName: "Seafood Harbor",
        contact: "Robert Fisher",
        phone: "(555) 654-3210",
        address: "567 Harbor Drive, Coastville",
        specialInstructions: "Seafood dishes, please refrigerate immediately",
      },
      {
        id: 6,
        restaurant: "Vegan Delight",
        items: [
          { name: "Salads", quantity: 10 },
          { name: "Tofu", quantity: 12 },
          { name: "Quinoa Bowls", quantity: 8 },
        ],
        pickupTime: "2024-03-21 13:00",
        status: "completed",
        restaurantName: "Vegan Delight",
        contact: "Olivia Green",
        phone: "(555) 234-5678",
        address: "890 Plant Street, Greenfield",
        specialInstructions: "All plant-based, allergen information included",
      },
      {
        id: 7,
        restaurant: "BBQ Smokehouse",
        items: [
          { name: "Smoked Meats", quantity: 20 },
          { name: "Cornbread", quantity: 30 },
          { name: "Beans", quantity: 25 },
        ],
        pickupTime: "2024-03-22 12:00",
        status: "pending",
        restaurantName: "BBQ Smokehouse",
        contact: "Thomas Grill",
        phone: "(555) 876-5432",
        address: "432 Smoke Road, Grillville",
        specialInstructions: "Heavy containers, please bring sturdy transport",
      },
      {
        id: 8,
        restaurant: "Restaurant Test",
        items: [
          { name: "Pizza", quantity: 10 },
          { name: "Salad", quantity: 15 },
          { name: "Garlic Bread", quantity: 20 },
        ],
        pickupTime: "2024-03-22 15:45",
        status: "pending",
        restaurantName: "Restaurant Test",
        contact: "Restaurant Manager",
        phone: "(555) 555-5555",
        address: "456 Food Avenue, Metropolis",
        specialInstructions: "This is a test donation",
      },
      {
        id: 9,
        restaurant: "Indian Spice",
        items: [
          { name: "Curry", quantity: 15 },
          { name: "Rice", quantity: 15 },
          { name: "Naan Bread", quantity: 28 },
        ],
        pickupTime: "2024-03-23 17:00",
        status: "rejected",
        restaurantName: "Indian Spice",
        contact: "Raj Patel",
        phone: "(555) 432-1098",
        address: "765 Spice Lane, Flavortown",
        specialInstructions: "Some dishes are spicy, labeled accordingly",
      },
      {
        id: 10,
        restaurant: "Greek Taverna",
        items: [
          { name: "Gyros", quantity: 15 },
          { name: "Greek Salad", quantity: 15 },
          { name: "Pita", quantity: 32 },
        ],
        pickupTime: "2024-03-23 18:30",
        status: "accepted",
        restaurantName: "Greek Taverna",
        contact: "Nikos Papadopoulos",
        phone: "(555) 210-9876",
        address: "109 Mediterranean Blvd, Athens Place",
        specialInstructions:
          "Packed family-style, serves 4-6 people per container",
      },
    ];

    // Save mock data to localStorage
    localStorage.setItem("donationRequests", JSON.stringify(mockDonations));
    donationRequests = mockDonations;
  }

  displayDonationRequests(donationRequests);
}

// Display all requests as cards
function displayDonationRequests(donationRequests) {
  const requestsContainer = document.getElementById("donationRequests");
  if (!requestsContainer) return;

  const requests =
    donationRequests ||
    JSON.parse(localStorage.getItem("donationRequests") || "[]");

  // Filter by status
  const activeStatusBtn = document.querySelector(".filter-btn.active");
  const status = activeStatusBtn ? activeStatusBtn.dataset.status : "all";

  let filtered = requests;
  if (status !== "all") {
    filtered = filtered.filter((r) => r.status === status);
  }

  // Filter by search
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  if (searchTerm) {
    filtered = filtered.filter((r) => {
      // Search in restaurant name
      if (
        r.restaurantName &&
        r.restaurantName.toLowerCase().includes(searchTerm)
      ) {
        return true;
      }

      // Search in items
      if (r.items) {
        if (Array.isArray(r.items)) {
          return r.items.some(
            (item) => item.name && item.name.toLowerCase().includes(searchTerm)
          );
        } else if (typeof r.items === "string") {
          return r.items.toLowerCase().includes(searchTerm);
        }
      }

      // Search in contact name or address
      if (
        (r.contact && r.contact.toLowerCase().includes(searchTerm)) ||
        (r.address && r.address.toLowerCase().includes(searchTerm))
      ) {
        return true;
      }

      return false;
    });
  }

  // Clear container
  requestsContainer.innerHTML = "";

  // Show empty state if no results
  if (filtered.length === 0) {
    requestsContainer.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <p>No donation requests found.</p>
      </div>
    `;
    return;
  }

  // Create a card for each donation request
  filtered.forEach((request) => {
    // Prepare items display
    let itemsHtml = "";

    if (Array.isArray(request.items)) {
      itemsHtml = `
        <ul class="items-list">
          ${request.items
            .map(
              (item) => `
            <li>
              <span>${item.name}</span>
              <span class="item-quantity">${item.quantity}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      `;
    } else if (typeof request.items === "string") {
      const itemsArray = request.items.split(",").map((item) => item.trim());
      itemsHtml = `
        <ul class="items-list">
          ${itemsArray
            .map(
              (item) => `
            <li>
              <span>${item}</span>
            </li>
          `
            )
            .join("")}
        </ul>
      `;
    }

    // Get status with first letter capitalized
    const statusDisplay = capitalizeFirstLetter(request.status);

    // Create the card HTML
    const card = document.createElement("div");
    card.className = "donation-request-card";
    card.innerHTML = `
      <div class="card-header">
        <div class="restaurant-name">
          <i class="fas fa-utensils"></i>
          ${
            request.restaurantName || request.restaurant || "Unknown Restaurant"
          }
        </div>
        <span class="status-badge ${request.status}">
          ${getStatusIcon(request.status)} ${statusDisplay}
        </span>
      </div>
      
      <div class="card-body">
        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Pickup Time</div>
            <div class="info-value">${formatDateTime(request.pickupTime)}</div>
          </div>
        </div>
        
        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Donation Items</div>
            ${itemsHtml}
          </div>
        </div>
        
        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-user"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Contact</div>
            <div class="info-value">${request.contact || "Not provided"}</div>
          </div>
        </div>
        
        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Address</div>
            <div class="info-value">${request.address || "Not provided"}</div>
          </div>
        </div>
        
        ${
          request.specialInstructions
            ? `
        <div class="info-item">
          <div class="info-icon">
            <i class="fas fa-info-circle"></i>
          </div>
          <div class="info-content">
            <div class="info-label">Special Instructions</div>
            <div class="info-value">${request.specialInstructions}</div>
          </div>
        </div>
        `
            : ""
        }
      </div>
      
      <div class="card-footer">
        ${
          request.status === "pending"
            ? `
          <button class="action-btn accept-btn" onclick="handleDonationRequest(${request.id}, 'accepted')">
            <i class="fas fa-check"></i> Accept
          </button>
          <button class="action-btn reject-btn" onclick="handleDonationRequest(${request.id}, 'rejected')">
            <i class="fas fa-times"></i> Reject
          </button>
        `
            : ""
        }
        
        ${
          request.status === "accepted"
            ? `
          <button class="action-btn complete-btn" onclick="handleDonationRequest(${request.id}, 'completed')">
            <i class="fas fa-check-double"></i> Mark Completed
          </button>
        `
            : ""
        }
      </div>
    `;

    requestsContainer.appendChild(card);
  });
}

// Format date and time
function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return "Not specified";

  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr; // Return as is if invalid date

  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Get status icon
function getStatusIcon(status) {
  switch (status) {
    case "pending":
      return '<i class="fas fa-clock"></i>';
    case "accepted":
      return '<i class="fas fa-check-circle"></i>';
    case "rejected":
      return '<i class="fas fa-times-circle"></i>';
    case "completed":
      return '<i class="fas fa-check-double"></i>';
    default:
      return '<i class="fas fa-question-circle"></i>';
  }
}

// Capitalize first letter of a string
function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add styles
const style = document.createElement("style");
style.textContent = `
    .donation-request-card {
        background: var(--card-bg);
        border-radius: 8px;
        padding: 1.5rem;
        margin-bottom: 1rem;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .request-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .status-badge.pending {
        background: #fef3c7;
        color: #92400e;
    }

    .status-badge.accepted {
        background: #dcfce7;
        color: #166534;
    }

    .status-badge.rejected {
        background: #fee2e2;
        color: #991b1b;
    }

    .request-details {
        margin-bottom: 1rem;
    }

    .request-details p {
        margin-bottom: 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .request-details ul {
        list-style: none;
        padding-left: 1.5rem;
    }

    .request-details li {
        margin-bottom: 0.25rem;
    }

    .request-actions {
        display: flex;
        gap: 1rem;
    }

    .accept-btn, .reject-btn {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .accept-btn {
        background: var(--primary-color);
        color: white;
    }

    .reject-btn {
        background: #fee2e2;
        color: #991b1b;
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
        z-index: 1000;
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

    .confirmation-modal {
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

    .modal-content {
        background: var(--card-bg);
        padding: 2rem;
        border-radius: 8px;
        width: 90%;
        max-width: 500px;
        text-align: center;
    }

    .close-btn {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        background: var(--primary-color);
        color: white;
        cursor: pointer;
    }
`;
document.head.appendChild(style);
