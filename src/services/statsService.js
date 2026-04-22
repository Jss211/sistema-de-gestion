// ============================================================
// statsService.js
// Capa de datos para estadísticas.
// Actualmente usa localStorage + datos mock.
// Cuando el backend esté listo, solo reemplaza estas funciones.
// ============================================================

const KEYS = {
  VENTAS_MENSUALES: "stats_ventas_mensuales",
  TRANSACCIONES: "stats_transacciones",
  INVENTARIO: "stats_inventario",
  CATEGORIAS: "stats_categorias",
  PRODUCTOS_VALOR: "stats_productos_valor",
};

// ── Datos mock iniciales ──────────────────────────────────────

const MOCK_VENTAS_MENSUALES = [
  { mes: "Ene", ventas: 4500 },
  { mes: "Feb", ventas: 5200 },
  { mes: "Mar", ventas: 4800 },
  { mes: "Abr", ventas: 6100 },
  { mes: "May", ventas: 7400 },
  { mes: "Jun", ventas: 6800 },
  { mes: "Jul", ventas: 7500 },
  { mes: "Ago", ventas: 6900 },
  { mes: "Sep", ventas: 7900 },
  { mes: "Oct", ventas: 8200 },
  { mes: "Nov", ventas: 7600 },
  { mes: "Dic", ventas: 9300 },
];

const MOCK_TRANSACCIONES_SEMANALES = [
  { dia: "Lun", transacciones: 12 },
  { dia: "Mar", transacciones: 15 },
  { dia: "Mié", transacciones: 18 },
  { dia: "Jue", transacciones: 14 },
  { dia: "Vie", transacciones: 20 },
  { dia: "Sáb", transacciones: 9 },
  { dia: "Dom", transacciones: 5 },
];

const MOCK_INVENTARIO = {
  totalProductos: 10,
  stockTotal: 156,
  valorInventario: 41640,
  stockBajo: 4,
  cambios: {
    totalProductos: "+12%",
    stockTotal: "+8%",
    valorInventario: "+15%",
    stockBajo: "-3%",
  },
};

const MOCK_CATEGORIAS = [
  { nombre: "Computadoras", valor: 35, color: "#6366f1" },
  { nombre: "Periféricos", valor: 28, color: "#a855f7" },
  { nombre: "Audio", valor: 15, color: "#06b6d4" },
  { nombre: "Almacenamiento", valor: 12, color: "#22c55e" },
  { nombre: "Red", valor: 10, color: "#f59e0b" },
];

const MOCK_PRODUCTOS_VALOR = [
  { nombre: "Laptop Dell XPS 15", valor: 22200 },
  { nombre: "Auriculares Sony WH-1000XM5", valor: 4800 },
  { nombre: "Mouse Logitech MX Master 3", valor: 4600 },
  { nombre: "Router WiFi 6", valor: 4200 },
  { nombre: "SSD Samsung 1TB", valor: 3900 },
];

const MOCK_INVENTARIO_MENSUAL = [
  { mes: "Ene", vendidos: 145 },
  { mes: "Feb", vendidos: 158 },
  { mes: "Mar", vendidos: 150 },
  { mes: "Abr", vendidos: 195 },
  { mes: "May", vendidos: 215 },
  { mes: "Jun", vendidos: 200 },
  { mes: "Jul", vendidos: 230 },
  { mes: "Ago", vendidos: 210 },
  { mes: "Sep", vendidos: 255 },
  { mes: "Oct", vendidos: 268 },
  { mes: "Nov", vendidos: 240 },
  { mes: "Dic", vendidos: 280 },
];

// ── Helpers ───────────────────────────────────────────────────

function getOrInit(key, defaultValue) {
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(key, JSON.stringify(defaultValue));
  return defaultValue;
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ── API pública del servicio ──────────────────────────────────

export function getVentasMensuales() {
  return getOrInit(KEYS.VENTAS_MENSUALES, MOCK_VENTAS_MENSUALES);
}

export function getTransaccionesSemanales() {
  return getOrInit(KEYS.TRANSACCIONES, MOCK_TRANSACCIONES_SEMANALES);
}

export function getInventario() {
  return getOrInit(KEYS.INVENTARIO, MOCK_INVENTARIO);
}

export function getCategorias() {
  return getOrInit(KEYS.CATEGORIAS, MOCK_CATEGORIAS);
}

export function getProductosPorValor() {
  return getOrInit(KEYS.PRODUCTOS_VALOR, MOCK_PRODUCTOS_VALOR);
}

export function getInventarioMensual() {
  return getOrInit("stats_inventario_mensual", MOCK_INVENTARIO_MENSUAL);
}

// ── Función para registrar una compra (llamar desde el carrito) ──
// Cuando el cliente haga una compra, llama a esta función.
// Actualiza transacciones del día actual y ventas del mes.
export function registrarCompra({ monto = 0, productos = [] }) {
  const dias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const hoy = new Date();
  const diaActual = dias[hoy.getDay()];
  const mesActual = meses[hoy.getMonth()];

  // Actualizar transacciones semanales
  const transacciones = getTransaccionesSemanales();
  const idx = transacciones.findIndex((t) => t.dia === diaActual);
  if (idx !== -1) transacciones[idx].transacciones += 1;
  save(KEYS.TRANSACCIONES, transacciones);

  // Actualizar ventas mensuales
  const ventas = getVentasMensuales();
  const idxMes = ventas.findIndex((v) => v.mes === mesActual);
  if (idxMes !== -1) ventas[idxMes].ventas += monto;
  save(KEYS.VENTAS_MENSUALES, ventas);

  // Actualizar inventario
  const inventario = getInventario();
  inventario.stockTotal = Math.max(0, inventario.stockTotal - productos.length);
  save(KEYS.INVENTARIO, inventario);
}

// ── Reset (útil para desarrollo) ─────────────────────────────
export function resetStats() {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  localStorage.removeItem("stats_inventario_mensual");
}
