import { Meal } from './utils';

export function applyDietaryFilters(meals: Meal[], isVegetarian: boolean, isVegan: boolean): Meal[] {
  return meals.filter(meal => {
    if (isVegan) {
      return meal.strCategory === 'Vegan';
    }
    if (isVegetarian) {
      return meal.strCategory === 'Vegetarian';
    }
    return true;
  });
}