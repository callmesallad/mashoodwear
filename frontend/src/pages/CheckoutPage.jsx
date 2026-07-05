import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import StateMessage from "../components/StateMessage";
import { useSite } from "../context/SiteContext";
import { useCart } from "../hooks/useCart";
import { calculateCartTotal } from "../utils/cartStorage";
import { formatPriceWithToman } from "../utils/formatPrice";
import { buildOrderCopyText } from "../utils/orderCopy";

/**
 * Checkout page — order summary, Instagram CTA, copy details, Telegram fallback.
 */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const { checkoutSettings } = useSite();
  const { items } = useCart();
  const [openingInstagram, setOpeningInstagram] = useState(false);
  const [instagramError, setInstagramError] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const total = useMemo(() => calculateCartTotal(items), [items]);
  const instagramUrl = checkoutSettings?.instagramDirectUrl || "";
  const telegramUsername = checkoutSettings?.telegramUsername || "";
  const telegramUrl = telegramUsername ? `https://t.me/${telegramUsername}` : "";

  useEffect(() => {
    if (items.length === 0) {
      return;
    }
    setInstagramError(false);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="checkout-page container">
        <h1 className="page-title">Checkout</h1>
        <StateMessage
          variant="empty"
          message="Your cart is empty — add items before checkout"
          actionLabel="View Cart"
          onAction={() => navigate("/cart")}
        />
      </div>
    );
  }

  const handleInstagram = () => {
    if (!instagramUrl) {
      setInstagramError(true);
      return;
    }

    setOpeningInstagram(true);
    setInstagramError(false);

    try {
      window.open(instagramUrl, "_blank", "noopener,noreferrer");
    } catch {
      setInstagramError(true);
    } finally {
      setTimeout(() => setOpeningInstagram(false), 1200);
    }
  };

  const handleCopy = async () => {
    const text = buildOrderCopyText(items);
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage("Order details copied");
    } catch {
      setToastMessage("Could not copy — select and copy manually");
    }
  };

  return (
    <div className="checkout-page container">
      <h1 className="page-title">Checkout</h1>
      <p className="checkout-lead">
        Complete your order on Instagram Direct or Telegram. Copy your details below to paste in the DM.
      </p>

      <div className="checkout-layout">
        <div className="checkout-summary">
          <h2 className="checkout-summary-title">Order summary</h2>
          {items.map((line) => (
            <div
              key={`${line.productId}-${line.selectedSize}-${line.selectedColor}`}
              className="checkout-line"
            >
              <span>
                {line.name} ({line.selectedSize}, {line.selectedColor}) × {line.quantity}
              </span>
              <span>{formatPriceWithToman(line.price * line.quantity)}</span>
            </div>
          ))}
          <div className="checkout-total">
            <span>Total</span>
            <span>{formatPriceWithToman(total)}</span>
          </div>
        </div>

        <div className="checkout-actions">
          <button
            type="button"
            className="btn btn-primary"
            disabled={openingInstagram}
            onClick={handleInstagram}
          >
            {openingInstagram ? "Opening Instagram…" : "Complete Order on Instagram"}
          </button>

          {telegramUrl && (
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="checkout-telegram">
              Or order via Telegram
            </a>
          )}

          <button type="button" className="btn btn-secondary" onClick={handleCopy}>
            Copy order details for DM
          </button>

          <Link to="/how-to-buy" className="checkout-help-link">
            How to Buy — payment & delivery
          </Link>

          {instagramError && (
            <p className="checkout-error" role="alert">
              Could not open Instagram. Try{" "}
              {telegramUrl ? (
                <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
                  Telegram
                </a>
              ) : (
                "Telegram"
              )}{" "}
              or <Link to="/contact">Contact</Link>.
            </p>
          )}
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
