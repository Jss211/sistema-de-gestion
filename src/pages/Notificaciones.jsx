import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  BellIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  TagIcon,
  HeartIcon,
  InformationCircleIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../hooks/useTheme";

const TYPE_CONFIG = {
  pedido:   { color: "#10b981", bg: "rgba(16,185,129,0.1)",  icon: ShoppingBagIcon,       label: "Pedido"       },
  oferta:   { color: "#f59e0b", bg: "rgba(245,158,11,0.1)",  icon: TagIcon,               label: "Oferta"       },
  favorito: { color: "#ef4444", bg: "rgba(239,68,68,0.1)",   icon: HeartIcon,             label: "Favorito"     },
  sistema:  { color: "#6366f1", bg: "rgba(99,102,241,0.1)",  icon: InformationCircleIcon, label: "Sistema"      },
  pago:     { color: "#3b82f6", bg: "rgba(59,130,246,0.1)",  icon: CheckCircleIcon,       label: "Pago"         },
};

function getNotifs() {
  try { return JSON.parse(localStorage.getItem("techvault_notifs") || "[]"); } catch { return []; }
}
function saveNotifs(list) {
  localStorage.setItem("techvault_notifs", JSON.stringify(list));
  window.dispatchEvent(new Event("notifs_updated"));
}

// Genera notificaciones de ejemplo si no hay ninguna
function seedIfEmpty() {
  const existing = getNotifs();
  if (existing.length > 0) return;
  const now = Date.now();
  const seeds = [
    { id: now-5000, type: "sistema",  title: "Bienvenido a TechVault",         body: "Explora nuestro catálogo y encuentra los mejores productos tecnológicos.",  time: "Hace un momento", read: false },
    { id: now-4000, type: "oferta",   title: "¡Oferta especial disponible!",   body: "Laptops con hasta 20% de descuento esta semana. ¡No te lo pierdas!",        time: "Hace 5 min",      read: false },
    { id: now-3000, type: "sistema",  title: "Envío gratis activado",          body: "Todas tus compras incluyen envío gratis a Lima Metropolitana.",              time: "Hace 10 min",     read: true  },
  ];
  saveNotifs(seeds);
}

export default function Notificaciones() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const [notifs, setNotifs] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    seedIfEmpty();
    setNotifs(getNotifs());
    const sync = () => setNotifs(getNotifs());
    window.addEventListener("notifs_updated", sync);
    return () => window.removeEventListener("notifs_updated", sync);
  }, []);

  const noLeidas = notifs.filter((n) => !n.read).length;

  const filtradas = notifs.filter((n) => {
    if (filtro === "todas") return true;
    if (filtro === "no_leidas") return !n.read;
    return n.type === filtro;
  });

  const marcarLeida = (id) => {
    const updated = notifs.map((n) => n.id === id ? { ...n, read: true } : n);
    setNotifs(updated);
    saveNotifs(updated);
  };

  const marcarTodasLeidas = () => {
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setNotifs(updated);
    saveNotifs(updated);
  };

  const eliminar = (id) => {
    const updated = notifs.filter((n) => n.id !== id);
    setNotifs(updated);
    saveNotifs(updated);
  };

  const limpiarTodas = () => {
    setNotifs([]);
    saveNotifs([]);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.inputBg, color: t.text }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2.5rem 2rem", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: t.text }}>
              Notificaciones
            </h1>
            <p style={{ color: t.textSub, marginTop: "0.25rem", fontSize: "0.95rem" }}>
              {noLeidas > 0 ? `${noLeidas} sin leer` : "Todo al día"}
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {noLeidas > 0 && (
              <button onClick={marcarTodasLeidas}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #1e3a5f", background: "transparent", color: "#93c5fd", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                <CheckIcon style={{ width: "14px" }} /> Marcar todas leídas
              </button>
            )}
            {notifs.length > 0 && (
              <button onClick={limpiarTodas}
                style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #3f1e1e", background: "rgba(239,68,68,0.08)", color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                <TrashIcon style={{ width: "14px" }} /> Limpiar todo
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total",      value: notifs.length,                                    color: "#6366f1" },
            { label: "Sin leer",   value: noLeidas,                                         color: "#f59e0b" },
            { label: "Pedidos",    value: notifs.filter(n=>n.type==="pedido"||n.type==="pago").length, color: "#10b981" },
            { label: "Ofertas",    value: notifs.filter(n=>n.type==="oferta").length,        color: "#3b82f6" },
          ].map((s) => (
            <div key={s.label} style={{ background: t.cardBg, borderRadius: "14px", padding: "1rem 1.25rem", border: "1px solid #1e3a5f" }}>
              <p style={{ color: t.textSub, fontSize: "0.72rem", marginBottom: "0.35rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
              <p style={{ color: s.color, fontWeight: 800, fontSize: "1.4rem" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          {[
            ["todas",     "Todas"],
            ["no_leidas", "Sin leer"],
            ["pedido",    "Pedidos"],
            ["pago",      "Pagos"],
            ["oferta",    "Ofertas"],
            ["sistema",   "Sistema"],
          ].map(([val, lbl]) => (
            <button key={val} onClick={() => setFiltro(val)}
              style={{ padding: "0.4rem 1rem", borderRadius: "20px", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem",
                background: filtro === val ? "linear-gradient(135deg,#1e3a5f,#2563eb)" : t.cardBg,
                color: filtro === val ? "#fff" : t.textSub,
                border: `1px solid ${filtro === val ? "#2563eb" : t.border}` }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* Lista */}
        {filtradas.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "40vh", textAlign: "center" }}>
            <BellIcon style={{ width: "56px", height: "56px", color: t.border, marginBottom: "1rem" }} />
            <p style={{ color: "#475569", fontSize: "1.1rem", fontWeight: 600 }}>Sin notificaciones</p>
            <p style={{ color: t.border2, fontSize: "0.88rem" }}>No hay nada aquí por ahora.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {filtradas.map((notif) => {
              const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.sistema;
              const Icon = cfg.icon;
              return (
                <div key={notif.id}
                  style={{ background: t.cardBg, borderRadius: "14px", border: `1px solid ${notif.read ? t.border : "#2563eb"}`, padding: "1rem 1.25rem", display: "flex", gap: "1rem", alignItems: "flex-start", transition: "border-color 0.2s", position: "relative" }}>

                  {/* Punto no leído */}
                  {!notif.read && (
                    <span style={{ position: "absolute", top: "14px", right: "14px", width: "8px", height: "8px", borderRadius: "50%", background: "#3b82f6" }} />
                  )}

                  {/* Icono */}
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon style={{ width: "20px", height: "20px", color: cfg.color }} />
                  </div>

                  {/* Contenido */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: t.text, fontSize: "0.92rem" }}>{notif.title}</span>
                      <span style={{ padding: "0.1rem 0.5rem", borderRadius: "20px", fontSize: "0.65rem", fontWeight: 700, background: cfg.bg, color: cfg.color }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ color: t.textMuted, fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "0.4rem" }}>{notif.body}</p>
                    <p style={{ color: "#475569", fontSize: "0.72rem" }}>{notif.time}</p>
                  </div>

                  {/* Acciones */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
                    {!notif.read && (
                      <button onClick={() => marcarLeida(notif.id)} title="Marcar como leída"
                        style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "transparent", color: "#10b981", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckIcon style={{ width: "14px" }} />
                      </button>
                    )}
                    <button onClick={() => eliminar(notif.id)} title="Eliminar"
                      style={{ width: "30px", height: "30px", borderRadius: "8px", border: "1px solid #1e3a5f", background: "transparent", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <TrashIcon style={{ width: "14px" }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

// Helper exportado para agregar notificaciones desde otros módulos
export function pushNotif({ type = "sistema", title, body }) {
  const list = getNotifs();
  const now = new Date();
  const notif = {
    id: Date.now(),
    type, title, body,
    time: now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }) + " · " + now.toLocaleDateString("es-PE"),
    read: false,
  };
  saveNotifs([notif, ...list]);
}
