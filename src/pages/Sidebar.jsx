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
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthModal from "../components/AuthModal";

const DEFAULT_PROFILE = {
  nombre: "Usuario",
  email: "usuario@ejemplo.com",
  photoURL: "",
  rol: "Cliente",
  role: "cliente",
};

export default function Sidebar() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAdminUser = (profile.role || profile.rol)?.toLowerCase() === "admin";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        // Actualizar perfil con datos de Firebase
        setProfile({
          nombre: user.displayName || user.email?.split('@')[0] || "Usuario",
          email: user.email || "usuario@ejemplo.com",
          photoURL: user.photoURL || "",
          rol: "Cliente",
          role: "cliente",
        });
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
    const updateProfile = () => {
      const saved = localStorage.getItem("userProfile");
      setProfile(saved ? JSON.parse(saved) : DEFAULT_PROFILE);
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
    `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
      isActive
        ? "bg-blue-600 text-white shadow-lg"
        : "text-slate-700 dark:text-slate-200"
    }`;

  return (
    <div className="w-64 min-h-full bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0a0a0f] dark:to-[#000000] text-slate-900 dark:text-white p-6 shadow-xl border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
            <CpuChipIcon className="text-white h-6 w-6" />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">TechVault</h1>
            <p className="text-slate-500 dark:text-gray-300 text-sm">Sistema de Gestion</p>
          </div>
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
          </NavLink>

          <NavLink to="/mis-pedidos" className={getLinkClassName}>
            <DocumentTextIcon className="h-5 w-5" />
            Mis pedidos
          </NavLink>

          <NavLink to="/favoritos" className={getLinkClassName}>
            <BookmarkIcon className="h-5 w-5" />
            Favoritos
          </NavLink>

          <NavLink to="/notificaciones" className={getLinkClassName}>
            <BellIcon className="h-5 w-5" />
            Notificaciones
          </NavLink>

          <NavLink to="/mi-perfil" className={getLinkClassName}>
            <UserIcon className="h-5 w-5" />
            Mi perfil
          </NavLink>

          <NavLink to="/soporte" className={getLinkClassName}>
            <LightBulbIcon className="h-5 w-5" />
            Soporte
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-[#0b1326] dark:text-white dark:hover:bg-[#0f2136] transition"
        >
          {theme === "dark" ? <LightBulbIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </button>

        {firebaseUser ? (
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl bg-slate-200 border border-slate-300 dark:bg-[#0b1326] dark:border-gray-700/50">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg ring-1 ring-white/10 flex-shrink-0">
              {profile.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.nombre}
                  className="w-full h-full object-cover"
                  style={{
                    aspectRatio: "1 / 1",
                    borderRadius: "50%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              ) : (
                <span className="text-white text-lg font-bold">
                  {profile.nombre?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            <div className="flex flex-col flex-1 min-w-0 px-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {profile.nombre || "Usuario"}
              </span>
              <span className="text-xs text-slate-600 dark:text-gray-400 truncate">
                {profile.rol || "Cliente"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-slate-300 dark:hover:bg-gray-700/50 transition-colors group flex-shrink-0 ml-1"
              title="Cerrar sesion"
            >
              <ArrowRightOnRectangleIcon className="text-slate-500 dark:text-gray-400 group-hover:text-slate-800 dark:group-hover:text-white h-5 w-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg transition-all"
          >
            <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
            Iniciar Sesión
          </button>
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
}
