// Mock food bank credentials
const mockFoodBanks = [
  {
    id: "FB001",
    password: "test",
    name: "Food Bank Test",
  },
  {
    id: "FB002",
    password: "foodbank456",
    name: "City Food Bank",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const foodbankIdInput = document.getElementById("foodbankId");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");
  const loginButton = document.getElementById("loginButton");
  const logoutBtn = document.getElementById("logoutBtn");

  // Auto-fill demo account
  foodbankIdInput.value = "FB001";
  passwordInput.value = "test";

  // Show error message
  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  // Clear error message
  function clearError() {
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }

  // Handle login form submission
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();

    const foodbankId = foodbankIdInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate inputs
    if (!foodbankId || !password) {
      showError("Please fill in all fields");
      return;
    }

    // Check credentials
    const foodBank = mockFoodBanks.find((fb) => {
      return fb.id === foodbankId && fb.password === password;
    });

    if (foodBank) {
      // Store login state
      localStorage.setItem("isFoodBankLoggedIn", "true");
      localStorage.setItem("foodBankId", foodbankId);
      localStorage.setItem("foodBankName", "Food Bank Test");

      // Add some startup data for the demo
      if (!localStorage.getItem("foodBankProfile")) {
        const defaultProfile = {
          id: foodbankId,
          name: "Food Bank Test",
          address: "123 Main Street, Cityville",
          phone: "(555) 123-4567",
          email: "contact@foodbanktest.org",
          website: "www.foodbanktest.org",
          openingHours: "Mon-Fri: 9am-5pm, Sat: 10am-2pm",
          description: "Serving the community since 2010",
        };
        localStorage.setItem("foodBankProfile", JSON.stringify(defaultProfile));
      }

      // Redirect to food bank dashboard
      window.location.href = "foodbank_dashboard.html";
    } else {
      showError("Invalid Food Bank ID or password");
    }
  });

  // Clear error when user starts typing
  foodbankIdInput.addEventListener("input", clearError);
  passwordInput.addEventListener("input", clearError);

  // Check if already logged in
  if (localStorage.getItem("isFoodBankLoggedIn") === "true") {
    window.location.href = "foodbank_dashboard.html";
  }

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("isFoodBankLoggedIn");
      localStorage.removeItem("foodBankId");
      localStorage.removeItem("foodBankName");
      window.location.href = "foodbank_login.html";
    });
  }
});
