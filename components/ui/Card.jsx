"use client";

export function Card({ className = "", children, ...rest }) {
  const classes = ["flg-card", className].filter(Boolean).join(" ");
  return <div className={classes} {...rest}>{children}</div>;
}

export function CardHead({ title, subtitle, actions, className = "", children, ...rest }) {
  const classes = ["flg-card-head", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children ?? (
        <>
          <div>
            {title && <h3 className="flg-card-title">{title}</h3>}
            {subtitle && <div className="flg-card-subtitle">{subtitle}</div>}
          </div>
          {actions && <div className="flg-card-head-actions">{actions}</div>}
        </>
      )}
    </div>
  );
}

export function CardBody({ flush = false, className = "", children, ...rest }) {
  const classes = [
    "flg-card-body",
    flush ? "flg-card-body-flush" : "",
    className,
  ].filter(Boolean).join(" ");
  return <div className={classes} {...rest}>{children}</div>;
}

export function CardFoot({ className = "", children, ...rest }) {
  const classes = ["flg-card-foot", className].filter(Boolean).join(" ");
  return <div className={classes} {...rest}>{children}</div>;
}

export default Card;
