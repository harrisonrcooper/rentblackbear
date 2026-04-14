"use client";

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function Stepper({
  steps,
  currentStep = 0,
  className = "",
  ...rest
}) {
  if (!Array.isArray(steps) || steps.length === 0) return null;
  const classes = ["flg-stepper", className].filter(Boolean).join(" ");

  return (
    <ol className={classes} {...rest}>
      {steps.map((step, i) => {
        const label = typeof step === "string" ? step : step.label;
        const isCurrent = i === currentStep;
        const isCompleted = i < currentStep;
        const itemClasses = [
          "flg-stepper-item",
          isCurrent ? "flg-stepper-item-current" : "",
          isCompleted ? "flg-stepper-item-completed" : "",
        ].filter(Boolean).join(" ");
        return (
          <>
            <li
              key={`step-${i}`}
              className={itemClasses}
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flg-stepper-dot">
                {isCompleted ? <Check /> : i + 1}
              </div>
              <div className="flg-stepper-label">{label}</div>
            </li>
            {i < steps.length - 1 && (
              <li
                key={`connector-${i}`}
                className="flg-stepper-item-grow"
                aria-hidden="true"
              >
                <div
                  className={
                    "flg-stepper-connector " +
                    (i < currentStep ? "flg-stepper-connector-completed" : "")
                  }
                />
              </li>
            )}
          </>
        );
      })}
    </ol>
  );
}
