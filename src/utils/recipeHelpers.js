/** @returns {import('../types/recipe').Recipe} */
export const emptyRecipePayload = () => ({
  slug: '',
  title: '',
  subtitle: '',
  imageUrl: '',
  tags: [],
  prepTimeMinutes: 0,
  cookTimeMinutes: 0,
  servings: 1,
  ingredients: [],
  steps: [],
  nutrition: {
    calories: 0,
    proteinG: 0,
    fatG: 0,
    carbsG: 0,
  },
});

const splitLines = (text) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const joinLines = (items) => (items || []).join('\n');

/** @param {import('../types/recipe').Recipe} recipe */
export const recipeToFormState = (recipe) => ({
  slug: recipe.slug || '',
  title: recipe.title || '',
  subtitle: recipe.subtitle || '',
  imageUrl: recipe.imageUrl || '',
  tagsText: joinLines(recipe.tags),
  prepTimeMinutes: recipe.prepTimeMinutes ?? 0,
  cookTimeMinutes: recipe.cookTimeMinutes ?? 0,
  servings: recipe.servings ?? 1,
  ingredientsText: joinLines(recipe.ingredients),
  stepsText: joinLines(recipe.steps),
  calories: recipe.nutrition?.calories ?? 0,
  proteinG: recipe.nutrition?.proteinG ?? 0,
  fatG: recipe.nutrition?.fatG ?? 0,
  carbsG: recipe.nutrition?.carbsG ?? 0,
});

/** @returns {Omit<import('../types/recipe').Recipe, 'id'>} */
export const formStateToRecipePayload = (form) => ({
  slug: form.slug.trim(),
  title: form.title.trim(),
  subtitle: form.subtitle.trim(),
  imageUrl: form.imageUrl.trim(),
  tags: splitLines(form.tagsText),
  prepTimeMinutes: Number(form.prepTimeMinutes) || 0,
  cookTimeMinutes: Number(form.cookTimeMinutes) || 0,
  servings: Number(form.servings) || 0,
  ingredients: splitLines(form.ingredientsText),
  steps: splitLines(form.stepsText),
  nutrition: {
    calories: Number(form.calories) || 0,
    proteinG: Number(form.proteinG) || 0,
    fatG: Number(form.fatG) || 0,
    carbsG: Number(form.carbsG) || 0,
  },
});
