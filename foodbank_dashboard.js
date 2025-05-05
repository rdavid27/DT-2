// Check authentication
function checkAuth() {
  if (localStorage.getItem("isFoodBankLoggedIn") !== "true") {
    window.location.href = "foodbank_login.html";
    return false;
  }
  return true;
}

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  if (!checkAuth()) return;

  // Set food bank name
  const foodBankName = localStorage.getItem("foodBankName");
  document.getElementById("foodBankName").textContent = foodBankName;

  // Setup logout button
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("isFoodBankLoggedIn");
    localStorage.removeItem("foodBankId");
    localStorage.removeItem("foodBankName");
    window.location.href = "foodbank_login.html";
  });

  // Load donation data from localStorage
  const donationRequests = JSON.parse(
    localStorage.getItem("donationRequests") || "[]"
  );

  // Update dashboard stats
  updateDashboardStats(donationRequests);

  // Populate recent donations table (only accepted or completed)
  populateRecentDonations(donationRequests);

  // Set up modals
  setupModals(donationRequests);
});

// Update dashboard statistics
function updateDashboardStats(donations) {
  const activeDonations = donations.filter(
    (d) => d.status === "pending"
  ).length;
  document.getElementById("activeDonations").textContent = activeDonations;

  // Calculate upcoming pickups (next 24 hours)
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const upcomingPickups = donations.filter((d) => {
    const pickupTime = new Date(d.pickupTime);
    return (
      d.status === "accepted" && pickupTime >= now && pickupTime <= next24Hours
    );
  }).length;
  document.getElementById("upcomingPickups").textContent = upcomingPickups;
}

// Populate recent donations table (only show accepted and completed)
function populateRecentDonations(donations) {
  const tbody = document.getElementById("recentDonationsList");
  if (!tbody) return;

  tbody.innerHTML = "";

  // Filter to only show accepted and completed donations
  const filteredDonations = donations.filter(
    (d) => d.status === "accepted" || d.status === "completed"
  );

  if (filteredDonations.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `
      <td colspan="6" style="text-align: center; padding: 2rem;">
        <i class="fas fa-info-circle" style="font-size: 1.5rem; margin-bottom: 0.5rem; display: block; color: var(--text-muted);"></i>
        <p style="color: var(--text-muted);">No accepted donations yet. Go to the Donations page to accept pending requests.</p>
      </td>
    `;
    tbody.appendChild(emptyRow);
    return;
  }

  filteredDonations.forEach((donation) => {
    const row = document.createElement("tr");

    // Extract data safely
    const restaurantName =
      donation.restaurantName || donation.restaurant || "Unknown Restaurant";

    // Handle different item formats
    let itemsText = "";
    if (Array.isArray(donation.items)) {
      itemsText = donation.items.map((item) => item.name).join(", ");
    } else if (typeof donation.items === "string") {
      itemsText = donation.items;
    }

    // Handle quantity
    let quantityText = "";
    if (donation.quantity) {
      quantityText = donation.quantity;
    } else if (Array.isArray(donation.items)) {
      quantityText =
        donation.items.reduce(
          (acc, item) => acc + (parseInt(item.quantity) || 0),
          0
        ) + " items";
    }

    row.innerHTML = `
      <td>${restaurantName}</td>
      <td>${itemsText}</td>
      <td>${quantityText}</td>
      <td>${formatDateTime(donation.pickupTime)}</td>
      <td><span class="status-badge ${donation.status.toLowerCase()}">${getStatusIcon(
      donation.status
    )} ${capitalizeFirstLetter(donation.status)}</span></td>
      <td>
        <button class="action-btn details-btn" data-id="${donation.id}">
          <i class="fas fa-info-circle"></i> Details
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Add event listeners to buttons
  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", () => showDonationDetails(btn.dataset.id));
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

// Set up modals
function setupModals(donations) {
  const detailsModal = document.getElementById("detailsModal");
  const closeDetails = document.getElementById("closeDetails");

  // Close modals when clicking close buttons
  if (closeDetails) {
    closeDetails.onclick = () => {
      detailsModal.style.display = "none";
    };
  }

  // Close modals when clicking outside
  window.onclick = (event) => {
    if (event.target === detailsModal) {
      detailsModal.style.display = "none";
    }
  };
}

// Show donation details
function showDonationDetails(donationId) {
  // Get donations from localStorage
  const donations = JSON.parse(
    localStorage.getItem("donationRequests") || "[]"
  );

  // Find the donation
  const donation = donations.find((d) => d.id == donationId);
  if (!donation) return;

  // Fill in details modal
  document.getElementById("detailRestaurant").textContent =
    donation.restaurantName || donation.restaurant || "Unknown";
  document.getElementById("detailContact").textContent =
    donation.contact || "Not provided";
  document.getElementById("detailPhone").textContent =
    donation.phone || "Not provided";
  document.getElementById("detailAddress").textContent =
    donation.address || "Not provided";

  // Handle different item formats
  let itemsText = "";
  if (Array.isArray(donation.items)) {
    itemsText = donation.items
      .map((item) => `${item.name} (${item.quantity})`)
      .join(", ");
  } else if (typeof donation.items === "string") {
    itemsText = donation.items;
  }
  document.getElementById("detailItems").textContent = itemsText;

  // Handle quantity
  let quantityText = "";
  if (donation.quantity) {
    quantityText = donation.quantity;
  } else if (Array.isArray(donation.items)) {
    quantityText =
      donation.items.reduce(
        (acc, item) => acc + (parseInt(item.quantity) || 0),
        0
      ) + " items";
  }
  document.getElementById("detailQuantity").textContent = quantityText;

  document.getElementById("detailPickupTime").textContent = formatDateTime(
    donation.pickupTime
  );

  const statusElement = document.getElementById("detailStatus");
  statusElement.textContent = capitalizeFirstLetter(donation.status);
  statusElement.className = ""; // Clear previous classes
  statusElement.classList.add(donation.status.toLowerCase());

  document.getElementById("detailNotes").textContent =
    donation.specialInstructions || donation.notes || "No additional notes";

  // Show the modal
  const modal = document.getElementById("detailsModal");
  modal.style.display = "block";
}
