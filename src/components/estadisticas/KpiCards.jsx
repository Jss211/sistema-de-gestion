import { CubeIcon, ShoppingCartIcon, CurrencyDollarIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const cards = (data) => [
  {
    label: "Total Productos",
    value: data.totalProductos,
    cambio: data.cambios.totalProductos,
    icon: CubeIcon,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    trend: data.cambios.totalProductos.startsWith("+") ? "↑" : "↓",
  },
  {
    label: "Stock Total",
    value: data.stockTotal,
    cambio: data.cambios.stockTotal,
    icon: ShoppingCartIcon,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-900/20",
    trend: data.cambios.stockTotal.startsWith("+") ? "↑" : "↓",
  },
  {
    label: "Valor Inventario",
    value: `$${data.valorInventario.toLocaleString()}`,
    cambio: data.cambios.valorInventario,
    icon: CurrencyDollarIcon,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    trend: data.cambios.valorInventario.startsWith("+") ? "↑" : "↓",
  },
  {
    label: "Stock Bajo",
    value: data.stockBajo,
    cambio: data.cambios.stockBajo,
    icon: ExclamationTriangleIcon,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    trend: data.cambios.stockBajo.startsWith("+") ? "↑" : "↓",
  },
];

export default function KpiCards({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards(data).map(({ label, value, cambio, icon: Icon, color, bg, trend }) => {
        const isPositive = cambio.startsWith("+");
        return (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-500">{label}</span>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-0">{value}</p>
            <p className={`text-sm mt-1 flex items-center gap-1 ${isPositive ? "text-green-500" : "text-red-500"}`}>
              <span>{trend}</span>
              {cambio}
            </p>
          </div>
        );
      })}
    </div>
  );
}
