import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getRecipe } from '../services/api';
import { Recipe } from '../types';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        if (id) {
          const data = await getRecipe(id);
          setRecipe(data);
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
        setError('Failed to load recipe. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>{error || 'Recipe not found'}</h2>
          <Link to="/">Return to recipe list</Link>
          {error && (
            <button onClick={() => window.location.reload()} className="retry-button">
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        ← Back to recipes
      </Link>

      <div className="recipe-detail">
        <h1>{recipe.name}</h1>
        <p>{recipe.description}</p>
        
        <div className="recipe-meta">
          <div>
            <strong>Difficulty:</strong> {recipe.difficulty}
          </div>
          <div>
            <strong>Prep Time:</strong> {recipe.prepTime} minutes
          </div>
          <div>
            <strong>Cook Time:</strong> {recipe.cookTime} minutes
          </div>
          <div>
            <strong>Total Time:</strong> {recipe.prepTime + recipe.cookTime} minutes
          </div>
          <div>
            <strong>Servings:</strong> {recipe.servings}
          </div>
          <div>
            <strong>Calories per Serving:</strong> {recipe.calories} kcal
          </div>
        </div>

        {recipe.image && (
          <div className="recipe-image">
            <img src={recipe.image} alt={recipe.name} />
          </div>
        )}

        {recipe.nutrition && (
          <div className="nutrition-grid">
            {Object.entries(recipe.nutrition).map(([key, value]) => (
              <div key={key} className="nutrition-item">
                <div className="label">{key}</div>
                <div className="value">{value}{key === 'calories' ? ' kcal' : 'g'}</div>
              </div>
            ))}
          </div>
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h2>Ingredients</h2>
            <ul className="ingredients-list">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.amount} {ingredient.unit} {ingredient.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {recipe.instructions && recipe.instructions.length > 0 && (
          <div>
            <h2>Instructions</h2>
            <ol className="instructions-list">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}