import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { HomeWelcome } from "./pages/home";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    return savedTheme === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      const nextTheme = event.detail?.theme;
      if (!nextTheme) return;
      setDarkMode(nextTheme === "dark");
    };

    window.addEventListener("theme_changed", handleThemeChange);
    // FIX: estaba "theme_Changed" con C mayúscula — nunca se removía el listener
    return () => window.removeEventListener("theme_changed", handleThemeChange);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/home" element={<HomeWelcome onNavigateToCatalog={() => {}} darkMode={darkMode} />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
