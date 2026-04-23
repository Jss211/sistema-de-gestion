import { useMemo } from "react";
import Sidebar from "./Sidebar";
import KpiCards from "../components/estadisticas/KpiCards";
import TransaccionesChart from "../components/estadisticas/TransaccionesChart";
import CategoriasChart from "../components/estadisticas/CategoriasChart";
import VentasMensualesChart from "../components/estadisticas/VentasMensualesChart";
import ProductosValorChart from "../components/estadisticas/ProductosValorChart";
import InventarioMensualChart from "../components/estadisticas/InventarioMensualChart";

import {
  getInventario,
  getTransaccionesSemanales,
  getCategorias,
  getVentasMensuales,
  getProductosPorValor,
  getInventarioMensual,
} from "../services/statsService";

export default function Estadisticas() {
  // Carga de datos desde localStorage (o mock si es primera vez)
  const inventario = useMemo(() => getInventario(), []);
  const transacciones = useMemo(() => getTransaccionesSemanales(), []);
  const categorias = useMemo(() => getCategorias(), []);
  const ventasMensuales = useMemo(() => getVentasMensuales(), []);
  const productosValor = useMemo(() => getProductosPorValor(), []);
  const inventarioMensual = useMemo(() => getInventarioMensual(), []);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f5f7fb] dark:bg-[#0f172a] text-slate-900 dark:text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden space-y-6">

        {/* Encabezado */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Análisis de Inventario</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Panel de control con estadísticas y métricas clave
          </p>
        </div>

        {/* KPIs */}
        <KpiCards data={inventario} />

        {/* Transacciones semanales */}
        <TransaccionesChart data={transacciones} />

        {/* Categorías */}
        <CategoriasChart data={categorias} />

        {/* Ventas mensuales */}
        <VentasMensualesChart data={ventasMensuales} />

        {/* Inventario mensual */}
        <InventarioMensualChart data={inventarioMensual} />

        {/* Productos por valor + Productos Críticos */}
        <ProductosValorChart data={productosValor} />

      </div>
    </div>
  );
}
