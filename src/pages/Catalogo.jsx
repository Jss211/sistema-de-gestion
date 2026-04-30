import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import productosLocales from "../data/productos.json";
import GradientText from "../components/GradientText";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

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

function ProductCard({ producto, onVerDetalle, onAgregar, onToggleFav, esFavorito, p, isDark }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ background: p.cardBg, borderRadius: "16px", overflow: "hidden", border: `1px solid ${p.cardBorder}`, transition: "transform 0.2s, box-shadow 0.2s", transform: hovered ? "translateY(-4px)" : "translateY(0)", boxShadow: hovered ? p.cardHoverShadow : "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: "relative", cursor: "pointer" }} onClick={() => onVerDetalle(producto)}>
        <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", height: "180px", objectFit: "contain", display: "block", background: isDark ? "#0d1f3c" : "#f8fafc", padding: "0.5rem" }} />
        {producto.badge && (
          <span style={{ position: "absolute", top: "10px", left: "10px", padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: producto.badge === "Nuevo" ? "#10b981" : "#f59e0b", color: "#fff", zIndex: 2 }}>
            {producto.badge}
          </span>
        )}
        {/* Lupa */}
        <div style={{
          position: "absolute", top: "10px", right: "52px",
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
        {/* Corazón */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(producto); }}
          style={{
            position: "absolute", top: "10px", right: "10px",
            width: "36px", height: "36px", borderRadius: "8px",
            background: esFavorito ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.92)",
            border: "none", display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 3,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            transition: "background 0.2s, transform 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          <svg width="17" height="17" viewBox="0 0 24 24"
            fill={esFavorito ? "#ef4444" : "none"}
            stroke={esFavorito ? "#ef4444" : "#334155"}
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
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
  const [paginaActual, setPaginaActual] = useState(1);
  const PRODUCTOS_POR_PAGINA = 8;

  // Carrito sincronizado con localStorage
  const [carrito, setCarrito] = useState(() => {
    try { return JSON.parse(localStorage.getItem("techvault_cart") || "[]"); } catch { return []; }
  });

  // Favoritos
  const [favoritos, setFavoritos] = useState(() => {
    try { return JSON.parse(localStorage.getItem("techvault_favoritos") || "[]"); } catch { return []; }
  });

  // Productos: locales + Firebase
  const [productos, setProductos] = useState(productosLocales);

  useEffect(() => {
    // Cargar productos de Firebase y combinar con los locales
    getDocs(collection(db, "productos")).then((snap) => {
      const firebaseProds = snap.docs.map((d) => ({ ...d.data(), id: d.id, fromFirebase: true }));
      if (firebaseProds.length > 0) {
        // Asignar IDs numéricos únicos para los de Firebase
        const maxId = Math.max(...productosLocales.map((p) => p.id), 0);
        const withIds = firebaseProds.map((p, i) => ({ ...p, _fbId: p.id, id: maxId + i + 1 }));
        setProductos([...productosLocales, ...withIds]);
      }
    }).catch(() => {});
  }, []);

  const toggleFavorito = (producto) => {
    setFavoritos((prev) => {
      const existe = prev.find((x) => x.id === producto.id);
      const updated = existe ? prev.filter((x) => x.id !== producto.id) : [...prev, producto];
      localStorage.setItem("techvault_favoritos", JSON.stringify(updated));
      window.dispatchEvent(new Event("favoritos_updated"));
      return updated;
    });
  };


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

  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);
  const productosPaginados = productosFiltrados.slice(
    (paginaActual - 1) * PRODUCTOS_POR_PAGINA,
    paginaActual * PRODUCTOS_POR_PAGINA
  );

  // Reset página al cambiar filtros
  const handleCategoria = (cat) => { setCategoriaActiva(cat); setPaginaActual(1); };
  const handleBusqueda = (val) => { setBusqueda(val); setPaginaActual(1); };

  const agregarAlCarrito = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((x) => x.id === producto.id);
      const updated = existe
        ? prev.map((x) => x.id === producto.id ? { ...x, cantidad: x.cantidad + 1, quantity: x.cantidad + 1 } : x)
        : [...prev, { ...producto, cantidad: 1, quantity: 1, name: producto.nombre, price: producto.precio }];
      localStorage.setItem("techvault_cart", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart_updated"));
      return updated;
    });
    setProductoModal(null);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: p.pageBg }}>
      <Sidebar />

      <main style={{ flex: 1, padding: "2rem", color: p.text, overflowY: "auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 800, color: isDark ? "#ffffff" : "#0f172a" }}>Catálogo de Productos</h1>
          <p style={{ color: p.textMuted, marginTop: "0.25rem" }}>Encuentra los mejores productos tecnológicos</p>
        </div>

        {/* Búsqueda */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <input value={busqueda} onChange={(e) => handleBusqueda(e.target.value)} placeholder="Buscar productos..."
              style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "12px", border: `1px solid ${p.inputBorder}`, background: p.inputBg, color: p.text, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} />
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {CATEGORIAS.map((cat) => (
            <button key={cat} onClick={() => handleCategoria(cat)}
              style={{ padding: "0.5rem 1.1rem", borderRadius: "20px", border: "none", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", transition: "all 0.2s", background: categoriaActiva === cat ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : p.filterInactive, color: categoriaActiva === cat ? "#fff" : p.filterTextInactive }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid de productos principales */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {productosPaginados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} onVerDetalle={setProductoModal} onAgregar={agregarAlCarrito} onToggleFav={toggleFavorito} esFavorito={favoritos.some((f) => f.id === producto.id)} p={p} isDark={isDark} />
          ))}
        </div>

        {/* --- SECCIÓN NUEVA: INVENTARIO TECHVAULT 🛡️ --- */}
        <div style={{ marginTop: "5rem", borderTop: `1px solid ${p.cardBorder}`, paddingTop: "3rem" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: 800, color: p.text, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
            Inventario TechVault <span style={{ fontSize: "1.4rem" }}>🛡️</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
            {productosPaginados.map((prod) => (
              <div key={prod.id} style={{ background: isDark ? "#111827" : "#fff", borderRadius: "16px", padding: "1.2rem", border: `1px solid ${p.cardBorder}`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                <img src={prod.imageUrl} alt={prod.nombre} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px", marginBottom: "1rem" }} />
                <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: p.text, marginBottom: "0.5rem" }}>{prod.nombre}</h3>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#3b82f6", fontWeight: 900, fontSize: "1.1rem" }}>S/ {Number(prod.precio).toFixed(2)}</span>
                  <span style={{ fontSize: "0.75rem", color: p.textMuted, background: isDark ? "#1f2937" : "#f3f4f6", padding: "2px 8px", borderRadius: "6px" }}>Stock: {prod.stock}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "2.5rem" }}>
              {[...Array(totalPaginas)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    width: "38px", height: "38px", borderRadius: "10px", border: "none", cursor: "pointer",
                    background: currentPage === i + 1 ? "#6366f1" : p.cardBg,
                    color: "#fff", fontWeight: 700, transition: "all 0.2s",
                    border: currentPage === i + 1 ? "none" : `1px solid ${p.cardBorder}`
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mensaje de no resultados */}
        {productosFiltrados.length === 0 && productosFirebase.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: p.textSub }}>
            <div style={{ fontSize: "3rem" }}>🔍</div>
            <p style={{ marginTop: "1rem", fontSize: "1.1rem" }}>No se encontraron productos</p>
          </div>
        )}

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.4rem", marginTop: "2.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setPaginaActual((p) => Math.max(1, p - 1))}
              disabled={paginaActual === 1}
              style={{ padding: "0.45rem 0.9rem", borderRadius: "8px", border: `1px solid #1e3a5f`, background: "transparent", color: paginaActual === 1 ? "#334155" : "#93c5fd", cursor: paginaActual === 1 ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
              ‹
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
              <button key={num} onClick={() => setPaginaActual(num)}
                style={{ width: "36px", height: "36px", borderRadius: "8px", border: `1px solid ${paginaActual === num ? "#2563eb" : "#1e3a5f"}`, background: paginaActual === num ? "linear-gradient(135deg,#1e3a5f,#2563eb)" : "transparent", color: paginaActual === num ? "#fff" : "#93c5fd", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem" }}>
                {num}
              </button>
            ))}
            <button
              onClick={() => setPaginaActual((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaActual === totalPaginas}
              style={{ padding: "0.45rem 0.9rem", borderRadius: "8px", border: `1px solid #1e3a5f`, background: "transparent", color: paginaActual === totalPaginas ? "#334155" : "#93c5fd", cursor: paginaActual === totalPaginas ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
              ›
            </button>
          </div>
        )}
      </main>

      {/* ── Modal Detalles producto ── */}
      {productoModal && (
        <div onClick={() => setProductoModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#0f172a", borderRadius: "16px", maxWidth: "780px", width: "100%", overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,0.7)", maxHeight: "90vh", overflowY: "auto", border: "1px solid #1e3a5f" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.5rem", borderBottom: "1px solid #1e3a5f", background: "#0d1f3c" }}>
              <span style={{ fontWeight: 600, color: "#e2e8f0", fontSize: "1rem" }}>Detalles del Producto</span>
              <button onClick={() => setProductoModal(null)} style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#94a3b8", lineHeight: 1 }}>✕</button>
            </div>
            <div style={{ display: "flex", gap: "2rem", padding: "1.5rem", flexWrap: "wrap" }}>
              <div style={{ flex: "0 0 auto", width: "320px", maxWidth: "100%" }}>
                <img src={productoModal.imagen} alt={productoModal.nombre} style={{ width: "100%", height: "260px", objectFit: "contain", borderRadius: "12px", border: "1px solid #1e3a5f", background: isDark ? "#0d1f3c" : "#f8fafc", padding: "0.75rem" }} />
              </div>
              <div style={{ flex: 1, minWidth: "220px" }}>
                <h2 style={{ fontWeight: 800, fontSize: "1.4rem", color: "#f1f5f9", marginBottom: "0.5rem" }}>{productoModal.nombre}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", marginBottom: "1rem" }}>
                  {[1,2,3,4,5].map((i) => (
                    <span key={i} style={{ color: i <= 4 ? "#f59e0b" : "#334155", fontSize: "1.1rem" }}>★</span>
                  ))}
                  <span style={{ color: "#64748b", fontSize: "0.85rem", marginLeft: "4px" }}>(128 reseñas)</span>
                </div>
                <div style={{ background: "#0d1f3c", borderRadius: "10px", padding: "0.85rem 1rem", marginBottom: "1.25rem", border: "1px solid #1e3a5f" }}>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginBottom: "0.4rem" }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.9rem" }}>Precio:</span>
                    <span style={{ color: "#f1f5f9", fontWeight: 800, fontSize: "1.05rem" }}>S/ {productoModal.precio.toFixed(2)}</span>
                    {productoModal.precioAntes && (
                      <span style={{ fontSize: "0.85rem", color: "#64748b", textDecoration: "line-through" }}>S/ {productoModal.precioAntes.toFixed(2)}</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                    <span style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.9rem" }}>Disponibilidad:</span>
                    <span style={{ color: productoModal.stock <= 8 ? "#ef4444" : "#34d399", fontWeight: 700, fontSize: "0.9rem" }}>{productoModal.stock} unidades en stock</span>
                  </div>
                </div>
                <h3 style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Descripción</h3>
                <p style={{ color: "#94a3b8", lineHeight: 1.7, fontSize: "0.88rem", marginBottom: "1.25rem" }}>{productoModal.descripcion}</p>
                <h3 style={{ fontWeight: 700, color: "#e2e8f0", marginBottom: "0.5rem", fontSize: "0.95rem" }}>Características Destacadas</h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "1.75rem" }}>
                  {["Alta calidad de construcción","Diseño moderno y elegante","Excelente relación calidad-precio","Garantía del fabricante","Compatible con múltiples dispositivos"].map((c) => (
                    <li key={c} style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#3b82f6", flexShrink: 0 }}></span>{c}
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button onClick={() => setProductoModal(null)}
                    style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "1px solid #1e3a5f", background: "transparent", color: "#94a3b8", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                    Cerrar
                  </button>
                  <button onClick={() => agregarAlCarrito(productoModal)}
                    style={{ flex: 2, padding: "0.75rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
                    + Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}