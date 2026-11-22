/**
 * @typedef {Object} Nutrition
 * @property {number} calories
 * @property {number} proteinG
 * @property {number} fatG
 * @property {number} carbsG
 */

/**
 * @typedef {Object} Recipe
 * @property {number} id
 * @property {string} slug
 * @property {string} title
 * @property {string} [subtitle]
 * @property {string} [imageUrl]
 * @property {string[]} tags
 * @property {number} prepTimeMinutes
 * @property {number} cookTimeMinutes
 * @property {number} servings
 * @property {string[]} ingredients
 * @property {string[]} steps
 * @property {Nutrition} nutrition
 */

export {};
