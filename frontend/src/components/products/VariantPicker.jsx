import { colorNameToSlug } from "../../utils/variantSelection";

/**
 * Size and color pickers for product detail.
 * @param {{
 *   sizes: string[],
 *   colors: string[],
 *   selectedSize: string | null,
 *   selectedColor: string | null,
 *   onSizeChange: (size: string | null) => void,
 *   onColorChange: (color: string | null) => void
 * }} props
 */
export default function VariantPicker({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}) {
  return (
    <>
      <div className="variant-group">
        <p className="variant-label">Size</p>
        <div className="size-grid" role="group" aria-label="Size">
          {sizes.map((size) => (
            <button
              key={size}
              type="button"
              className={`size-btn${selectedSize === size ? " active" : ""}`}
              aria-pressed={selectedSize === size}
              onClick={() => onSizeChange(selectedSize === size ? null : size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="variant-group">
        <p className="variant-label">Color</p>
        <div className="color-swatches" role="group" aria-label="Color">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`color-swatch ${colorNameToSlug(color)}${
                selectedColor === color ? " active" : ""
              }`}
              aria-label={color}
              aria-pressed={selectedColor === color}
              onClick={() => onColorChange(selectedColor === color ? null : color)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
