import { useState } from "react";
import { auth } from "../firebase";
import Sidebar from "./Sidebar";

const FAQS = [
  {
    pregunta: "¿Cómo puedo rastrear mi pedido?",
    respuesta:
      "Una vez confirmado tu pedido, recibirás un correo con el número de seguimiento. Puedes rastrearlo desde la sección 'Mis Pedidos' en el menú lateral o directamente en el sitio del courier.",
  },
  {
    pregunta: "¿Cuál es la política de devoluciones?",
    respuesta:
      "Aceptamos devoluciones dentro de los 30 días posteriores a la compra. El producto debe estar en su estado original, sin uso y con todos sus accesorios. Contáctanos por este formulario para iniciar el proceso.",
  },
  {
    pregunta: "¿Ofrecen garantía en los productos?",
    respuesta:
      "Sí. Todos nuestros productos incluyen garantía de fábrica más 6 meses adicionales sin costo. En caso de falla, nos encargamos de la gestión directamente con el fabricante.",
  },
  {
    pregunta: "¿Cuánto tarda el envío?",
    respuesta:
      "Los envíos dentro de Lima llegan en 24 a 48 horas. Para provincias el plazo es de 3 a 5 días hábiles. Los pedidos realizados antes de las 2:00 PM se despachan el mismo día.",
  },
  {
    pregunta: "¿Qué métodos de pago aceptan?",
    respuesta:
      "Aceptamos Visa, Mastercard, transferencias bancarias (BCP, Scotiabank), Yape y pago contra entrega en Lima Metropolitana.",
  },
  {
    pregunta: "¿Puedo cambiar o cancelar mi pedido?",
    respuesta:
      "Puedes cancelar o modificar tu pedido dentro de las 2 horas siguientes a la compra, siempre que aún no haya sido despachado. Escríbenos lo antes posible a través del formulario de contacto.",
  },
];

function FaqItem({ pregunta, respuesta }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors"
      >
        <span className="text-sm font-medium">{pregunta}</span>
        <svg
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
          {respuesta}
        </div>
      )}
    </div>
  );
}

export default function Soporte() {
  const user = auth.currentUser;
  const [form, setForm] = useState({
    nombre: user?.displayName || user?.email?.split("@")[0] || "",
    email: user?.email || "",
    asunto: "",
    mensaje: "",
  });
  const [enviado, setEnviado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError("");
    const ahora = new Date();
    const fecha = ahora.toLocaleDateString("es-PE") + ", " + ahora.toLocaleTimeString("es-PE");
    const mensajeCompleto = `NUEVO MENSAJE DE SOPORTE - TECHVAULT\n========================================\nCLIENTE: ${form.nombre}\nEMAIL DE CONTACTO: ${form.email}\nASUNTO: ${form.asunto}\n\nMENSAJE COMPLETO:\n${form.mensaje}\n\nFECHA Y HORA: ${fecha}\nORIGEN: TechVault Support System\nRESPONDER A: ${form.email}\n\n========================================\nEste mensaje fue enviado automáticamente desde el sistema de soporte de TechVault.\nPara responder, simplemente contesta a este email.`;
    try {
      const res = await fetch("https://formsubmit.co/ajax/jjsjpm2@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: form.nombre,
          email: form.email,
          subject: `Soporte TechVault: ${form.asunto}`,
          message: mensajeCompleto,
          _replyto: form.email,
          _subject: `Soporte TechVault: ${form.asunto}`,
        }),
      });
      if (res.ok) {
        setEnviado(true);
        setForm((prev) => ({ ...prev, asunto: "", mensaje: "" }));
      } else {
        setError("No se pudo enviar el mensaje. Intenta de nuevo.");
      }
    } catch {
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f5f7fb] dark:bg-[#0f172a] text-slate-900 dark:text-white">
      <Sidebar />
      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Centro de Soporte</h1>
          <p className="text-slate-500 text-sm mt-1">Estamos aquí para ayudarte</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Columna izquierda ── */}
          <div className="flex flex-col gap-6">

            {/* Contáctanos */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-slate-900 dark:text-white font-semibold mb-4">Contáctanos</h2>
              <div className="flex flex-col gap-3">

                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-700/40 rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 010 12.728M15.536 8.464a5 5 0 010 7.072M6.343 17.657a9 9 0 010-12.728M9.172 15.536a5 5 0 010-7.072M12 12h.01" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-medium">Atención al Cliente</p>
                    <p className="text-slate-500 text-xs">Disponible 24/7</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-700/40 rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-medium">Teléfono</p>
                    <p className="text-slate-500 text-xs">+51 986 182 856</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-700/40 rounded-xl px-4 py-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white text-sm font-medium">Email</p>
                    <p className="text-slate-500 text-xs">jjsjpm2@gmail.com</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Horario */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-slate-900 dark:text-white font-semibold">Horario</h2>
              </div>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Lun - Vie</span>
                  <span className="text-slate-900 dark:text-white">9:00 - 21:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sábados</span>
                  <span className="text-slate-900 dark:text-white">10:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Domingos</span>
                  <span className="text-red-400 font-medium">Cerrado</span>
                </div>
              </div>
            </div>

          </div>

          {/* ── Columna derecha ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* FAQ */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <h2 className="text-slate-900 dark:text-white font-semibold">Preguntas Frecuentes</h2>
              </div>
              <div className="flex flex-col gap-2">
                {FAQS.map((faq) => (
                  <FaqItem key={faq.pregunta} pregunta={faq.pregunta} respuesta={faq.respuesta} />
                ))}
              </div>
            </div>

            {/* Formulario */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-slate-900 dark:text-white font-semibold mb-4">Envíanos un Mensaje</h2>

              {enviado ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
                    <svg className="w-7 h-7 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white font-medium">¡Mensaje enviado!</p>
                  <p className="text-slate-400 text-sm text-center">Nos pondremos en contacto contigo pronto.</p>
                  <button onClick={() => setEnviado(false)} className="mt-2 text-blue-400 text-sm hover:underline">
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-xs mb-1 block">Nombre</label>
                      <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Tu nombre"
                        className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition" />
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs mb-1 block">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="tu@email.com"
                        className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition" />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-500 text-xs mb-1 block">Asunto</label>
                    <input name="asunto" value={form.asunto} onChange={handleChange} required placeholder="¿En qué podemos ayudarte?"
                      className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition" />
                  </div>

                  <div>
                    <label className="text-slate-500 text-xs mb-1 block">Mensaje</label>
                    <textarea name="mensaje" value={form.mensaje} onChange={handleChange} required rows={5} placeholder="Describe tu consulta con detalle..."
                      className="w-full bg-slate-100 dark:bg-slate-700/50 border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 transition resize-none" />
                  </div>

                  {error && <p className="text-red-400 text-sm">{error}</p>}

                  <button type="submit" disabled={enviando}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-60">
                    {enviando ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        Enviar Mensaje
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}



