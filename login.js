// Mock user credentials (in a real application, this would be handled server-side)
const mockUsers = [
    {
        username: 'admin',
        password: 'admin123'
    },
    {
        username: 'manager',
        password: 'manager123'
    }
];

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('errorMessage');

// Check if user is already logged in
function checkAuthStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        window.location.href = 'index.html';
    }
}

// Validate form inputs
function validateForm() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (!username || !password) {
        showError('Please fill in all fields');
        return false;
    }

    return true;
}

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
function handleLogin(e) {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
        return;
    }

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check credentials against stored users
        const user = users.find(
            user => user.username === username && user.password === password
        );

        if (user) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);
            localStorage.setItem('userRole', user.role);
            
            // Redirect to home page
            window.location.href = 'index.html';
        } else {
            showError('Invalid username or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred during login. Please try again.');
    }
}

// Event Listeners
loginForm.addEventListener('submit', handleLogin);

// Clear error message when user starts typing
usernameInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);

// Check authentication status when page loads
checkAuthStatus(); 