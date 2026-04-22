import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      <p className="text-sm text-cyan-500">valor : {payload[0].value.toLocaleString()}</p>
    </div>
  );
};

export default function ProductosValorChart({ data }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-slate-900 dark:text-white">Productos por Valor</h3>
      <p className="text-xs text-slate-500 mb-4">Top 5 productos más valiosos en inventario</p>

      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" strokeOpacity={0.1} />
          <XAxis
            dataKey="nombre"
            tick={{ fontSize: 11 }}
            tickFormatter={(v) => v.length > 15 ? v.slice(0, 15) + "…" : v}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="valor" radius={[6, 6, 0, 0]} fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
