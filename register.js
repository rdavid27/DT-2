// DOM Elements
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const errorMessage = document.getElementById('errorMessage');

// Validate form inputs
function validateForm() {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (!username || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return false;
    }

    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
    }

    if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
    }

    if (!isValidEmail(email)) {
        showError('Please enter a valid email address');
        return false;
    }

    return true;
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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

// Handle registration
function handleRegister(e) {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
        return;
    }

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    try {
        // Get existing users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if username already exists
        if (users.some(user => user.username === username)) {
            showError('Username already exists');
            return;
        }

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            showError('Email already registered');
            return;
        }

        // Add new user
        users.push({
            username,
            email,
            password,
            role: 'user' // Default role for new registrations
        });

        // Save updated users array
        localStorage.setItem('users', JSON.stringify(users));

        // Show success message
        showError('Registration successful! Redirecting to login...');
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        showError('An error occurred during registration. Please try again.');
    }
}

// Event Listeners
registerForm.addEventListener('submit', handleRegister);

// Clear error message when user starts typing
usernameInput.addEventListener('input', clearError);
emailInput.addEventListener('input', clearError);
passwordInput.addEventListener('input', clearError);
confirmPasswordInput.addEventListener('input', clearError); 