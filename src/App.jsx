import productsData from "./data/products.json";
import Step from "./components/Step/Step.jsx";

// TEMPORARY scaffolding to verify the accordion Step in the browser.
// Replaced by the real Builder + ReviewPanel shell later.
export default function App() {
  const { steps } = productsData;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
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
