import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useTheme } from "../hooks/useTheme";

export default function Favoritos() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [favoritos, setFavoritos] = useState(() => {
    try { return JSON.parse(localStorage.getItem("techvault_favoritos") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    const sync = () => {
      try { setFavoritos(JSON.parse(localStorage.getItem("techvault_favoritos") || "[]")); } catch {}
    };
    window.addEventListener("favoritos_updated", sync);
    return () => window.removeEventListener("favoritos_updated", sync);
  }, []);

  const quitarFavorito = (id) => {
    const updated = favoritos.filter((x) => x.id !== id);
    setFavoritos(updated);
    localStorage.setItem("techvault_favoritos", JSON.stringify(updated));
    window.dispatchEvent(new Event("favoritos_updated"));
  };

  const agregarAlCarrito = (producto) => {
    const cart = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
    const existe = cart.find((x) => x.id === producto.id);
    const updated = existe
      ? cart.map((x) => x.id === producto.id ? { ...x, cantidad: x.cantidad + 1, quantity: x.cantidad + 1 } : x)
      : [...cart, { ...producto, cantidad: 1, quantity: 1, name: producto.nombre, price: producto.precio }];
    localStorage.setItem("techvault_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.inputBg, color: t.text }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-10 md:pt-10">
        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, marginBottom: "0.25rem", color: t.text }}>
          Mis Favoritos
        </h1>
        <p style={{ color: t.textSub, marginBottom: "2rem", fontSize: "0.95rem" }}>
          {favoritos.length} {favoritos.length === 1 ? "producto guardado" : "productos guardados"}
        </p>

        {favoritos.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "50vh", textAlign: "center" }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: "1rem" }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <p style={{ color: "#475569", fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>No tienes favoritos aún</p>
            <p style={{ color: t.border2, fontSize: "0.9rem", marginBottom: "1.5rem" }}>Agrega productos desde el catálogo tocando el corazón</p>
            <button onClick={() => navigate("/catalogo")}
              style={{ padding: "0.75rem 1.75rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
              Ir al Catálogo
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: "1rem" }}>
            {favoritos.map((producto) => (
              <FavCard key={producto.id} producto={producto} onQuitar={quitarFavorito} onAgregarCarrito={agregarAlCarrito} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function FavCard({ producto, onQuitar, onAgregarCarrito }) {
  const [added, setAdded] = useState(false);
  const { t } = useTheme();

  const handleAgregar = () => {
    onAgregarCarrito(producto);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div style={{ background: t.cardBg, borderRadius: "16px", overflow: "hidden", border: "1px solid #1e3a5f", position: "relative" }}>
      {/* Botón quitar favorito */}
      <button onClick={() => onQuitar(producto.id)}
        title="Quitar de favoritos"
        style={{ position: "absolute", top: "10px", right: "10px", zIndex: 2, background: "rgba(15,23,42,0.85)", border: "none", borderRadius: "50%", width: "34px", height: "34px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>

      {producto.badge && (
        <span style={{ position: "absolute", top: "10px", left: "10px", zIndex: 2, padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, background: producto.badge === "Nuevo" ? "#10b981" : "#f59e0b", color: "#fff" }}>
          {producto.badge}
        </span>
      )}

      <img src={producto.imagen} alt={producto.nombre} style={{ width: "100%", height: "180px", objectFit: "cover", display: "block" }} />

      <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
        <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: t.text, marginBottom: "0.4rem", lineHeight: 1.3 }}>{producto.nombre}</h3>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem" }}>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "#3b82f6" }}>S/ {producto.precio.toFixed(2)}</span>
          <span style={{ fontSize: "0.8rem", color: t.textSub }}>{producto.stock} disponibles</span>
        </div>
        <button onClick={handleAgregar}
          style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: added ? "#059669" : "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem", transition: "background 0.2s" }}>
          {added ? "✓ Agregado" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
