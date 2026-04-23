import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ShoppingBagIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../hooks/useTheme";

const STATUS_CONFIG = {
  pagado:      { label: "Entregado",    color: "#10b981", bg: "rgba(16,185,129,0.12)",  dot: "#10b981" },
  en_revision: { label: "Procesando",  color: "#f59e0b", bg: "rgba(245,158,11,0.12)",   dot: "#f59e0b" },
  cancelado:   { label: "Cancelado",   color: "#ef4444", bg: "rgba(239,68,68,0.12)",    dot: "#ef4444" },
};

const PAYMENT_LABELS = {
  tarjeta: "Tarjeta Visa / Débito",
  yape: "Yape",
  bcp: "BCP",
  scotiabank: "Scotiabank",
};

export default function MisPedidos() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [orders, setOrders] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [detalle, setDetalle] = useState(null); // id del pedido con modal abierto

  useEffect(() => {
    const raw = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders([...raw].reverse());
  }, []);

  const filtrados = orders.filter((o) =>
    filtro === "todos" ? true : o.status === filtro
  );

  const handlePrint = (order) => {
    const win = window.open("", "_blank", "width=400,height=700");
    win.document.write(`<html><head><title>Ticket ${order.orderId}</title>
    <style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;padding:20px;font-size:12px;width:320px;margin:0 auto}
    .c{text-align:center}.b{font-weight:700}.row{display:flex;justify-content:space-between;margin-bottom:3px}
    .sep{color:#999;letter-spacing:2px;text-align:center;margin:6px 0}.small{font-size:10px;color:#666}</style></head><body>
    <div class="c"><p class="sep">* * * * * * * * * * * * * * *</p>
    <p style="font-size:18px;font-weight:900;letter-spacing:3px;margin:4px 0">TECHVAULT</p>
    <p class="small">www.techvault.com — Lima, Perú</p>
    <p class="sep">- - - - - - - - - - - - - - -</p></div>
    ${[["N° Pedido",order.orderId],["Fecha",order.date],["Cliente",order.clientName||"Cliente"],
       ["Pago",PAYMENT_LABELS[order.paymentMethod]||order.paymentMethod],
       ["Estado",order.status==="pagado"?"ENTREGADO ✓":"PROCESANDO"]]
      .map(([k,v])=>`<div class="row"><span style="color:#555">${k}</span><span class="b">${v}</span></div>`).join("")}
    <p class="sep">- - - - - - - - - - - - - - -</p>
    ${order.products.map((item,i)=>{
      const n=item.nombre||item.name,p=item.precio||item.price,q=item.cantidad||item.quantity||1;
      return `<div style="margin-bottom:5px"><p class="b">${String(i+1).padStart(2,"0")}. ${n}</p>
      <div class="row"><span class="small">${q} x S/${p.toFixed(2)}</span><span class="b">S/ ${(p*q).toFixed(2)}</span></div></div>`;
    }).join("")}
    <p class="sep">= = = = = = = = = = = = = = =</p>
    <div class="row"><span class="b" style="font-size:14px">TOTAL</span><span class="b" style="font-size:14px">S/ ${order.total.toFixed(2)}</span></div>
    <div class="c" style="margin-top:10px"><p class="sep">* * * * * * * * * * * * * * *</p>
    <p class="small">¡Gracias por tu compra en TechVault!</p>
    <p class="small">ID: ${order.id}</p></div></body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.pageBg, color: t.text }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2.5rem 2rem", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: t.text }}>
            Mis Pedidos
          </h1>
          <p style={{ color: t.textSub, marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Historial completo de tus compras
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          {[
            { label: "Total pedidos", value: orders.length,                                         color: "#6366f1" },
            { label: "Entregados",    value: orders.filter(o => o.status === "pagado").length,      color: "#10b981" },
            { label: "Procesando",    value: orders.filter(o => o.status === "en_revision").length, color: "#f59e0b" },
          ].map((s) => (
            <div key={s.label} style={{ background: t.cardBg, borderRadius: "12px", padding: "0.85rem 1.1rem", border: `1px solid ${t.border}`, minWidth: "110px" }}>
              <p style={{ color: t.textSub, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: "0.4rem" }}>{s.label}</p>
              <p style={{ color: s.color, fontWeight: 800, fontSize: "1.6rem", lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}

          {/* Total gastado */}
          <div style={{ background: "linear-gradient(135deg,#0d1f3c,#1e3a5f)", borderRadius: "12px", padding: "0.85rem 1.1rem", border: "1px solid #2563eb", minWidth: "140px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "-15px", right: "-15px", width: "60px", height: "60px", borderRadius: "50%", background: "rgba(37,99,235,0.25)", filter: "blur(16px)", pointerEvents: "none" }} />
            <p style={{ color: "#93c5fd", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600, marginBottom: "0.4rem" }}>Total gastado</p>
            <p style={{ color: "#60a5fa", fontSize: "0.72rem", fontWeight: 600, lineHeight: 1, marginBottom: "0.1rem" }}>S/</p>
            <p style={{ color: "#fff", fontWeight: 900, fontSize: "1.4rem", lineHeight: 1, letterSpacing: "-0.5px" }}>
              {orders.reduce((a, o) => a + (o.total || 0), 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.75rem", flexWrap: "wrap" }}>
          {[["todos","Todos"],["pagado","Entregados"],["en_revision","Procesando"]].map(([val,lbl]) => (
            <button key={val} onClick={() => setFiltro(val)}
              style={{ padding: "0.4rem 1.1rem", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                background: filtro === val ? "linear-gradient(135deg,#1e3a5f,#2563eb)" : t.cardBg,
                color: filtro === val ? "#fff" : t.textSub,
                border: `1px solid ${filtro === val ? "#2563eb" : t.border}` }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Lista */}
        {filtrados.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", textAlign: "center" }}>
            <ShoppingBagIcon style={{ width: "56px", height: "56px", color: t.border, marginBottom: "1rem" }} />
            <p style={{ color: "#475569", fontSize: "1.1rem", fontWeight: 600 }}>No hay pedidos aquí</p>
            <p style={{ color: t.border2, fontSize: "0.88rem", marginBottom: "1.25rem" }}>Aún no has realizado ninguna compra.</p>
            <button onClick={() => navigate("/catalogo")}
              style={{ padding: "0.75rem 1.75rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              Ir al Catálogo
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filtrados.map((order) => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.en_revision;
              const isOpen = detalle === order.id;
              const totalItems = order.products?.reduce((a, x) => a + (x.cantidad || x.quantity || 1), 0) || 0;

              return (
                <div key={order.id} style={{ background: t.cardBg, borderRadius: "16px", border: `1px solid ${t.border}`, overflow: "hidden" }}>

                  {/* Fila principal */}
                  <div style={{ padding: "1.1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 700, color: t.text, fontSize: "0.95rem" }}>
                          Pedido #{order.orderId || String(order.id).slice(-6)}
                        </span>
                        {/* Badge estado */}
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.15rem 0.65rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
                          {cfg.label}
                        </span>
                      </div>
                      <p style={{ color: t.textSub, fontSize: "0.8rem" }}>{order.date}</p>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <p style={{ color: "#3b82f6", fontWeight: 800, fontSize: "1rem" }}>S/ {order.total?.toFixed(2)}</p>
                      <p style={{ color: t.textSub, fontSize: "0.75rem" }}>{totalItems} {totalItems === 1 ? "producto" : "productos"}</p>
                    </div>
                  </div>

                  {/* Separador */}
                  <div style={{ height: "1px", background: t.border, margin: "0 1.5rem" }} />

                  {/* Productos (siempre visibles, estilo de la imagen) */}
                  <div style={{ padding: "0.75rem 1.5rem" }}>
                    {order.products?.map((item) => {
                      const nombre = item.nombre || item.name;
                      const precio = item.precio || item.price;
                      const cantidad = item.cantidad || item.quantity || 1;
                      return (
                        <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 0", borderBottom: "1px solid #0f172a" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            {/* Icono producto */}
                            <div style={{ width: "28px", height: "28px", borderRadius: "6px", overflow: "hidden", background: t.border, flexShrink: 0 }}>
                              {item.imagen
                                ? <img src={item.imagen} alt={nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "0.7rem" }}>📦</span>
                              }
                            </div>
                            <span style={{ color: "#cbd5e1", fontSize: "0.85rem" }}>
                              {nombre} × {cantidad}
                            </span>
                          </div>
                          <span style={{ color: t.textMuted, fontSize: "0.85rem", fontWeight: 600 }}>
                            S/ {(precio * cantidad).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Separador */}
                  <div style={{ height: "1px", background: t.border, margin: "0 1.5rem" }} />

                  {/* Botones de acción */}
                  <div style={{ display: "flex", gap: "0" }}>
                    <button onClick={() => navigate("/catalogo")}
                      style={{ flex: 1, padding: "0.85rem", background: "transparent", border: "none", borderRight: "1px solid #1e3a5f", color: "#60a5fa", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(37,99,235,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      Volver a Comprar
                    </button>

                    <button onClick={() => setDetalle(isOpen ? null : order.id)}
                      style={{ flex: 1, padding: "0.85rem", background: "transparent", border: "none", borderRight: "1px solid #1e3a5f", color: t.textMuted, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {isOpen ? "Ocultar Detalles" : "Ver Detalles"}
                    </button>

                    <button onClick={() => handlePrint(order)}
                      style={{ flex: 1, padding: "0.85rem", background: "transparent", border: "none", color: t.textMuted, fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <PrinterIcon style={{ width: "15px" }} /> Ticket
                    </button>
                  </div>

                  {/* Panel de detalles expandible */}
                  {isOpen && (
                    <div style={{ borderTop: "1px solid #1e3a5f", padding: "1.25rem 1.5rem", background: t.cardBg2 }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                        {[
                          ["N° Pedido",       order.orderId || `#${String(order.id).slice(-6)}`],
                          ["Fecha",           order.date],
                          ["Hora",            order.time || "—"],
                          ["Cliente",         order.clientName || "Cliente"],
                          ["Método de pago",  PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod],
                          ["Estado",          cfg.label],
                        ].map(([k, v]) => (
                          <div key={k} style={{ background: t.cardBg, borderRadius: "10px", padding: "0.65rem 0.85rem", border: "1px solid #1e3a5f" }}>
                            <p style={{ color: t.textSub, fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.2rem" }}>{k}</p>
                            <p style={{ color: t.text, fontWeight: 700, fontSize: "0.85rem" }}>{v}</p>
                          </div>
                        ))}
                      </div>

                      {/* Resumen de totales */}
                      <div style={{ background: t.cardBg, borderRadius: "10px", padding: "0.85rem 1rem", border: "1px solid #1e3a5f" }}>
                        {[
                          ["Subtotal", `S/ ${order.total?.toFixed(2)}`, t.textMuted],
                          ["Envío",    "GRATIS",                        "#10b981"],
                          ["Total",    `S/ ${order.total?.toFixed(2)}`, "#3b82f6"],
                        ].map(([k, v, c], i) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", paddingTop: i === 2 ? "0.5rem" : 0, marginTop: i === 2 ? "0.5rem" : 0, borderTop: i === 2 ? "1px solid #1e3a5f" : "none", marginBottom: i < 2 ? "0.35rem" : 0 }}>
                            <span style={{ color: t.textMuted, fontSize: "0.85rem" }}>{k}</span>
                            <span style={{ color: c, fontWeight: i === 2 ? 800 : 600, fontSize: i === 2 ? "0.95rem" : "0.85rem" }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
