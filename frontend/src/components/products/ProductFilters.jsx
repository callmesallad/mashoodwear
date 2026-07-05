import { useEffect, useState } from "react";
import PriceRangeSlider from "./PriceRangeSlider";
import {
  PRODUCT_COLORS,
  PRODUCT_SIZES,
} from "../../constants/filters";

/**
 * Sidebar / sheet filter controls for the products page.
 * @param {{
 *   categories: Array<{ id: number, name: string, slug: string }>,
 *   filters: import('../../hooks/useProductFilters').ProductFilterState,
 *   onChange: (next: import('../../hooks/useProductFilters').ProductFilterState) => void,
 *   onApply?: () => void,
 *   onClear: () => void,
 *   showClearButton?: boolean,
 *   idPrefix?: string
 * }} props
 */
export default function ProductFilters({
  categories,
  filters,
  onChange,
  onApply,
  onClear,
  showClearButton = true,
  idPrefix = "filters",
}) {
  const [localPrice, setLocalPrice] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  useEffect(() => {
    setLocalPrice({
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    });
  }, [filters.minPrice, filters.maxPrice]);

  const update = (patch) => {
    onChange({ ...filters, ...patch });
  };

  const toggleCategory = (slug) => {
    update({ category: filters.category === slug ? null : slug });
  };

  const toggleSize = (size) => {
    update({ size: filters.size === size ? null : size });
  };

  const toggleColor = (color) => {
    update({ color: filters.color === color ? null : color });
  };

  const handlePriceChange = (minPrice, maxPrice) => {
    setLocalPrice({ minPrice, maxPrice });
  };

  const handlePriceCommit = (minPrice, maxPrice) => {
    if (onApply) {
      onChange({ ...filters, minPrice, maxPrice });
      onApply();
      return;
    }
    update({ minPrice, maxPrice });
  };

  return (
    <div className="filters-panel">
      <p className="filter-label">Category</p>
      <div className="filter-group filter-pill-grid" role="group" aria-label="Category">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`filter-pill${filters.category === category.slug ? " active" : ""}`}
            aria-pressed={filters.category === category.slug}
            onClick={() => toggleCategory(category.slug)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <p className="filter-label">Size</p>
      <div className="filter-group size-grid" role="group" aria-label="Size">
        {PRODUCT_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            className={`size-btn${filters.size === size ? " active" : ""}`}
            aria-pressed={filters.size === size}
            onClick={() => toggleSize(size)}
          >
            {size}
          </button>
        ))}
      </div>

      <p className="filter-label">Color</p>
      <div className="filter-group color-swatches" role="group" aria-label="Color">
        {PRODUCT_COLORS.map((color) => (
          <button
            key={color.name}
            type="button"
            className={`color-swatch ${color.slug}${filters.color === color.name ? " active" : ""}`}
            aria-label={color.name}
            aria-pressed={filters.color === color.name}
            onClick={() => toggleColor(color.name)}
          />
        ))}
      </div>

      <p className="filter-label">Price range</p>
      <div className="filter-group">
        <PriceRangeSlider
          minPrice={localPrice.minPrice}
          maxPrice={localPrice.maxPrice}
          onChange={handlePriceChange}
          onCommit={handlePriceCommit}
        />
      </div>

      {showClearButton && (
        <button type="button" className="clear-filters" onClick={onClear}>
          Clear filters
        </button>
      )}
    </div>
  );
}
