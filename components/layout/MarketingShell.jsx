"use client";

const DefaultLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>
  </svg>
);

function Brand({ brand, colorClass = "" }) {
  const href = brand?.href ?? "/";
  const name = brand?.name ?? "Black Bear Rentals";
  const logo = brand?.logo ?? <DefaultLogo />;
  return (
    <a className={`flg-mkt-logo ${colorClass}`} href={href}>
      <span className="flg-mkt-logo-mark">{logo}</span>
      {name}
    </a>
  );
}

export default function MarketingShell({
  brand,
  nav = [],
  cta,
  announcement,
  footer,
  className = "",
  children,
}) {
  const classes = ["flg-mkt", className].filter(Boolean).join(" ");
  const footerBrand = footer?.brand ?? brand;
  const columns = footer?.columns ?? [];
  const legalLinks = footer?.legalLinks ?? [];
  const copyright = footer?.copyright
    ?? (footerBrand?.name ? `© ${new Date().getFullYear()} ${footerBrand.name}` : null);

  return (
    <div className={classes}>
      {announcement && (
        <div className="flg-mkt-announce" role="region" aria-label="Announcement">
          <div className="flg-container">{announcement}</div>
        </div>
      )}

      <header className="flg-mkt-nav">
        <div className="flg-container flg-mkt-nav-inner">
          <Brand brand={brand} />
          {nav.length > 0 && (
            <ul className="flg-mkt-nav-links">
              {nav.map((item) => (
                <li key={item.key ?? item.href ?? item.label}>
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
          )}
          {cta && <div className="flg-mkt-nav-cta">{cta}</div>}
        </div>
      </header>

      <main className="flg-mkt-body">{children}</main>

      {footer !== null && (
        <footer className="flg-mkt-footer">
          <div className="flg-container">
            <div className="flg-mkt-footer-grid">
              <div className="flg-mkt-footer-brand">
                <Brand brand={footerBrand} />
                {footer?.tagline && <p className="flg-mkt-footer-tagline">{footer.tagline}</p>}
                {footer?.brandExtra}
              </div>
              {columns.map((col, i) => (
                <div key={col.key ?? col.title ?? i} className="flg-mkt-footer-col">
                  <h4>{col.title}</h4>
                  <ul>
                    {(col.links || []).map((link) => (
                      <li key={link.key ?? link.href ?? link.label}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flg-mkt-footer-bottom">
              <div>{copyright}</div>
              {legalLinks.length > 0 && (
                <ul className="flg-mkt-footer-legal">
                  {legalLinks.map((l) => (
                    <li key={l.key ?? l.href ?? l.label}>
                      <a href={l.href}>{l.label}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
