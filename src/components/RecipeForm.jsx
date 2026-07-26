import React from 'react';

/**
 * @param {{
 *   form: ReturnType<import('../utils/recipeHelpers').recipeToFormState>,
 *   onChange: (field: string, value: string) => void,
 *   onSubmit: (event: Event) => void,
 *   submitLabel: string,
 *   loading?: boolean,
 *   onCancel?: () => void,
 * }} props
 */
export default function RecipeForm({
  form,
  onChange,
  onSubmit,
  submitLabel,
  loading = false,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          className="small-input"
          value={form.title}
          onChange={(e) => onChange('title', e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="slug">Slug</label>
        <input
          id="slug"
          type="text"
          className="small-input"
          value={form.slug}
          onChange={(e) => onChange('slug', e.target.value)}
          placeholder="Auto-generated from title if empty"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subtitle">Subtitle</label>
        <input
          id="subtitle"
          type="text"
          className="small-input"
          value={form.subtitle}
          onChange={(e) => onChange('subtitle', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          id="imageUrl"
          type="text"
          className="small-input"
          value={form.imageUrl}
          onChange={(e) => onChange('imageUrl', e.target.value)}
          placeholder="/images/example.png"
        />
      </div>

      <div className="form-group">
        <label htmlFor="tagsText">Tags (one per line)</label>
        <textarea
          id="tagsText"
          className="small-input"
          rows={3}
          value={form.tagsText}
          onChange={(e) => onChange('tagsText', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="prepTimeMinutes">Prep time (minutes)</label>
        <input
          id="prepTimeMinutes"
          type="number"
          min="0"
          className="small-input"
          value={form.prepTimeMinutes}
          onChange={(e) => onChange('prepTimeMinutes', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cookTimeMinutes">Cook time (minutes)</label>
        <input
          id="cookTimeMinutes"
          type="number"
          min="0"
          className="small-input"
          value={form.cookTimeMinutes}
          onChange={(e) => onChange('cookTimeMinutes', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="servings">Servings</label>
        <input
          id="servings"
          type="number"
          min="1"
          className="small-input"
          value={form.servings}
          onChange={(e) => onChange('servings', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="ingredientsText">Ingredients (one per line)</label>
        <textarea
          id="ingredientsText"
          className="small-input"
          rows={6}
          value={form.ingredientsText}
          onChange={(e) => onChange('ingredientsText', e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="stepsText">Prep steps (one per line)</label>
        <textarea
          id="stepsText"
          className="small-input"
          rows={6}
          value={form.stepsText}
          onChange={(e) => onChange('stepsText', e.target.value)}
        />
      </div>

      <fieldset className="form-group">
        <legend>Nutrition</legend>
        <div className="form-group">
          <label htmlFor="calories">Calories</label>
          <input
            id="calories"
            type="number"
            min="0"
            className="small-input"
            value={form.calories}
            onChange={(e) => onChange('calories', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="proteinG">Protein (g)</label>
          <input
            id="proteinG"
            type="number"
            min="0"
            className="small-input"
            value={form.proteinG}
            onChange={(e) => onChange('proteinG', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="fatG">Fat (g)</label>
          <input
            id="fatG"
            type="number"
            min="0"
            className="small-input"
            value={form.fatG}
            onChange={(e) => onChange('fatG', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="carbsG">Carbs (g)</label>
          <input
            id="carbsG"
            type="number"
            min="0"
            className="small-input"
            value={form.carbsG}
            onChange={(e) => onChange('carbsG', e.target.value)}
          />
        </div>
      </fieldset>

      <div className="button-group">
        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            className="cancel-btn9"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
