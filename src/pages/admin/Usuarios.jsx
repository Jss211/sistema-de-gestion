import { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { db, auth } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useTheme } from "../../hooks/useTheme";
import { UsersIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Usuarios() {
  const { t } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [search, setSearch] = useState("");

  const currentUid = auth.currentUser?.uid;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "users"));
      const list = snap.docs.map((d) => {
        const data = d.data();
        // El doc ID es el UID — lo usamos como fuente de verdad
        return { ...data, id: d.id, uid: d.id };
      });
      list.sort((a, b) => {
        if (a.uid === currentUid) return -1;
        if (b.uid === currentUid) return 1;
        const ra = (a.role || "").trim().toLowerCase();
        const rb = (b.role || "").trim().toLowerCase();
        if (ra === "admin" && rb !== "admin") return -1;
        if (rb === "admin" && ra !== "admin") return 1;
        return (a.name || "").localeCompare(b.name || "");
      });
      setUsers(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (uid, newRole) => {
    if (uid === currentUid) return;
    setSaving(uid);
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      setUsers((prev) => prev.map((u) => u.uid === uid ? { ...u, role: newRole } : u));
    } catch (err) {
      alert("Error al cambiar rol: " + err.message);
    } finally {
      setSaving(null);
    }
  };

  const filtered = users.filter((u) =>
    (u.name || u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const admins  = users.filter((u) => (u.role || "").trim().toLowerCase() === "admin").length;
  const clients = users.filter((u) => (u.role || "").trim().toLowerCase() !== "admin").length;

  const inputStyle = {
    padding: "0.65rem 1rem", borderRadius: "10px", background: t.cardBg,
    border: `1px solid ${t.border}`, color: t.text, outline: "none", fontSize: "0.88rem",
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: t.pageBg, color: t.text }}>
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-10 md:pt-10">

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: t.text }}>
            Gestión de Usuarios
          </h1>
          <p style={{ color: t.textSub, marginTop: "0.25rem", fontSize: "0.95rem" }}>
            Cambia roles y revisa qué usuarios tienen acceso de administrador
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(160px,100%), 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Usuarios registrados", value: users.length, color: "#6366f1", Icon: UsersIcon },
            { label: "Admins",               value: admins,        color: "#3b82f6", Icon: ShieldCheckIcon },
            { label: "Clientes",             value: clients,       color: "#10b981", Icon: UserIcon },
          ].map(({ label, value, color, Icon }) => (
            <div key={label} style={{ background: t.cardBg, borderRadius: "14px", padding: "1.5rem 1.75rem", border: `1px solid ${t.border}` }}>
              <p style={{ color: t.textSub, fontSize: "0.78rem", marginBottom: "0.6rem" }}>{label}</p>
              <p style={{ color, fontWeight: 800, fontSize: "2rem", lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>
        {/* Buscador */}
        <div style={{ marginBottom: "1.5rem" }}>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o email..."
            style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }} />
        </div>

        {/* Tabla */}
        <div style={{ background: t.cardBg, borderRadius: "16px", border: `1px solid ${t.border}`, overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <UsersIcon style={{ width: "18px", height: "18px", color: "#6366f1" }} />
            <span style={{ fontWeight: 700, color: t.text, fontSize: "0.95rem" }}>Lista de usuarios</span>
          </div>

          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: t.textSub }}>Cargando usuarios...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: t.textSub }}>No se encontraron usuarios</div>
          ) : (
            filtered.map((user, idx) => {
              const role = (user.role || "cliente").trim().toLowerCase();
              const isAdmin = role === "admin";
              const isMe = user.uid === currentUid || user.id === currentUid;
              return (
                <div key={user.id}
                  style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.5rem",
                    borderBottom: idx < filtered.length - 1 ? `1px solid ${t.border}` : "none",
                    background: isMe ? (t.pageBg === "#f1f5f9" ? "rgba(99,102,241,0.04)" : "rgba(99,102,241,0.06)") : "transparent" }}>

                  {/* Info */}                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, color: t.text, fontSize: "0.9rem" }}>
                        {user.name || user.email?.split("@")[0] || "Sin nombre"}
                      </span>
                      {isMe && (
                        <span style={{ padding: "0.1rem 0.5rem", borderRadius: "20px", fontSize: "0.65rem", fontWeight: 700, background: "rgba(99,102,241,0.15)", color: "#6366f1", border: "1px solid #6366f140" }}>
                          Admin protegido
                        </span>
                      )}
                    </div>
                    <p style={{ color: t.textSub, fontSize: "0.78rem" }}>{user.email}</p>
                  </div>

                  {/* Rol actual */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ color: t.textSub, fontSize: "0.72rem", marginBottom: "0.25rem" }}>
                      Rol actual: <span style={{ color: isAdmin ? "#3b82f6" : "#10b981", fontWeight: 700 }}>{isAdmin ? "Admin" : "Cliente"}</span>
                    </p>
                    {/* Selector de rol */}
                    <select
                      value={role}
                      disabled={isMe || saving === (user.uid || user.id)}
                      onChange={(e) => changeRole(user.uid || user.id, e.target.value)}
                      style={{ padding: "0.35rem 0.6rem", borderRadius: "8px", border: `1px solid ${t.border}`, background: t.cardBg2, color: t.text, fontSize: "0.82rem", cursor: isMe ? "not-allowed" : "pointer", opacity: isMe ? 0.5 : 1 }}>
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
