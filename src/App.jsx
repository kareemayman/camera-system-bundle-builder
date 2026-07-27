import Builder from "./components/Builder/Builder.jsx";
import ReviewPanel from "./components/ReviewPanel/ReviewPanel.jsx";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.shell}>
      <Builder />
      <ReviewPanel />
    </div>
  );
}
