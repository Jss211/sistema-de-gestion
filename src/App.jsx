import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import Carrito from "./pages/Carrito";
import Estadisticas from "./pages/Estadisticas";
import Soporte from "./pages/Soporte";
import MiPerfil from "./pages/MiPerfil";
import Favoritos from "./pages/Favoritos";
import MisPedidos from "./pages/MisPedidos";
import Notificaciones from "./pages/Notificaciones";
import AgregarProducto from "./pages/admin/AgregarProducto";
import Usuarios from "./pages/admin/Usuarios";
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    return savedTheme === "dark";
  });

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "¡Vuelve como a TINDER 🔥";
      } else {
        document.title = "TechVault";
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
    return () => window.removeEventListener("theme_changed", handleThemeChange);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/catalogo" element={<Catalogo />} />
      <Route path="/carrito" element={<Carrito />} />
      <Route path="/estadisticas" element={<Estadisticas />} />
      <Route path="/soporte" element={<Soporte />} />
      <Route path="/mi-perfil" element={<MiPerfil />} />
      <Route path="/favoritos" element={<Favoritos />} />
      <Route path="/mis-pedidos" element={<MisPedidos />} />
      <Route path="/notificaciones" element={<Notificaciones />} />
      {/* Rutas solo admin */}
      <Route path="/admin/productos" element={isAdmin ? <AgregarProducto /> : <Navigate to="/" replace />} />
      <Route path="/admin/usuarios"  element={isAdmin ? <Usuarios />         : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

