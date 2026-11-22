import React from 'react';
import { getFullImageUrl } from '../utils/constants';
import '../styles/RecipeCard.css';

/**
 * Rustic split recipe card for list and detail views.
 * @param {{ recipe: import('../types/recipe').Recipe }} props
 */
export default function RecipeCard({ recipe }) {
  const {
    title,
    subtitle,
    imageUrl,
    tags = [],
    prepTimeMinutes,
    cookTimeMinutes,
    servings,
    ingredients = [],
    steps = [],
    nutrition = {},
  } = recipe;

  const fullImageUrl = getFullImageUrl(imageUrl);

  return (
    <article className="recipe-card">
      <div className="recipe-card__hero">
        {fullImageUrl ? (
          <img src={fullImageUrl} alt={title} />
        ) : (
          <div className="recipe-card__hero-placeholder">{title}</div>
        )}
      </div>

      <div className="recipe-card__body">
        <h2 className="recipe-card__title">{title}</h2>
        {subtitle && <p className="recipe-card__subtitle">{subtitle}</p>}

        <div className="recipe-card__tags">
          {tags.map((tag) => (
            <span key={tag} className="recipe-card__tag">
              {tag}
            </span>
          ))}
          <span className="recipe-card__tag">Prep {prepTimeMinutes} min</span>
          <span className="recipe-card__tag">Cook {cookTimeMinutes} min</span>
          <span className="recipe-card__tag">Serves {servings}</span>
        </div>

        <section className="recipe-card__section">
          <h3>Ingredients</h3>
          <ul className="recipe-card__list">
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </section>

        <section className="recipe-card__section">
          <h3>Prep steps</h3>
          <ol className="recipe-card__list recipe-card__steps">
            {steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>

        <div className="recipe-card__nutrition">
          <span>{nutrition.calories ?? 0} kcal</span>
          <span>{nutrition.proteinG ?? 0}g protein</span>
          <span>{nutrition.fatG ?? 0}g fat</span>
          <span>{nutrition.carbsG ?? 0}g carbs</span>
        </div>
      </div>
    </article>
  );
}
