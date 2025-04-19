// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Ingredients page loaded, initializing...');
    
    try {
        // Initialize ingredients data
        initializeIngredientsData();
        console.log('Ingredients data initialized');
        
        // Initialize event listeners
        initializeEventListeners();
        console.log('Event listeners initialized');
    } catch (error) {
        console.error('Error initializing ingredients page:', error);
    }
});

// Initialize ingredients data
function initializeIngredientsData() {
    try {
        const ingredientsTableBody = document.getElementById('ingredientsTableBody');
        if (!ingredientsTableBody) {
            console.error('Ingredients table body not found');
            return;
        }

        const ingredients = DataStore.getIngredients();
        
        // Generate table rows
        ingredientsTableBody.innerHTML = ingredients.map(ingredient => `
            <tr data-id="${ingredient.id}">
                <td>${ingredient.name}</td>
                <td>${ingredient.quantity}</td>
                <td>${formatCurrency(ingredient.unitPrice)}</td>
                <td class="actions">
                    <button class="edit-btn" onclick="editIngredient(${ingredient.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteIngredient(${ingredient.id})">Delete</button>
                </td>
            </tr>
        `).join('') || '<tr><td colspan="4" class="no-items">No ingredients available</td></tr>';
    } catch (error) {
        console.error('Error initializing ingredients data:', error);
        ingredientsTableBody.innerHTML = '<tr><td colspan="4" class="error">Error loading ingredients</td></tr>';
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Initialize event listeners
function initializeEventListeners() {
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const ingredientModal = document.getElementById('ingredientModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const ingredientForm = document.getElementById('ingredientForm');

    // Modal controls
    addIngredientBtn.addEventListener('click', () => {
        ingredientForm.reset();
        ingredientModal.style.display = 'flex';
        ingredientModal.classList.add('show');
    });

    const hideModal = () => {
        ingredientModal.classList.remove('show');
        ingredientModal.style.display = 'none';
        ingredientForm.reset();
    };

    closeModalBtn.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === ingredientModal) {
            hideModal();
        }
    });

    // Handle form submission
    ingredientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(ingredientForm);
            const name = formData.get('name');
            const quantity = parseFloat(formData.get('quantity'));
            const unitPrice = parseFloat(formData.get('unitPrice'));
            
            if (!name || isNaN(quantity) || isNaN(unitPrice)) {
                alert('Please fill in all fields');
                return;
            }

            // Add new ingredient
            const newIngredient = {
                name,
                quantity,
                unitPrice,
                inStock: quantity > 0
            };

            DataStore.addIngredient(newIngredient);
            console.log('Added new ingredient:', newIngredient);
            
            // Update UI
            initializeIngredientsData();
            
            // Close modal and reset form
            hideModal();
        } catch (error) {
            console.error('Error adding ingredient:', error);
            alert('Error adding ingredient. Please try again.');
        }
    });
}

// Edit ingredient
function editIngredient(ingredientId) {
    const ingredientModal = document.getElementById('ingredientModal');
    const ingredientForm = document.getElementById('ingredientForm');
    
    // Get ingredient data
    const ingredient = DataStore.getIngredients().find(item => item.id === ingredientId);
    if (!ingredient) {
        console.error('Ingredient not found:', ingredientId);
        return;
    }
    
    // Populate form
    ingredientForm.elements.name.value = ingredient.name;
    ingredientForm.elements.quantity.value = ingredient.quantity;
    ingredientForm.elements.unitPrice.value = ingredient.unitPrice;
    
    // Show modal
    ingredientModal.style.display = 'flex';
    ingredientModal.classList.add('show');
    
    // Update form submission handler
    const originalSubmitHandler = ingredientForm.onsubmit;
    ingredientForm.onsubmit = (e) => {
        e.preventDefault();
        
        try {
            const formData = new FormData(ingredientForm);
            const updatedIngredient = {
                id: ingredientId,
                name: formData.get('name'),
                quantity: parseFloat(formData.get('quantity')),
                unitPrice: parseFloat(formData.get('unitPrice')),
                inStock: parseFloat(formData.get('quantity')) > 0
            };
            
            if (!updatedIngredient.name || isNaN(updatedIngredient.quantity) || isNaN(updatedIngredient.unitPrice)) {
                alert('Please fill in all fields');
                return;
            }
            
            // Update ingredient
            DataStore.updateIngredient(updatedIngredient);
            console.log('Updated ingredient:', updatedIngredient);
            
            // Update UI
            initializeIngredientsData();
            
            // Close modal and reset form
            hideModal();
            
            // Restore original submit handler
            ingredientForm.onsubmit = originalSubmitHandler;
        } catch (error) {
            console.error('Error updating ingredient:', error);
            alert('Error updating ingredient. Please try again.');
        }
    };
}

// Delete ingredient
function deleteIngredient(ingredientId) {
    if (confirm('Are you sure you want to delete this ingredient?')) {
        DataStore.deleteIngredient(ingredientId);
        initializeIngredientsData();
    }
} 