import { useEffect, useRef } from "react";
import { imageSrc } from "../lib/imageUrl";

function ProductModal({ product, index, total, phone, phoneDisplay, onClose, onPrev, onNext }) {
  const closeRef = useRef(null);
  const available = product.available !== false;

  useEffect(() => {
    function handleKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeRef}
          className="product-modal-close"
          onClick={onClose}
          aria-label="Затвори"
        >
          ✕
        </button>

        <div className={available ? "product-modal-image" : "product-modal-image is-sold-out"}>
          {product.image_url ? (
            <img src={imageSrc(product.image_url)} alt={product.name} decoding="async" />
          ) : (
            <div className="product-image-empty">Нема слика</div>
          )}

          {!available && <span className="product-sold-out">Распродадено</span>}

          {total > 1 && (
            <>
              <button
                className="product-modal-nav prev"
                onClick={onPrev}
                aria-label="Претходен производ"
              >
                ‹
              </button>
              <button
                className="product-modal-nav next"
                onClick={onNext}
                aria-label="Следен производ"
              >
                ›
              </button>
            </>
          )}
        </div>

        <div className="product-modal-info">
          <span className="product-modal-category condensed-text">{product.category}</span>

          {product.brand && (
            <span className="product-brand condensed-text">{product.brand}</span>
          )}

          <h3 id="product-modal-title" className="condensed-text">
            {product.name}
          </h3>

          <strong className="product-modal-price condensed-text">
            {Number(product.price).toLocaleString("mk-MK")} €
          </strong>

          <span className={available ? "product-modal-status in-stock" : "product-modal-status"}>
            {available ? "Достапно" : "Распродадено"}
          </span>

          {product.description && (
            <p className="product-modal-description">{product.description}</p>
          )}

          <a className="product-modal-call condensed-text" href={`tel:${phone}`}>
            Јави се: {phoneDisplay}
          </a>

          {total > 1 && (
            <span className="product-modal-count">
              {index + 1} / {total}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
