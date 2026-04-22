import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-200">{payload[0].name}</p>
      <p className="text-sm" style={{ color: payload[0].payload.color }}>
        {payload[0].value}%
      </p>
    </div>
  );
};

export default function CategoriasChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Categorías</h3>
      <p className="text-xs text-slate-500 mb-4">Distribución de productos</p>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              dataKey="valor"
              nameKey="nombre"
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.nombre} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="flex flex-col gap-2 flex-1">
          {data.map((cat) => (
            <div key={cat.nombre} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-sm text-slate-700 dark:text-slate-300">{cat.nombre}</span>
              </div>
              <span className="text-sm font-medium text-slate-500">{cat.valor}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
