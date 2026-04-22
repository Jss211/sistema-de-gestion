import CountUp from "../CountUp";

export default function StatsSection() {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-black dark:to-slate-900 p-10 rounded-3xl shadow-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/50">
      <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white mb-6">
        TechVault en numeros
      </h2>
      <div className="flex text-center text-slate-700 dark:text-white/90 flex-wrap gap-6 md:gap-0">
        <div className="flex-1 min-w-[120px]">
          <p className="text-2xl font-bold">+<CountUp to={10000} separator="," duration={2.2} /></p>
          <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Clientes satisfechos</p>
        </div>
        <div className="flex-1 min-w-[120px]">
          <p className="text-2xl font-bold">+<CountUp to={500} separator="," duration={1.8} /></p>
          <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Productos disponibles</p>
        </div>
        <div className="flex-1 min-w-[120px]">
          <p className="text-2xl font-bold"><CountUp to={4.8} duration={1.6} />/5</p>
          <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Calificacion promedio</p>
        </div>
        <div className="flex-1 min-w-[120px]">
          <p className="text-2xl font-bold"><CountUp to={24} duration={1.4} />/7</p>
          <p className="text-sm text-slate-600 dark:text-white/60 mt-1">Soporte al cliente</p>
        </div>
      </div>
    </div>
  );
}
