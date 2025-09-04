import { NextResponse } from 'next/server';
import { getRecipesByIngredient } from '../utils';
import { applyDietaryFilters } from '../filters';
import { ApiError, handleError } from '../errors';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ingredients = searchParams.get('ingredients');
    const isVegetarian = searchParams.get('isVegetarian') === 'true';
    const isVegan = searchParams.get('isVegan') === 'true';

    if (!ingredients) {
      throw new ApiError(400, 'Ingredients are required');
    }

    let meals = await getRecipesByIngredient(ingredients);

    if (!meals || meals.length === 0) {
      throw new ApiError(404, 'No recipes found for the given ingredients');
    }

    if (isVegetarian || isVegan) {
      meals = applyDietaryFilters(meals, isVegetarian, isVegan);
    }

    return NextResponse.json({ meals });
  } catch (error) {
    const { error: errorMessage, status } = handleError(error);
    return NextResponse.json({ error: errorMessage }, { status });
  }
}