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
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase";
import AuthModal from "../components/AuthModal";

const DEFAULT_PROFILE = {
  nombre: "Usuario",
  email: "usuario@ejemplo.com",
  photoURL: "",
  rol: "Cliente",
  role: "cliente",
};

const normalizeRole = (value) => String(value || "").trim().toLowerCase();

async function getUserRole(uid) {
  for (const collectionName of ["users", "usuarios"]) {
    try {
      const snap = await getDoc(doc(db, collectionName, uid));
      if (!snap.exists()) continue;

      const data = snap.data();
      const role = normalizeRole(data.role || data.rol);
      if (role) return role;
    } catch {}
  }

  return "cliente";
}

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [cartCount, setCartCount] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
      return cart.reduce((acc, item) => acc + (item.cantidad || item.quantity || 1), 0);
    } catch {
      return 0;
    }
  });
  const [favCount, setFavCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("techvault_favoritos") || "[]").length;
    } catch {
      return 0;
    }
  });
  const [notifCount, setNotifCount] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("techvault_notifs") || "[]").filter((n) => !n.read).length;
    } catch {
      return 0;
    }
  });
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAdminUser = normalizeRole(profile.role || profile.rol) === "admin";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setProfile(DEFAULT_PROFILE);
        return;
      }

      const saved = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
      const role = await getUserRole(user.uid);
      const nextProfile = {
        nombre: saved.nombre || user.displayName || "Usuario",
        email: user.email || "usuario@ejemplo.com",
        photoURL: saved.photoURL || user.photoURL || "",
        rol: role === "admin" ? "Admin" : "Cliente",
        role,
      };

      setProfile(nextProfile);
      localStorage.setItem("userProfile", JSON.stringify(nextProfile));
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
      if (!user) return;

      const saved = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
      const role = await getUserRole(user.uid);

      setProfile({
        nombre: saved.nombre || user.displayName || "Usuario",
        email: user.email || "",
        photoURL: saved.photoURL || user.photoURL || "",
        rol: role === "admin" ? "Admin" : "Cliente",
        role,
      });
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
        const cart = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
        setCartCount(cart.reduce((acc, item) => acc + (item.cantidad || item.quantity || 1), 0));
      } catch {
        setCartCount(0);
      }
    };

    const updateFavs = () => {
      try {
        setFavCount(JSON.parse(localStorage.getItem("techvault_favoritos") || "[]").length);
      } catch {
        setFavCount(0);
      }
    };

    const updateNotifs = () => {
      try {
        setNotifCount(JSON.parse(localStorage.getItem("techvault_notifs") || "[]").filter((n) => !n.read).length);
      } catch {
        setNotifCount(0);
      }
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
      console.error("Error al cerrar sesion:", error);
    }
  };

  const getLinkClassName = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-medium transition ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800"
    }`;

  const Badge = ({ count, bg, color = "#fff" }) =>
    count > 0 ? (
      <span
        style={{
          marginLeft: "auto",
          background: bg,
          color,
          borderRadius: "999px",
          minWidth: "22px",
          height: "22px",
          padding: "0 6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.72rem",
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {count > 99 ? "99+" : count}
      </span>
    ) : null;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div style={{ flex: 1 }}>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <CpuChipIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight text-slate-900 dark:text-white">TechVault</h1>
            <p className="text-xs text-slate-500 dark:text-gray-300">Sistema de Gestion</p>
          </div>
        </div>

        <p className="mb-2 px-1 text-sm tracking-wide text-slate-500 dark:text-gray-400">NAVEGACION</p>

        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" className={getLinkClassName}>
            <HomeIcon className="h-5 w-5 flex-shrink-0" />
            Inicio
          </NavLink>
          <NavLink to="/catalogo" className={getLinkClassName}>
            <BriefcaseIcon className="h-5 w-5 flex-shrink-0" />
            Catalogo
          </NavLink>
          <NavLink to="/estadisticas" className={getLinkClassName}>
            <ChartBarIcon className="h-5 w-5 flex-shrink-0" />
            Estadisticas
          </NavLink>
          <NavLink to="/carrito" className={getLinkClassName}>
            <ShoppingCartIcon className="h-5 w-5 flex-shrink-0" />
            Carrito
            <Badge count={cartCount} bg="#2563eb" />
          </NavLink>
          <NavLink to="/mis-pedidos" className={getLinkClassName}>
            <DocumentTextIcon className="h-5 w-5 flex-shrink-0" />
            Mis pedidos
          </NavLink>
          <NavLink to="/favoritos" className={getLinkClassName}>
            <BookmarkIcon className="h-5 w-5 flex-shrink-0" />
            Favoritos
            <Badge count={favCount} bg="#ef4444" />
          </NavLink>
          <NavLink to="/notificaciones" className={getLinkClassName}>
            <BellIcon className="h-5 w-5 flex-shrink-0" />
            Notificaciones
            <Badge count={notifCount} bg="#f59e0b" color="#000" />
          </NavLink>
          <NavLink to="/mi-perfil" className={getLinkClassName}>
            <UserIcon className="h-5 w-5 flex-shrink-0" />
            Mi perfil
          </NavLink>
          <NavLink to="/soporte" className={getLinkClassName}>
            <LightBulbIcon className="h-5 w-5 flex-shrink-0" />
            Soporte
          </NavLink>

          {isAdminUser && (
            <>
              <p className="mb-1 mt-3 px-1 text-sm tracking-wide text-slate-400 dark:text-gray-500">
                ADMINISTRACION
              </p>
              <NavLink to="/admin/productos" className={getLinkClassName}>
                <PlusCircleIcon className="h-5 w-5 flex-shrink-0" />
                Agregar producto
              </NavLink>
              <NavLink to="/admin/usuarios" className={getLinkClassName}>
                <UsersIcon className="h-5 w-5 flex-shrink-0" />
                Usuarios
              </NavLink>
            </>
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-2 border-t border-slate-200 pt-2 dark:border-slate-800">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 rounded-xl bg-slate-200 px-3 py-2.5 text-sm text-slate-800 transition hover:bg-slate-300 dark:bg-[#0b1326] dark:text-white dark:hover:bg-[#0f2136]"
        >
          {theme === "dark" ? <LightBulbIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>

        {firebaseUser ? (
          <div className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-200 px-3 py-2.5 dark:border-gray-700/50 dark:bg-[#0b1326]">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.nombre}
                  className="h-full w-full object-cover"
                  style={{ borderRadius: "50%" }}
                />
              ) : (
                <span className="text-sm font-bold text-white">
                  {profile.nombre?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col px-1">
              <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                {profile.nombre || "Usuario"}
              </span>
              <span className="truncate text-xs text-slate-600 dark:text-gray-400">
                {profile.rol || "Cliente"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-slate-300 dark:hover:bg-gray-700/50"
              title="Cerrar sesion"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5 text-slate-500 dark:text-gray-400" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            Iniciar sesion
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white shadow-lg md:hidden dark:border-slate-700 dark:bg-[#0b1326]"
        aria-label="Abrir menu"
      >
        <Bars3Icon className="h-6 w-6 text-slate-700 dark:text-white" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 overflow-y-auto border-r border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-5 shadow-2xl transition-transform duration-300 md:hidden dark:border-slate-800 dark:from-[#0a0a0f] dark:to-[#000000] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg transition hover:bg-slate-200 dark:hover:bg-slate-800"
          aria-label="Cerrar menu"
        >
          <XMarkIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
        </button>
        <SidebarContent />
      </div>

      <div className="hidden w-72 flex-shrink-0 self-stretch border-r border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-4 text-slate-900 shadow-xl md:flex dark:border-slate-800 dark:from-[#0a0a0f] dark:to-[#000000] dark:text-white">
        <SidebarContent />
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={() => setShowAuthModal(false)} />
      )}
    </>
  );
}
