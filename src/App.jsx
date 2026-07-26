import productsData from "./data/products.json";
import ProductCard from "./components/ProductCard/ProductCard.jsx";

// TEMPORARY scaffolding to verify the ProductCard frame in the browser.
// Replaced by the real Builder / Step layout later.
export default function App() {
  const cameras = productsData.steps.find((s) => s.id === "cameras");

  return (
    <div style={{ padding: 24, background: "var(--light-blue)", minHeight: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 15,
        }}
      >
        {cameras.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
