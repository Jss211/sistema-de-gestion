import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  ArrowRightOnRectangleIcon,
  ArrowRightStartOnRectangleIcon,
  BellIcon,
  BookmarkIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CpuChipIcon,
  DocumentTextIcon,
  HomeIcon,
  LightBulbIcon,
  MoonIcon,
  PlusCircleIcon,
  ShoppingCartIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AuthModal from "../components/AuthModal";

export default function Sidebar() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [cartCount, setCartCount] = useState(() => {
    try {
      const c = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
      return c.reduce((acc, x) => acc + (x.cantidad || x.quantity || 1), 0);
    } catch { return 0; }
  });
  const [favCount, setFavCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem("techvault_favoritos") || "[]").length; } catch { return 0; }
  });
  const [notifCount, setNotifCount] = useState(() => {
    try { return JSON.parse(localStorage.getItem("techvault_notifs") || "[]").filter(n => !n.read).length; } catch { return 0; }
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profile, setProfile] = useState({ nombre: "Usuario", rol: "Cliente" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const saved = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
        // Leer rol desde Firestore
        let role = "cliente";
        try {
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) {
            const data = snap.data();
            role = (data.role || data.rol || "cliente").trim().toLowerCase();
          }
        } catch {}
        const perfil = {
          nombre: saved.nombre || user.displayName || "Usuario",
          email: user.email || "usuario@ejemplo.com",
          photoURL: saved.photoURL || user.photoURL || "",
          rol: role === "admin" ? "Admin" : "Cliente",
          role,
        };
        setProfile(perfil);
        localStorage.setItem("userProfile", JSON.stringify(perfil));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme);
    window.dispatchEvent(new CustomEvent("theme_changed", { detail: { theme } }));
  }, [theme]);

  useEffect(() => {
    const updateProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const saved = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
        let role = "cliente";
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const { db } = await import("../firebase");
          const snap = await getDoc(doc(db, "users", user.uid));
          if (snap.exists()) role = (snap.data().role || "cliente").trim().toLowerCase();
        } catch {}
        setProfile({
          nombre: saved.nombre || user.displayName || "Usuario",
          email: user.email || "",
          photoURL: saved.photoURL || user.photoURL || "",
          rol: role === "admin" ? "Admin" : "Cliente",
          role,
        });
      }
    };

    const onLogout = () => {
      setProfile(DEFAULT_PROFILE);
    };

    window.addEventListener("profile_updated", updateProfile);
    window.addEventListener("logout", onLogout);

    return () => {
      window.removeEventListener("profile_updated", updateProfile);
      window.removeEventListener("logout", onLogout);
    };
  }, []);

  useEffect(() => {
    const updateCart = () => {
      try {
        const c = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
        setCartCount(c.reduce((acc, x) => acc + (x.cantidad || x.quantity || 1), 0));
      } catch { setCartCount(0); }
    };
    const updateFavs = () => {
      try { setFavCount(JSON.parse(localStorage.getItem("techvault_favoritos") || "[]").length); } catch { setFavCount(0); }
    };
    const updateNotifs = () => {
      try { setNotifCount(JSON.parse(localStorage.getItem("techvault_notifs") || "[]").filter(n => !n.read).length); } catch { setNotifCount(0); }
    };
    window.addEventListener("cart_updated", updateCart);
    window.addEventListener("storage", updateCart);
    window.addEventListener("favoritos_updated", updateFavs);
    window.addEventListener("storage", updateFavs);
    window.addEventListener("notifs_updated", updateNotifs);
    window.addEventListener("storage", updateNotifs);
    return () => {
      window.removeEventListener("cart_updated", updateCart);
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("favoritos_updated", updateFavs);
      window.removeEventListener("storage", updateFavs);
      window.removeEventListener("notifs_updated", updateNotifs);
      window.removeEventListener("storage", updateNotifs);
    };
  }, []);

  const toggleTheme = () => {
    setTheme((previousTheme) => (previousTheme === "dark" ? "light" : "dark"));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("provider");
      localStorage.removeItem("userProfile");
      window.dispatchEvent(new Event("logout"));
      setProfile(DEFAULT_PROFILE);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const getLinkClassName = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive 
        ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
        : "text-slate-400 hover:text-white hover:bg-gray-800"
    }`;

  return (
    <div className="w-64 h-screen sticky top-0 bg-black text-white p-6 border-r border-gray-900 flex flex-col overflow-y-auto z-50">
      {/* Branding */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/20">
          <CpuChipIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight">TechVault</h1>
          <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest">Sistema de Gestión</p>
        </div>

        <p className="text-slate-500 dark:text-gray-400 text-xs mb-4 tracking-wide">NAVEGACION</p>

        <nav className="flex flex-col gap-3">
          <NavLink to="/dashboard" className={getLinkClassName}>
            <HomeIcon className="h-5 w-5" />
            Inicio
          </NavLink>

          <NavLink to="/catalogo" className={getLinkClassName}>
            <BriefcaseIcon className="h-5 w-5" />
            Catalogo
          </NavLink>

          <NavLink to="/estadisticas" className={getLinkClassName}>
            <ChartBarIcon className="h-5 w-5" />
            Estadisticas
          </NavLink>

          <NavLink to="/carrito" className={getLinkClassName}>
            <ShoppingCartIcon className="h-5 w-5" />
            Carrito
            {cartCount > 0 && (
              <span style={{ marginLeft: "auto", background: "#2563eb", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/mis-pedidos" className={getLinkClassName}>
            <DocumentTextIcon className="h-5 w-5" />
            Mis pedidos
          </NavLink>

          <NavLink to="/favoritos" className={getLinkClassName}>
            <BookmarkIcon className="h-5 w-5" />
            Favoritos
            {favCount > 0 && (
              <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>
                {favCount > 99 ? "99+" : favCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/notificaciones" className={getLinkClassName}>
            <BellIcon className="h-5 w-5" />
            Notificaciones
            {notifCount > 0 && (
              <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#000", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>
                {notifCount > 99 ? "99+" : notifCount}
              </span>
            )}
          </NavLink>

          <NavLink to="/mi-perfil" className={getLinkClassName}>
            <UserIcon className="h-5 w-5" />
            Mi perfil
          </NavLink>

          <NavLink to="/soporte" className={getLinkClassName}>
            <LightBulbIcon className="h-5 w-5" />
            Soporte
          </NavLink>

          {/* ── Solo Admin ── */}
          {isAdminUser && (
            <>
              <p className="text-slate-400 dark:text-gray-500 text-xs mt-3 mb-1 tracking-wide px-1">ADMINISTRACIÓN</p>
              <NavLink to="/admin/productos" className={getLinkClassName}>
                <PlusCircleIcon className="h-5 w-5" />
                Agregar producto
              </NavLink>
              <NavLink to="/admin/usuarios" className={getLinkClassName}>
                <UsersIcon className="h-5 w-5" />
                Usuarios
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <nav className="flex flex-col gap-1 flex-1">
        {/* SECCIÓN NAVEGACIÓN */}
        <p className="text-gray-600 text-[10px] font-bold mb-4 tracking-widest uppercase opacity-60 px-2">Navegación</p>
        <NavLink to="/dashboard" className={getLinkClassName}><HomeIcon className="h-5 w-5" /> Inicio</NavLink>
        <NavLink to="/catalogo" className={getLinkClassName}><BriefcaseIcon className="h-5 w-5" /> Catálogo</NavLink>
        <NavLink to="/estadisticas" className={getLinkClassName}><ChartBarIcon className="h-5 w-5" /> Estadísticas</NavLink>
        <NavLink to="/carrito" className={getLinkClassName}><ShoppingCartIcon className="h-5 w-5" /> Carrito</NavLink>
        <NavLink to="/mis-pedidos" className={getLinkClassName}><DocumentTextIcon className="h-5 w-5" /> Mis pedidos</NavLink>
        <NavLink to="/favoritos" className={getLinkClassName}><BookmarkIcon className="h-5 w-5" /> Favoritos</NavLink>
        <NavLink to="/mi-perfil" className={getLinkClassName}><UserIcon className="h-5 w-5" /> Mi perfil</NavLink>
        <NavLink to="/soporte" className={getLinkClassName}><LightBulbIcon className="h-5 w-5" /> Soporte</NavLink>

        {/* --- CAMBIO AQUÍ: Solo tú verás esto --- */}
        {firebaseUser?.email === "wilfredoederp@gmail.com" && (
          <div className="mt-8">
            <p className="text-gray-600 text-[10px] font-bold mb-4 tracking-widest uppercase opacity-60 px-2">Administración</p>
            <NavLink to="/agregar-producto" className={getLinkClassName}><PlusCircleIcon className="h-5 w-5" /> Agregar producto</NavLink>
            <NavLink to="/usuarios" className={getLinkClassName}><UserIcon className="h-5 w-5" /> Usuarios</NavLink>
          </div>
        )}
      </nav>

      {/* Perfil / Iniciar Sesión */}
      <div className="mt-auto pt-6 border-t border-gray-900">
        {firebaseUser ? (
          <div className="flex items-center gap-3 p-3 bg-[#0d0d0d] rounded-2xl border border-gray-800">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-sm font-black text-white">
              {profile.nombre.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{profile.nombre}</p>
              <p className="text-[9px] text-blue-400 font-bold uppercase">{profile.rol}</p>
            </div>
            <button onClick={() => signOut(auth)} className="text-gray-500 hover:text-red-500 transition-colors">
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowAuthModal(true)} 
            className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20"
          >
            Iniciar Sesión
          </button>
        )}
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />}
    </div>
  );
}