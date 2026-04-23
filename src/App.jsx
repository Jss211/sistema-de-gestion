import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// ... tus otros imports
import { auth, db } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark" || !("theme" in localStorage);
  });

  // --- NUEVOS ESTADOS ---
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); 

  // Lógica de Autenticación y Rol
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Verificar rol en Firestore (asumiendo que guardas el rol en una colección 'users')
        const docRef = doc(db, "usuarios", currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().rol === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Lógica de Título y Dark Mode (Tu código original está bien aquí)
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

  // Si está cargando la info de Firebase, mostrar un spinner o pantalla vacía
  if (loading) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

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

      {/* Rutas Protegidas */}
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

