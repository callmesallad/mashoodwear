/**
 * Derive add-to-cart button and stock label from variant selection.
 * @param {{
 *   productStatus: string,
 *   variants: Array<{ size: string, color: string, stock: number }>,
 *   selectedSize: string | null,
 *   selectedColor: string | null
 * }} input
 * @returns {{ disabled: boolean, label: string, stockLabel: string | null }}
 */
export function getAddToCartState({
  productStatus,
  variants,
  selectedSize,
  selectedColor,
}) {
  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  if (productStatus === "out_of_stock" || totalStock <= 0) {
    return { disabled: true, label: "Sold out", stockLabel: "Sold out" };
  }

  if (!selectedSize || !selectedColor) {
    return {
      disabled: true,
      label: "Pick a size and color first",
      stockLabel: null,
    };
  }

  const variant = variants.find(
    (item) => item.size === selectedSize && item.color === selectedColor
  );

  if (!variant || variant.stock <= 0) {
    return {
      disabled: true,
      label: "This size and color is sold out",
      stockLabel: "Sold out",
    };
  }

  let stockLabel = "In stock";
  if (variant.stock <= 3) {
    stockLabel = `Only ${variant.stock} left`;
  }

  return { disabled: false, label: "Add to Cart", stockLabel };
}

/**
 * Unique sizes from variants in display order.
 * @param {Array<{ size: string }>} variants
 * @param {string[]} [preferredOrder]
 * @returns {string[]}
 */
export function uniqueSizes(variants, preferredOrder = ["S", "M", "L", "XL", "2XL"]) {
  const sizes = [...new Set(variants.map((variant) => variant.size))];
  return sizes.sort(
    (left, right) => preferredOrder.indexOf(left) - preferredOrder.indexOf(right)
  );
}

/**
 * Colors available for the selected size.
 * @param {Array<{ size: string, color: string }>} variants
 * @param {string | null} selectedSize
 * @returns {string[]}
 */
export function colorsForSize(variants, selectedSize) {
  const filtered = selectedSize
    ? variants.filter((variant) => variant.size === selectedSize)
    : variants;
  return [...new Set(filtered.map((variant) => variant.color))];
}

/**
 * Map color name to CSS slug for swatches.
 * @param {string} colorName
 * @returns {string}
 */
export function colorNameToSlug(colorName) {
  return colorName.toLowerCase().replace(/\s+/g, "-");
}
