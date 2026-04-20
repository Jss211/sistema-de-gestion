import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import productos from "../data/productos.json";

const CATEGORIAS = ["Todos", "Laptops", "PCs", "Mouse", "Monitores", "Accesorios", "Almacenamiento"];

function getPalette(dark) {
  return dark ? {
    pageBg: "#0f1117", cardBg: "#1e293b", cardBorder: "#334155",
    cardHoverShadow: "0 12px 40px rgba(99,102,241,0.2)", text: "#f1f5f9",
    textMuted: "#94a3b8", textSub: "#64748b", accent: "#6366f1",
    accentLight: "#a78bfa", inputBg: "#1e293b", inputBorder: "#1e293b",
    filterInactive: "#1e293b", filterTextInactive: "#94a3b8",
    modalBg: "#1e293b", modalBorder: "#334155",
    cartItemBg: "#0f172a",
    starFilled: "#f59e0b", starEmpty: "#334155", logoFilter: "brightness(1.2)",
  } : {
    pageBg: "#f1f5f9", cardBg: "#ffffff", cardBorder: "#e2e8f0",
    cardHoverShadow: "0 12px 40px rgba(99,102,241,0.15)", text: "#1e293b",
    textMuted: "#64748b", textSub: "#94a3b8", accent: "#6366f1",
    accentLight: "#7c3aed", inputBg: "#ffffff", inputBorder: "#e2e8f0",
    filterInactive: "#e2e8f0", filterTextInactive: "#475569",
    modalBg: "#ffffff", modalBorder: "#e2e8f0",
    cartItemBg: "#f8fafc",
    starFilled: "#f59e0b", starEmpty: "#cbd5e1", logoFilter: "none",
  };
}

function ProductCard({ producto, onVerDetalle, onAgregar, p }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ background: p.cardBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${p.cardBorder}`, transition: "transform 0.2s, box-shadow 0.2s", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? p.cardHoverShadow : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => onVerDetalle(producto)}>
        <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />
        {producto.badge && (
          <span style={{ position: "absolute", top: "10px", left: "10px", padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: producto.badge === "Nuevo" ? "#10b981" : "#f59e0b", color: "#fff", zIndex: 2 }}>
            {producto.badge}
          </span>
        )}
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
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => (localStorage.getItem("theme") || "dark") === "dark");
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [productoModal, setProductoModal] = useState(null);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Carrito sincronizado con localStorage para que Carrito.jsx lo lea
  const [carrito, setCarrito] = useState(() => {
    try { return JSON.parse(localStorage.getItem("techvault_cart") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("techvault_cart", JSON.stringify(carrito));
  }, [carrito]);

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
      if (existe) return prev.map((x) => x.id === producto.id ? { ...x, cantidad: x.cantidad + 1, quantity: x.cantidad + 1 } : x);
      return [...prev, { ...producto, cantidad: 1, quantity: 1, name: producto.nombre, price: producto.precio }];
    });
    setProductoModal(null);
  };

  const quitarDelCarrito = (id) => setCarrito((prev) => prev.filter((x) => x.id !== id));
  const cambiarCantidad = (id, delta) => setCarrito((prev) =>
    prev.map((x) => x.id === id ? { ...x, cantidad: Math.max(1, x.cantidad + delta), quantity: Math.max(1, x.cantidad + delta) } : x)
  );
  const totalCarrito = carrito.reduce((acc, x) => acc + x.precio * x.cantidad, 0);
  const totalItems = carrito.reduce((acc, x) => acc + x.cantidad, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: p.pageBg }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "2rem", color: p.text, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, background: "linear-gradient(90deg,#6366f1,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Catálogo de Productos</h1>
          <p style={{ color: p.textMuted, marginTop: "0.25rem" }}>Encuentra los mejores productos tecnológicos</p>
        </div>

        {/* Búsqueda + botón carrito */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar productos..."
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: `1px solid ${p.inputBorder}`, background: p.inputBg, color: p.text, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>

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

        {/* Grid de productos */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: "1px solid #e2e8f0" }}>
              <span style={{ fontWeight: 600, color: "#1e293b", fontSize: "1rem" }}>Detalles del Producto</span>
              <button onClick={() => setProductoModal(null)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#64748b", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "2rem", padding: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 auto", width: "320px", maxWidth: "100%" }}>
                <img src={productoModal.imagen} alt={productoModal.nombre} style={{ width: "100%", height: "260px", objectFit: "cover", borderRadius: "12px" }} />
              </div>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#1e293b", marginBottom: "0.5rem" }}>{productoModal.nombre}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "1rem" }}>
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} style={{ color: i <= 4 ? "#f59e0b" : "#cbd5e1", fontSize: "1.1rem" }}>★</span>
                  ))}
                  <span style={{ color: "#64748b", fontSize: "0.85rem", marginLeft: "4px" }}>(128 reseñas)</span>
                </div>
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
                <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Descripción</h3>
                <p style={{ color: "#475569", lineHeight: 1.7, fontSize: "0.88rem", marginBottom: "1.25rem" }}>{productoModal.descripcion}</p>
                <h3 style={{ fontWeight: 700, color: "#1e293b", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Características Destacadas</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "1.75rem" }}>
                  {["Alta calidad de construcción","Diseño moderno y elegante","Excelente relación calidad-precio","Garantía del fabricante","Compatible con múltiples dispositivos"].map((c) => (
                    <li key={c} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", flexShrink: 0 }}></span>{c}
                    </li>
                  ))}
                </ul>
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

      {/* ── Modal Carrito ── */}
      {mostrarCarrito && (
        <div onClick={() => setMostrarCarrito(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{ background: p.pageBg, borderRadius: "16px", width: "100%", maxWidth: "900px", maxHeight: "88vh", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.35)", display: "flex", flexDirection: "column" }}>

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
                  {/* ── Navega a /carrito pasando el estado por localStorage ── */}
                  <button
                    onClick={() => { setMostrarCarrito(false); navigate("/carrito"); }}
                    style={{ marginTop: "1.5rem", width: "100%", padding: "0.9rem", borderRadius: "10px", border: "none", background: "#1e293b", color: "#fff", fontWeight: 800, cursor: "pointer", fontSize: "1rem", letterSpacing: "0.3px" }}>
                    Continuar compra
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}