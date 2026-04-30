import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

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

const normalizeRole = (value) => String(value || "").trim().toLowerCase();

async function getUserAdminRole(uid) {
  for (const collectionName of ["users", "usuarios"]) {
    try {
      const snap = await getDoc(doc(db, collectionName, uid));
      if (!snap.exists()) continue;

      const data = snap.data();
      const role = normalizeRole(data.role || data.rol);
      if (role) return role;
    } catch (error) {
      console.error(`Error leyendo ${collectionName}:`, error);
    }
  }

  return "cliente";
}

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    return savedTheme === "dark";
  });
  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const role = await getUserAdminRole(user.uid);
          setIsAdmin(role === "admin");
        } catch (error) {
          console.error("Error verificando rol:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      document.title = document.hidden ? "Vuelve a TechVault" : "TechVault";
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const handleThemeChange = (event) => {
      const nextTheme = event.detail?.theme;
      if (nextTheme) setDarkMode(nextTheme === "dark");
    };
    window.addEventListener("theme_changed", handleThemeChange);
    return () => window.removeEventListener("theme_changed", handleThemeChange);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        Cargando TechVault...
      </div>
    );
  }

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

      <Route
        path="/admin/productos"
        element={isAdmin ? <AgregarProducto /> : <Navigate to="/" replace />}
      />
      <Route
        path="/admin/usuarios"
        element={isAdmin ? <Usuarios /> : <Navigate to="/" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
