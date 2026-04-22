import {
  ChartBarIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import GlareHover from "../GlareHover";

const METRICS = [
  { label: "Productos top", icon: ChartBarIcon, color: "text-yellow-400" },
  { label: "Certificados", icon: DocumentTextIcon, color: "text-green-400" },
  { label: "Garantía", icon: ShieldCheckIcon, color: "text-blue-300" },
  { label: "Clientes", icon: UsersIcon, color: "text-purple-300" },
];

const glareProps = {
  width: "100%",
  height: "80px",
  background: "rgba(255,255,255,0.2)",
  borderColor: "rgba(255,255,255,0.3)",
  borderRadius: "1rem",
  glareColor: "#ffffff",
  glareOpacity: 0.25,
  glareAngle: -30,
  glareSize: 300,
  transitionDuration: 700,
  style: { backdropFilter: "blur(12px)" },
};

export default function MetricsSection() {
  return (
    <div className="relative group w-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 rounded-3xl blur opacity-25 group-hover:opacity-70 transition duration-500" />
      <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 text-slate-900 dark:text-white h-[280px] w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-100 via-blue-200 to-indigo-200 dark:from-[#1e3a8a] dark:via-[#3b82f6] dark:to-[#0b1326]" />
        <div className="relative z-10 p-6 h-full flex flex-col">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Nuestras metricas</h2>
            <p className="text-slate-700 dark:text-blue-200 text-sm">Calidad y confianza en cada compra</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {METRICS.map(({ label, icon: Icon, color }) => (
              <GlareHover key={label} {...glareProps}>
                <div className="flex flex-col items-center justify-center text-center p-3">
                  <Icon className={`h-6 w-6 mb-1 ${color}`} />
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-200">{label}</p>
                </div>
              </GlareHover>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
