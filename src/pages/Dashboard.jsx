import { useEffect, useState } from "react";
import {
  ChartBarIcon,
  CheckBadgeIcon,
  CreditCardIcon,
  DocumentTextIcon,
  InformationCircleIcon,
  LifebuoyIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

import Sidebar from "./Sidebar";
import SpecialOffersSection from "../components/SpecialOffersSection";
import AuthSection from "../components/AuthSection";
import CountUp from "../components/CountUp";
import PaymentMethodsSection from "../components/PaymentMethodsSection";
import GlareHover from "../components/GlareHover";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const TRUST_BADGES = [
  {
    label: "4.8/5 Calificacion",
    icon: ChartBarIcon,
  },
  {
    label: "Entrega rapida",
    icon: TruckIcon,
  },
  {
    label: "100% garantizado",
    icon: CheckBadgeIcon,
  },
];

const BENEFITS = [
  {
    title: "Garantia Extendida",
    description:
      "Todos los productos incluyen garantia de fabrica y cobertura adicional por tiempo limitado.",
    icon: ShieldCheckIcon,
    accent: "green",
  },
  {
    title: "Entrega Rapida",
    description:
      "Pedidos entregados en tiempo reducido para que nunca te quedes sin tecnologia.",
    icon: TruckIcon,
    accent: "blue",
  },
  {
    title: "Pago Seguro",
    description:
      "Aceptamos tarjetas, billeteras digitales y otros metodos con proteccion de pago.",
    icon: CreditCardIcon,
    accent: "purple",
  },
  {
    title: "Soporte 24/7",
    description:
      "Nuestro equipo de soporte esta disponible todo el ano para ayudarte.",
    icon: LifebuoyIcon,
    accent: "orange",
  },
];

const GUARANTEES = [
  {
    title: "Garantia de Satisfaccion",
    description:
      "Si no quedas conforme, puedes gestionar una devolucion dentro del plazo establecido.",
    icon: ShieldCheckIcon,
    accent: "green",
  },
  {
    title: "Productos Originales",
    description:
      "Trabajamos con distribuidores y fabricantes autorizados para cuidar la autenticidad.",
    icon: CheckBadgeIcon,
    accent: "blue",
  },
  {
    title: "Pago Protegido",
    description:
      "Los datos sensibles se procesan con practicas de seguridad y cifrado moderno.",
    icon: CreditCardIcon,
    accent: "purple",
  },
];

const accentClassMap = {
  green: "border-green-200 dark:border-green-500/40 bg-green-50 dark:bg-green-700/10 text-green-600",
  blue: "border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-700/10 text-blue-600",
  purple:
    "border-purple-200 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-700/10 text-purple-600",
  orange:
    "border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-700/10 text-orange-600",
};

export default function Dashboard() {
  const [userName, setUserName] = useState("Usuario");
  const [showAlert, setShowAlert] = useState(() =>
    Boolean(localStorage.getItem("provider"))
  );
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usar nombre de Firebase (Google trae displayName, email/pass no)
        const name = user.displayName || user.email?.split("@")[0] || "Usuario";
        setUserName(name);
      } else {
        setUserName("Usuario");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleLogout = () => {
      setShowLogoutAlert(true);

      setTimeout(() => {
        window.location.href = "/login";
      }, 1800);
    };

    window.addEventListener("logout", handleLogout);
    return () => window.removeEventListener("logout", handleLogout);
  }, []);

  useEffect(() => {
    if (!showAlert) return;
    const timeout = setTimeout(() => setShowAlert(false), 3500);
    return () => clearTimeout(timeout);
  }, [showAlert]);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f5f7fb] dark:bg-[#0f172a] text-slate-900 dark:text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">
        {showAlert && (
          <div className="fixed top-4 right-4 max-w-xs w-full z-50">
            <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl shadow-xl overflow-hidden">
              <div className="p-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckBadgeIcon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">
                    Bienvenido, {userName}
                  </div>
                  <div className="text-green-100 text-xs">
                    Explora nuestro catalogo tecnologico.
                  </div>
                </div>

                <button
                  onClick={() => setShowAlert(false)}
                  className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
                >
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {showLogoutAlert && (
          <div className="fixed top-5 right-5 bg-blue-600/20 border border-blue-400 text-blue-200 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fadeIn z-50">
            <InformationCircleIcon className="h-5 w-5" />
            <span>Sesion cerrada correctamente</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-70 transition duration-500"></div>

            <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 text-slate-900 dark:text-white h-[280px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-[#0a1428] dark:via-[#0b1326] dark:to-[#1e3a8a]"></div>

              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-6">
                    Bienvenido, {userName}
                  </h1>

                  <p className="text-slate-700 dark:text-blue-100 text-lg leading-relaxed mb-6">
                    En <strong className="text-slate-900 dark:text-white">TechVault</strong> encontraras
                    productos tecnologicos para oficina, hogar y estudio con una
                    experiencia mas clara y profesional.
                  </p>
                </div>

                <div className="flex gap-2.5 flex-wrap justify-center">
                  {TRUST_BADGES.map(({ label, icon: Icon }) => (
                    <div
                      key={label}
                      className="bg-white/70 dark:bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 flex items-center gap-2 text-sm text-slate-800 dark:text-white hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-70 transition duration-500"></div>

            <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 text-slate-900 dark:text-white h-[280px] w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-blue-200 to-indigo-200 dark:from-[#1e3a8a] dark:via-[#3b82f6] dark:to-[#0b1326]"></div>

              <div className="relative z-10 p-6 h-full flex flex-col">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    Nuestras metricas
                  </h2>
                  <p className="text-slate-700 dark:text-blue-200 text-sm">
                    Calidad y confianza en cada compra
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <GlareHover
                    width="100%" height="80px"
                    background="rgba(255,255,255,0.2)"
                    borderColor="rgba(255,255,255,0.3)"
                    borderRadius="1rem"
                    glareColor="#ffffff"
                    glareOpacity={0.25}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={700}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <ChartBarIcon className="h-6 w-6 mb-1 text-yellow-400" />
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-200">Productos top</p>
                    </div>
                  </GlareHover>

                  <GlareHover
                    width="100%" height="80px"
                    background="rgba(255,255,255,0.2)"
                    borderColor="rgba(255,255,255,0.3)"
                    borderRadius="1rem"
                    glareColor="#ffffff"
                    glareOpacity={0.25}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={700}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <DocumentTextIcon className="h-6 w-6 mb-1 text-green-400" />
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-200">Certificados</p>
                    </div>
                  </GlareHover>

                  <GlareHover
                    width="100%" height="80px"
                    background="rgba(255,255,255,0.2)"
                    borderColor="rgba(255,255,255,0.3)"
                    borderRadius="1rem"
                    glareColor="#ffffff"
                    glareOpacity={0.25}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={700}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <ShieldCheckIcon className="h-6 w-6 mb-1 text-blue-300" />
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-200">Garantía</p>
                    </div>
                  </GlareHover>

                  <GlareHover
                    width="100%" height="80px"
                    background="rgba(255,255,255,0.2)"
                    borderColor="rgba(255,255,255,0.3)"
                    borderRadius="1rem"
                    glareColor="#ffffff"
                    glareOpacity={0.25}
                    glareAngle={-30}
                    glareSize={300}
                    transitionDuration={700}
                    style={{ backdropFilter: 'blur(12px)' }}
                  >
                    <div className="flex flex-col items-center justify-center text-center p-3">
                      <UsersIcon className="h-6 w-6 mb-1 text-purple-300" />
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-200">Clientes</p>
                    </div>
                  </GlareHover>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mt-10">Por que elegir TechVault</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          {BENEFITS.map(({ title, description, icon: Icon, accent }) => (
            <div
              key={title}
              className={`bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm text-slate-900 dark:text-white ${accentClassMap[accent]
                .split(" ")
                .filter((className) => className.startsWith("border"))
                .join(" ")}`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${accentClassMap[accent]
                  .split(" ")
                  .filter((className) => className.startsWith("bg-") || className.startsWith("text-"))
                  .join(" ")}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium mt-2">{title}</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <SpecialOffersSection
            onNavigateToCatalog={() => (window.location.href = "/catalogo")}
          />
        </div>

        <AuthSection />

        <h2 className="text-2xl font-bold mt-14 mb-4 text-left">
          Nuestras garantias
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center mb-12">
          {GUARANTEES.map(({ title, description, icon: Icon, accent }) => (
            <div
              key={title}
              className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg max-w-sm w-full border ${accentClassMap[accent]
                .split(" ")
                .filter((className) => className.startsWith("border"))
                .join(" ")}`}
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 mx-auto ${accentClassMap[accent]
                  .split(" ")
                  .filter((className) => className.startsWith("bg-") || className.startsWith("text-"))
                  .join(" ")}`}
              >
                <Icon className="h-7 w-7" />
              </div>
              <h3 className="text-base font-semibold text-center">{title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 text-center">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-black dark:to-slate-900 p-10 rounded-3xl shadow-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/50">
          <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white mb-6">
            TechVault en numeros
          </h2>

          <div className="flex text-center text-slate-700 dark:text-white/90 flex-wrap gap-6 md:gap-0">
            <div className="flex-1 min-w-[120px]">
              <p className="text-2xl font-bold">
                +<CountUp to={10000} separator="," duration={2.2} />
              </p>
              <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Clientes satisfechos</p>
            </div>

            <div className="flex-1 min-w-[120px]">
              <p className="text-2xl font-bold">
                +<CountUp to={500} separator="," duration={1.8} />
              </p>
              <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Productos disponibles</p>
            </div>

            <div className="flex-1 min-w-[120px]">
              <p className="text-2xl font-bold">
                <CountUp to={4.8} duration={1.6} />/5
              </p>
              <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Calificacion promedio</p>
            </div>

            <div className="flex-1 min-w-[120px]">
              <p className="text-2xl font-bold">
                <CountUp to={24} duration={1.4} />/7
              </p>
              <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Soporte al cliente</p>
            </div>
          </div>
        </div>

        <div className="mt-14 p-10 rounded-3xl shadow-xl border border-blue-100 bg-white text-center dark:bg-gray-800 dark:text-white dark:border-blue-500/40 mb-10">
          <p className="text-slate-900 dark:text-white text-lg font-semibold">
            Listo para empezar
          </p>

          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            Explora nuestro catalogo completo y encuentra productos tecnologicos
            con una presentacion mas limpia y profesional.
          </p>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => (window.location.href = "/catalogo")}
              className="px-8 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-2xl hover:scale-[1.03] transition cursor-pointer relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              Ver catálogo completo
            </button>
          </div>
        </div>

        <PaymentMethodsSection />
      </div>
    </div>
  );
}
