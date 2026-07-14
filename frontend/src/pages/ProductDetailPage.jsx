import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { getProductBySlug } from "../api/client";
import Toast from "../components/Toast";
import PersianText from "../components/PersianText";
import ProductDetailSkeleton from "../components/products/ProductDetailSkeleton";
import ProductGallery from "../components/products/ProductGallery";
import RelatedProducts from "../components/products/RelatedProducts";
import VariantPicker from "../components/products/VariantPicker";
import StateMessage from "../components/StateMessage";
import { formatPrice } from "../utils/formatPrice";
import { addCartLine } from "../utils/cartStorage";
import {
  colorsForSize,
  getAddToCartState,
  uniqueSizes,
} from "../utils/variantSelection";

/**
 * Product detail page — gallery, variants, stock-aware add to cart.
 */
export default function ProductDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(false);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const backLink = useMemo(() => {
    const from = location.state?.from;
    if (from?.pathname?.startsWith("/collections/")) {
      return { to: from.pathname, label: "← Back to Collection" };
    }
    return { to: "/products", label: "← Back to Products" };
  }, [location.state]);

  const loadProduct = useCallback(async () => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);
    setNotFound(false);
    setSelectedSize(null);
    setSelectedColor(null);

    try {
      const response = await getProductBySlug(slug);
      if (response.notFound) {
        setProduct(null);
        setNotFound(true);
        return;
      }
      setProduct(response.product);
    } catch {
      setProduct(null);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [slug]);

  const sizes = useMemo(
    () => (product ? uniqueSizes(product.variants) : []),
    [product]
  );

  const colors = useMemo(
    () => (product ? colorsForSize(product.variants, selectedSize) : []),
    [product, selectedSize]
  );

  useEffect(() => {
    if (selectedColor && !colors.includes(selectedColor)) {
      setSelectedColor(null);
    }
  }, [colors, selectedColor]);

  const cartState = useMemo(() => {
    if (!product) {
      return { disabled: true, label: "Add to Cart", stockLabel: null };
    }
    return getAddToCartState({
      productStatus: product.status,
      variants: product.variants,
      selectedSize,
      selectedColor,
    });
  }, [product, selectedSize, selectedColor]);

  const handleAddToCart = () => {
    if (!product || cartState.disabled) {
      return;
    }

    const variant = product.variants.find(
      (item) => item.size === selectedSize && item.color === selectedColor
    );

    addCartLine({
      productId: product.id,
      quantity: 1,
      selectedSize: selectedSize ?? "",
      selectedColor: selectedColor ?? "",
      name: product.name,
      price: product.price,
      slug: product.slug,
      imageUrl: product.images[0] ?? null,
      variantStock: variant?.stock,
    });

    setToastMessage("Added to cart");
  };

  if (loading) {
    return (
      <div className="product-detail-page container">
        <Link to={backLink.to} className="back-link">
          {backLink.label}
        </Link>
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="product-detail-page container">
        <StateMessage
          variant="empty"
          message="Product not found — it may have been removed"
          actionLabel="Back to Products"
          onAction={() => navigate("/products")}
        />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-page container">
        <StateMessage
          variant="error"
          message="Couldn't load this product"
          actionLabel="Try again"
          onAction={loadProduct}
        />
      </div>
    );
  }

  return (
    <div className="product-detail-page container">
      <Link to={backLink.to} className="back-link">
        {backLink.label}
      </Link>

      <div className="product-detail">
        <ProductGallery images={product.images} productName={product.name} />

        <div className="product-info">
          <PersianText as="h1" variant="heading">
            {product.name}
          </PersianText>
          <p className="product-price">{formatPrice(product.price)}</p>

          <VariantPicker
            sizes={sizes}
            colors={colors}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            onSizeChange={setSelectedSize}
            onColorChange={setSelectedColor}
          />

          {cartState.stockLabel && (
            <p className={`stock-badge ${cartState.stockLabel === "Sold out" ? "sold-out" : ""}`}>
              {cartState.stockLabel}
            </p>
          )}

          <button
            type="button"
            className="btn btn-primary add-to-cart-btn"
            disabled={cartState.disabled}
            onClick={handleAddToCart}
          >
            {cartState.label}
          </button>

          {product.description && (
            <PersianText as="p" className="product-desc">
              {product.description}
            </PersianText>
          )}
        </div>
      </div>

      <RelatedProducts productSlug={product.slug} />

      {toastMessage && (
        <Toast message={toastMessage} onDismiss={() => setToastMessage(null)} />
      )}
    </div>
  );
}
