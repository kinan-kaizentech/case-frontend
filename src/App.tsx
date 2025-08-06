import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import FavoriteRecipes from './pages/FavoriteRecipes';
import './App.css';

function Navigation() {
  const location = useLocation();
  return (
    <nav className="main-nav">
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          All Recipes
        </Link>
        <Link to="/favorites" className={location.pathname === '/favorites' ? 'active' : ''}>
          Favorites
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Routes>
          <Route path="/" element={<RecipeList />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/favorites" element={<FavoriteRecipes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;