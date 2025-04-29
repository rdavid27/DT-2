// Mock food bank credentials (in a real application, this would be handled server-side)
const mockFoodBanks = [
    {
        id: 'FB001',
        password: 'foodbank123',
        name: 'Community Food Bank'
    },
    {
        id: 'FB002',
        password: 'foodbank456',
        name: 'City Food Bank'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('foodbankLoginForm');
    const foodbankIdInput = document.getElementById('foodbankId');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Clear error message
    function clearError() {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
    }

    // Handle login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        clearError();

        const foodbankId = foodbankIdInput.value.trim();
        const password = passwordInput.value.trim();

        // Validate inputs
        if (!foodbankId || !password) {
            showError('Please fill in all fields');
            return;
        }

        // Check credentials
        const foodBank = mockFoodBanks.find(
            fb => fb.id === foodbankId && fb.password === password
        );

        if (foodBank) {
            // Store login state
            localStorage.setItem('isFoodBankLoggedIn', 'true');
            localStorage.setItem('foodBankId', foodbankId);
            localStorage.setItem('foodBankName', foodBank.name);
            
            // Redirect to food bank dashboard
            window.location.href = 'foodbank_dashboard.html';
        } else {
            showError('Invalid Food Bank ID or password');
        }
    });

    // Clear error when user starts typing
    foodbankIdInput.addEventListener('input', clearError);
    passwordInput.addEventListener('input', clearError);

    // Check if already logged in
    if (localStorage.getItem('isFoodBankLoggedIn') === 'true') {
        window.location.href = 'foodbank_dashboard.html';
    }
}); 