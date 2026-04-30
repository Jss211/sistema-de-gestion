import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import productos from "../data/productos.json";
// IMPORTANTE: Asegúrate de que la ruta a tu config de firebase sea correcta
import { db } from "../firebase"; 
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

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

  // --- NUEVOS ESTADOS PARA TECHVAULT ---
  const [productosFirebase, setProductosFirebase] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productosPorPagina = 4;

  const [carrito, setCarrito] = useState(() => {
    try { return JSON.parse(localStorage.getItem("techvault_cart") || "[]"); } catch { return []; }
  });

  // Carga de productos desde Firebase
  useEffect(() => {
    const q = query(collection(db, "productos"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProductosFirebase(docs);
    });
    return () => unsubscribe();
  }, []);

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

  // Lógica de paginación TechVault
  const ultimoIndice = currentPage * productosPorPagina;
  const primerIndice = ultimoIndice - productosPorPagina;
  const productosPaginados = productosFirebase.slice(primerIndice, ultimoIndice);
  const totalPaginas = Math.ceil(productosFirebase.length / productosPorPagina);

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

        {/* Grid de productos principales */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {productosFiltrados.map((producto) => (
            <ProductCard key={producto.id} producto={producto} onVerDetalle={setProductoModal} onAgregar={agregarAlCarrito} p={p} />
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
      </main>

      {/* --- MODALES (Mantén tus modales originales) --- */}
      {/* ... Código de Modal Detalles y Modal Carrito igual al tuyo ... */}
    </div>
  );
}