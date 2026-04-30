import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { TrashIcon, CreditCardIcon, PrinterIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { auth } from "../firebase";
import { pushNotif } from "./Notificaciones";
import { useTheme } from "../hooks/useTheme";

const PAYMENT_METHODS = [
  {
    id: "tarjeta",
    label: "Tarjeta Visa / Débito",
    img: "/payment-logos/visa.png",
  },
  {
    id: "yape",
    label: "Yape",
    img: "/payment-logos/yape.png",
  },
  {
    id: "bcp",
    label: "BCP",
    img: "/payment-logos/bcp.png",
  },
  {
    id: "scotiabank",
    label: "Scotiabank",
    img: "/payment-logos/scotiabank.png",
  },
];

export default function CartPage() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const ticketRef = useRef(null);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardData, setCardData] = useState({ number: "", name: "", date: "", cvv: "" });
  const [voucher, setVoucher] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [clientName, setClientName] = useState("Cliente");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
    setCart(saved);
    // Obtener nombre del cliente
    const user = auth.currentUser;
    if (user) {
      const perfil = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
      setClientName(perfil.nombre || user.displayName || user.email?.split("@")[0] || "Cliente");
    }
  }, []);

  const syncCart = (updated) => {
    setCart(updated);
    localStorage.setItem("techvault_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart_updated"));
  };

  const removeItem = (id) => syncCart(cart.filter((x) => x.id !== id));

  const changeQty = (id, delta) =>
    syncCart(cart.map((x) => x.id === id
      ? { ...x, cantidad: Math.max(1, (x.cantidad || 1) + delta), quantity: Math.max(1, (x.cantidad || 1) + delta) }
      : x));

  const subtotal = cart.reduce((acc, x) => acc + (x.precio || x.price) * (x.cantidad || 1), 0);

  const handleFinishPayment = () => {
    if (!paymentMethod) return alert("Selecciona un método de pago");
    if (paymentMethod === "tarjeta" && (!cardData.number || !cardData.name || !cardData.date || !cardData.cvv))
      return alert("Completa los datos de la tarjeta");
    if ((paymentMethod === "yape" || paymentMethod === "bcp" || paymentMethod === "scotiabank") && !voucher)
      return alert("Debes subir tu voucher");

    const now = new Date();
    const order = {
      id: Date.now(),
      orderId: `TV-${Date.now().toString().slice(-8)}`,
      products: cart,
      total: subtotal,
      paymentMethod,
      status: paymentMethod === "tarjeta" ? "pagado" : "en_revision",
      date: now.toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" }),
      time: now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      clientName,
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...orders, order]));
    setOrderData(order);
    syncCart([]);
    // Notificación automática
    pushNotif({
      type: paymentMethod === "tarjeta" ? "pago" : "pedido",
      title: paymentMethod === "tarjeta" ? "¡Pago confirmado!" : "Pedido en revisión",
      body: `Tu pedido ${order.orderId} por S/ ${subtotal.toFixed(2)} fue registrado correctamente.`,
    });
    // Animación de carga antes del ticket
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(3);
    }, 2200);
  };

  const handlePrint = () => {
    const win = window.open("", "_blank", "width=400,height=750");
    win.document.write(`
      <html><head><title>Ticket TechVault</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Courier New', monospace; background: #fff; color: #111; padding: 16px; font-size: 12px; width: 320px; margin: 0 auto; }
        .center { text-align: center; }
        .bold { font-weight: 700; }
        .sep-star { color: #999; letter-spacing: 2px; }
        .sep-dash { color: #bbb; letter-spacing: 1px; }
        .sep-eq { color: #555; letter-spacing: 1px; font-weight: 700; }
        .label { color: #555; }
        .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
        .section-title { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: #888; margin: 4px 0 3px; }
        .product-name { font-weight: 700; font-size: 12px; }
        .product-detail { color: #555; font-size: 11px; }
        .total-row { display: flex; justify-content: space-between; font-size: 14px; font-weight: 900; margin-top: 4px; }
        .small { font-size: 10px; color: #777; }
        .policy { font-size: 10px; color: #666; margin-bottom: 2px; }
        p { margin: 1px 0; }
      </style>
      </head><body>
        <div class="center">
          <p class="sep-star">* * * * * * * * * * * * * * *</p>
          <p style="font-size:18px;font-weight:900;letter-spacing:3px;margin:4px 0">TECHVAULT</p>
          <p class="small">Sistema de Gestión Tecnológica</p>
          <p class="small">www.techvault.com</p>
          <p class="small">Lima, Perú | Tel: +51 999 999 999</p>
          <p class="sep-dash" style="margin-top:4px">- - - - - - - - - - - - - - -</p>
        </div>
        ${ticketRef.current.querySelector ? "" : ""}
        <p class="section-title">COMPROBANTE DE VENTA</p>
        ${[
          ["N° Pedido", orderData?.orderId],
          ["Fecha", orderData?.date],
          ["Hora", orderData?.time],
          ["Cajero", "Sistema Automático"],
          ["Cliente", orderData?.clientName],
          ["Pago", PAYMENT_METHODS.find(m => m.id === orderData?.paymentMethod)?.label || orderData?.paymentMethod],
          ["Estado", orderData?.status === "pagado" ? "PAGADO ✓" : "EN REVISIÓN"],
        ].map(([k,v]) => `<div class="row"><span class="label">${k}</span><span class="bold">${v}</span></div>`).join("")}
        <p class="sep-dash" style="margin:5px 0">- - - - - - - - - - - - - - -</p>
        <div class="row"><span class="section-title">DESCRIPCIÓN</span><span class="section-title">IMPORTE</span></div>
        ${orderData?.products.map((item, idx) => {
          const nombre = item.nombre || item.name;
          const precio = item.precio || item.price;
          const cantidad = item.cantidad || item.quantity || 1;
          return `<div style="margin-bottom:5px">
            <p class="product-name">${String(idx+1).padStart(2,"0")}. ${nombre}</p>
            <div class="row"><span class="product-detail">${cantidad} und x S/${precio.toFixed(2)}</span><span class="bold">S/ ${(precio*cantidad).toFixed(2)}</span></div>
            ${item.categoria ? `<p class="small">Cat: ${item.categoria}</p>` : ""}
          </div>`;
        }).join("")}
        <p class="sep-dash" style="margin:5px 0">- - - - - - - - - - - - - - -</p>
        ${[
          ["Subtotal", `S/ ${orderData?.total.toFixed(2)}`],
          ["IGV (18%)", `S/ ${(orderData?.total * 0.18).toFixed(2)}`],
          ["Descuento", "S/ 0.00"],
          ["Envío", "GRATIS"],
        ].map(([k,v]) => `<div class="row"><span class="label">${k}</span><span class="bold">${v}</span></div>`).join("")}
        <p class="sep-eq" style="margin:5px 0">= = = = = = = = = = = = = = =</p>
        <div class="total-row"><span>TOTAL A PAGAR</span><span>S/ ${orderData?.total.toFixed(2)}</span></div>
        <p class="sep-dash" style="margin:5px 0">- - - - - - - - - - - - - - -</p>
        <p class="policy">• Cambios y devoluciones: 30 días</p>
        <p class="policy">• Garantía de fábrica incluida</p>
        <p class="policy">• Documento válido como comprobante</p>
        <div class="center" style="margin-top:8px">
          <p class="sep-star">* * * * * * * * * * * * * * *</p>
          <p style="margin:3px 0;font-size:11px">¡Gracias por tu compra!</p>
          <p class="small">Vuelva pronto — TechVault</p>
          <p class="small" style="margin-top:3px">ID: ${orderData?.id}</p>
          <p class="sep-star" style="margin-top:4px">* * * * * * * * * * * * * * *</p>
        </div>
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.pageBg, color: t.text }}>
      <Sidebar />

      <div style={{ flex: 1, padding: "1rem", paddingTop: "4rem", overflowY: "auto" }} className="md:!p-10">
        {step !== 3 && (
          <>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: t.text, marginBottom: "0.25rem" }}>
              Carrito de Compras
            </h1>
            <p style={{ color: t.textSub, marginBottom: "2rem", fontSize: "0.95rem" }}>
              {cart.length} {cart.length === 1 ? "producto" : "productos"} en tu carrito
            </p>
          </>
        )}

        {processing ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "1.5rem" }}>
            {/* Spinner */}
            <div style={{ position: "relative", width: "80px", height: "80px" }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "4px solid rgba(37,99,235,0.15)",
              }} />
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                border: "4px solid transparent",
                borderTopColor: "#2563eb",
                animation: "spin 0.9s linear infinite",
              }} />
              <div style={{
                position: "absolute", inset: "12px", borderRadius: "50%",
                border: "3px solid transparent",
                borderTopColor: "#60a5fa",
                animation: "spin 1.4s linear infinite reverse",
              }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.4rem" }}>Procesando tu pago...</p>
              <p style={{ color: "#64748b", fontSize: "0.88rem" }}>Por favor espera un momento</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : step === 3 ? (
          <div style={{ maxWidth: "420px", margin: "0 auto" }}>
            {/* Confirmación */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <CheckCircleIcon style={{ width: "48px", height: "48px", color: "#10b981", flexShrink: 0 }} />
              <div>
                <h2 style={{ fontSize: "1.6rem", fontWeight: 800, marginBottom: "0.2rem" }}>¡Pedido Registrado!</h2>
                <p style={{ color: t.textSub, fontSize: "0.9rem" }}>Tu pedido está en revisión o pagado según el método elegido.</p>
              </div>
            </div>

            {/* Ticket estilo supermercado */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: "100%", maxWidth: "420px", background: t.cardBg, borderRadius: "12px", border: `1px solid ${t.border}`, overflow: "hidden" }}>
                {/* Barra superior */}
                <div style={{ background: t.cardBg2, padding: "0.75rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${t.border}` }}>
                  <span style={{ fontWeight: 700, color: "#60a5fa", fontSize: "0.9rem" }}>🧾 Ticket de Compra</span>
                  <button onClick={handlePrint}
                    style={{ display: "flex", alignItems: "center", gap: "0.35rem", padding: "0.4rem 0.85rem", borderRadius: "7px", border: `1px solid ${t.border}`, background: "transparent", color: "#93c5fd", cursor: "pointer", fontWeight: 600, fontSize: "0.78rem" }}>
                    <PrinterIcon style={{ width: "14px", height: "14px" }} />
                    Imprimir
                  </button>
                </div>

                {/* Cuerpo del ticket */}
                <div ref={ticketRef} style={{ padding: "1.25rem 1.5rem", fontFamily: "'Courier New', monospace" }}>

                  {/* Cabecera */}
                  <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
                    <p style={{ fontSize: "0.7rem", color: "#475569", letterSpacing: "2px" }}>* * * * * * * * * * * * * * * * * *</p>
                    <p style={{ fontSize: "1.1rem", fontWeight: 900, color: "#60a5fa", letterSpacing: "3px", margin: "0.3rem 0" }}>TECHVAULT</p>
                    <p style={{ fontSize: "0.7rem", color: t.textSub }}>Sistema de Gestión Tecnológica</p>
                    <p style={{ fontSize: "0.68rem", color: "#475569" }}>www.techvault.com | soporte@techvault.com</p>
                    <p style={{ fontSize: "0.68rem", color: "#475569" }}>Lima, Perú | Tel: +51 999 999 999</p>
                    <p style={{ fontSize: "0.7rem", color: "#475569", letterSpacing: "2px", marginTop: "0.3rem" }}>- - - - - - - - - - - - - - - - - -</p>
                  </div>

                  {/* Info pedido */}
                  <div style={{ marginBottom: "0.6rem" }}>
                    <p style={{ fontSize: "0.65rem", color: t.textSub, letterSpacing: "1.5px", marginBottom: "0.4rem" }}>COMPROBANTE DE VENTA</p>
                    {[
                      ["N° Pedido",   orderData?.orderId],
                      ["Fecha",       orderData?.date],
                      ["Hora",        orderData?.time],
                      ["Cajero",      "Sistema Automático"],
                      ["Cliente",     orderData?.clientName],
                      ["Pago",        PAYMENT_METHODS.find(m => m.id === orderData?.paymentMethod)?.label || orderData?.paymentMethod],
                      ["Estado",      orderData?.status === "pagado" ? "PAGADO ✓" : "EN REVISIÓN"],
                    ].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.18rem" }}>
                        <span style={{ fontSize: "0.72rem", color: t.textMuted }}>{k}</span>
                        <span style={{ fontSize: "0.72rem", color: t.text, fontWeight: 700 }}>{v}</span>
                      </div>
                    ))}
                  </div>

                  <p style={{ fontSize: "0.65rem", color: t.border2, letterSpacing: "1px", margin: "0.5rem 0" }}>- - - - - - - - - - - - - - - - - -</p>

                  {/* Encabezado columnas */}
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                    <span style={{ fontSize: "0.65rem", color: t.textSub, letterSpacing: "1px" }}>DESCRIPCIÓN</span>
                    <span style={{ fontSize: "0.65rem", color: t.textSub, letterSpacing: "1px" }}>IMPORTE</span>
                  </div>

                  {/* Productos */}
                  {orderData?.products.map((item, idx) => {
                    const nombre = item.nombre || item.name;
                    const precio = item.precio || item.price;
                    const cantidad = item.cantidad || item.quantity || 1;
                    return (
                      <div key={item.id} style={{ marginBottom: "0.5rem" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: t.text, marginBottom: "0.1rem" }}>
                          {String(idx + 1).padStart(2, "0")}. {nombre}
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "0.68rem", color: t.textSub }}>
                            {cantidad} und x S/{precio.toFixed(2)}
                          </span>
                          <span style={{ fontSize: "0.72rem", color: "#3b82f6", fontWeight: 700 }}>
                            S/ {(precio * cantidad).toFixed(2)}
                          </span>
                        </div>
                        {item.categoria && (
                          <p style={{ fontSize: "0.62rem", color: "#475569" }}>Cat: {item.categoria}</p>
                        )}
                      </div>
                    );
                  })}

                  <p style={{ fontSize: "0.65rem", color: t.border2, letterSpacing: "1px", margin: "0.5rem 0" }}>- - - - - - - - - - - - - - - - - -</p>

                  {/* Totales */}
                  {[
                    ["Subtotal",          `S/ ${orderData?.total.toFixed(2)}`,  t.textMuted],
                    ["IGV (18%)",         `S/ ${(orderData?.total * 0.18).toFixed(2)}`, t.textMuted],
                    ["Descuento",         "S/ 0.00",                            t.textMuted],
                    ["Envío",             "GRATIS",                             "#10b981"],
                  ].map(([k, v, c]) => (
                    <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                      <span style={{ fontSize: "0.72rem", color: t.textMuted }}>{k}</span>
                      <span style={{ fontSize: "0.72rem", color: c, fontWeight: 600 }}>{v}</span>
                    </div>
                  ))}

                  <p style={{ fontSize: "0.65rem", color: t.border2, letterSpacing: "1px", margin: "0.4rem 0" }}>= = = = = = = = = = = = = = = = = =</p>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 900, color: t.text }}>TOTAL A PAGAR</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 900, color: "#3b82f6" }}>S/ {orderData?.total.toFixed(2)}</span>
                  </div>

                  {/* Efectivo / vuelto si aplica */}
                  {orderData?.paymentMethod === "tarjeta" && (
                    <div style={{ background: "rgba(37,99,235,0.08)", borderRadius: "6px", padding: "0.4rem 0.6rem", marginBottom: "0.5rem", border: `1px solid ${t.border}` }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.68rem", color: t.textMuted }}>Pagado con tarjeta</span>
                        <span style={{ fontSize: "0.68rem", color: t.text, fontWeight: 700 }}>S/ {orderData?.total.toFixed(2)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.68rem", color: t.textMuted }}>Vuelto</span>
                        <span style={{ fontSize: "0.68rem", color: t.text, fontWeight: 700 }}>S/ 0.00</span>
                      </div>
                    </div>
                  )}

                  <p style={{ fontSize: "0.65rem", color: t.border2, letterSpacing: "1px", margin: "0.4rem 0" }}>- - - - - - - - - - - - - - - - - -</p>

                  {/* Políticas */}
                  <div style={{ marginBottom: "0.5rem" }}>
                    <p style={{ fontSize: "0.62rem", color: "#475569", marginBottom: "0.15rem" }}>• Cambios y devoluciones: 30 días</p>
                    <p style={{ fontSize: "0.62rem", color: "#475569", marginBottom: "0.15rem" }}>• Garantía de fábrica incluida</p>
                    <p style={{ fontSize: "0.62rem", color: "#475569" }}>• Documento válido como comprobante</p>
                  </div>

                  {/* Footer */}
                  <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
                    <p style={{ fontSize: "0.7rem", color: "#475569", letterSpacing: "2px" }}>* * * * * * * * * * * * * * * * * *</p>
                    <p style={{ fontSize: "0.72rem", color: t.textSub, margin: "0.3rem 0" }}>¡Gracias por tu compra!</p>
                    <p style={{ fontSize: "0.68rem", color: "#475569" }}>Vuelva pronto — TechVault</p>
                    <p style={{ fontSize: "0.62rem", color: t.border2, marginTop: "0.3rem" }}>ID: {orderData?.id}</p>
                    <p style={{ fontSize: "0.7rem", color: "#475569", letterSpacing: "2px", marginTop: "0.3rem" }}>* * * * * * * * * * * * * * * * * *</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
              <button onClick={() => navigate("/catalogo")}
                style={{ padding: "0.85rem 2rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "1rem" }}>
                Seguir comprando
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem", alignItems: "start" }} className="md:!grid-cols-[1fr_340px]">

            {/* ── Columna izquierda ── */}
            <div>
              {step === 1 && (
                <>
                  {cart.length === 0 ? (
                    <div style={{ background: t.cardBg, borderRadius: "16px", padding: "3rem", textAlign: "center", border: `1px solid ${t.border}` }}>
                      <p style={{ color: t.textSub, fontSize: "1.1rem" }}>Tu carrito está vacío.</p>
                      <button onClick={() => navigate("/catalogo")}
                        style={{ marginTop: "1.25rem", padding: "0.75rem 1.75rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                        Ver catálogo
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {cart.map((item) => (
                        <CartItem key={item.id} item={item} onRemove={removeItem} onChangeQty={changeQty} t={t} />
                      ))}
                    </div>
                  )}
                </>
              )}

              {step === 2 && (
                <div style={{ background: t.cardBg, borderRadius: "16px", padding: "1.75rem", border: `1px solid ${t.border}`, display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <h2 style={{ fontWeight: 700, color: "#60a5fa", fontSize: "1.1rem", marginBottom: "0.25rem" }}>Método de pago</h2>

                  {PAYMENT_METHODS.map((m) => (
                    <div key={m.id} onClick={() => setPaymentMethod(m.id)}
                      style={{ padding: "0.85rem 1.25rem", border: `2px solid ${paymentMethod === m.id ? "#2563eb" : t.border}`, borderRadius: "12px", cursor: "pointer", background: paymentMethod === m.id ? "rgba(37,99,235,0.12)" : "transparent", display: "flex", alignItems: "center", gap: "0.85rem", transition: "all 0.15s" }}>
                      <img src={m.img} alt={m.label}
                        style={{ height: "28px", width: "auto", maxWidth: "60px", objectFit: "contain", borderRadius: "4px" }} />
                      <span style={{ fontWeight: 600, color: t.text }}>{m.label}</span>
                    </div>
                  ))}

                  {paymentMethod === "tarjeta" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.25rem" }}>
                      {/* Número de tarjeta: 16 dígitos con guiones XXXX-XXXX-XXXX-XXXX */}
                      <input
                        placeholder="0000-0000-0000-0000"
                        value={cardData.number}
                        maxLength={19}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                          const formatted = digits.replace(/(.{4})/g, "$1-").replace(/-$/, "");
                          setCardData({ ...cardData, number: formatted });
                        }}
                        style={{ padding: "0.75rem 1rem", borderRadius: "10px", background: t.pageBg, border: `1px solid ${t.border}`, color: t.text, outline: "none", fontSize: "0.9rem", letterSpacing: "0.1em" }}
                      />
                      {/* Nombre del titular */}
                      <input
                        placeholder="Nombre del titular"
                        value={cardData.name}
                        onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                        style={{ padding: "0.75rem 1rem", borderRadius: "10px", background: t.pageBg, border: `1px solid ${t.border}`, color: t.text, outline: "none", fontSize: "0.9rem" }}
                      />
                      <div style={{ display: "flex", gap: "0.75rem" }}>
                        {/* Fecha MM/YY */}
                        <input
                          placeholder="MM/YY"
                          value={cardData.date}
                          maxLength={5}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                            const formatted = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
                            setCardData({ ...cardData, date: formatted });
                          }}
                          style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "10px", background: t.pageBg, border: `1px solid ${t.border}`, color: t.text, outline: "none", fontSize: "0.9rem" }}
                        />
                        {/* CVV: 3 dígitos */}
                        <input
                          placeholder="CVV"
                          value={cardData.cvv}
                          maxLength={3}
                          onChange={(e) => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
                            setCardData({ ...cardData, cvv: digits });
                          }}
                          style={{ flex: 1, padding: "0.75rem 1rem", borderRadius: "10px", background: t.pageBg, border: `1px solid ${t.border}`, color: t.text, outline: "none", fontSize: "0.9rem" }}
                        />
                      </div>
                    </div>
                  )}

                  {(paymentMethod === "yape" || paymentMethod === "bcp" || paymentMethod === "scotiabank") && (
                    <div style={{ background: t.pageBg, padding: "1rem", borderRadius: "10px", border: `1px solid ${t.border}` }}>
                      <p style={{ fontWeight: 600, marginBottom: "0.5rem", color: t.textMuted, fontSize: "0.9rem" }}>Sube tu voucher de pago</p>
                      <input type="file" accept="image/*" onChange={(e) => setVoucher(e.target.files[0])} style={{ color: t.textMuted, fontSize: "0.85rem" }} />
                    </div>
                  )}

                  <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button onClick={() => setStep(1)}
                      style={{ flex: 1, padding: "0.8rem", borderRadius: "10px", border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>
                      ← Regresar
                    </button>
                    <button onClick={handleFinishPayment}
                      style={{ flex: 2, padding: "0.8rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#059669,#10b981)", color: "#fff", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem" }}>
                      Confirmar Pago — S/ {subtotal.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Resumen lateral ── */}
            <div style={{ background: t.cardBg, borderRadius: "16px", padding: "1.5rem", border: `1px solid ${t.border}`, position: "sticky", top: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, fontSize: "1rem", color: t.text, marginBottom: "1.25rem" }}>Resumen del Pedido</h3>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ color: t.textMuted, fontSize: "0.9rem" }}>Subtotal</span>
                <span style={{ color: t.text, fontWeight: 600 }}>S/ {subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "1rem", borderBottom: `1px solid ${t.border}` }}>
                <span style={{ color: t.textMuted, fontSize: "0.9rem" }}>Envío</span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>¡GRATIS!</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                <span style={{ color: t.text, fontWeight: 800, fontSize: "1rem" }}>Total</span>
                <span style={{ color: "#3b82f6", fontWeight: 900, fontSize: "1.2rem" }}>S/ {subtotal.toFixed(2)}</span>
              </div>

              {step === 1 ? (
                <button onClick={() => setStep(2)} disabled={cart.length === 0}
                  style={{ width: "100%", padding: "0.9rem", borderRadius: "12px", border: "none", background: cart.length === 0 ? t.border : "linear-gradient(135deg,#1e3a5f,#2563eb)", color: cart.length === 0 ? "#475569" : "#fff", fontWeight: 700, cursor: cart.length === 0 ? "not-allowed" : "pointer", fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <CreditCardIcon style={{ width: "18px", height: "18px" }} />
                  Proceder al Pago
                </button>
              ) : (
                <button onClick={handleFinishPayment}
                  style={{ width: "100%", padding: "0.9rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#059669,#10b981)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.95rem" }}>
                  Confirmar Pago
                </button>
              )}

              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Envío seguro y protegido", "30 días de garantía", "Pago 100% seguro"].map((txt) => (
                  <div key={txt} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", flexShrink: 0 }}></span>
                    <span style={{ color: t.textSub, fontSize: "0.82rem" }}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItem({ item, onRemove, onChangeQty, t }) {
  const precio = item.precio || item.price || 0;
  const cantidad = item.cantidad || item.quantity || 1;
  const nombre = item.nombre || item.name || "";
  const stock = item.stock || 0;

  return (
    <div style={{ background: t.cardBg, borderRadius: "16px", padding: "1.25rem", border: `1px solid ${t.border}`, display: "flex", gap: "1rem", alignItems: "center" }}>
      <div style={{ width: "80px", height: "80px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: t.border }}>
        {item.imagen && <img src={item.imagen} alt={nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontWeight: 700, color: t.text, fontSize: "1rem", marginBottom: "0.2rem" }}>{nombre}</p>
            <p style={{ color: t.textSub, fontSize: "0.82rem" }}>Stock disponible: {stock}</p>
          </div>
          <button onClick={() => onRemove(item.id)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", padding: "0.25rem", flexShrink: 0 }}>
            <TrashIcon style={{ width: "20px", height: "20px" }} />
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.75rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={() => onChangeQty(item.id, -1)}
              style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1px solid ${t.border2}`, background: t.pageBg, color: t.text, cursor: "pointer", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>−</button>
            <span style={{ color: t.text, fontWeight: 700, minWidth: "20px", textAlign: "center" }}>{cantidad}</span>
            <button onClick={() => onChangeQty(item.id, 1)}
              style={{ width: "32px", height: "32px", borderRadius: "50%", border: `1px solid ${t.border2}`, background: t.pageBg, color: t.text, cursor: "pointer", fontWeight: 700, fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>+</button>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#3b82f6", fontWeight: 800, fontSize: "1rem" }}>S/ {(precio * cantidad).toFixed(2)}</p>
            <p style={{ color: t.textSub, fontSize: "0.78rem" }}>S/ {precio.toFixed(2)} c/u</p>
          </div>
        </div>
      </div>
    </div>
  );
}
