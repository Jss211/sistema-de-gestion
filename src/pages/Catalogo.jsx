import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import productos from "../data/productos.json";

const METODOS_PAGO = [
  { id: "yape", nombre: "Yape", logo: "data:image/png;base64,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", color: "#6C1D8E" },
  { id: "plin", nombre: "Plin", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN94zsmpdqN7p2ugqBBrPygthpvfIsDB4QJA&s", color: "#00B4D8" },
  { id: "bcp", nombre: "BCP", logo: "https://play-lh.googleusercontent.com/gBpVaCpZsbBrLufT06aRpuLQvsUq1KAZUCEof_ps76mtB8_llJg3xv24mey8I0m3dUE", color: "#004B8D" },
  { id: "bbva", nombre: "BBVA", logo: "https://imgmedia.larepublica.pe/1000x590/larepublica/migration/images/JBEHFO7DIZCKPNLZ65TQHWMGZ4.webp", color: "#004481" },
  { id: "interbank", nombre: "Interbank", logo: "https://bancaporinternet.interbank.pe/static/images/interbank.png", color: "#00A651" },
  { id: "scotiabank", nombre: "Scotiabank", logo: "https://play-lh.googleusercontent.com/bX-2nxLIzRoDZBf_wMVI_VIB8NgnochPebM8aDMGe3wqEYz6dSQZsJjZ4F5j8OMM86S2", color: "#EC111A" },
];

const CATEGORIAS = ["Todos", "Laptops", "PCs", "Mouse", "Monitores", "Accesorios", "Almacenamiento"];

function generarCodigo() {
  return "TV-" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function formatFecha() {
  return new Date().toLocaleString("es-PE", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
}

function getPalette(dark) {
  return dark ? {
    pageBg: "#0f1117", cardBg: "#1e293b", cardBorder: "#334155",
    cardHoverShadow: "0 12px 40px rgba(99,102,241,0.2)", text: "#f1f5f9",
    textMuted: "#94a3b8", textSub: "#64748b", accent: "#6366f1",
    accentLight: "#a78bfa", inputBg: "#1e293b", inputBorder: "#1e293b",
    filterInactive: "#1e293b", filterTextInactive: "#94a3b8",
    modalBg: "#1e293b", modalBorder: "#334155", detailBg: "#1e293b",
    detailPriceBg: "#0f172a", detailText: "#f1f5f9", detailTextMuted: "#94a3b8",
    detailTextSub: "#64748b", cartItemBg: "#0f172a",
    stockColor: (s) => s <= 8 ? "#ef4444" : "#10b981",
    starFilled: "#f59e0b", starEmpty: "#334155", logoFilter: "brightness(1.2)",
  } : {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBorder: "#e2e8f0",
    cardHoverShadow: "0 12px 40px rgba(99,102,241,0.15)", text: "#1e293b",
    textMuted: "#64748b", textSub: "#94a3b8", accent: "#6366f1",
    accentLight: "#7c3aed", inputBg: "#ffffff", inputBorder: "#e2e8f0",
    filterInactive: "#e2e8f0", filterTextInactive: "#475569",
    modalBg: "#ffffff", modalBorder: "#e2e8f0", detailBg: "#f8fafc",
    detailPriceBg: "#f1f5f9", detailText: "#1e293b", detailTextMuted: "#475569",
    detailTextSub: "#94a3b8", cartItemBg: "#f8fafc",
    stockColor: (s) => s <= 8 ? "#ef4444" : "#059669",
    starFilled: "#f59e0b", starEmpty: "#cbd5e1", logoFilter: "none",
  };
}

function Estrellas({ rating = 4.0, total = 128, p }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
      {[1,2,3,4,5].map((i) => (
        <span key={i} style={{ color: i <= Math.round(rating) ? p.starFilled : p.starEmpty, fontSize: "1rem" }}>★</span>
      ))}
      <span style={{ color: p.detailTextMuted, fontSize: "0.8rem" }}>({total} reseñas)</span>
    </div>
  );
}

function ProductCard({ producto, onVerDetalle, onAgregar, p }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ background: p.cardBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${p.cardBorder}`, transition: "transform 0.2s, box-shadow 0.2s", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? p.cardHoverShadow : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagen clickeable con lupa en hover */}
      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => onVerDetalle(producto)}>
        <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
        {producto.badge && (
          <span style={{ position: "absolute", top: "10px", left: "10px", padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: producto.badge === "Nuevo" ? "#10b981" : "#f59e0b", color: "#fff", zIndex: 2 }}>
            {producto.badge}
          </span>
        )}
        {/* ── Lupa en hover ── */}
        <div style={{
          position: "absolute", top: "10px", right: "10px",
          width: "36px", height: "36px", borderRadius: "8px",
          background: "rgba(255,255,255,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
          zIndex: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7"/><line x1="16.5" y1="16.5" x2="22" y2="22"/>
          </svg>
        </div>
      </div>

      <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
        <h3 style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "0.4rem", color: p.text, lineHeight: 1.3 }}>{producto.nombre}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "0.5rem" }}>
          {[1,2,3,4,5].map((i) => (
            <span key={i} style={{ color: i <= 4 ? "#f59e0b" : p.starEmpty, fontSize: "0.95rem" }}>★</span>
          ))}
          <span style={{ color: p.textMuted, fontSize: "0.78rem", marginLeft: "2px" }}>(4.0)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#2563eb" }}>S/ {producto.precio.toFixed(2)}</span>
          <span style={{ fontSize: "0.8rem", color: p.textMuted }}>{producto.stock} disponibles</span>
        </div>
        <button onClick={() => onAgregar(producto)}
          style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#1e3a5f", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}

export default function Catalogo() {
  const [isDark, setIsDark] = useState(() => (localStorage.getItem("theme") || "dark") === "dark");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [productoModal, setProductoModal] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [pasoDetallePago, setPasoDetallePago] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: "", nombre: "", fecha: "", cvv: "" });
  const [usuarioId] = useState("USR-" + Math.random().toString(36).substring(2, 7).toUpperCase());

  useEffect(() => {
    const handler = (e) => { const t = e.detail?.theme; if (t) setIsDark(t === "dark"); };
    window.addEventListener("theme_changed", handler);
    return () => window.removeEventListener("theme_changed", handler);
  }, []);

  const p = getPalette(isDark);

  const productosFiltrados = productos.filter((prod) => {
    const coincideCategoria = categoriaActiva === "Todos" || prod.categoria === categoriaActiva;
    const coincideBusqueda = prod.nombre.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((x) => x.id === producto.id);
      if (existe) return prev.map((x) => x.id === producto.id ? { ...x, cantidad: x.cantidad + 1 } : x);
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setProductoModal(null);
  };

  const quitarDelCarrito = (id) => setCarrito((prev) => prev.filter((x) => x.id !== id));
  const cambiarCantidad = (id, delta) => setCarrito((prev) => prev.map((x) => x.id === id ? { ...x, cantidad: Math.max(1, x.cantidad + delta) } : x));
  const totalCarrito = carrito.reduce((acc, x) => acc + x.precio * x.cantidad, 0);
  const totalItems = carrito.reduce((acc, x) => acc + x.cantidad, 0);

  const confirmarCompra = () => { if (!metodoPago) return alert("Selecciona un método de pago"); setPasoDetallePago(true); };

  const finalizarPago = () => {
    const esYapeOPlin = ["yape", "plin"].includes(metodoPago);
    if (!esYapeOPlin) {
      const { numero, nombre, fecha, cvv } = datosTarjeta;
      if (!numero || !nombre || !fecha || !cvv) return alert("Completa todos los datos de la tarjeta");
    }
    setPasoDetallePago(false);
    setProcesando(true);
    setTimeout(() => {
      setProcesando(false);
      setTicket({ codigo: generarCodigo(), usuarioId, fecha: formatFecha(), productos: [...carrito], total: totalCarrito, metodoPago: METODOS_PAGO.find((m) => m.id === metodoPago)?.nombre });
      setCarrito([]); setMostrarPago(false); setMostrarCarrito(false);
      setMetodoPago(null); setDatosTarjeta({ numero: "", nombre: "", fecha: "", cvv: "" });
    }, 2500);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: p.pageBg }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem", color: p.text, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Catálogo de Productos</h1>
          <p style={{ color: p.textMuted, marginTop: "0.25rem" }}>Encuentra los mejores productos tecnológicos</p>
        </div>

        {/* Búsqueda + botón carrito estilo Falabella */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <span style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: p.textMuted, fontSize: "1.1rem" }}></span>
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar productos..."
              style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.75rem", borderRadius: "12px", border: `1px solid ${p.inputBorder}`, background: p.inputBg, color: p.text, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>

          {/* ── Botón carrito estilo Falabella ── */}
          <button onClick={() => setMostrarCarrito(true)}
            style={{ position: "relative", width: "48px", height: "48px", borderRadius: "12px", background: "transparent", border: `1px solid ${p.cardBorder}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: p.text, transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = p.filterInactive}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {totalItems > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-6px", background: "#6366f1", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, color: "#fff" }}>{totalItems}</span>
            )}
          </button>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {CATEGORIAS.map((cat) => (
            <button key={cat} onClick={() => setCategoriaActiva(cat)}
              style={{ padding: "0.5rem 1.1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s", background: categoriaActiva === cat ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : p.filterInactive, color: categoriaActiva === cat ? "#fff" : p.filterTextInactive }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} onVerDetalle={setProductoModal} onAgregar={agregarAlCarrito} p={p} />
          ))}
        </div>
        {productosFiltrados.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: p.textSub }}>
            <div style={{ fontSize: "3rem" }}>🔍</div>
            <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>No se encontraron productos</p>
          </div>
        )}
      </main>

{/* ── Modal Detalles producto ── */}
{productoModal && (
  <div onClick={() => setProductoModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
    <div onClick={(e) => e.stopPropagation()} style={{ background: "#ffffff", borderRadius: "16px", maxWidth: "780px", width: "100%", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto" }}>
      
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
        <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "1rem" }}>Detalles del Producto</span>
        <button onClick={() => setProductoModal(null)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#64748b", lineHeight: 1 }}>✕</button>
      </div>

      <div style={{ display: "flex", gap: "2rem", padding: "1.5rem", flexWrap: "wrap" }}>
        {/* Imagen */}
        <div style={{ flex: "0 0 auto", width: "320px", maxWidth: "100%" }}>
          <img src={productoModal.imagen} alt={productoModal.nombre} style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "12px" }} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: "220px" }}>
          <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1e293b", marginBottom: "0.5rem" }}>{productoModal.nombre}</h2>

          {/* Estrellas */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "1rem" }}>
            {[1,2,3,4,5].map((i) => (
              <span key={i} style={{ color: i <= 4 ? "#f59e0b" : "#cbd5e1", fontSize: "1.1rem" }}>★</span>
            ))}
            <span style={{ color: "#64748b", fontSize: "0.85rem", marginLeft: "4px" }}>(128 reseñas)</span>
          </div>

          {/* Precio + stock */}
          <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "0.85rem 1rem", marginBottom: "1.25rem", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.4rem" }}>
              <span style={{ color: "#475569", fontWeight: 600, fontSize: "0.9rem" }}>Precio:</span>
              <span style={{ color: "#1e293b", fontWeight: 800, fontSize: "1.05rem" }}>S/ {productoModal.precio.toFixed(2)}</span>
              {productoModal.precioAntes && (
                <span style={{ fontSize: "0.85rem", color: "#94a3b8", textDecoration: "line-through" }}>S/ {productoModal.precioAntes.toFixed(2)}</span>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
              <span style={{ color: "#475569", fontWeight: 600, fontSize: "0.9rem" }}>Disponibilidad:</span>
              <span style={{ color: productoModal.stock <= 8 ? "#ef4444" : "#059669", fontWeight: 700, fontSize: "0.9rem" }}>{productoModal.stock} unidades en stock</span>
            </div>
          </div>

          {/* Descripción */}
          <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Descripción</h3>
          <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.88rem", marginBottom: "1.25rem" }}>{productoModal.descripcion}</p>

          {/* Características */}
          <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Características Destacadas</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "1.75rem" }}>
            {["Alta calidad de construcción","Diseño moderno y elegante","Excelente relación calidad-precio","Garantía del fabricante","Compatible con múltiples dispositivos"].map((c) => (
              <li key={c} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", flexShrink: 0 }}></span>{c}
              </li>
            ))}
          </ul>

          {/* Botones */}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button onClick={() => setProductoModal(null)}
              style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
              Cerrar
            </button>
            <button onClick={() => agregarAlCarrito(productoModal)}
              style={{ flex: 2, padding: "0.75rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
              + Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

      {/* ── Modal Carrito estilo Falabella ── */}
      {mostrarCarrito && (
        <div onClick={() => setMostrarCarrito(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: p.pageBg, borderRadius: "16px", width: "100%", maxWidth: "900px", maxHeight: "88vh", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column" }}>

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.75rem", borderBottom: `1px solid ${p.cardBorder}`, background: p.modalBg }}>
              <h2 style={{ fontWeight: 800, fontSize: "1.2rem", color: p.text, margin: 0 }}>
                Carro <span style={{ fontWeight: 400, color: p.textMuted, fontSize: "1rem" }}>({totalItems} {totalItems === 1 ? "producto" : "productos"})</span>
              </h2>
              <button onClick={() => setMostrarCarrito(false)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: p.textMuted, lineHeight: 1 }}>✕</button>
            </div>

            {carrito.length === 0 ? (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "3rem", color: p.textSub }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem", opacity: 0.4 }}>
                  <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Tu carrito está vacío</p>
                <p style={{ fontSize: "0.88rem", marginTop: "0.5rem" }}>Agrega productos para continuar</p>
              </div>
            ) : (
              <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "row" }}>

                {/* Lista de productos */}
                <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 1.75rem", background: p.pageBg }}>
                  {carrito.map((item) => (
                    <div key={item.id} style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem", background: p.modalBg, borderRadius: "12px", border: `1px solid ${p.cardBorder}`, marginBottom: "0.75rem" }}>
                      <img src={item.imagen} alt={item.nombre} style={{ width: "72px", height: "72px", objectFit: "cover", borderRadius: "10px", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: "0.92rem", color: p.text, marginBottom: "0.2rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.nombre}</p>
                        <p style={{ color: "#6366f1", fontWeight: 800, fontSize: "1rem" }}>S/ {(item.precio * item.cantidad).toFixed(2)}</p>
                        {item.precioAntes && (
                          <p style={{ color: p.textMuted, fontSize: "0.8rem", textDecoration: "line-through" }}>S/ {(item.precioAntes * item.cantidad).toFixed(2)}</p>
                        )}
                      </div>
                      {/* Controles cantidad */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                        <button onClick={() => cambiarCantidad(item.id, -1)}
                          style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1.5px solid ${p.cardBorder}`, background: "transparent", color: p.text, cursor: "pointer", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
                        <span style={{ color: p.text, fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, 1)}
                          style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1.5px solid ${p.cardBorder}`, background: "transparent", color: p.text, cursor: "pointer", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
                        <button onClick={() => quitarDelCarrito(item.id)}
                          style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "0.25rem" }}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Resumen de la orden (derecha) ── */}
                <div style={{ width: "300px", flexShrink: 0, background: p.modalBg, borderLeft: `1px solid ${p.cardBorder}`, padding: "1.5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: p.text, marginBottom: "1.25rem" }}>Resumen de la orden</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ color: p.textMuted, fontSize: "0.9rem" }}>Productos ({totalItems})</span>
                      <span style={{ color: p.text, fontWeight: 600, fontSize: "0.9rem" }}>S/ {totalCarrito.toFixed(2)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                      <span style={{ color: p.textMuted, fontSize: "0.9rem" }}>Envío</span>
                      <span style={{ color: "#10b981", fontWeight: 600, fontSize: "0.9rem" }}>Gratis</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${p.cardBorder}`, paddingTop: "0.75rem", marginTop: "0.25rem", display: "flex", justifyContent: "space-between" }}>
                      <span style={{ color: p.text, fontWeight: 800, fontSize: "1rem" }}>Total:</span>
                      <span style={{ color: "#6366f1", fontWeight: 900, fontSize: "1.15rem" }}>S/ {totalCarrito.toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => { setMostrarCarrito(false); setMostrarPago(true); }}
                    style={{ marginTop: "1.5rem", width: "100%", padding: "0.9rem", borderRadius: "10px", border: "none", background: "#1e293b", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "1rem", letterSpacing: "0.3px" }}>
                    Continuar compra
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Modal Pago: selección método ── */}
      {mostrarPago && !pasoDetallePago && !procesando && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: p.modalBg, borderRadius: "20px", maxWidth: "500px", width: "100%", border: `1px solid ${p.modalBorder}`, padding: "1.5rem" }}>
            <h2 style={{ fontWeight: 800, marginBottom: "0.5rem", color: p.text }}>Método de Pago</h2>
            <p style={{ color: p.textMuted, marginBottom: "1.5rem" }}>Total a pagar: <span style={{ color: p.accentLight, fontWeight: 800 }}>S/ {totalCarrito.toFixed(2)}</span></p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {METODOS_PAGO.map((m) => (
                <button key={m.id} onClick={() => setMetodoPago(m.id)}
                  style={{ padding: "1rem", borderRadius: "12px", border: `2px solid ${metodoPago === m.id ? m.color : p.cardBorder}`, background: metodoPago === m.id ? `${m.color}22` : p.cartItemBg, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <img src={m.logo} alt={m.nombre} style={{ height: "28px", objectFit: "contain", filter: p.logoFilter }} onError={(e) => { e.target.style.display = "none"; }} />
                  <span style={{ color: p.text, fontWeight: 700, fontSize: "0.85rem" }}>{m.nombre}</span>
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setMostrarPago(false)} style={{ flex: 1, padding: "0.8rem", borderRadius: "12px", border: `1px solid ${p.cardBorder}`, background: "transparent", color: p.textMuted, cursor: "pointer", fontWeight: 600 }}>Volver</button>
              <button onClick={confirmarCompra} style={{ flex: 2, padding: "0.8rem", borderRadius: "12px", border: "none", background: metodoPago ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : p.cardBorder, color: "#fff", fontWeight: 800, cursor: metodoPago ? "pointer" : "not-allowed", fontSize: "1rem" }}>
                Continuar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal Detalle de Pago (QR o Tarjeta) ── */}
      {mostrarPago && pasoDetallePago && !procesando && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: p.modalBg, borderRadius: "20px", maxWidth: "460px", width: "100%", border: `1px solid ${p.modalBorder}`, padding: "1.5rem" }}>
            {["yape", "plin"].includes(metodoPago) ? (
              <>
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <h2 style={{ fontWeight: 800, color: p.text, marginBottom: "0.25rem" }}>{metodoPago === "yape" ? "💜 Pagar con Yape" : "🔵 Pagar con Plin"}</h2>
                  <p style={{ color: p.textMuted, fontSize: "0.88rem" }}>Escanea el QR con tu app para completar el pago</p>
                </div>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <div style={{ background: "#fff", padding: "1rem", borderRadius: "12px", border: "2px solid #e2e8f0" }}>
                    <svg width="180" height="180" viewBox="0 0 180 180">
                      <rect width="180" height="180" fill="white"/>
                      <rect x="10" y="10" width="50" height="50" rx="4" fill="none" stroke="#111" strokeWidth="6"/>
                      <rect x="20" y="20" width="30" height="30" rx="2" fill="#111"/>
                      <rect x="120" y="10" width="50" height="50" rx="4" fill="none" stroke="#111" strokeWidth="6"/>
                      <rect x="130" y="20" width="30" height="30" rx="2" fill="#111"/>
                      <rect x="10" y="120" width="50" height="50" rx="4" fill="none" stroke="#111" strokeWidth="6"/>
                      <rect x="20" y="130" width="30" height="30" rx="2" fill="#111"/>
                      {[0,1,2,3,4,5,6].map(row => [0,1,2,3,4,5,6].map(col => {
                        const val = (row * 3 + col * 7 + row * col) % 3;
                        return val === 0 ? <rect key={`${row}-${col}`} x={72 + col * 8} y={72 + row * 8} width="6" height="6" fill="#111"/> : null;
                      }))}
                      <rect x="78" y="78" width="24" height="24" rx="4" fill={metodoPago === "yape" ? "#6C1D8E" : "#00B4D8"}/>
                      <text x="90" y="95" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">{metodoPago === "yape" ? "Y" : "P"}</text>
                    </svg>
                  </div>
                </div>
                <div style={{ background: p.cartItemBg, borderRadius: "10px", padding: "0.75rem 1rem", marginBottom: "1.25rem", textAlign: "center" }}>
                  <p style={{ color: p.textMuted, fontSize: "0.8rem", marginBottom: "0.2rem" }}>Monto a pagar</p>
                  <p style={{ color: p.accentLight, fontWeight: 900, fontSize: "1.4rem" }}>S/ {totalCarrito.toFixed(2)}</p>
                </div>
                <p style={{ color: p.textMuted, fontSize: "0.78rem", textAlign: "center", marginBottom: "1rem" }}>⚠️ QR de demostración.</p>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "1.25rem" }}>
                  <h2 style={{ fontWeight: 800, color: p.text, marginBottom: "0.25rem" }}>💳 Datos de Tarjeta</h2>
                  <p style={{ color: p.textMuted, fontSize: "0.88rem" }}>Ingresa los datos de tu tarjeta para continuar</p>
                </div>
                <div style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderRadius: "14px", padding: "1.25rem 1.5rem", marginBottom: "1.25rem", color: "#fff", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255,255,255,0.08)" }}></div>
                  <p style={{ fontSize: "0.7rem", opacity: 0.7, marginBottom: "0.75rem", letterSpacing: "1px" }}>NÚMERO DE TARJETA</p>
                  <p style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: "3px", marginBottom: "1rem", fontFamily: "monospace" }}>
                    {datosTarjeta.numero ? datosTarjeta.numero.replace(/(.{4})/g, "$1 ").trim() : "•••• •••• •••• ••••"}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: "0.65rem", opacity: 0.7, letterSpacing: "1px" }}>TITULAR</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{datosTarjeta.nombre || "NOMBRE APELLIDO"}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "0.65rem", opacity: 0.7, letterSpacing: "1px" }}>VENCE</p>
                      <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>{datosTarjeta.fecha || "MM/AA"}</p>
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", color: p.textMuted, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Número de tarjeta</label>
                  <input type="text" maxLength={16} placeholder="1234 5678 9012 3456" value={datosTarjeta.numero}
                    onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, numero: e.target.value.replace(/\D/g, "") }))}
                    style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "10px", border: `1px solid ${p.cardBorder}`, background: p.cartItemBg, color: p.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "0.75rem" }}>
                  <label style={{ display: "block", color: p.textMuted, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Nombre del titular</label>
                  <input type="text" maxLength={40} placeholder="Como aparece en la tarjeta" value={datosTarjeta.nombre}
                    onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, nombre: e.target.value }))}
                    style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "10px", border: `1px solid ${p.cardBorder}`, background: p.cartItemBg, color: p.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <div>
                    <label style={{ display: "block", color: p.textMuted, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>Fecha de vencimiento</label>
                    <input type="text" maxLength={5} placeholder="MM/AA" value={datosTarjeta.fecha}
                      onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, fecha: e.target.value }))}
                      style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "10px", border: `1px solid ${p.cardBorder}`, background: p.cartItemBg, color: p.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", color: p.textMuted, fontSize: "0.8rem", fontWeight: 600, marginBottom: "0.3rem" }}>CVV</label>
                    <input type="password" maxLength={4} placeholder="•••" value={datosTarjeta.cvv}
                      onChange={(e) => setDatosTarjeta((prev) => ({ ...prev, cvv: e.target.value }))}
                      style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "10px", border: `1px solid ${p.cardBorder}`, background: p.cartItemBg, color: p.text, fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <p style={{ color: p.textMuted, fontSize: "0.75rem", marginBottom: "1rem" }}>🔒 Formulario de demostración. Los datos no se almacenan ni procesan.</p>
              </>
            )}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setPasoDetallePago(false)} style={{ flex: 1, padding: "0.8rem", borderRadius: "12px", border: `1px solid ${p.cardBorder}`, background: "transparent", color: p.textMuted, cursor: "pointer", fontWeight: 600 }}>← Volver</button>
              <button onClick={finalizarPago} style={{ flex: 2, padding: "0.8rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#10b981,#059669)", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "1rem" }}>✅ Confirmar Pago</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Procesando ── */}
      {procesando && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: p.modalBg, borderRadius: "20px", padding: "2.5rem 2rem", textAlign: "center", maxWidth: "320px", width: "90%", border: `1px solid ${p.modalBorder}` }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", border: "5px solid #e2e8f0", borderTop: "5px solid #6366f1", margin: "0 auto 1.5rem", animation: "spin 0.9s linear infinite" }}></div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            <h3 style={{ fontWeight: 800, color: p.text, marginBottom: "0.5rem" }}>Procesando pago...</h3>
            <p style={{ color: p.textMuted, fontSize: "0.88rem" }}>Por favor espera, estamos verificando tu transacción</p>
          </div>
        </div>
      )}

      {/* ── Ticket ── */}
      {ticket && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "20px", maxWidth: "420px", width: "100%", padding: "2rem", color: "#111", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontWeight: 900, fontSize: "1.5rem", color: "#6366f1" }}>TechVault</h2>
              <p style={{ color: "#64748b", fontSize: "0.85rem" }}>Sistema de Gestión</p>
              <div style={{ width: "60px", height: "3px", background: "linear-gradient(90deg,#6366f1,#8b5cf6)", margin: "0.75rem auto" }}></div>
              <p style={{ fontWeight: 800, fontSize: "1.1rem", color: "#10b981" }}>✅ Compra Exitosa</p>
            </div>
            <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", marginBottom: "1rem", fontSize: "0.85rem" }}>
              {[["Código", ticket.codigo, "#6366f1"], ["Usuario ID", ticket.usuarioId, "#111"], ["Fecha", ticket.fecha, "#111"], ["Método de pago", ticket.metodoPago, "#111"]].map(([label, val, color]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: "#64748b" }}>{label}:</span>
                  <span style={{ fontWeight: 700, color, fontSize: label === "Fecha" ? "0.8rem" : undefined }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ fontWeight: 700, marginBottom: "0.5rem", color: "#334155" }}>Productos:</p>
              {ticket.productos.map((prod) => (
                <div key={prod.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0", borderBottom: "1px solid #e2e8f0", fontSize: "0.85rem" }}>
                  <span>{prod.nombre} x{prod.cantidad}</span>
                  <span style={{ fontWeight: 700 }}>S/ {(prod.precio * prod.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0 0", fontWeight: 800, fontSize: "1rem" }}>
                <span>TOTAL</span><span style={{ color: "#6366f1" }}>S/ {ticket.total.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ background: "#f0fdf4", borderRadius: "10px", padding: "0.75rem", textAlign: "center", marginBottom: "1.5rem", fontSize: "0.8rem", color: "#166534" }}>
              📍 Muestra este ticket en nuestra tienda física para recoger tu pedido
            </div>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setTicket(null)} style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", fontWeight: 600 }}>Cerrar</button>
              <button onClick={() => window.print()} style={{ flex: 2, padding: "0.75rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 800, cursor: "pointer" }}>🖨️ Imprimir Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}