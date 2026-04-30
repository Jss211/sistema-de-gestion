import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

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

      <div className="flex-1 p-4 pt-16 sm:p-6 sm:pt-6 lg:p-10 overflow-x-hidden">

        {/* Alertas */}
        {showAlert && <WelcomeAlert userName={userName} onClose={() => setShowAlert(false)} />}
        {showLogoutAlert && <LogoutAlert />}

        {/* Hero + Métricas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 items-stretch">
          <HeroSection userName={userName} />
          <MetricsSection />
        </div>

        {/* Beneficios */}
        <BenefitsSection />

        {/* Ofertas especiales */}
        <div className="mt-12">
          <SpecialOffersSection onNavigateToCatalog={() => (window.location.href = "/catalogo")} />
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