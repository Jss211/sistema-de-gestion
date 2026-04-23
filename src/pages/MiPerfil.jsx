import { useState, useEffect, useRef } from "react";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "./Sidebar";

// Utilidad: leer total de compras del cliente desde localStorage (orders)
function getTotalCompras() {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return orders.reduce((acc, o) => acc + (o.total || 0), 0);
}

function getTotalPedidos() {
  return JSON.parse(localStorage.getItem("orders") || "[]").length;
}

// Utilidad: formatear fecha de registro Firebase
function formatFechaRegistro(user) {
  if (!user?.metadata?.creationTime) return "—";
  const fecha = new Date(user.metadata.creationTime);
  return fecha.toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" });
}

export default function MiPerfil() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("Cliente");
  const [form, setForm] = useState({ nombre: "", username: "", telefono: "", direccion: "", ciudad: "", codigoPostal: "", pais: "" });
  const [fotoURL, setFotoURL] = useState("");
  const [totalCompras, setTotalCompras] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alerta, setAlerta] = useState(""); // mensaje de éxito
  const fileRef = useRef();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;
      setUser(u);
      setTotalCompras(getTotalCompras());
      setTotalPedidos(getTotalPedidos());

      // Leer rol desde Firestore
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const role = (snap.data().role || "cliente").trim().toLowerCase();
          setUserRole(role === "admin" ? "Admin" : "Cliente");
        }
      } catch {}

      // Cargar datos guardados en localStorage
      const saved = JSON.parse(localStorage.getItem(`perfil_${u.uid}`) || "{}");

      // La foto: primero localStorage (base64), luego Firebase, luego vacío
      setFotoURL(saved.photoURL || u.photoURL || "");

      // Nombre: prioridad → guardado por el usuario → displayName de Google → vacío
      const nombreBase = saved.nombre || u.displayName || "";
      const usernameBase = saved.username || u.displayName || "";

      setForm({
        nombre: nombreBase,
        username: usernameBase,
        telefono: saved.telefono || "",
        direccion: saved.direccion || "",
        ciudad: saved.ciudad || "",
        codigoPostal: saved.codigoPostal || "",
        pais: saved.pais || "",
      });
    });
    return () => unsub();
  }, []);

  // Subir foto: se guarda en base64 en localStorage (sin Firebase Storage)
  const handleFoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const base64 = ev.target.result;
        // Guardar en localStorage
        const saved = JSON.parse(localStorage.getItem(`perfil_${user.uid}`) || "{}");
        localStorage.setItem(`perfil_${user.uid}`, JSON.stringify({ ...saved, photoURL: base64 }));
        setFotoURL(base64);
        // Intentar actualizar Firebase también (puede fallar si no hay Storage configurado)
        try { await updateProfile(user, { photoURL: base64.slice(0, 500) }); } catch {}
        window.dispatchEvent(new Event("profile_updated"));
        mostrarAlerta("Foto actualizada correctamente");
        setUploading(false);
      };
      reader.onerror = () => {
        mostrarAlerta("Error al leer la imagen. Intenta de nuevo.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      mostrarAlerta("Error al subir la foto. Intenta de nuevo.");
      setUploading(false);
    }
  };

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleGuardar = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: form.nombre });
      localStorage.setItem(`perfil_${user.uid}`, JSON.stringify({ ...form, photoURL: fotoURL }));
      window.dispatchEvent(new Event("profile_updated"));
      mostrarAlerta("Cambios guardados exitosamente");
    } catch {
      mostrarAlerta("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  const mostrarAlerta = (msg) => {
    setAlerta(msg);
    setTimeout(() => setAlerta(""), 3500);
  };

  const nombreMostrado = form.nombre || user?.displayName || "";
  const inicial = nombreMostrado ? nombreMostrado.charAt(0).toUpperCase() : (user?.displayName?.charAt(0)?.toUpperCase() || "U");

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#f5f7fb] dark:bg-[#0f172a] text-slate-900 dark:text-white">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6 lg:p-10 overflow-x-hidden">

        {/* Alerta de éxito */}
        {alerta && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-xl shadow-xl animate-fade-in">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">{alerta}</span>
          </div>
        )}

        <div className="mb-6">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <p className="text-slate-500 text-sm mt-1">Administra tu información personal</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Columna izquierda: avatar + stats ── */}
          <div className="flex flex-col gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-3">

              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ring-4 ring-blue-500/20">
                  {fotoURL ? (
                    <img src={fotoURL} alt="foto" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-bold">{inicial}</span>
                  )}
                </div>
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center shadow-lg transition"
                  title="Cambiar foto"
                >
                  {uploading ? (
                    <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFoto} />
              </div>

              <div className="text-center">
                <p className="font-semibold text-slate-900 dark:text-white">{nombreMostrado}</p>
                <p className="text-xs text-slate-500">{userRole}</p>
              </div>
            </div>

            {/* Miembro desde */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-xs text-slate-500 mb-1">Miembro desde</p>
              <p className="font-semibold text-slate-900 dark:text-white text-sm">{user ? formatFechaRegistro(user) : "—"}</p>
            </div>

            {/* Total de compras */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-center">
              <p className="text-xs text-slate-500 mb-1">Total gastado</p>
              <p className="font-bold text-blue-500 text-xl">
                S/ {totalCompras.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-slate-400 mt-1">{totalPedidos} {totalPedidos === 1 ? "pedido" : "pedidos"}</p>
            </div>
          </div>

          {/* ── Columna derecha: formulario ── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Información personal */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Información Personal</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Nombre completo" name="nombre" value={form.nombre} onChange={handleChange}
                  icon={<UserIcon />} placeholder="Tu nombre completo" />
                <Field label="Nombre de usuario" name="username" value={form.username} onChange={handleChange}
                  icon={<UserIcon />} placeholder="@usuario" />
                <Field label="Correo electrónico" name="email" value={user?.email || ""} readOnly
                  icon={<MailIcon />} placeholder="tu@email.com" />
                <Field label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange}
                  icon={<PhoneIcon />} placeholder="+51 999 999 999" />
              </div>
            </div>

            {/* Dirección de envío */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Dirección de Envío</h2>
              <div className="flex flex-col gap-4">
                <Field label="Dirección completa" name="direccion" value={form.direccion} onChange={handleChange}
                  icon={<MapIcon />} placeholder="Av. Principal 123, Piso 2" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Ciudad" name="ciudad" value={form.ciudad} onChange={handleChange} placeholder="Lima" />
                  <Field label="Código Postal" name="codigoPostal" value={form.codigoPostal} onChange={handleChange} placeholder="15001" />
                  <Field label="País" name="pais" value={form.pais} onChange={handleChange} placeholder="Perú" />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition disabled:opacity-60"
              >
                {saving ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                Guardar Cambios
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ── Componente campo reutilizable ──
function Field({ label, name, value, onChange, icon, placeholder, readOnly }) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4">
            {icon}
          </span>
        )}
        <input
          name={name}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder || ""}
          className={`w-full ${icon ? "pl-9" : "pl-4"} pr-4 py-3 rounded-xl border text-sm transition
            ${readOnly
              ? "bg-slate-100 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              : "bg-white dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            }`}
        />
      </div>
    </div>
  );
}

// ── Iconos SVG inline ──
function UserIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}
function MapIcon() {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}
