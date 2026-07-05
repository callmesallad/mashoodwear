import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StateMessage from "../components/StateMessage";
import ProductImage from "../components/ProductImage";
import { useCart } from "../hooks/useCart";
import {
  calculateCartTotal,
  isCheckoutEnabled,
  removeLine,
  updateLineQuantity,
} from "../utils/cartStorage";
import { formatPrice, formatPriceWithToman } from "../utils/formatPrice";

/**
 * Shopping cart page with qty controls and checkout CTA.
 */
export default function CartPage() {
  const { items, refresh } = useCart();
  const [stockMessage, setStockMessage] = useState(null);

  const total = useMemo(() => calculateCartTotal(items), [items]);
  const checkoutEnabled = isCheckoutEnabled(items);

  const handleQuantityChange = (line, delta) => {
    const nextQty = line.quantity + delta;
    const { capped } = updateLineQuantity(
      line.productId,
      line.selectedSize,
      line.selectedColor,
      nextQty
    );
    if (capped) {
      setStockMessage("Quantity adjusted — not enough stock for that size and color");
    } else {
      setStockMessage(null);
    }
    refresh();
  };

  const handleRemove = (line) => {
    removeLine(line.productId, line.selectedSize, line.selectedColor);
    setStockMessage(null);
    refresh();
  };

  if (items.length === 0) {
    return (
      <div className="cart-page container">
        <h1 className="page-title">Cart</h1>
        <StateMessage
          variant="empty"
          message="Your cart is empty"
          actionLabel="View Products"
          onAction={() => {
            window.location.href = "/products";
          }}
        />
      </div>
    );
  }

  return (
    <div className="cart-page container">
      <h1 className="page-title">Cart</h1>

      {stockMessage && (
        <p className="cart-stock-message" role="alert">
          {stockMessage}
        </p>
      )}

      <div className="cart-lines">
        {items.map((line) => (
          <article
            key={`${line.productId}-${line.selectedSize}-${line.selectedColor}`}
            className="cart-line"
          >
            <Link to={`/products/${line.slug}`} className="cart-line-image">
              <ProductImage
                src={line.imageUrl}
                fallbackClassName="cart-line-image--placeholder"
                fallbackLabel="No image"
              />
            </Link>

            <div className="cart-line-body">
              <Link to={`/products/${line.slug}`} className="cart-line-name">
                {line.name}
              </Link>
              <p className="cart-line-variant">
                {line.selectedSize}, {line.selectedColor}
              </p>
              <p className="cart-line-unit">{formatPrice(line.price)} each</p>

              <div className="cart-line-actions">
                <div className="qty-control" aria-label="Quantity">
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Decrease quantity"
                    onClick={() => handleQuantityChange(line, -1)}
                  >
                    −
                  </button>
                  <span className="qty-value">{line.quantity}</span>
                  <button
                    type="button"
                    className="qty-btn"
                    aria-label="Increase quantity"
                    onClick={() => handleQuantityChange(line, 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="cart-remove-btn"
                  onClick={() => handleRemove(line)}
                >
                  Remove
                </button>
              </div>
            </div>

            <p className="cart-line-total">
              {formatPriceWithToman(line.price * line.quantity)}
            </p>
          </article>
        ))}
      </div>

      <div className="cart-footer">
        <p className="cart-grand-total">
          <span>Total</span>
          <span>{formatPriceWithToman(total)}</span>
        </p>
        <Link
          to="/checkout"
          className={`btn btn-primary${checkoutEnabled ? "" : " btn-disabled"}`}
          aria-disabled={!checkoutEnabled}
          onClick={(event) => {
            if (!checkoutEnabled) {
              event.preventDefault();
            }
          }}
        >
          Continue to Checkout
        </Link>
      </div>
    </div>
  );
}
