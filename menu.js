// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Menu page loaded, initializing...');
    
    try {
        // Initialize menu data
        initializeMenuData();
        console.log('Menu data initialized');
        
        // Initialize event listeners
        initializeEventListeners();
        console.log('Event listeners initialized');
    } catch (error) {
        console.error('Error initializing menu page:', error);
    }
});

// Initialize menu data
function initializeMenuData() {
    try {
        const menuContainer = document.getElementById('menuContainer');
        if (!menuContainer) {
            console.error('Menu container not found');
            return;
        }

        const menuItems = DataStore.getMenuItems();
        const ingredients = DataStore.getIngredients();
        
        // Group menu items by category
        const categories = {};
        menuItems.forEach(item => {
            if (!categories[item.category]) {
                categories[item.category] = [];
            }
            categories[item.category].push(item);
        });

        // Generate menu HTML
        menuContainer.innerHTML = Object.entries(categories)
            .map(([category, items]) => `
                <div class="menu-category">
                    <h2>${category}</h2>
                    <div class="menu-items">
                        ${items.map(item => `
                            <div class="menu-item" data-id="${item.id}">
                                <div class="menu-item-header">
                                    <h3>${item.name}</h3>
                                    <span class="price">${formatCurrency(item.price)}</span>
                                </div>
                                <div class="menu-item-ingredients">
                                    ${item.ingredients.map(ingredientId => {
                                        const ingredient = ingredients.find(i => i.id === ingredientId);
                                        return ingredient ? ingredient.name : '';
                                    }).filter(Boolean).join(', ')}
                                </div>
                                <div class="menu-item-actions">
                                    <button class="edit-btn" onclick="editMenuItem(${item.id})">Edit</button>
                                    <button class="delete-btn" onclick="deleteMenuItem(${item.id})">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('') || '<p class="no-items">No menu items available</p>';
    } catch (error) {
        console.error('Error initializing menu data:', error);
        menuContainer.innerHTML = '<p class="error">Error loading menu items</p>';
    }
}

// Initialize event listeners
function initializeEventListeners() {
    const addItemBtn = document.getElementById('addMenuItemBtn');
    const itemModal = document.getElementById('itemModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
    const itemForm = document.getElementById('itemForm');
    const ingredientsSelect = document.getElementById('ingredients');

    if (!addItemBtn || !itemModal || !closeModalBtn || !cancelBtn || !itemForm || !ingredientsSelect) {
        console.error('Required elements not found');
        return;
    }

    // Populate ingredients dropdown
    const ingredients = DataStore.getIngredients();
    ingredientsSelect.innerHTML = ingredients.map(ingredient => `
        <option value="${ingredient.id}">${ingredient.name}</option>
    `).join('');

    // Enable multiple selection
    ingredientsSelect.setAttribute('multiple', 'true');

    // Modal controls
    addItemBtn.addEventListener('click', () => {
        itemForm.reset();
        itemModal.style.display = 'flex';
        itemModal.classList.add('show');
    });

    const hideModal = () => {
        itemModal.classList.remove('show');
        itemModal.style.display = 'none';
        itemForm.reset();
    };

    closeModalBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === itemModal) {
            hideModal();
        }
    });

    // Handle form submission
    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(itemForm);
            const name = formData.get('name');
            const price = parseFloat(formData.get('price'));
            const category = formData.get('category');
            const selectedIngredients = Array.from(ingredientsSelect.selectedOptions).map(option => parseInt(option.value));
            
            if (!name || isNaN(price) || !category || selectedIngredients.length === 0) {
                alert('Please fill in all fields and select at least one ingredient');
                return;
            }

            // Add new menu item
            const newItem = {
                name,
                price,
                category,
                ingredients: selectedIngredients
            };

            DataStore.addMenuItem(newItem);
            console.log('Added new menu item:', newItem);
            
            // Update UI
            initializeMenuData();
            
            // Close modal and reset form
            hideModal();
        } catch (error) {
            console.error('Error adding menu item:', error);
            alert('Error adding menu item. Please try again.');
        }
    });
}

// Edit menu item
function editMenuItem(itemId) {
    const itemModal = document.getElementById('itemModal');
    const itemForm = document.getElementById('itemForm');
    const ingredientsSelect = document.getElementById('ingredients');
    
    if (!itemModal || !itemForm || !ingredientsSelect) {
        console.error('Required elements not found');
        return;
    }

    // Get menu item data
    const menuItem = DataStore.getMenuItems().find(item => item.id === itemId);
    if (!menuItem) {
        console.error('Menu item not found:', itemId);
        return;
    }
    
    // Populate form
    itemForm.elements.name.value = menuItem.name;
    itemForm.elements.price.value = menuItem.price;
    itemForm.elements.category.value = menuItem.category;
    
    // Select ingredients
    Array.from(ingredientsSelect.options).forEach(option => {
        option.selected = menuItem.ingredients.includes(parseInt(option.value));
    });
    
    // Show modal
    itemModal.style.display = 'flex';
    itemModal.classList.add('show');
    
    // Update form submission handler
    const originalSubmitHandler = itemForm.onsubmit;
    itemForm.onsubmit = (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(itemForm);
            const updatedItem = {
                id: itemId,
                name: formData.get('name'),
                price: parseFloat(formData.get('price')),
                category: formData.get('category'),
                ingredients: Array.from(ingredientsSelect.selectedOptions).map(option => parseInt(option.value))
            };

            if (!updatedItem.name || isNaN(updatedItem.price) || !updatedItem.category || updatedItem.ingredients.length === 0) {
                alert('Please fill in all fields and select at least one ingredient');
                return;
            }
            
            // Update menu item
            DataStore.updateMenuItem(updatedItem);
            console.log('Updated menu item:', updatedItem);
    
    // Update UI
            initializeMenuData();
            
            // Close modal and reset form
            itemModal.classList.remove('show');
            itemModal.style.display = 'none';
            itemForm.reset();
            
            // Restore original submit handler
            itemForm.onsubmit = originalSubmitHandler;
        } catch (error) {
            console.error('Error updating menu item:', error);
            alert('Error updating menu item. Please try again.');
        }
    };
}

// Delete menu item
function deleteMenuItem(itemId) {
    if (confirm('Are you sure you want to delete this menu item?')) {
        try {
            DataStore.deleteMenuItem(itemId);
            console.log('Deleted menu item:', itemId);
            initializeMenuData();
        } catch (error) {
            console.error('Error deleting menu item:', error);
            alert('Error deleting menu item. Please try again.');
        }
    }
}

// Utility function to format currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(value);
} 