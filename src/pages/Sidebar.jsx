import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { auth, db } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import AuthModal from "../components/AuthModal";

const DEFAULT_PROFILE = {
  nombre: "Usuario",
  email: "usuario@ejemplo.com",
  photoURL: "",
  rol: "Cliente",
  role: "cliente",
};

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
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

  const isAdminUser = (profile.role || profile.rol)?.toLowerCase() === "admin";

  // Cerrar sidebar al cambiar de ruta en móvil
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Bloquear scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        const saved = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
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
          const { doc: d, getDoc: g } = await import("firebase/firestore");
          const { db: database } = await import("../firebase");
          const snap = await g(d(database, "users", user.uid));
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
    const onLogout = () => setProfile(DEFAULT_PROFILE);
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

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

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
    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
    }`;

  const Badge = ({ count, bg, color = "#fff" }) =>
    count > 0 ? (
      <span style={{ marginLeft: "auto", background: bg, color, borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, flexShrink: 0 }}>
        {count > 99 ? "99+" : count}
      </span>
    ) : null;

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex-shrink-0">
            <CpuChipIcon className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white leading-tight">TechVault</h1>
            <p className="text-slate-500 dark:text-gray-300 text-xs">Sistema de Gestion</p>
          </div>
        </div>

        <p className="text-slate-500 dark:text-gray-400 text-xs mb-2 tracking-wide">NAVEGACION</p>

        <nav className="flex flex-col gap-0.5">
          <NavLink to="/dashboard" className={getLinkClassName}><HomeIcon className="h-5 w-5 flex-shrink-0" />Inicio</NavLink>
          <NavLink to="/catalogo" className={getLinkClassName}><BriefcaseIcon className="h-5 w-5 flex-shrink-0" />Catalogo</NavLink>
          <NavLink to="/estadisticas" className={getLinkClassName}><ChartBarIcon className="h-5 w-5 flex-shrink-0" />Estadisticas</NavLink>
          <NavLink to="/carrito" className={getLinkClassName}>
            <ShoppingCartIcon className="h-5 w-5 flex-shrink-0" />Carrito
            <Badge count={cartCount} bg="#2563eb" />
          </NavLink>
          <NavLink to="/mis-pedidos" className={getLinkClassName}><DocumentTextIcon className="h-5 w-5 flex-shrink-0" />Mis pedidos</NavLink>
          <NavLink to="/favoritos" className={getLinkClassName}>
            <BookmarkIcon className="h-5 w-5 flex-shrink-0" />Favoritos
            <Badge count={favCount} bg="#ef4444" />
          </NavLink>
          <NavLink to="/notificaciones" className={getLinkClassName}>
            <BellIcon className="h-5 w-5 flex-shrink-0" />Notificaciones
            <Badge count={notifCount} bg="#f59e0b" color="#000" />
          </NavLink>
          <NavLink to="/mi-perfil" className={getLinkClassName}><UserIcon className="h-5 w-5 flex-shrink-0" />Mi perfil</NavLink>
          <NavLink to="/soporte" className={getLinkClassName}><LightBulbIcon className="h-5 w-5 flex-shrink-0" />Soporte</NavLink>

          {isAdminUser && (
            <>
              <p className="text-slate-400 dark:text-gray-500 text-xs mt-3 mb-1 tracking-wide px-1">ADMINISTRACIÓN</p>
              <NavLink to="/admin/productos" className={getLinkClassName}><PlusCircleIcon className="h-5 w-5 flex-shrink-0" />Agregar producto</NavLink>
              <NavLink to="/admin/usuarios" className={getLinkClassName}><UsersIcon className="h-5 w-5 flex-shrink-0" />Usuarios</NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-200 text-slate-800 text-sm hover:bg-slate-300 dark:bg-[#0b1326] dark:text-white dark:hover:bg-[#0f2136] transition">
          {theme === "dark" ? <LightBulbIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>

        {firebaseUser ? (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-200 border border-slate-300 dark:bg-[#0b1326] dark:border-gray-700/50">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg flex-shrink-0">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt={profile.nombre} className="w-full h-full object-cover" style={{ borderRadius: "50%" }} />
              ) : (
                <span className="text-white text-sm font-bold">{profile.nombre?.charAt(0)?.toUpperCase() || "U"}</span>
              )}
            </div>
            <div className="flex flex-col flex-1 min-w-0 px-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">{profile.nombre || "Usuario"}</span>
              <span className="text-xs text-slate-600 dark:text-gray-400 truncate">{profile.rol || "Cliente"}</span>
            </div>
            <button onClick={handleLogout} className="p-1.5 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-700/50 transition-colors flex-shrink-0" title="Cerrar sesion">
              <ArrowRightOnRectangleIcon className="text-slate-500 dark:text-gray-400 h-5 w-5" />
            </button>
          </div>
        ) : (
          <button onClick={() => setShowAuthModal(true)} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold shadow-lg transition-all">
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            Iniciar Sesión
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Botón hamburguesa (solo móvil) ── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-[#0b1326] shadow-lg border border-slate-200 dark:border-slate-700"
        aria-label="Abrir menú"
      >
        <Bars3Icon className="h-6 w-6 text-slate-700 dark:text-white" />
      </button>

      {/* ── Overlay (móvil) ── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Sidebar móvil (drawer) ── */}
      <div className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0a0a0f] dark:to-[#000000] p-5 shadow-2xl border-r border-slate-200 dark:border-slate-800 overflow-y-auto transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Botón cerrar */}
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition" aria-label="Cerrar menú">
          <XMarkIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
        <SidebarContent />
      </div>

      {/* ── Sidebar desktop (fijo) ── */}
      <div className="hidden md:flex w-72 min-h-screen flex-shrink-0 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0a0a0f] dark:to-[#000000] text-slate-900 dark:text-white p-5 shadow-xl border-r border-slate-200 dark:border-slate-800 flex-col justify-between sticky top-0 h-screen overflow-y-auto">
        <SidebarContent />
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
