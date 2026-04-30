import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { db } from "../../firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { useTheme } from "../../hooks/useTheme";
import { PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const CATEGORIAS = ["Laptops", "PCs", "Mouse", "Monitores", "Accesorios", "Almacenamiento"];
const BADGES = ["", "Oferta", "Nuevo"];
const EMPTY = { nombre: "", categoria: "Laptops", precio: "", precioAntes: "", stock: "", imagen: "", descripcion: "", badge: "", rating: "4.0", resenas: "0" };

export default function AgregarProducto() {
  const { t } = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState(EMPTY);
  const [editId, setEditId]       = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);
  const [success, setSuccess]     = useState("");
  const [error, setError]         = useState("");
  const [search, setSearch]       = useState("");
  const [confirmDel, setConfirmDel] = useState(null);

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "productos"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));
      setProductos(list);
    } catch (e) {
      setError("Error al cargar: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProductos(); }, []);

  const handle = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const openNew = () => { setForm(EMPTY); setEditId(null); setError(""); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const openEdit = (prod) => {
    setForm({
      nombre: prod.nombre || "", categoria: prod.categoria || "Laptops",
      precio: String(prod.precio ?? ""), precioAntes: prod.precioAntes ? String(prod.precioAntes) : "",
      stock: String(prod.stock ?? ""), imagen: prod.imagen || "",
      descripcion: prod.descripcion || "", badge: prod.badge || "",
      rating: String(prod.rating ?? "4.0"), resenas: String(prod.resenas ?? "0"),
    });
    setEditId(prod.id); setError(""); setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.precio || !form.stock) { setError("Nombre, precio y stock son obligatorios."); return; }
    setSaving(true); setError("");
    const data = {
      nombre: form.nombre.trim(), categoria: form.categoria,
      precio: parseFloat(form.precio), precioAntes: form.precioAntes ? parseFloat(form.precioAntes) : null,
      stock: parseInt(form.stock), imagen: form.imagen.trim() || "",
      descripcion: form.descripcion.trim(), badge: form.badge || null,
      rating: parseFloat(form.rating) || 4.0, resenas: parseInt(form.resenas) || 0,
    };
    try {
      if (editId) {
        await updateDoc(doc(db, "productos", editId), { ...data, actualizadoEn: serverTimestamp() });
        setSuccess("Producto actualizado correctamente");
      } else {
        await addDoc(collection(db, "productos"), { ...data, creadoEn: serverTimestamp() });
        setSuccess("Producto agregado correctamente");
      }
      setForm(EMPTY); setEditId(null); setShowForm(false);
      await fetchProductos();
      setTimeout(() => setSuccess(""), 3500);
    } catch (err) {
      setError("Error: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos((prev) => prev.filter((p) => p.id !== id));
      setSuccess("Producto eliminado"); setTimeout(() => setSuccess(""), 2500);
    } catch (err) {
      setError("Error al eliminar: " + err.message);
    } finally {
      setDeleting(null); setConfirmDel(null);
    }
  };

  const inp = { width: "100%", padding: "0.7rem 0.9rem", borderRadius: "10px", background: t.cardBg2, border: `1px solid ${t.border}`, color: t.text, outline: "none", fontSize: "0.9rem", boxSizing: "border-box" };
  const lbl = { color: t.textSub, fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "0.3rem", display: "block" };

  const filtered = productos.filter((p) =>
    (p.nombre || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.categoria || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.pageBg, color: t.text }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-10 md:pt-10">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: t.text }}>
              Gestión de Productos
            </h1>
            <p style={{ color: t.textSub, marginTop: "0.25rem", fontSize: "0.95rem" }}>
              {productos.length} productos en Firebase
            </p>
          </div>
          <button onClick={openNew}
            style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.7rem 1.25rem", borderRadius: "10px", border: "none", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: "0.9rem" }}>
            <PlusIcon style={{ width: "16px" }} /> Nuevo producto
          </button>
        </div>

        {/* Alertas */}
        {success && (
          <div style={{ background: "rgba(16,185,129,0.12)", border: "1px solid #10b981", borderRadius: "10px", padding: "0.75rem 1.25rem", marginBottom: "1.25rem", color: "#10b981", fontWeight: 600, fontSize: "0.88rem" }}>
            ✓ {success}
          </div>
        )}
        {error && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid #ef4444", borderRadius: "10px", padding: "0.75rem 1.25rem", marginBottom: "1.25rem", color: "#ef4444", fontWeight: 600, fontSize: "0.88rem" }}>
            {error}
          </div>
        )}

        {/* Formulario */}
        {showForm && (
          <div style={{ background: t.cardBg, borderRadius: "16px", padding: "1.75rem", border: `1px solid ${t.border}`, marginBottom: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontWeight: 700, color: t.text, fontSize: "1.05rem" }}>
                {editId ? "Editar producto" : "Nuevo producto"}
              </h2>
              <button onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY); setError(""); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: t.textSub }}>
                <XMarkIcon style={{ width: "20px" }} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label style={lbl}>Nombre *</label>
                  <input name="nombre" value={form.nombre} onChange={handle} placeholder="Ej: Laptop Dell XPS 15" style={inp} required />
                </div>
                <div>
                  <label style={lbl}>Categoría</label>
                  <select name="categoria" value={form.categoria} onChange={handle} style={inp}>
                    {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div>
                  <label style={lbl}>Precio (S/) *</label>
                  <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handle} placeholder="0.00" style={inp} required />
                </div>
                <div>
                  <label style={lbl}>Precio anterior</label>
                  <input name="precioAntes" type="number" step="0.01" min="0" value={form.precioAntes} onChange={handle} placeholder="Opcional" style={inp} />
                </div>
                <div>
                  <label style={lbl}>Stock *</label>
                  <input name="stock" type="number" min="0" value={form.stock} onChange={handle} placeholder="0" style={inp} required />
                </div>
                <div>
                  <label style={lbl}>Badge</label>
                  <select name="badge" value={form.badge} onChange={handle} style={inp}>
                    {BADGES.map((b) => <option key={b} value={b}>{b || "Sin badge"}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div>
                  <label style={lbl}>Rating</label>
                  <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handle} style={inp} />
                </div>
                <div>
                  <label style={lbl}>N° reseñas</label>
                  <input name="resenas" type="number" min="0" value={form.resenas} onChange={handle} style={inp} />
                </div>
                <div>
                  <label style={lbl}>URL imagen</label>
                  <input name="imagen" value={form.imagen} onChange={handle} placeholder="https://..." style={inp} />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <label style={lbl}>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handle} rows={3}
                  placeholder="Describe el producto..."
                  style={{ ...inp, resize: "vertical", fontFamily: "inherit" }} />
              </div>

              {form.imagen && (
                <div style={{ marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <img src={form.imagen} alt="preview"
                    style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px", border: `1px solid ${t.border}` }}
                    onError={(e) => { e.target.style.display = "none"; }} />
                  <span style={{ color: t.textSub, fontSize: "0.78rem" }}>Vista previa</span>
                </div>
              )}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button type="button" onClick={() => { setShowForm(false); setEditId(null); setForm(EMPTY); }}
                  style={{ flex: 1, padding: "0.8rem", borderRadius: "10px", border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving}
                  style={{ flex: 2, padding: "0.8rem", borderRadius: "10px", border: "none",
                    background: saving ? t.border : (editId ? "linear-gradient(135deg,#059669,#10b981)" : "linear-gradient(135deg,#1e3a5f,#2563eb)"),
                    color: saving ? t.textSub : "#fff", fontWeight: 700, cursor: saving ? "not-allowed" : "pointer", fontSize: "0.95rem" }}>
                  {saving ? "Guardando..." : (editId ? "Actualizar producto" : "Guardar en Firebase")}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla */}
        <div style={{ background: t.cardBg, borderRadius: "16px", border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 700, color: t.text, fontSize: "0.95rem" }}>
              Productos en Firebase ({filtered.length})
            </span>
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              style={{ ...inp, width: "200px", padding: "0.5rem 0.85rem" }} />
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: t.textSub }}>Cargando...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: t.textSub }}>
              {productos.length === 0 ? "No hay productos en Firebase aún." : "Sin resultados."}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.cardBg2 }}>
                    {["Producto", "Categoría", "Precio", "Stock", "Badge", ""].map((h) => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", color: t.textSub, fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((prod, idx) => (
                    <tr key={prod.id} style={{ borderTop: `1px solid ${t.border}`, background: idx % 2 === 0 ? "transparent" : `${t.cardBg2}60` }}>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                          <div style={{ width: "44px", height: "44px", borderRadius: "8px", overflow: "hidden", flexShrink: 0, background: t.border }}>
                            {prod.imagen
                              ? <img src={prod.imagen} alt={prod.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => { e.target.style.display = "none"; }} />
                              : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: "1.2rem" }}>📦</span>
                            }
                          </div>
                          <div>
                            <p style={{ fontWeight: 700, color: t.text, fontSize: "0.88rem", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{prod.nombre}</p>
                            <p style={{ color: t.textSub, fontSize: "0.72rem" }}>★ {prod.rating || 4} · {prod.resenas || 0} reseñas</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span style={{ padding: "0.2rem 0.65rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 600, background: "rgba(99,102,241,0.12)", color: "#6366f1" }}>
                          {prod.categoria}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <p style={{ fontWeight: 700, color: "#3b82f6", fontSize: "0.9rem" }}>S/ {parseFloat(prod.precio || 0).toFixed(2)}</p>
                        {prod.precioAntes && <p style={{ color: t.textSub, fontSize: "0.72rem", textDecoration: "line-through" }}>S/ {parseFloat(prod.precioAntes).toFixed(2)}</p>}
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span style={{ padding: "0.2rem 0.65rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700,
                          background: prod.stock === 0 ? "rgba(239,68,68,0.12)" : prod.stock <= 8 ? "rgba(245,158,11,0.12)" : "rgba(16,185,129,0.12)",
                          color: prod.stock === 0 ? "#ef4444" : prod.stock <= 8 ? "#f59e0b" : "#10b981" }}>
                          {prod.stock === 0 ? "Sin stock" : `${prod.stock} uds`}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        {prod.badge
                          ? <span style={{ padding: "0.2rem 0.65rem", borderRadius: "20px", fontSize: "0.72rem", fontWeight: 700, background: prod.badge === "Nuevo" ? "rgba(16,185,129,0.12)" : "rgba(245,158,11,0.12)", color: prod.badge === "Nuevo" ? "#10b981" : "#f59e0b" }}>{prod.badge}</span>
                          : <span style={{ color: t.textSub, fontSize: "0.75rem" }}>—</span>
                        }
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <div style={{ display: "flex", gap: "0.4rem" }}>
                          <button onClick={() => openEdit(prod)} title="Editar"
                            style={{ width: "32px", height: "32px", borderRadius: "8px", border: `1px solid ${t.border}`, background: "transparent", color: "#6366f1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <PencilIcon style={{ width: "14px" }} />
                          </button>
                          <button onClick={() => setConfirmDel(prod.id)} title="Eliminar"
                            style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.08)", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <TrashIcon style={{ width: "14px" }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal confirmar eliminar */}
        {confirmDel && (
          <div onClick={() => setConfirmDel(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: t.cardBg, borderRadius: "16px", padding: "2rem", maxWidth: "380px", width: "90%", border: `1px solid ${t.border}`, textAlign: "center" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <TrashIcon style={{ width: "24px", color: "#ef4444" }} />
              </div>
              <h3 style={{ fontWeight: 800, color: t.text, marginBottom: "0.5rem" }}>¿Eliminar producto?</h3>
              <p style={{ color: t.textSub, fontSize: "0.88rem", marginBottom: "1.5rem" }}>
                Esta acción no se puede deshacer.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button onClick={() => setConfirmDel(null)}
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: `1px solid ${t.border}`, background: "transparent", color: t.textMuted, cursor: "pointer", fontWeight: 600 }}>
                  Cancelar
                </button>
                <button onClick={() => handleDelete(confirmDel)} disabled={deleting === confirmDel}
                  style={{ flex: 1, padding: "0.75rem", borderRadius: "10px", border: "none", background: "#ef4444", color: "#fff", cursor: "pointer", fontWeight: 700 }}>
                  {deleting === confirmDel ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
