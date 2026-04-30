import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase"; // Importamos db también
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"; // Importes para Firebase
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"; // Para los botones

// Layout
import Sidebar from "./Sidebar";

// Secciones del dashboard
import HeroSection from "../components/dashboard/HeroSection";
import MetricsSection from "../components/dashboard/MetricsSection";
import BenefitsSection from "../components/dashboard/BenefitsSection";
import GuaranteesSection from "../components/dashboard/GuaranteesSection";
import StatsSection from "../components/dashboard/StatsSection";
import CtaSection from "../components/dashboard/CtaSection";
import { WelcomeAlert, LogoutAlert } from "../components/dashboard/WelcomeAlert";

// Componentes globales
import SpecialOffersSection from "../components/SpecialOffersSection";
import AuthSection from "../components/AuthSection";
import PaymentMethodsSection from "../components/PaymentMethodsSection";

export default function Dashboard() {
  const [userName, setUserName] = useState("Usuario");
  const [showAlert, setShowAlert] = useState(() => Boolean(localStorage.getItem("provider")));
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  // --- NUEVOS ESTADOS PARA PRODUCTOS ---
  const [productos, setProductos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productosPorPagina] = useState(4); 

  // Escuchar cambios de autenticación Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const name = user.displayName || user.email?.split("@")[0] || "Usuario";
        setUserName(name);
      } else {
        setUserName("Usuario");
      }
    });
    return () => unsubscribe();
  }, []);

  // --- NUEVA LÓGICA: TRAER PRODUCTOS DE FIREBASE ---
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductos(docs);
    });
    return () => unsubscribe();
  }, []);

  // --- CÁLCULO DE PAGINACIÓN ---
  const ultimoIndice = currentPage * productosPorPagina;
  const primerIndice = ultimoIndice - productosPorPagina;
  const productosActuales = productos.slice(primerIndice, ultimoIndice);
  const totalPaginas = Math.ceil(productos.length / productosPorPagina);

  // Alerta de logout
  useEffect(() => {
    const handleLogout = () => {
      setShowLogoutAlert(true);
      setTimeout(() => { window.location.href = "/login"; }, 1800);
    };
    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  // Auto-ocultar alerta de bienvenida
  useEffect(() => {
    if (!showAlert) return;
    const timeout = setTimeout(() => setShowAlert(false), 3500);
    return () => clearTimeout(timeout);
  }, [showAlert]);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f5f7fb] dark:bg-[#000000] text-slate-900 dark:text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">

        {/* Alertas */}
        {showAlert && <WelcomeAlert userName={userName} onClose={() => setShowAlert(false)} />}
        {showLogoutAlert && <LogoutAlert />}

        {/* Hero + Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <HeroSection userName={userName} />
          <MetricsSection />
        </div>

        {/* Beneficios */}
        <BenefitsSection />

        {/* Ofertas especiales */}
        <div className="mt-12">
          <SpecialOffersSection onNavigateToCatalog={() => (window.location.href = "/catalogo")} />
        </div>

        {/* --- SECCIÓN NUEVA: PRODUCTOS DE FIREBASE CON PAGINACIÓN --- */}
        <div className="mt-16">
          <h2 className="text-2xl font-black mb-8 px-2">Inventario TechVault 🛡️</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {productosActuales.map((prod) => (
              <div key={prod.id} className="bg-[#0f1115] border border-gray-800 rounded-[24px] p-5">
                <div className="h-40 bg-black rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                  <img src={prod.imageUrl} alt={prod.nombre} className="max-h-full object-contain" />
                </div>
                <h3 className="font-bold text-lg mb-1 truncate">{prod.nombre}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-blue-500 font-black text-xl">${prod.precio}</span>
                  <span className="text-xs text-gray-500 font-bold">Stock: {prod.stock}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Botones de Paginación 1, 2, 3... */}
          {productos.length > productosPorPagina && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-30"
              >
                <ChevronLeftIcon className="h-5 w-5 text-white" />
              </button>

              {[...Array(totalPaginas)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-black transition-all ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-900 text-gray-500 border border-gray-800"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                disabled={currentPage === totalPaginas}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 rounded-lg bg-gray-900 border border-gray-800 disabled:opacity-30"
              >
                <ChevronRightIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          )}
        </div>

        {/* Sección de registro (solo si no está autenticado) */}
        <div className="mt-16">
          <AuthSection />
        </div>

        {/* Garantías */}
        <GuaranteesSection />

        {/* Estadísticas */}
        <StatsSection />

        {/* CTA */}
        <CtaSection />

        {/* Métodos de pago */}
        <PaymentMethodsSection />

      </div>
    </div>
  );
}