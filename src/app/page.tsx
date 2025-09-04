'use client';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ThemeSwitcher } from './ThemeSwitcher';
import { GradientBlobs } from './GradientBlobs';
import { useToast } from './useToast';
import { Toast } from './Toast';

interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [favoritedIds, setFavoritedIds] = useState<Set<string>>(new Set());
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [aiRecipe, setAiRecipe] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast, showToast } = useToast();
  const [searched, setSearched] = useState(false);
  const favoritesRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    setIsLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/recipes?ingredients=${ingredients}&isVegetarian=${isVegetarian}&isVegan=${isVegan}`);
      if (!res.ok) {
        throw new Error('Failed to fetch recipes');
      }
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (error) {
      showToast('Failed to fetch recipes. Please try again.', 'error');
    }
    setIsLoading(false);
  };

  const handleGenerateAIRecipe = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      if (!res.ok) {
        throw new Error('Failed to generate AI recipe');
      }
      const data = await res.json();
      setAiRecipe(data.recipe);
    } catch (error) {
      showToast('Failed to generate AI recipe. Please try again.', 'error');
    }
    setIsGenerating(false);
  };

  const clearSearch = () => {
    setRecipes([]);
    setSearched(false);
  };

  const scrollToFavorites = () => {
    favoritesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favoriteList = JSON.parse(storedFavorites);
      setFavorites(favoriteList);
      setFavoritedIds(new Set(favoriteList.map((r: Recipe) => r.idMeal)));
    }
  }, []);

  const toggleFavorite = (recipe: Recipe) => {
    const newFavorites = [...favorites];
    const newFavoritedIds = new Set(favoritedIds);
    if (newFavoritedIds.has(recipe.idMeal)) {
      const index = newFavorites.findIndex((r) => r.idMeal === recipe.idMeal);
      newFavorites.splice(index, 1);
      newFavoritedIds.delete(recipe.idMeal);
      showToast('Removed from favorites', 'success');
    } else {
      newFavorites.push(recipe);
      newFavoritedIds.add(recipe.idMeal);
      showToast('Added to favorites', 'success');
    }
    setFavorites(newFavorites);
    setFavoritedIds(newFavoritedIds);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => {}} />}
      <GradientBlobs />
      <header className="py-8 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center relative z-10 backdrop-filter backdrop-blur-lg bg-opacity-20 bg-background rounded-b-3xl shadow-xl">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-bold text-primary text-center sm:text-left"
        >
          AI-Powered Recipe Finder
        </motion.h1>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {favorites.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToFavorites}
              className="bg-accent text-foreground py-3 px-8 rounded-full font-semibold shadow-lg transition-colors duration-300"
            >
              Favorites ({favorites.length})
            </motion.button>
          )}
          <ThemeSwitcher />
        </div>
      </header>

      <main className="container mx-auto p-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col sm:flex-row justify-center items-center mb-12">
          <motion.input
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            disabled={isLoading || isGenerating}
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Enter ingredients (e.g., chicken, broccoli)"
            className="w-full max-w-lg p-3 border-2 border-primary rounded-full focus:outline-none focus:border-secondary transition-colors duration-300 bg-transparent placeholder-foreground"
          />
          <div className="flex flex-col sm:flex-row mt-4 sm:mt-0 sm:ml-4">
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isLoading || isGenerating}
              className="bg-primary text-foreground py-3 px-8 rounded-full font-semibold shadow-lg transition-colors duration-300 disabled:bg-gray-400"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                'Search'
              )}
            </motion.button> */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGenerateAIRecipe}
              disabled={isLoading || isGenerating}
              className="bg-secondary text-foreground py-3 px-8 rounded-full font-semibold shadow-lg mt-4 sm:mt-0 sm:ml-4 transition-colors duration-300 disabled:bg-gray-400"
            >
              {isGenerating ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                'Generate Recipe'
              )}
            </motion.button>
            {searched && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearSearch}
                className="bg-gray-500 text-white py-3 px-8 rounded-full font-semibold shadow-lg mt-4 sm:mt-0 sm:ml-4 transition-colors duration-300"
              >
                'Clear'
              </motion.button>
            )}
          </div>
        </div>

        <div className="flex justify-center mb-12 gap-8">
          <motion.label 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={isVegetarian}
              disabled={isLoading || isGenerating}
              onChange={(e) => setIsVegetarian(e.target.checked)}
              className="hidden"
            />
            <motion.div 
              className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center ${isVegetarian ? 'bg-primary border-primary' : 'border-gray-400'}`}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: isVegetarian ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 bg-white rounded-sm"
              />
            </motion.div>
            <span className="font-semibold">Vegetarian</span>
          </motion.label>
          <motion.label 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
            className="flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              checked={isVegan}
              disabled={isLoading || isGenerating}
              onChange={(e) => setIsVegan(e.target.checked)}
              className="hidden"
            />
            <motion.div 
              className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center ${isVegan ? 'bg-primary border-primary' : 'border-gray-400'}`}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: isVegan ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="w-3 h-3 bg-white rounded-sm"
              />
            </motion.div>
            <span className="font-semibold">Vegan</span>
          </motion.label>
        </div>

        {aiRecipe && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-background rounded-2xl shadow-lg p-8 my-12 border-2 border-primary backdrop-filter backdrop-blur-md bg-opacity-30"
          >
            <h2 className="text-3xl font-bold mb-6 text-primary">AI Generated Recipe</h2>
            <div className="prose max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: aiRecipe.replace(/\n/g, '<br />') }} />
          </motion.div>
        )}

        <motion.div
          animate={{ opacity: isLoading ? 0.5 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {searched && recipes.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xl font-semibold my-12"
            >
              No recipes found. Try different ingredients.
            </motion.div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {recipes.map((recipe, index) => (
              <motion.div 
                key={recipe.idMeal} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                className="bg-background rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 border-2 border-secondary backdrop-filter backdrop-blur-md bg-opacity-30"
              >
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-56 object-cover" />
                <div className="p-6">
                  <h2 className="text-2xl font-semibold mb-3">{recipe.strMeal}</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFavorite(recipe)}
                    className={`w-full py-2 rounded-full font-semibold transition-colors duration-300 ${favoritedIds.has(recipe.idMeal) ? 'bg-red-500 text-white' : 'bg-accent text-foreground'}`}
                  >
                    {favoritedIds.has(recipe.idMeal) ? 'Favorited' : 'Add to Favorites'}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {favorites.length > 0 && (
          <div ref={favoritesRef} className="mt-24">
            <h2 className="text-4xl font-bold mb-8 text-center">Favorites</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {favorites.map((recipe, index) => (
                <motion.div 
                  key={recipe.idMeal} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
                  className="bg-background rounded-2xl shadow-lg overflow-hidden border-2 border-accent backdrop-filter backdrop-blur-md bg-opacity-30"
                >
                  <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-56 object-cover" />
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold">{recipe.strMeal}</h2>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleFavorite(recipe)}
                      className="w-full bg-red-500 text-white py-2 rounded-full font-semibold transition-colors duration-300 mt-4"
                    >
                      Remove
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-8 mt-16 relative z-10 backdrop-filter backdrop-blur-lg bg-opacity-20 bg-background rounded-t-3xl shadow-xl">
        <p>Powered by <a href="https://www.themealdb.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TheMealDB</a> and <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Google Gemini</a></p>
      </footer>
    </div>
  );
}