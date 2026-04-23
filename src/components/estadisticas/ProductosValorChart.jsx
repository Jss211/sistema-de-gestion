import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";
import productosData from "../../data/productos.json";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-200">{label}</p>
      <p className="text-sm text-cyan-400">S/ {payload[0].value.toLocaleString()}</p>
    </div>
  );
};

// Productos críticos: sin stock (0) o stock bajo (<=8), usando productos reales
const productosCriticos = [...productosData]
  .filter((p) => p.stock <= 8)
  .sort((a, b) => a.stock - b.stock)
  .slice(0, 8);

export default function ProductosValorChart({ data }) {
  return (
    <>
      {/* Gráfico productos por valor */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Productos por Valor de Inventario</h3>
        <p className="text-xs text-slate-500 mb-4">Top 5 productos más valiosos en stock (precio × unidades)</p>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#3b82f6" strokeOpacity={0.1} />
            <XAxis
              dataKey="nombre"
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => v.length > 15 ? v.slice(0, 15) + "…" : v}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              tickFormatter={(v) => `S/${(v / 1000).toFixed(0)}k`}
              label={{ value: "Valor (S/)", angle: -90, position: "insideLeft", offset: -2, style: { fontSize: 11, fill: "#94a3b8" } }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="valor" radius={[6, 6, 0, 0]} fill="#06b6d4" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Productos Críticos */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white">Productos Críticos</h3>
          <p className="text-xs text-slate-500 mt-0.5">Productos con stock bajo o agotados que requieren atención</p>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {["Producto", "Nombre", "Precio", "Stock", "Estado"].map((h) => (
                <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {productosCriticos.map((prod, idx) => {
              const sinStock = prod.stock === 0;
              return (
                <tr key={prod.id}
                  className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  {/* Imagen */}
                  <td className="px-5 py-3">
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", overflow: "hidden", background: "#e2e8f0" }}>
                      <img src={prod.imagen} alt={prod.nombre}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }} />
                    </div>
                  </td>
                  {/* Nombre */}
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{prod.nombre}</p>
                    <p className="text-xs text-slate-400">{prod.categoria}</p>
                  </td>
                  {/* Precio */}
                  <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-300">
                    S/ {prod.precio.toFixed(2)}
                  </td>
                  {/* Stock */}
                  <td className="px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {prod.stock}
                  </td>
                  {/* Estado */}
                  <td className="px-5 py-3">
                    <span style={{
                      padding: "0.2rem 0.75rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                      background: sinStock ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                      color: sinStock ? "#ef4444" : "#d97706",
                    }}>
                      {sinStock ? "Sin Stock" : "Stock Bajo"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
