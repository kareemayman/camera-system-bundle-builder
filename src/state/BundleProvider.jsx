import { useState } from "react";
import { BundleContext } from "./BundleContext.js";
import {
  initialQuantities,
  initialActiveVariants,
  minQuantity,
  getLineItems,
  groupByCategory,
  getStepCounts,
  getTotals,
  reviewExtras,
  currency,
} from "./selectors";

const STORAGE_KEY = "wyze-bundle-v1";
const DEFAULT_OPEN_STEP = "cameras";

// Read a previously saved system (from "Save my system for later"). Never throws.
function loadSaved() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function BundleProvider({ children }) {
  const saved = loadSaved();

  // Merge saved values over the seed so new products in the data still appear.
  const [quantities, setQuantities] = useState(() => ({
    ...initialQuantities(),
    ...(saved?.quantities ?? {}),
  }));
  const [activeVariant, setActiveVariant] = useState(() => ({
    ...initialActiveVariants(),
    ...(saved?.activeVariant ?? {}),
  }));
  const [openStep, setOpenStep] = useState(saved?.openStep ?? DEFAULT_OPEN_STEP);

  // --- actions ---------------------------------------------------------------

  const setQuantity = (variantId, qty) =>
    setQuantities((prev) => ({
      ...prev,
      [variantId]: Math.max(minQuantity(variantId), qty),
    }));

  const increment = (variantId) =>
    setQuantities((prev) => ({ ...prev, [variantId]: (prev[variantId] ?? 0) + 1 }));

  const decrement = (variantId) =>
    setQuantities((prev) => ({
      ...prev,
      [variantId]: Math.max(minQuantity(variantId), (prev[variantId] ?? 0) - 1),
    }));

  // Selecting a color makes it the active variant; the card's stepper follows it.
  const selectVariant = (productId, variantId) =>
    setActiveVariant((prev) => ({ ...prev, [productId]: variantId }));

  const toggleStep = (stepId) =>
    setOpenStep((prev) => (prev === stepId ? null : stepId));

  // Persist the exact configuration so a reload / return visit restores it.
  const saveForLater = () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ quantities, activeVariant, openStep })
      );
      return true;
    } catch {
      return false;
    }
  };

  // --- derived (recomputed each render; React Compiler handles memoization) ---

  const lineItems = getLineItems(quantities);
  const groups = groupByCategory(lineItems);
  const stepCounts = getStepCounts(quantities);
  const totals = getTotals(quantities);

  const value = {
    // state
    quantities,
    activeVariant,
    openStep,
    // actions
    setQuantity,
    increment,
    decrement,
    selectVariant,
    setOpenStep,
    toggleStep,
    saveForLater,
    // derived
    lineItems,
    groups,
    stepCounts,
    totals,
    // static config
    reviewExtras,
    currency,
  };

  return <BundleContext.Provider value={value}>{children}</BundleContext.Provider>;
}
