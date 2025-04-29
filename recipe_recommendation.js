// Recipe database with common dishes and their ingredients
const RECIPES = [
    {
        id: 1,
        name: "Margherita Pizza",
        ingredients: ["Tomatoes", "Mozzarella", "Basil", "Pizza Dough", "Olive Oil"],
        instructions: "1. Preheat oven to 450°F\n2. Roll out pizza dough\n3. Spread tomato sauce\n4. Add mozzarella and basil\n5. Drizzle with olive oil\n6. Bake for 15-20 minutes",
        category: "Italian",
        prepTime: "30 mins",
        difficulty: "Medium"
    },
    {
        id: 2,
        name: "Pasta Alfredo",
        ingredients: ["Pasta", "Cream", "Parmesan", "Olive Oil"],
        instructions: "1. Cook pasta according to package\n2. Heat cream in a pan\n3. Add parmesan and stir until melted\n4. Toss with pasta\n5. Drizzle with olive oil",
        category: "Italian",
        prepTime: "20 mins",
        difficulty: "Easy"
    },
    {
        id: 3,
        name: "Chicken Stir Fry",
        ingredients: ["Chicken", "Mixed Vegetables", "Olive Oil"],
        instructions: "1. Cut chicken into cubes\n2. Heat oil in a wok\n3. Cook chicken until golden\n4. Add vegetables and stir fry\n5. Season to taste",
        category: "Asian",
        prepTime: "25 mins",
        difficulty: "Easy"
    },
    {
        id: 4,
        name: "Vegetable Soup",
        ingredients: ["Mixed Vegetables", "Olive Oil"],
        instructions: "1. Chop all vegetables\n2. Heat oil in a large pot\n3. Sauté vegetables\n4. Add water or broth\n5. Simmer for 20-30 minutes\n6. Season to taste",
        category: "Soups",
        prepTime: "40 mins",
        difficulty: "Easy"
    },
    {
        id: 5,
        name: "Tomato Basil Pasta",
        ingredients: ["Tomatoes", "Basil", "Pasta", "Olive Oil"],
        instructions: "1. Cook pasta according to package\n2. Sauté tomatoes in olive oil\n3. Add chopped basil\n4. Toss with pasta\n5. Season to taste",
        category: "Italian",
        prepTime: "25 mins",
        difficulty: "Easy"
    },
    {
        id: 6,
        name: "Creamy Mushroom Pasta",
        ingredients: ["Pasta", "Cream", "Olive Oil"],
        instructions: "1. Cook pasta according to package\n2. Sauté mushrooms in olive oil\n3. Add cream and simmer\n4. Toss with pasta\n5. Season to taste",
        category: "Italian",
        prepTime: "25 mins",
        difficulty: "Easy"
    },
    {
        id: 7,
        name: "Chicken Parmesan",
        ingredients: ["Chicken", "Tomatoes", "Mozzarella", "Olive Oil"],
        instructions: "1. Bread chicken cutlets\n2. Fry in olive oil\n3. Top with tomato sauce and mozzarella\n4. Bake until cheese melts",
        category: "Italian",
        prepTime: "35 mins",
        difficulty: "Medium"
    },
    {
        id: 8,
        name: "Vegetable Stir Fry",
        ingredients: ["Mixed Vegetables", "Olive Oil"],
        instructions: "1. Chop all vegetables\n2. Heat oil in a wok\n3. Stir fry vegetables\n4. Season to taste",
        category: "Asian",
        prepTime: "20 mins",
        difficulty: "Easy"
    },
    {
        id: 9,
        name: "Asian Chicken Rice Bowl",
        ingredients: ["Rice", "Lettuce", "Chicken", "Tomatoes", "Onions", "Ginger"],
        instructions: "1. Cook rice according to package instructions\n2. Cut chicken into bite-sized pieces\n3. Finely chop onions and ginger\n4. Heat oil in a pan and sauté onions and ginger until fragrant\n5. Add chicken and cook until golden brown\n6. Slice tomatoes and chop lettuce\n7. Assemble bowl: rice at the bottom, topped with chicken, fresh tomatoes, and lettuce\n8. Season with salt and pepper to taste",
        category: "Asian",
        prepTime: "30 mins",
        difficulty: "Easy"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Initialize DataStore
    DataStore.init();

    const ingredientsList = document.getElementById('ingredientsList');
    const selectedCount = document.getElementById('selectedCount');
    const assistantMessage = document.getElementById('assistantMessage');
    const suggestRecipeBtn = document.getElementById('suggestRecipeBtn');
    const recipesContainer = document.getElementById('recipesContainer');
    const suggestedRecipes = document.getElementById('suggestedRecipes');

    // Get available ingredients from DataStore
    const availableIngredients = DataStore.getIngredients();

    // Populate ingredients list
    availableIngredients.forEach(ingredient => {
        const ingredientElement = document.createElement('div');
        ingredientElement.className = 'ingredient-item';
        ingredientElement.innerHTML = `
            <input type="checkbox" id="ingredient-${ingredient.id}" value="${ingredient.name}">
            <label for="ingredient-${ingredient.id}">${ingredient.name}</label>
        `;
        ingredientsList.appendChild(ingredientElement);
    });

    // Update selected count
    function updateSelectedCount() {
        const selectedIngredients = document.querySelectorAll('.ingredient-item input:checked');
        selectedCount.textContent = selectedIngredients.length;
    }

    // Get selected ingredients
    function getSelectedIngredients() {
        return Array.from(document.querySelectorAll('.ingredient-item input:checked'))
            .map(input => input.value);
    }

    // Find matching recipes
    function findMatchingRecipes(selectedIngredients) {
        return RECIPES.filter(recipe => {
            const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase());
            const selected = selectedIngredients.map(i => i.toLowerCase());
            
            // Count how many ingredients from the recipe are in the selected ingredients
            const matchingIngredients = recipeIngredients.filter(ingredient => 
                selected.includes(ingredient)
            );
            
            // If we have at least 3 matching ingredients, show the recipe
            return matchingIngredients.length >= 3;
        });
    }

    // Display recipe card
    function displayRecipeCard(recipe) {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <div class="recipe-header">
                <h3>${recipe.name}</h3>
                <span class="recipe-category">${recipe.category}</span>
            </div>
            <div class="recipe-details">
                <p><i class="fas fa-clock"></i> ${recipe.prepTime}</p>
                <p><i class="fas fa-signal"></i> ${recipe.difficulty}</p>
            </div>
            <div class="recipe-ingredients">
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
            </div>
            <div class="recipe-instructions">
                <h4>Instructions:</h4>
                <p>${recipe.instructions.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        return card;
    }

    // Update suggested recipes
    function updateSuggestedRecipes(recipes) {
        suggestedRecipes.innerHTML = '';
        if (recipes.length === 0) {
            suggestedRecipes.innerHTML = '<p class="no-recipes">No recipes found with the selected ingredients.</p>';
            return;
        }
        recipes.forEach(recipe => {
            suggestedRecipes.appendChild(displayRecipeCard(recipe));
        });
    }

    // Event Listeners
    ingredientsList.addEventListener('change', () => {
        updateSelectedCount();
        const selectedIngredients = getSelectedIngredients();
        const matchingRecipes = findMatchingRecipes(selectedIngredients);
        updateSuggestedRecipes(matchingRecipes);
        
        if (selectedIngredients.length === 0) {
            assistantMessage.textContent = "Hello! I can recommend dishes based on the ingredients you have. Please select ingredients from the list!";
        } else if (matchingRecipes.length === 0) {
            assistantMessage.textContent = "I couldn't find any recipes that match your selected ingredients. Try selecting different ingredients!";
        } else {
            assistantMessage.textContent = `I found ${matchingRecipes.length} recipe(s) you can make with your selected ingredients!`;
        }
    });

    // Add event listener for the Suggest Recipe button
    suggestRecipeBtn.addEventListener('click', () => {
        const selectedIngredients = getSelectedIngredients();
        if (selectedIngredients.length === 0) {
            assistantMessage.textContent = "Please select some ingredients first!";
            return;
        }
        
        const matchingRecipes = findMatchingRecipes(selectedIngredients);
        if (matchingRecipes.length === 0) {
            assistantMessage.textContent = "I couldn't find any recipes that match your selected ingredients. Try selecting different ingredients!";
            return;
        }

        // Display all matching recipes in the suggestedRecipes container
        const suggestedRecipesContainer = document.getElementById('suggestedRecipes');
        suggestedRecipesContainer.innerHTML = '';
        
        if (matchingRecipes.length === 0) {
            suggestedRecipesContainer.innerHTML = '<p class="no-recipes">No recipes found with the selected ingredients.</p>';
        } else {
            matchingRecipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'recipe-card';
                recipeCard.innerHTML = `
                    <div class="recipe-header">
                        <h3>${recipe.name}</h3>
                        <span class="recipe-category">${recipe.category}</span>
                    </div>
                    <div class="recipe-details">
                        <p><i class="fas fa-clock"></i> ${recipe.prepTime}</p>
                        <p><i class="fas fa-signal"></i> ${recipe.difficulty}</p>
                    </div>
                    <div class="recipe-ingredients">
                        <h4>Ingredients:</h4>
                        <ul>
                            ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="recipe-instructions">
                        <h4>Instructions:</h4>
                        <p>${recipe.instructions.replace(/\n/g, '<br>')}</p>
                    </div>
                `;
                suggestedRecipesContainer.appendChild(recipeCard);
            });
        }

        // Randomly select one recipe to highlight
        const randomRecipe = matchingRecipes[Math.floor(Math.random() * matchingRecipes.length)];
        assistantMessage.textContent = `I recommend trying ${randomRecipe.name}! It's a ${randomRecipe.difficulty.toLowerCase()} difficulty recipe that takes about ${randomRecipe.prepTime}.`;
    });
}); 