import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useBundle } from "../../state/BundleContext.js";
import ChevronIcon from "../icons/ChevronIcon.jsx";
import StepIcon from "../icons/StepIcon.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import styles from "./Step.module.css";

// One accordion step: eyebrow ("STEP X OF 4"), a clickable header (icon + title
// on the left, "N selected" + chevron on the right), and — when open — the
// product cards plus a "Next: …" button that advances to the following step.
export default function Step({ step, totalSteps, nextStep }) {
  const { openStep, toggleStep, setOpenStep, stepCounts } = useBundle();
  const [parent] = useAutoAnimate();

  const open = openStep === step.id;
  const count = stepCounts[step.id];

  return (
    <section
      ref={parent}
      className={open ? `${styles.step} ${styles.open}` : styles.step}
    >
      <p className={styles.eyebrow}>
        Step {step.step} of {totalSteps}
      </p>

      <button
        type="button"
        className={styles.header}
        onClick={() => toggleStep(step.id)}
        aria-expanded={open}
      >
        <span className={styles.left}>
          <StepIcon name={step.icon} className={styles.icon} />
          <span className={styles.title}>{step.title}</span>
        </span>

        <span className={styles.right}>
          <span className={styles.count}>{count} selected</span>
          <ChevronIcon className={styles.chevron} />
        </span>
      </button>

      {open && (
        <div className={styles.body}>
          <div className={styles.products}>
            {step.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {nextStep && (
            <button
              type="button"
              className={styles.next}
              onClick={() => setOpenStep(nextStep.id)}
            >
              Next: {nextStep.title}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
