// Mock restaurant credentials
const mockRestaurants = [
  {
    username: "Restaurant Test",
    password: "test",
    name: "Restaurant Test",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const errorMessage = document.getElementById("errorMessage");

  // Auto-fill demo account
  usernameInput.value = "Restaurant Test";
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

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Validate inputs
    if (!username || !password) {
      showError("Please fill in all fields");
      return;
    }

    // Check credentials
    const restaurant = mockRestaurants.find(
      (r) => r.username === username && r.password === password
    );

    if (restaurant) {
      // Store login state
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("restaurantName", "Restaurant Test");

      // Add some startup data for the demo
      if (!localStorage.getItem("restaurantProfile")) {
        const defaultProfile = {
          name: "Restaurant Test",
          address: "456 Food Avenue, Metropolis",
          phone: "(555) 987-6543",
          email: "info@restauranttest.com",
          website: "www.restauranttest.com",
          openingHours: "Tue-Sun: 11am-10pm",
          cuisine: "International",
          description:
            "A modern restaurant specializing in sustainable food practices",
        };
        localStorage.setItem(
          "restaurantProfile",
          JSON.stringify(defaultProfile)
        );
      }

      // Initialize notification count
      if (!localStorage.getItem("notificationCount")) {
        localStorage.setItem("notificationCount", "0");
      }

      // Redirect to restaurant dashboard
      window.location.href = "foodbanks.html";
    } else {
      showError("Invalid username or password");
    }
  });

  // Clear error when user starts typing
  usernameInput.addEventListener("input", clearError);
  passwordInput.addEventListener("input", clearError);

  // Check if already logged in
  if (localStorage.getItem("isLoggedIn") === "true") {
    window.location.href = "foodbanks.html";
  }
});
