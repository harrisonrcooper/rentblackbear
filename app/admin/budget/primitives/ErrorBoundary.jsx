"use client";

// Catches render errors anywhere under it and shows a recoverable
// fallback instead of a white screen. Drops a stack trace into the
// console so dev still sees what blew up.

import { Component } from "react";

import { COLORS, FONT, btnStyle } from "../lib/tokens";
import { Icon, ICON } from "../lib/icons";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("[BudgetClient ErrorBoundary]", error, info);
  }
  reset = () => this.setState({ error: null });
  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      return (
        <main role="alert" style={{
          minHeight: "100vh", display: "grid", placeItems: "center",
          background: COLORS.bg, color: COLORS.text, fontFamily: FONT, padding: 32,
        }}>
          <div style={{
            maxWidth: 480, textAlign: "center",
            background: COLORS.surface, border: `1px solid ${COLORS.border}`,
            borderRadius: 18, padding: 32,
            boxShadow: "0 1px 2px rgba(15,23,41,0.04)",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, margin: "0 auto 18px",
              background: COLORS.redBg, color: COLORS.red,
              display: "grid", placeItems: "center",
            }}>
              <Icon d={ICON.x} size={28} />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 6 }}>
              Something broke
            </h1>
            <p style={{ color: COLORS.textMuted, fontSize: 13.5, lineHeight: 1.5, marginBottom: 20 }}>
              {msg}
            </p>
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={this.reset} style={btnStyle("primary")}>Try again</button>
              <button onClick={() => window.location.reload()} style={btnStyle("ghost")}>Reload page</button>
            </div>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
