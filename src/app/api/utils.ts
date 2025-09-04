import axios from 'axios';

const API_URL = 'https://www.themealdb.com/api/json/v1/1';

export const getRecipesByIngredient = async (ingredient: string) => {
  try {
    const response = await axios.get(`${API_URL}/filter.php?i=${ingredient}`);
    const meals = response.data.meals || [];
    console.log(`Response from filter.php for ingredient ${ingredient}:`, meals);

    // Fetch detailed information for each meal
    const detailedMeals = await Promise.all(
      meals.map(async (meal: any) => {
        const details = await getRecipeDetails(meal.idMeal);
        return details;
      })
    );

    console.log(`Detailed meals for ingredient ${ingredient}:`, detailedMeals);
    return detailedMeals.filter(meal => meal !== null);
  } catch (error) {
    console.error(`Error fetching recipes by ingredient ${ingredient}:`, error);
    return [];
  }
};

export const getRecipeDetails = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/lookup.php?i=${id}`);
    const details = response.data.meals ? response.data.meals[0] : null;
    console.log(`Response from lookup.php for ID ${id}:`, details);
    return details;
  } catch (error) {
    console.error(`Error fetching recipe details for ID ${id}:`, error);
    return null;
  }
};

export const getRecipesByCategory = async (category: string) => {
  try {
    const response = await axios.get(`${API_URL}/filter.php?c=${category}`);
    const meals = response.data.meals || [];
    console.log(`Response from filter.php for category ${category}:`, meals);
    return meals;
  } catch (error) {
    console.error(`Error fetching recipes by category ${category}:`, error);
    return [];
  }
};