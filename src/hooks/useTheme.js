import { useState, useEffect } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(
    () => (localStorage.getItem("theme") || "dark") === "dark"
  );

  useEffect(() => {
    const handler = (e) => {
      const t = e.detail?.theme;
      if (t) setIsDark(t === "dark");
    };
    window.addEventListener("theme_changed", handler);
    return () => window.removeEventListener("theme_changed", handler);
  }, []);

  const t = isDark
    ? {
        pageBg:    "#0f172a",
        cardBg:    "#0d1f3c",
        cardBg2:   "#0a1628",
        border:    "#1e3a5f",
        border2:   "#334155",
        text:      "#f1f5f9",
        textMuted: "#94a3b8",
        textSub:   "#64748b",
        inputBg:   "#0f172a",
        btnHover:  "rgba(37,99,235,0.08)",
        rowHover:  "rgba(255,255,255,0.03)",
      }
    : {
        pageBg:    "#f1f5f9",
        cardBg:    "#ffffff",
        cardBg2:   "#f8fafc",
        border:    "#e2e8f0",
        border2:   "#cbd5e1",
        text:      "#0f172a",
        textMuted: "#475569",
        textSub:   "#64748b",
        inputBg:   "#ffffff",
        btnHover:  "rgba(37,99,235,0.06)",
        rowHover:  "rgba(0,0,0,0.02)",
      };

  return { isDark, t };
}
