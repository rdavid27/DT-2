// Check authentication
function checkAuth() {
    if (localStorage.getItem('isFoodBankLoggedIn') !== 'true') {
        window.location.href = 'foodbank_login.html';
        return false;
    }
    return true;
}

// Mock data for testing
const mockFoodBankProfile = {
    id: 'FB001',
    name: 'Community Food Bank',
    address: '123 Main St, City, State 12345',
    phone: '555-0123',
    email: 'info@communityfoodbank.org',
    website: 'https://communityfoodbank.org',
    description: 'Serving the community since 1990, we provide food assistance to those in need.',
    operatingHours: {
        monday: { start: '09:00', end: '17:00' },
        tuesday: { start: '09:00', end: '17:00' },
        wednesday: { start: '09:00', end: '17:00' },
        thursday: { start: '09:00', end: '17:00' },
        friday: { start: '09:00', end: '17:00' },
        saturday: { start: '10:00', end: '14:00' },
        sunday: { start: '10:00', end: '14:00' }
    },
    preferences: {
        preferredItems: 'Non-perishable items, Fresh produce, Dairy products, Bread, Canned goods',
        pickupInstructions: 'Please call 30 minutes before arrival. Use the loading dock at the rear of the building.',
        notifications: {
            email: true,
            sms: false,
            dailyDigest: true
        }
    },
    stats: {
        totalPartners: 15,
        totalDonations: 245,
        activeDonations: 8
    }
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;

    // Get DOM elements
    const profileImage = document.getElementById('profileImage');
    const changeImageBtn = document.querySelector('.change-image-btn');
    const totalPartners = document.getElementById('totalPartners');
    const totalDonations = document.getElementById('totalDonations');
    const activeDonations = document.getElementById('activeDonations');
    const basicInfoForm = document.getElementById('basicInfoForm');
    const hoursForm = document.getElementById('hoursForm');
    const preferencesForm = document.getElementById('preferencesForm');
    const securityForm = document.getElementById('securityForm');
    const hoursDisplay = document.getElementById('hoursDisplay');
    const editHoursBtn = document.getElementById('editHoursBtn');
    const hoursModal = document.getElementById('hoursModal');
    const closeModal = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');

    // Load profile info from localStorage or set defaults
    const profile = JSON.parse(localStorage.getItem('foodBankProfile') || '{}');
    document.getElementById('fbName').value = profile.name || '';
    document.getElementById('fbAddress').value = profile.address || '';
    document.getElementById('fbEmail').value = profile.email || '';
    document.getElementById('fbPhone').value = profile.phone || '';
    document.getElementById('fbHours').value = profile.hours || '';
    document.getElementById('fbAccepts').value = profile.accepts || '';

    // Save changes
    document.getElementById('saveProfileBtn').onclick = () => {
        const updatedProfile = {
            name: document.getElementById('fbName').value,
            address: document.getElementById('fbAddress').value,
            email: document.getElementById('fbEmail').value,
            phone: document.getElementById('fbPhone').value,
            hours: document.getElementById('fbHours').value,
            accepts: document.getElementById('fbAccepts').value,
        };
        localStorage.setItem('foodBankProfile', JSON.stringify(updatedProfile));
        alert('Profile updated!');
    };

    // Load donation stats/history
    const requests = JSON.parse(localStorage.getItem('donationRequests') || '[]')
        .filter(r => r.foodbankId === (profile.id || 1));
    document.getElementById('totalDonations').textContent = requests.length;
    document.getElementById('totalItems').textContent = requests.reduce((sum, r) => sum + r.items.reduce((s, i) => s + i.quantity, 0), 0);

    // Show donation history
    const historyDiv = document.getElementById('donationHistory');
    historyDiv.innerHTML = requests.map(r => `
        <div class="history-card">
            <strong>${r.restaurantName}</strong> - ${new Date(r.pickupTime).toLocaleString()}<br>
            Items: ${r.items.map(i => `${i.name} (${i.quantity})`).join(', ')}<br>
            Status: <span class="status-badge ${r.status}">${r.status}</span>
        </div>
    `).join('');

    // Update profile stats
    function updateProfileStats() {
        totalPartners.textContent = mockFoodBankProfile.stats.totalPartners;
        totalDonations.textContent = mockFoodBankProfile.stats.totalDonations;
        activeDonations.textContent = mockFoodBankProfile.stats.activeDonations;
    }

    // Populate basic information form
    function populateBasicInfo() {
        document.getElementById('foodBankName').value = mockFoodBankProfile.name;
        document.getElementById('address').value = mockFoodBankProfile.address;
        document.getElementById('phone').value = mockFoodBankProfile.phone;
        document.getElementById('email').value = mockFoodBankProfile.email;
        document.getElementById('website').value = mockFoodBankProfile.website;
        document.getElementById('description').value = mockFoodBankProfile.description;
    }

    // Display operating hours
    function displayOperatingHours() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        // Group days with same hours
        const hoursGroups = {};
        days.forEach((day, index) => {
            const hours = mockFoodBankProfile.operatingHours[day];
            const key = `${hours.start}-${hours.end}`;
            if (!hoursGroups[key]) {
                hoursGroups[key] = [];
            }
            hoursGroups[key].push(dayNames[index]);
        });

        // Create HTML for hours display
        let html = '';
        for (const [hours, days] of Object.entries(hoursGroups)) {
            const [start, end] = hours.split('-');
            html += `
                <div class="hours-group">
                    <div class="days">${days.join(', ')}</div>
                    <div class="time">${formatTime(start)} - ${formatTime(end)}</div>
                </div>
            `;
        }

        hoursDisplay.innerHTML = html;
    }

    // Format time for display
    function formatTime(timeStr) {
        const [hours, minutes] = timeStr.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }

    // Populate operating hours form
    function populateOperatingHours() {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        days.forEach(day => {
            document.querySelector(`input[name="${day}Start"]`).value = mockFoodBankProfile.operatingHours[day].start;
            document.querySelector(`input[name="${day}End"]`).value = mockFoodBankProfile.operatingHours[day].end;
        });
    }

    // Populate preferences form
    function populatePreferences() {
        document.getElementById('preferredItems').value = mockFoodBankProfile.preferences.preferredItems;
        document.getElementById('pickupInstructions').value = mockFoodBankProfile.preferences.pickupInstructions;
        document.querySelector('input[name="emailNotifications"]').checked = mockFoodBankProfile.preferences.notifications.email;
        document.querySelector('input[name="smsNotifications"]').checked = mockFoodBankProfile.preferences.notifications.sms;
        document.querySelector('input[name="dailyDigest"]').checked = mockFoodBankProfile.preferences.notifications.dailyDigest;
    }

    // Handle basic information form submission
    function handleBasicInfoSubmit(e) {
        e.preventDefault();

        const formData = {
            name: document.getElementById('foodBankName').value,
            address: document.getElementById('address').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            website: document.getElementById('website').value,
            description: document.getElementById('description').value
        };

        // Update mock data
        Object.assign(mockFoodBankProfile, formData);

        // Show success message
        alert('Basic information updated successfully!');
    }

    // Handle operating hours form submission
    function handleHoursSubmit(e) {
        e.preventDefault();

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const newHours = {};

        days.forEach(day => {
            newHours[day] = {
                start: document.querySelector(`input[name="${day}Start"]`).value,
                end: document.querySelector(`input[name="${day}End"]`).value
            };
        });

        // Update mock data
        mockFoodBankProfile.operatingHours = newHours;

        // Update display
        displayOperatingHours();

        // Close modal
        hoursModal.style.display = 'none';

        // Show success message
        alert('Operating hours updated successfully!');
    }

    // Handle preferences form submission
    function handlePreferencesSubmit(e) {
        e.preventDefault();

        const formData = {
            preferredItems: document.getElementById('preferredItems').value,
            pickupInstructions: document.getElementById('pickupInstructions').value,
            notifications: {
                email: document.querySelector('input[name="emailNotifications"]').checked,
                sms: document.querySelector('input[name="smsNotifications"]').checked,
                dailyDigest: document.querySelector('input[name="dailyDigest"]').checked
            }
        };

        // Update mock data
        mockFoodBankProfile.preferences = formData;

        // Show success message
        alert('Preferences updated successfully!');
    }

    // Handle security form submission
    function handleSecuritySubmit(e) {
        e.preventDefault();

        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate passwords
        if (newPassword !== confirmPassword) {
            alert('New passwords do not match!');
            return;
        }

        // In a real application, this would make an API call to change the password
        console.log('Password change requested:', {
            currentPassword,
            newPassword
        });

        // Show success message
        alert('Password changed successfully!');
        securityForm.reset();
    }

    // Handle profile image change
    function handleImageChange() {
        // In a real application, this would open a file picker
        alert('Image upload functionality would be implemented here');
    }

    // Event listeners
    basicInfoForm.addEventListener('submit', handleBasicInfoSubmit);
    hoursForm.addEventListener('submit', handleHoursSubmit);
    preferencesForm.addEventListener('submit', handlePreferencesSubmit);
    securityForm.addEventListener('submit', handleSecuritySubmit);
    changeImageBtn.addEventListener('click', handleImageChange);

    // Operating hours modal event listeners
    editHoursBtn.addEventListener('click', () => {
        populateOperatingHours();
        hoursModal.style.display = 'block';
    });

    closeModal.addEventListener('click', () => {
        hoursModal.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        hoursModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === hoursModal) {
            hoursModal.style.display = 'none';
        }
    });

    // Initial population
    updateProfileStats();
    populateBasicInfo();
    displayOperatingHours();
    populatePreferences();
}); 