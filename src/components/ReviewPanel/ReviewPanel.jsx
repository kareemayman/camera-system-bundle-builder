import toast from "react-hot-toast";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useBundle } from "../../state/BundleContext.js";
import { formatPrice } from "../../state/selectors";
import Stepper from "../Stepper/Stepper.jsx";
import FastShippingIcon from "../icons/FastShippingIcon.jsx";
import styles from "./ReviewPanel.module.css";

// A category section: top border + optional uppercase label + its rows.
function Section({ label, children }) {
  const [parent] = useAutoAnimate();
  return (
    <div className={styles.section} ref={parent}>
      {label && <p className={styles.sectionLabel}>{label}</p>}
      {children}
    </div>
  );
}

// Standard review row (cameras / sensors / accessories): thumbnail + title on
// the left, stepper + line pricing on the right.
function ReviewLine({ item }) {
  return (
    <div className={styles.line}>
      <div className={styles.lineLeft}>
        <img className={styles.thumb} src={item.image} alt={item.title} />
        <span className={styles.lineTitle}>{item.title}</span>
      </div>
      <div className={styles.lineRight}>
        <Stepper variantId={item.variantId} mode="review" />
        <div className={styles.prices}>
          {item.lineCompareTotal != null && (
            <span className={styles.compare}>{formatPrice(item.lineCompareTotal)}</span>
          )}
          <span className={styles.amount}>
            {item.lineTotal === 0 ? "FREE" : formatPrice(item.lineTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

// Plan row: smaller logo, two-tone title, and monthly pricing (no stepper).
function PlanLine({ item }) {
  const [firstWord, ...rest] = item.title.split(" ");
  return (
    <div className={styles.line}>
      <div className={styles.lineLeft}>
        <img className={styles.planLogo} src={item.image} alt="" />
        <span className={styles.planTitle}>
          {firstWord}{rest.length > 0 ? " " : ""}
          <span className={styles.planHighlight}>{rest.join(" ")}</span>
        </span>
      </div>
      <div className={styles.prices}>
        {item.lineCompareTotal != null && (
          <span className={styles.compare}>{formatPrice(item.lineCompareTotal)}/mo</span>
        )}
        <span className={styles.amount}>{formatPrice(item.lineTotal)}/mo</span>
      </div>
    </div>
  );
}

// Fast-shipping row: self-contained icon, label, struck price → FREE (no stepper).
function ShippingLine({ shipping }) {
  return (
    <div className={styles.line}>
      <div className={styles.lineLeft}>
        <FastShippingIcon className={styles.thumbIcon} />
        <span className={styles.lineTitle}>{shipping.label}</span>
      </div>
      <div className={styles.prices}>
        {shipping.compareAtPrice != null && (
          <span className={styles.compare}>{formatPrice(shipping.compareAtPrice)}</span>
        )}
        <span className={styles.amount}>
          {shipping.price === 0 ? "FREE" : formatPrice(shipping.price)}
        </span>
      </div>
    </div>
  );
}

export default function ReviewPanel() {
  const { groups, reviewExtras, totals, saveForLater } = useBundle();
  const [sectionsRef] = useAutoAnimate();

  return (
    <aside className={styles.panel}>
      <p className={styles.eyebrow}>Review</p>

      <div className={styles.content}>
        <div className={styles.lines}>
          <header className={styles.header}>
            <h2 className={styles.title}>Your security system</h2>
            <p className={styles.desc}>
              Review your personalized protection system designed to keep what matters most safe.
            </p>
          </header>

          <div className={styles.sections} ref={sectionsRef}>
            {groups.map((group) => (
              <Section key={group.category} label={group.label}>
                {group.category === "plan"
                  ? group.items.map((item) => <PlanLine key={item.variantId} item={item} />)
                  : group.items.map((item) => <ReviewLine key={item.variantId} item={item} />)}
              </Section>
            ))}

            <Section>
              <ShippingLine shipping={reviewExtras.shipping} />
            </Section>
          </div>
        </div>

        <div className={styles.checkout}>
          <div className={styles.summaryRow}>
            <div className={styles.guarantee}>
              <img
                className={styles.satBadge}
                src={reviewExtras.guaranteeBadge}
                alt={reviewExtras.guarantee}
              />
              <div className={styles.returns}>
                <p className={styles.returnsTitle}>{reviewExtras.returnsTitle}</p>
                <p className={styles.returnsText}>{reviewExtras.returnsText}</p>
              </div>
            </div>
            <div className={styles.totals}>
              <span className={styles.lowAs}>
                as low as {formatPrice(totals.monthlyFinancing)}/mo
              </span>
              <div className={styles.totalPrices}>
                <span className={styles.totalCompare}>{formatPrice(totals.compareAtTotal)}</span>
                <span className={styles.totalAmount}>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>

          <div className={styles.checkoutArea}>
            <p className={styles.congrats}>
              Congrats! You&apos;re saving {formatPrice(totals.savings)} on your security bundle!
            </p>
            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={() => toast.success("Checkout complete! (not really, this is a demo)")}
            >
              Checkout
            </button>
            <button
              type="button"
              className={styles.saveLink}
              onClick={() => {
                saveForLater();
                toast.success("Your system's been saved");
              }}
            >
              Save my system for later
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
