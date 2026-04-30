import { ChartBarIcon, TruckIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";

const TRUST_BADGES = [
  { label: "4.8/5 Calificacion", icon: ChartBarIcon },
  { label: "Entrega rapida", icon: TruckIcon },
  { label: "100% garantizado", icon: CheckBadgeIcon },
];

export default function HeroSection({ userName }) {
  return (
    <div className="relative group w-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-70 transition duration-500" />
      <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-slate-200 dark:ring-white/10 text-slate-900 dark:text-white min-h-[280px] w-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-[#0a1428] dark:via-[#0b1326] dark:to-[#1e3a8a]" />
        <div className="relative z-10 p-6 flex flex-col justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-700 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-6">
              Bienvenido, {userName}
            </h1>
            <p className="text-slate-700 dark:text-blue-100 text-lg leading-relaxed mb-6">
              En <strong className="text-slate-900 dark:text-white">TechVault</strong> encontraras
              productos tecnologicos para oficina, hogar y estudio con una experiencia mas clara y profesional.
            </p>
          </div>
          <div className="flex gap-2 flex-nowrap">
            {TRUST_BADGES.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/70 dark:bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/20 flex items-center gap-2 text-sm text-slate-800 dark:text-white hover:bg-white/90 dark:hover:bg-white/20 transition-all duration-300 whitespace-nowrap"
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
