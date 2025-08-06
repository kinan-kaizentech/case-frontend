import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectFavorites, removeFromFavorites } from '../store/slices/favoritesSlice';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function FavoriteRecipes() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  const handleRemoveFromFavorites = (recipeId: number) => {
    dispatch(removeFromFavorites(recipeId));
  };

  if (favorites.length === 0) {
    return (
      <div className="container">
        <h1>Favorite Recipes</h1>
        <div className="empty-state">
          <p>You haven't added any recipes to your favorites yet.</p>
          <Link to="/" className="primary-button">
            Browse Recipes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Favorite Recipes</h1>
      <div className="recipe-grid">
        {favorites.map((recipe) => (
          <div key={recipe.id} className="recipe-card-wrapper">
            <Link
              to={`/recipe/${recipe.id}`}
              className="recipe-card"
            >
              <h2>{recipe.name}</h2>
              <p>{recipe.description}</p>
              <div className="recipe-meta">
                <p className="difficulty">{recipe.difficulty}</p>
                <p className="time">{recipe.prepTime + recipe.cookTime} min</p>
              </div>
              {recipe.image && <img src={recipe.image} alt={recipe.name} />}
            </Link>
            <button
              className="favorite-button"
              onClick={() => handleRemoveFromFavorites(recipe.id)}
            >
              <HeartSolid className="heart-icon filled" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}