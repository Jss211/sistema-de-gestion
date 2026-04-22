import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      <p className="text-sm text-blue-500">transacciones : {payload[0].value}</p>
    </div>
  );
};

export default function TransaccionesChart({ data }) {
  const total = data.reduce((acc, d) => acc + d.transacciones, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h3 className="font-semibold text-slate-900 dark:text-white">Transacciones Semanales</h3>
          <p className="text-xs text-slate-500">Actividad de la última semana</p>
        </div>
        <span className="text-sm text-slate-500">93 Total</span>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
        <span className="text-xs text-slate-500">Transacciones</span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTrans" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" strokeOpacity={0.1} />
          <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="transacciones"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorTrans)"
            dot={false}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
