import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./firebase"; // Importamos auth para la seguridad
import { onAuthStateChanged } from "firebase/auth";
import Sidebar from "./pages/Sidebar";
import Dashboard from "./pages/Dashboard";
import Catalogo from "./pages/Catalogo";
import AgregarProducto from "./pages/AgregarProducto";
import Estadisticas from "./pages/Estadisticas";
import Soporte from "./pages/Soporte";
import MiPerfil from "./pages/MiPerfil";
import Carrito from "./pages/Carrito";
// ✅ AGREGAMOS LA IMPORTACIÓN QUE HACÍA FALTA
import Usuarios from "./pages/Usuarios"; 

function App() {
  const [darkMode] = useState(true); // Forzamos dark mode para que coincida con tu diseño negro
  const [user, setUser] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");

    // Escuchamos si el usuario está logueado
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Validación de administrador por correo
  const isAdmin = user?.email === "wilfredoederp@gmail.com";

  return (
    <div className="flex min-h-screen bg-white dark:bg-[#000000] transition-colors duration-300">
      {/* Barra lateral fija */}
      <Sidebar />

      {/* Contenido de la derecha */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalogo" element={<Catalogo />} />
          
          {/* ✅ RUTA PROTEGIDA: Solo admin puede agregar productos */}
          <Route 
            path="/agregar-producto" 
            element={isAdmin ? <AgregarProducto /> : <Navigate to="/" />} 
          />
          
          <Route path="/estadisticas" element={<Estadisticas />} />
          <Route path="/carrito" element={<Carrito />} />
          
          {/* Rutas adicionales de navegación */}
          <Route path="/mis-pedidos" element={<Dashboard />} /> 
          <Route path="/favoritos" element={<Dashboard />} />    
          <Route path="/notificaciones" element={<Dashboard />} /> 
          
          <Route path="/mi-perfil" element={<MiPerfil />} />
          <Route path="/soporte" element={<Soporte />} />

          {/* ✅ RUTA PROTEGIDA: Solo admin puede gestionar usuarios */}
          <Route 
            path="/usuarios" 
            element={isAdmin ? <Usuarios /> : <Navigate to="/" />} 
          />
        
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;