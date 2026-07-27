// Pure, data-driven helpers for the bundle builder.
// Everything price-related is DERIVED here from unit prices + quantities — never stored.
import data from "../data/products.json";

export const currency = data.currency;
export const reviewExtras = data.reviewExtras;
export const steps = data.steps;

// Review-panel grouping. Order is fixed and independent of builder step order.
export const CATEGORY_ORDER = ["cameras", "sensors", "accessories", "plan"];
export const CATEGORY_LABELS = {
  cameras: "Cameras",
  sensors: "Sensors",
  accessories: "Accessories",
  plan: "Plan",
};

// Create a lookup table for variantId -> { product, variant, stepId } for O(1) lookups.
export const variantIndex = (() => {
  const idx = {};
  for (const step of steps)
    for (const product of step.products)
      for (const variant of product.variants)
        idx[variant.id] = { product, variant, stepId: step.id };
  return idx;
})();

// --- initial state builders --------------------------------------------------

export function initialQuantities() {
  const q = {};
  for (const step of steps)
    for (const product of step.products)
      for (const variant of product.variants)
        q[variant.id] = variant.initialQuantity ?? 0;
  return q;
}

// The card's stepper binds to the active variant; default to each product's first.
export function initialActiveVariants() {
  const active = {};
  for (const step of steps)
    for (const product of step.products)
      active[product.id] = product.variants[0].id;
  return active;
}

// Lowest quantity a variant may reach (required products can't drop below 1).
export function minQuantity(variantId) {
  return variantIndex[variantId]?.product.required ? 1 : 0;
}

// --- derived selectors -------------------------------------------------------

const round2 = (n) => Math.round(n * 100) / 100;

// Every variant with qty > 0, flattened into review line items.
export function getLineItems(quantities) {
  const items = [];
  for (const step of steps) {
    for (const product of step.products) {
      for (const variant of product.variants) {
        const quantity = quantities[variant.id] ?? 0;
        if (quantity <= 0) continue;
        items.push({
          variantId: variant.id,
          productId: product.id,
          title: product.title,
          label: variant.label,
          image: variant.image,
          category: product.category,
          unitPrice: product.price,
          compareAtPrice: product.compareAtPrice ?? null,
          perMonth: !!product.perMonth,
          required: !!product.required,
          quantity,
          lineTotal: round2(product.price * quantity),
          lineCompareTotal:
            product.compareAtPrice != null
              ? round2(product.compareAtPrice * quantity)
              : null,
        });
      }
    }
  }
  return items;
}

// Line items grouped under review-panel category subheadings (empty groups dropped).
export function groupByCategory(lineItems) {
  return CATEGORY_ORDER.map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: lineItems.filter((i) => i.category === category),
  })).filter((group) => group.items.length > 0);
}

// "N selected" per step = distinct products with at least one variant chosen.
export function getStepCounts(quantities) {
  const counts = {};
  for (const step of steps) {
    let n = 0;
    for (const product of step.products)
      if (product.variants.some((v) => (quantities[v.id] ?? 0) > 0)) n++;
    counts[step.id] = n;
  }
  return counts;
}

// One-time hardware total, pre-discount total, savings, and the monthly plan.
// Free shipping's compare-at is folded into savings, matching the design's rows.
export function getTotals(quantities) {
  let subtotal = 0;
  let compareAtSubtotal = 0;
  let monthly = 0;

  for (const item of getLineItems(quantities)) {
    if (item.perMonth) {
      monthly += item.unitPrice * item.quantity;
      continue;
    }
    subtotal += item.unitPrice * item.quantity;
    compareAtSubtotal += (item.compareAtPrice ?? item.unitPrice) * item.quantity;
  }

  const shipping = reviewExtras.shipping;
  const shippingCompare = shipping.compareAtPrice ?? shipping.price;

  const total = round2(subtotal + shipping.price);
  const compareAtTotal = round2(compareAtSubtotal + shippingCompare);
  const savings = round2(compareAtTotal - total);
  const monthlyFinancing = reviewExtras.financingMonths
    ? round2(total / reviewExtras.financingMonths)
    : 0;

  return {
    subtotal: round2(subtotal),
    total,
    compareAtTotal,
    savings,
    monthly: round2(monthly),
    monthlyFinancing,
  };
}

export function formatPrice(n) {
  return `${currency}${n.toFixed(2)}`;
}
