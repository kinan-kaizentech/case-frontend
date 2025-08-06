import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getRecipes, getCategories, getRecipe } from '../services/api';
import { RecipeListItem, Category, RecipeFilters } from '../types';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../store/slices/favoritesSlice';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

export default function RecipeList() {
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);
  const [recipes, setRecipes] = useState<RecipeListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<RecipeFilters>({});

  const handleFavoriteClick = async (e: React.MouseEvent, recipe: RecipeListItem) => {
    e.preventDefault();
    const isFavorite = favorites.some((fav: { id: number }) => fav.id === recipe.id);
    if (isFavorite) {
      dispatch(removeFromFavorites(recipe.id));
    } else {
      try {
        const fullRecipe = await getRecipe(recipe.id.toString());
        dispatch(addToFavorites(fullRecipe));
      } catch (error) {
        console.error('Error adding recipe to favorites:', error);
      }
    }
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    (term: string) => {
      setFilters(prev => ({ ...prev, keyword: term || undefined }));
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recipesData, categoriesData] = await Promise.all([
          getRecipes(filters),
          getCategories(),
        ]);
        setRecipes(recipesData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Turkish Recipes</h1>
      
      <div className="filters-section">
        <h2>Filters</h2>
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="search-input">Search:</label>
            <input
              id="search-input"
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={filters.categoryId || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, categoryId: e.target.value || undefined }))}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <button 
            className="reset-filters"
            onClick={() => {
              setFilters({});
              setSearchTerm('');
            }}
            disabled={!filters.categoryId && !searchTerm}
          >
            Reset Filters
          </button>
        </div>
        {(filters.categoryId || filters.keyword) && (
          <div className="active-filters">
            <span>Active Filters:</span>
            {filters.keyword && (
              <div className="filter-tag">
                Search: {filters.keyword}
                <button onClick={() => setSearchTerm('')}>×</button>
              </div>
            )}
            {filters.categoryId && (
              <div className="filter-tag">
                Category: {categories.find(c => c.id === filters.categoryId)?.name}
                <button onClick={() => setFilters(prev => ({ ...prev, categoryId: undefined }))}>×</button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="recipe-grid">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="recipe-card-wrapper">
            <Link
              to={`/recipe/${recipe.id}`}
              className="recipe-card"
            >
              <h2>{recipe.name}</h2>
              <p>{recipe.description}</p>
              <div className="recipe-meta">
                <p className="category-name">{recipe.category}</p>
                <p className="difficulty">{recipe.difficulty}</p>
                <p className="time">{recipe.prepTime + recipe.cookTime} min</p>
              </div>
              {recipe.image && <img src={recipe.image} alt={recipe.name} />}
            </Link>
            <button
              className="favorite-button"
              onClick={(e) => handleFavoriteClick(e, recipe)}
            >
              {favorites.some((fav: { id: number }) => fav.id === recipe.id) ? (
                <HeartSolid className="heart-icon filled" />
              ) : (
                <HeartOutline className="heart-icon" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}