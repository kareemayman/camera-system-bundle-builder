import { useBundle } from "../../state/BundleContext.js";
import { formatPrice } from "../../state/selectors";
import Stepper from "../Stepper/Stepper.jsx";
import styles from "./ProductCard.module.css";

// The main image, stepper, and pricing all follow the currently active variant.
export default function ProductCard({ product }) {
  const { quantities, activeVariant, selectVariant } = useBundle();

  const selected = product.variants.some((v) => (quantities[v.id] ?? 0) > 0);
  const activeVariantId = activeVariant[product.id];
  const active =
    product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0];
  const hasVariants = product.variants.length > 1;

  const cardClass = selected ? `${styles.card} ${styles.selected}` : styles.card;

  return (
    <article className={cardClass}>
      <div className={styles.media}>
        {product.badge && <span className={styles.badge}>{product.badge}</span>}
        <img src={active.image} alt={product.title} />
      </div>

      <div className={styles.content}>
        <div>
          <h3 className={styles.title}>{product.title}</h3>
          <p className={styles.desc}>
            {product.description}{" "}
            <a className={styles.learnMore} href={product.learnMoreUrl}>
              Learn More
            </a>
          </p>
        </div>

        {hasVariants && (
          <div className={styles.variants}>
            {product.variants.map((variant) => {
              const chipClass =
                variant.id === activeVariantId
                  ? `${styles.chip} ${styles.chipSelected}`
                  : styles.chip;
              return (
                <button
                  key={variant.id}
                  type="button"
                  className={chipClass}
                  onClick={() => selectVariant(product.id, variant.id)}
                >
                  <img className={styles.chipImg} src={variant.image} alt="" />
                  <span className={styles.chipLabel}>{variant.label}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className={styles.priceRow}>
          <Stepper variantId={activeVariantId} />
          <div className={styles.price}>
            {product.compareAtPrice != null && (
              <span className={styles.compare}>{formatPrice(product.compareAtPrice)}</span>
            )}
            <span className={styles.amount}>{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
