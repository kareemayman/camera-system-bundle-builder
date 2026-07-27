import productsData from "../../data/products.json";
import Step from "../Step/Step.jsx";
import styles from "./Builder.module.css";

// Left column: the 4-step accordion, rendered from the data.
export default function Builder() {
  const { steps } = productsData;

  return (
    <div className={styles.builder}>
      {steps.map((step, i) => (
        <Step
          key={step.id}
          step={step}
          totalSteps={steps.length}
          nextStep={steps[i + 1] ?? null}
        />
      ))}
    </div>
  );
}
