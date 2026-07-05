import { useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";
import { CartIcon, MenuIcon } from "./icons";
import { useSite } from "../context/SiteContext";
import { useCart } from "../hooks/useCart";

const DESKTOP_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/collections", label: "Collections" },
  { to: "/products", label: "Products" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const MOBILE_LINKS = [
  ...DESKTOP_LINKS,
  { to: "/how-to-buy", label: "How to Buy" },
];

/**
 * Sticky storefront header with desktop nav, cart icon, and mobile hamburger.
 * @param {{ menuOpen: boolean, onMenuToggle: () => void, onMenuClose: () => void }} props
 */
export default function Header({ menuOpen, onMenuToggle, onMenuClose }) {
  const { homeSettings } = useSite();
  const { count: cartCount, countIncreased } = useCart();
  const cartAriaLabel =
    cartCount > 0 ? `View cart, ${cartCount} item${cartCount === 1 ? "" : "s"}` : "View cart";
  const menuToggleRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onMenuClose();
        menuToggleRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, onMenuClose]);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to="/" className="logo-link" aria-label="Mashoodwear home" onClick={onMenuClose}>
            <Logo logoUrl={homeSettings?.logoUrl} />
          </Link>

          <nav className="nav" aria-label="Main navigation">
            <ul className="nav-links">
              {DESKTOP_LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => (isActive ? "active" : undefined)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-btn" aria-label={cartAriaLabel} onClick={onMenuClose}>
              <CartIcon />
              {cartCount > 0 && (
                <span className={`cart-badge${countIncreased ? " cart-badge--pop" : ""}`}>
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            <button
              ref={menuToggleRef}
              type="button"
              className="hamburger"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={onMenuToggle}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      <nav
        id="mobile-menu"
        className={`mobile-menu${menuOpen ? " open" : ""}`}
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
      >
        {MOBILE_LINKS.map((link) => (
          <Link key={link.to} to={link.to} end={link.end} onClick={onMenuClose}>
            {link.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
