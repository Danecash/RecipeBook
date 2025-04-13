document.addEventListener('DOMContentLoaded', () => {
    const recipeContainer = document.getElementById('recipe-container');
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    // Fetch all recipes on page load
    fetchRecipes();

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const ingredients = searchInput.value.trim();
        if (ingredients) {
            fetchRecipes(ingredients);
        }
    });

    async function fetchRecipes(ingredients = '') {
        try {
            let url = '/recipes';
            if (ingredients) {
                url = `/search/ingredients?q=${encodeURIComponent(ingredients)}`;
            }

            const response = await fetch(url);
            const recipes = await response.json();

            displayRecipes(recipes);
        } catch (error) {
            recipeContainer.innerHTML = `<div class="error">Failed to load recipes. Please try again.</div>`;
            console.error('Error:', error);
        }
    }

    function displayRecipes(recipes) {
        if (!recipes || recipes.length === 0) {
            recipeContainer.innerHTML = '<div class="recipe-card">No recipes found</div>';
            return;
        }

        recipeContainer.innerHTML = recipes.map(recipe => `
            <div class="recipe-card">
                <h3>${recipe.name}</h3>
                <p><strong>Category:</strong> ${recipe.category}</p>
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ul>
                ${recipe.instructions ? `
                <h4>Instructions:</h4>
                <ol>
                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                </ol>
                ` : ''}
            </div>
        `).join('');
    }
});