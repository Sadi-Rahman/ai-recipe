import { applyDietaryFilters } from './filters';
import { Meal } from './utils';

describe('applyDietaryFilters', () => {
  const meals: Meal[] = [
    { strCategory: 'Vegan' },
    { strCategory: 'Vegetarian' },
    { strCategory: 'Beef' },
  ] as Meal[];

  it('should return only vegan meals when isVegan is true', () => {
    const filteredMeals = applyDietaryFilters(meals, false, true);
    expect(filteredMeals).toEqual([{ strCategory: 'Vegan' }]);
  });

  it('should return only vegetarian meals when isVegetarian is true', () => {
    const filteredMeals = applyDietaryFilters(meals, true, false);
    expect(filteredMeals).toEqual([{ strCategory: 'Vegetarian' }]);
  });

  it('should return all meals when both flags are false', () => {
    const filteredMeals = applyDietaryFilters(meals, false, false);
    expect(filteredMeals).toEqual(meals);
  });
});
