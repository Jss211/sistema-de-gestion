import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon, BriefcaseIcon, ChartBarIcon, ShoppingCartIcon,
  DocumentTextIcon, BookmarkIcon, BellIcon, UserIcon,
  LightBulbIcon, CpuChipIcon, PlusCircleIcon, ArrowRightOnRectangleIcon
} from "@heroicons/react/24/outline";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AuthModal from "../components/AuthModal";

export default function Sidebar() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [profile, setProfile] = useState({ nombre: "Usuario", rol: "Cliente" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const saved = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
        setProfile({
          nombre: saved.nombre || user.displayName || "Usuario",
          rol: user.email === "wilfredoederp@gmail.com" ? "Administrador" : (saved.rol || "Cliente")
        });
      }
    });
    return () => unsubscribe();
  }, []);

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