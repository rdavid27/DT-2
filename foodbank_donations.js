// Check authentication
function checkAuth() {
  if (localStorage.getItem("isFoodBankLoggedIn") !== "true") {
    window.location.href = "foodbank_login.html";
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
    notes: "Please bring containers for the pasta",
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
    notes: "Vegetables are pre-cut",
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
    notes: "All items are vegetarian",
  },
  {
    id: 4,
    restaurant: "Burger Joint",
    items: "Buns, Patties, Vegetables",
    quantity: "30 portions",
    pickupTime: "2024-03-21 10:00",
    status: "Pending",
    contact: "Mike Johnson",
    phone: "555-0126",
    address: "321 Elm St, City",
    notes: "Patties are frozen",
  },
  {
    id: 5,
    restaurant: "Pizza Place",
    items: "Pizza, Breadsticks",
    quantity: "20 portions",
    pickupTime: "2024-03-21 11:30",
    status: "Pending",
    contact: "Tom Wilson",
    phone: "555-0127",
    address: "654 Maple Dr, City",
    notes: "Ready for pickup",
  },
];

// Store donation requests
let donationRequests = [];

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) return;

  // Get DOM elements
  const donationsList = document.getElementById("donationsList");
  const searchInput = document.getElementById("searchDonations");
  const statusFilter = document.getElementById("statusFilter");
  const dateFilter = document.getElementById("dateFilter");
  const exportBtn = document.querySelector(".export-btn");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageInfo = document.getElementById("pageInfo");
  const modal = document.getElementById("donationModal");
  const closeModal = document.querySelector(".close-modal");
  const donationDetails = document.getElementById("donationDetails");
  const confirmDonationBtn = document.getElementById("confirmDonation");
  const cancelDonationBtn = document.getElementById("cancelDonation");
  const completeDonationBtn = document.getElementById("completeDonation");

  // Pagination variables
  let currentPage = 1;
  const itemsPerPage = 10;
  let filteredDonations = [...mockDonations];

  // Populate donations table
  function populateDonations(donations) {
    donationsList.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedDonations = donations.slice(startIndex, endIndex);

    paginatedDonations.forEach((donation) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${donation.restaurant}</td>
                <td>${donation.items}</td>
                <td>${donation.quantity}</td>
                <td>${formatDateTime(donation.pickupTime)}</td>
                <td><span class="status-badge ${donation.status.toLowerCase()}">${
        donation.status
      }</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" data-id="${
                          donation.id
                        }">
                            <i class="fas fa-eye"></i>
                            View
                        </button>
                        <button class="action-btn confirm-btn" data-id="${
                          donation.id
                        }">
                            <i class="fas fa-check"></i>
                            Confirm
                        </button>
                    </div>
                </td>
            `;
      donationsList.appendChild(row);
    });

    // Add event listeners to buttons
    document.querySelectorAll(".view-btn").forEach((btn) => {
      btn.addEventListener("click", () => showDonationDetails(btn.dataset.id));
    });

    document.querySelectorAll(".confirm-btn").forEach((btn) => {
      btn.addEventListener("click", () =>
        updateDonationStatus(btn.dataset.id, "Confirmed")
      );
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

    filteredDonations = mockDonations.filter((donation) => {
      const matchesSearch =
        donation.restaurant.toLowerCase().includes(searchTerm) ||
        donation.items.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusValue === "all" || donation.status.toLowerCase() === statusValue;

      const matchesDate = filterByDate(donation.pickupTime, dateValue);

      return matchesSearch && matchesStatus && matchesDate;
    });

    currentPage = 1;
    populateDonations(filteredDonations);
  }

  // Filter by date
  function filterByDate(dateStr, filterValue) {
    if (filterValue === "all") return true;

    const date = new Date(dateStr);
    const now = new Date();

    switch (filterValue) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "week":
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return date >= weekAgo && date <= now;
      case "month":
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return date >= monthAgo && date <= now;
      default:
        return true;
    }
  }

  // Show donation details
  function showDonationDetails(donationId) {
    const donation = mockDonations.find((d) => d.id === parseInt(donationId));
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
                <p><strong>Pickup Time:</strong> ${formatDateTime(
                  donation.pickupTime
                )}</p>
                <p><strong>Status:</strong> <span class="status-badge ${donation.status.toLowerCase()}">${
      donation.status
    }</span></p>
                <p><strong>Notes:</strong> ${donation.notes}</p>
            </div>
        `;

    // Show/hide action buttons based on status
    confirmDonationBtn.style.display =
      donation.status === "Pending" ? "block" : "none";
    cancelDonationBtn.style.display = ["Pending", "Confirmed"].includes(
      donation.status
    )
      ? "block"
      : "none";
    completeDonationBtn.style.display =
      donation.status === "Confirmed" ? "block" : "none";

    // Set up action buttons
    confirmDonationBtn.onclick = () =>
      updateDonationStatus(donationId, "Confirmed");
    cancelDonationBtn.onclick = () =>
      updateDonationStatus(donationId, "Cancelled");
    completeDonationBtn.onclick = () =>
      updateDonationStatus(donationId, "Completed");

    modal.style.display = "block";
  }

  // Update donation status
  function updateDonationStatus(donationId, newStatus) {
    const donation = mockDonations.find((d) => d.id === parseInt(donationId));
    if (!donation) return;

    donation.status = newStatus;
    filterDonations();
    modal.style.display = "none";
  }

  // Export donations data
  function exportDonations() {
    const csvContent = [
      [
        "Restaurant",
        "Items",
        "Quantity",
        "Pickup Time",
        "Status",
        "Contact",
        "Phone",
        "Address",
        "Notes",
      ],
      ...filteredDonations.map((d) => [
        d.restaurant,
        d.items,
        d.quantity,
        d.pickupTime,
        d.status,
        d.contact,
        d.phone,
        d.address,
        d.notes,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `donations_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }

  // Format date and time
  function formatDateTime(dateTimeStr) {
    const date = new Date(dateTimeStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // Event listeners
  searchInput.addEventListener("input", filterDonations);
  statusFilter.addEventListener("change", filterDonations);
  dateFilter.addEventListener("change", filterDonations);
  exportBtn.addEventListener("click", exportDonations);

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      populateDonations(filteredDonations);
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      populateDonations(filteredDonations);
    }
  });

  // Modal event listeners
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // View button click handler
  donationsList.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-btn");
    if (viewBtn) {
      showDonationDetails(viewBtn.dataset.id);
    }
  });

  // Load and display donation requests
  loadDonationRequests();
});

// Load and display donation requests
function loadDonationRequests() {
  const requestsContainer = document.getElementById("donationRequests");
  if (!requestsContainer) return;

  // In a real application, this would fetch from an API
  // For now, we'll use sample data
  donationRequests = [
    {
      id: 1,
      restaurantName: "Sample Restaurant",
      items: [
        { name: "Bread", quantity: 20 },
        { name: "Vegetables", quantity: 15 },
      ],
      pickupTime: new Date(Date.now() + 3600000), // 1 hour from now
      status: "pending",
      specialInstructions: "Please bring containers for vegetables",
    },
  ];

  displayDonationRequests();
}

// Display donation requests
function displayDonationRequests() {
  const requestsContainer = document.getElementById("donationRequests");
  if (!requestsContainer) return;

  requestsContainer.innerHTML = "";

  donationRequests.forEach((request) => {
    const requestCard = document.createElement("div");
    requestCard.className = "donation-request-card";
    requestCard.innerHTML = `
            <div class="request-header">
                <h3>Donation from ${request.restaurantName}</h3>
                <span class="status-badge ${request.status}">${
      request.status
    }</span>
            </div>
            <div class="request-details">
                <p><i class="fas fa-clock"></i> Pickup Time: ${request.pickupTime.toLocaleString()}</p>
                <p><i class="fas fa-box"></i> Items:</p>
                <ul>
                    ${request.items
                      .map(
                        (item) => `
                        <li>${item.name} (${item.quantity})</li>
                    `
                      )
                      .join("")}
                </ul>
                ${
                  request.specialInstructions
                    ? `
                    <p><i class="fas fa-info-circle"></i> Special Instructions: ${request.specialInstructions}</p>
                `
                    : ""
                }
            </div>
            <div class="request-actions">
                ${
                  request.status === "pending"
                    ? `
                    <button class="accept-btn" onclick="handleDonationRequest(${request.id}, 'accepted')">
                        <i class="fas fa-check"></i> Accept
                    </button>
                    <button class="reject-btn" onclick="handleDonationRequest(${request.id}, 'rejected')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                `
                    : ""
                }
            </div>
        `;
    requestsContainer.appendChild(requestCard);
  });
}

// Handle donation request (accept/reject)
function handleDonationRequest(requestId, action) {
  const request = donationRequests.find((r) => r.id === requestId);
  if (!request) return;

  // Show loading animation
  const loadingOverlay = document.createElement("div");
  loadingOverlay.className = "loading-overlay";
  loadingOverlay.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <h3>Processing Request</h3>
            <p>Please wait...</p>
        </div>
    `;
  document.body.appendChild(loadingOverlay);

  // Simulate API call
  setTimeout(() => {
    loadingOverlay.remove();

    // Update request status
    request.status = action;

    // Show confirmation modal
    const confirmationModal = document.createElement("div");
    confirmationModal.className = "confirmation-modal";
    confirmationModal.innerHTML = `
            <div class="modal-content">
                <h2>Request ${
                  action === "accepted" ? "Accepted" : "Rejected"
                }</h2>
                <p>The donation request has been ${action}.</p>
                ${
                  action === "accepted"
                    ? `
                    <p>Estimated Pickup Time: ${request.pickupTime.toLocaleString()}</p>
                    <p>Please ensure you have the necessary resources to handle this donation.</p>
                `
                    : ""
                }
                <button class="close-btn" onclick="this.parentElement.parentElement.remove()">Close</button>
            </div>
        `;
    document.body.appendChild(confirmationModal);

    // Refresh the display
    displayDonationRequests();
  }, 1500);
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
