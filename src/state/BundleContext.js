import { createContext, useContext } from "react";

// The shared bundle configuration context + its consumer hook. Kept in this
// component-free module so BundleProvider.jsx can export ONLY a component,
// which keeps React Fast Refresh happy (react-refresh/only-export-components).
export const BundleContext = createContext(null);

export function useBundle() {
  const ctx = useContext(BundleContext);
  if (!ctx) throw new Error("useBundle must be used within a BundleProvider");
  return ctx;
}
