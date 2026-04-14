"use client";

const DefaultLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

// Workspace defaults used when Clerk/Supabase have not supplied one.
// Swap any of these via the `workspace.brand` prop.
const DEFAULT_WORKSPACE = {
  name: "Workspace",
  tagline: "Tenant Portal",
  logo: <DefaultLogo />,
  brand: {
    brand: "#1e6f47",
    brandDark: "#144d31",
    brandDarker: "#0e3822",
    brandBright: "#2a8f5e",
    accent: "#c7843b",
  },
};

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function buildBrandStyle(brand) {
  if (!brand) return undefined;
  const map = {
    brand: "--flg-ws-brand",
    brandDark: "--flg-ws-brand-dark",
    brandDarker: "--flg-ws-brand-darker",
    brandBright: "--flg-ws-brand-bright",
    accent: "--flg-ws-accent",
  };
  const style = {};
  for (const [k, cssVar] of Object.entries(map)) {
    if (brand[k]) style[cssVar] = brand[k];
  }
  return Object.keys(style).length ? style : undefined;
}

export default function PortalShell({
  workspace,
  nav = [],
  activeKey,
  onNavigate,
  user,
  onBellClick,
  onAccountClick,
  notificationCount = 0,
  footer,
  brandHref = "/portal",
  className = "",
  children,
}) {
  const ws = {
    ...DEFAULT_WORKSPACE,
    ...(workspace || {}),
    brand: { ...DEFAULT_WORKSPACE.brand, ...(workspace?.brand || {}) },
  };
  const brandStyle = buildBrandStyle(ws.brand);

  const classes = ["flg-portal", className].filter(Boolean).join(" ");

  const showFooter = footer !== null;
  const footerLinks = footer?.links ?? [];
  const footerCopyright = footer?.copyright
    ?? (ws?.name ? `© ${new Date().getFullYear()} ${ws.name}` : null);

  return (
    <div className={classes} style={brandStyle}>
      <header className="flg-portal-topbar">
        <a className="flg-portal-brand" href={brandHref}>
          <span className="flg-portal-logo">{ws.logo || <DefaultLogo />}</span>
          <span style={{minWidth:0}}>
            <div className="flg-portal-brand-name">{ws.name}</div>
            {ws.tagline && <div className="flg-portal-brand-sub">{ws.tagline}</div>}
          </span>
        </a>

        {nav.length > 0 && (
          <nav aria-label="Portal sections">
            <ul className="flg-portal-nav">
              {nav.map((item) => {
                const isActive = item.key === activeKey;
                const classes = [
                  "flg-portal-nav-item",
                  isActive ? "flg-portal-nav-item-active" : "",
                ].filter(Boolean).join(" ");
                const content = (
                  <>
                    {item.icon}
                    <span>{item.label}</span>
                  </>
                );
                return (
                  <li key={item.key ?? item.label}>
                    {item.href
                      ? <a className={classes} href={item.href} aria-current={isActive ? "page" : undefined} onClick={onNavigate ? (e) => onNavigate(item, e) : undefined}>{content}</a>
                      : <button type="button" className={classes} aria-current={isActive ? "page" : undefined} onClick={onNavigate ? (e) => onNavigate(item, e) : undefined}>{content}</button>}
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        <div className="flg-portal-right">
          {onBellClick && (
            <button
              type="button"
              className="flg-portal-bell"
              onClick={onBellClick}
              aria-label={notificationCount > 0 ? `Notifications (${notificationCount})` : "Notifications"}
            >
              <BellIcon />
              {notificationCount > 0 && <span className="flg-portal-bell-dot" aria-hidden="true" />}
            </button>
          )}
          {user && (
            <button
              type="button"
              className="flg-portal-account"
              onClick={onAccountClick}
              aria-label={user.name ? `Open account menu for ${user.name}` : "Open account menu"}
            >
              <span className="flg-portal-account-name">{user.name}</span>
              <span className="flg-portal-account-avatar" aria-hidden="true">
                {user.initials ?? getInitials(user.name)}
              </span>
            </button>
          )}
        </div>
      </header>

      <main className="flg-portal-body">{children}</main>

      {showFooter && (
        <footer className="flg-portal-footer">
          <div className="flg-portal-footer-inner">
            <div>{footerCopyright}</div>
            {footerLinks.length > 0 && (
              <ul className="flg-portal-footer-links">
                {footerLinks.map((l) => (
                  <li key={l.key ?? l.href ?? l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}
