import axios from 'axios';
import { Recipe, RecipeListItem, Category, RecipeFilters } from '../types';

const api = axios.create({
  baseURL: 'https://case-backend.vercel.app/api',
});

export const getRecipes = async (filters?: RecipeFilters) => {
  const response = await api.get<RecipeListItem[]>('/recipes', {
    params: filters,
  });
  return response.data;
};

export const getRecipe = async (id: string) => {
  const response = await api.get<Recipe>(`/recipes/${id}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get<Category[]>('/categories');
  return response.data;
};