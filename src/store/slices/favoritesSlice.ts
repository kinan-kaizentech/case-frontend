import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Recipe } from '../../types';

interface FavoritesState {
  favorites: Recipe[];
}

const initialState: FavoritesState = {
  favorites: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state: FavoritesState, action: PayloadAction<Recipe>) => {
      if (!state.favorites.some((recipe: Recipe) => recipe.id === action.payload.id)) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state: FavoritesState, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter((recipe: Recipe) => recipe.id !== action.payload);
    },
  },
});

export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.favorites;

export default favoritesSlice.reducer;