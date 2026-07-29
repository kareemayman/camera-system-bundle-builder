import { useBundle } from "../../state/BundleContext.js";
import { minQuantity, variantIndex } from "../../state/selectors";
import PlusIcon from "../icons/PlusIcon.jsx";
import MinusIcon from "../icons/MinusIcon.jsx";
import styles from "./Stepper.module.css";

// Shared quantity control used by both the product cards and the review lines.
// Bound to a single variant; reads/writes its quantity through the bundle context.
// `mode` selects the visual style: "card" (builder) or "review" (review panel).
export default function Stepper({ variantId, mode = "card" }) {
  const { quantities, increment, decrement } = useBundle();

  const quantity = quantities[variantId] ?? 0;
  const product = variantIndex[variantId]?.product;
  const required = !!product?.required;
  const max = product?.max ?? Infinity;

  // Floor: 0, or 1 for required (the Hub is fixed, so both buttons disable —
  // matching its greyed stepper in the design). Ceiling: a product's `max`
  // (the plan caps at 1 — a subscription is 0-or-1, not a quantity).
  const minusDisabled = required || quantity <= minQuantity(variantId);
  const plusDisabled = required || quantity >= max;

  const className = mode === "review" ? `${styles.stepper} ${styles.review}` : styles.stepper;

  return (
    <div className={className}>
      <button
        type="button"
        className={styles.btn}
        onClick={() => decrement(variantId)}
        disabled={minusDisabled}
        aria-label="Decrease quantity"
      >
        <MinusIcon className={styles.icon} />
      </button>

      <span className={styles.count}>{quantity}</span>

      <button
        type="button"
        className={styles.btn}
        onClick={() => increment(variantId)}
        disabled={plusDisabled}
        aria-label="Increase quantity"
      >
        <PlusIcon className={styles.icon} />
      </button>
    </div>
  );
}
