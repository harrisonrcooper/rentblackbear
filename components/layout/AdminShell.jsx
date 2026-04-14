"use client";
import { useId } from "react";
import Avatar from "../ui/Avatar";

const ChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const DefaultLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z"/>
  </svg>
);

function NavItemEl({ item, active, onSelect }) {
  const classes = [
    "flg-sb-nav-item",
    active ? "flg-sb-nav-item-active" : "",
  ].filter(Boolean).join(" ");

  const content = (
    <>
      {item.icon}
      <span className="flg-sb-nav-label">{item.label}</span>
      {item.badge !== undefined && <span className="flg-sb-nav-badge">{item.badge}</span>}
      {item.badge === undefined && item.count !== undefined && <span className="flg-sb-nav-count">{item.count}</span>}
    </>
  );

  if (item.href) {
    return (
      <a
        className={classes}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={onSelect ? (e) => onSelect(item, e) : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      aria-current={active ? "page" : undefined}
      onClick={onSelect ? (e) => onSelect(item, e) : undefined}
    >
      {content}
    </button>
  );
}

export default function AdminShell({
  brand,
  sections = [],
  activeKey,
  onNavigate,
  user,
  onUserClick,
  topbar,
  collapsed = false,
  className = "",
  children,
}) {
  const searchId = useId();
  const safeBrand = {
    name: "Tenantory",
    workspaceLabel: null,
    logo: <DefaultLogo />,
    href: "/admin",
    ...(brand || {}),
  };

  const handleNav = (item, e) => {
    if (onNavigate) onNavigate(item, e);
  };

  const breadcrumbs = topbar?.breadcrumbs ?? [];
  const onSearch = topbar?.onSearch;
  const searchPlaceholder = topbar?.searchPlaceholder ?? "Search…";
  const searchKbd = topbar?.searchKbd ?? "⌘K";
  const topbarActions = topbar?.actions;
  const showSearch = topbar?.showSearch !== false;

  return (
    <div className={["flg-shell", collapsed ? "flg-shell-collapsed" : "", className].filter(Boolean).join(" ")}>
      <aside className="flg-sb" aria-label="Primary">
        <a className="flg-sb-brand" href={safeBrand.href}>
          <span className="flg-sb-logo">{safeBrand.logo}</span>
          <span className="flg-sb-brand-text">
            <div className="flg-sb-brand-name">{safeBrand.name}</div>
            {safeBrand.workspaceLabel && (
              <div className="flg-sb-brand-ws">{safeBrand.workspaceLabel}</div>
            )}
          </span>
        </a>

        <nav className="flg-sb-sections" aria-label="Sections">
          {sections.map((section, i) => (
            <div key={section.key ?? section.label ?? i} className="flg-sb-section">
              {section.label && <div className="flg-sb-section-label">{section.label}</div>}
              <ul className="flg-sb-nav">
                {(section.items || []).map((item) => (
                  <li key={item.key ?? item.label}>
                    <NavItemEl
                      item={item}
                      active={item.key === activeKey}
                      onSelect={handleNav}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {user && (
          <div className="flg-sb-user">
            <button
              type="button"
              className="flg-sb-user-card"
              onClick={onUserClick}
              aria-label={user.name ? `Open menu for ${user.name}` : "Open user menu"}
            >
              <Avatar
                src={user.avatarUrl}
                name={user.name}
                initials={user.initials}
                size="md"
                variant="gradient"
              />
              <span className="flg-sb-user-info">
                <span className="flg-sb-user-name">{user.name}</span>
                {user.email && <span className="flg-sb-user-email">{user.email}</span>}
              </span>
              <span className="flg-sb-user-action" aria-hidden="true"><ChevronRight /></span>
            </button>
          </div>
        )}
      </aside>

      <main className="flg-main">
        <header className="flg-topbar">
          <nav className="flg-topbar-breadcrumb" aria-label="Breadcrumb">
            {breadcrumbs.map((c, i) => {
              const isLast = i === breadcrumbs.length - 1;
              return (
                <span key={c.key ?? c.label ?? i} style={{display:"inline-flex",alignItems:"center",gap:8}}>
                  {i > 0 && <ChevronRight />}
                  {c.href && !isLast
                    ? <a href={c.href}>{c.label}</a>
                    : <strong>{c.label}</strong>}
                </span>
              );
            })}
          </nav>
          <div className="flg-topbar-right">
            {showSearch && (
              <label className="flg-topbar-search" htmlFor={searchId}>
                <SearchIcon />
                <input
                  id={searchId}
                  type="search"
                  placeholder={searchPlaceholder}
                  onChange={onSearch ? (e) => onSearch(e.target.value, e) : undefined}
                />
                {searchKbd && <kbd>{searchKbd}</kbd>}
              </label>
            )}
            {topbarActions}
          </div>
        </header>
        <div className="flg-content">{children}</div>
      </main>
    </div>
  );
}
