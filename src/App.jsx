import { Toaster } from "react-hot-toast";
import Builder from "./components/Builder/Builder.jsx";
import ReviewPanel from "./components/ReviewPanel/ReviewPanel.jsx";
import styles from "./App.module.css";

// Toasts themed to match the app: white card, Gilroy, 10px radius, soft shadow.
const toastOptions = {
  duration: 3000,
  style: {
    padding: "12px 16px",
    borderRadius: "10px",
    background: "#fff",
    color: "var(--header-color)",
    fontFamily: '"Gilroy-Medium", sans-serif',
    fontSize: "14px",
    boxShadow: "0 8px 24px rgba(17, 17, 17, 0.14)",
  },
  success: {
    iconTheme: { primary: "var(--blue)", secondary: "#fff" },
  },
};

export default function App() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Let&apos;s get started!</h1>
      <div className={styles.shell}>
        <Builder />
        <ReviewPanel />
      </div>
      <Toaster position="top-right" toastOptions={toastOptions} />
    </div>
  );
}
