import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import productosData from "../../data/productos.json";

// Calcular categorías reales desde los productos
const categoriasReales = () => {
  const COLORS = ["#6366f1", "#a855f7", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444", "#ec4899"];
  const counts = {};
  productosData.forEach((p) => {
    counts[p.categoria] = (counts[p.categoria] || 0) + 1;
  });
  const total = productosData.length;
  return Object.entries(counts).map(([nombre, count], i) => ({
    nombre,
    valor: Math.round((count / total) * 100),
    count,
    color: COLORS[i % COLORS.length],
  }));
};

const data = categoriasReales();

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-200">{payload[0].name}</p>
      <p className="text-sm" style={{ color: payload[0].payload.color }}>
        {payload[0].payload.count} productos · {payload[0].value}%
      </p>
    </div>
  );
};

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, valor }) => {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (valor < 8) return null;
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {valor}%
    </text>
  );
};

export default function CategoriasChart() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Categorías</h3>
      <p className="text-xs text-slate-500 mb-6">Distribución real de productos del catálogo</p>

      <div style={{ display: "flex", alignItems: "center", gap: "2.5rem", flexWrap: "wrap" }}>
        {/* Donut grande */}
        <div style={{ flexShrink: 0 }}>
          <ResponsiveContainer width={260} height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={120}
                dataKey="valor"
                nameKey="nombre"
                paddingAngle={3}
                labelLine={false}
                label={renderLabel}
              >
                {data.map((entry) => (
                  <Cell key={entry.nombre} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Leyenda */}
        <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {data.map((cat) => (
            <div key={cat.nombre} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0.75rem", borderRadius: "10px", background: `${cat.color}12`, border: `1px solid ${cat.color}30` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: cat.color, flexShrink: 0 }} />
                <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">{cat.nombre}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className="text-xs text-slate-400">{cat.count} prods</span>
                <span className="text-sm font-bold" style={{ color: cat.color, minWidth: "36px", textAlign: "right" }}>{cat.valor}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
