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
  const required = !!variantIndex[variantId]?.product.required;

  // Can't go below the floor (0, or 1 for required). Required items are fixed,
  // so both buttons are disabled — matching the greyed Hub stepper in the design.
  const minusDisabled = required || quantity <= minQuantity(variantId);
  const plusDisabled = required;

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
