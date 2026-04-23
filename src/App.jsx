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

// Configuración de Firebase
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function App() {
  // 1. Estados de la Aplicación
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme") || "dark";
    return savedTheme === "dark";
  });

  const [isAdmin, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(true); // Evita el fallo de redirección en Vercel

  // 2. Lógica de Autenticación y Roles (Corrección principal)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Buscamos el rol del usuario en la colección "usuarios" de Firestore
          const userDoc = await getDoc(doc(db, "usuarios", user.uid));
          if (userDoc.exists() && userDoc.data().role === "admin") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error verificando rol:", error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false); // Ya terminó de verificar, podemos mostrar las rutas
    });

    return () => unsubscribe();
  }, []);

  // 3. Efectos de Interfaz (Título y Dark Mode)
  useEffect(() => {
    const handleVisibilityChange = () => {
      document.title = document.hidden ? "¡Vuelve como a TINDER 🔥" : "TechVault";
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

  // 4. Renderizado condicional mientras carga
  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Cargando TechVault...</div>;
  }

  return (
    <Routes>
      {/* Rutas Públicas/Usuario */}
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

      {/* Rutas Protegidas de Admin */}
      <Route 
        path="/admin/productos" 
        element={isAdmin ? <AgregarProducto /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/admin/usuarios"  
        element={isAdmin ? <Usuarios /> : <Navigate to="/" replace />} 
      />

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
