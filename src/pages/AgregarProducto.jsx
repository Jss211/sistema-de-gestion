import { useState } from "react";
import { db } from "../firebase"; 
import { collection, addDoc } from "firebase/firestore";

export default function AgregarProducto() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nombre: "", precio: "", stock: "", rating: "4.8", resenas: "0", imageUrl: "", descripcion: "", caracteristicas: ""
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convertimos las características (una por línea) a una lista (Array)
      const lista = form.caracteristicas.split("\n").filter(l => l.trim() !== "");
      
      await addDoc(collection(db, "productos"), {
        ...form,
        precio: parseFloat(form.precio) || 0,
        stock: parseInt(form.stock) || 0,
        caracteristicas: lista,
        fecha: new Date()
      });

      alert("¡Producto guardado exitosamente en TechVault!");
      setForm({ nombre: "", precio: "", stock: "", rating: "4.8", resenas: "0", imageUrl: "", descripcion: "", caracteristicas: "" });
    } catch (err) {
      alert("Error al guardar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = "w-full p-4 bg-[#0a0a0a] border border-gray-800 rounded-2xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-white transition-all placeholder:text-gray-700";
  const labelStyle = "text-xs font-black text-gray-500 uppercase tracking-widest ml-1 mb-2 block";

  return (
    <div className="p-8 bg-black min-h-screen text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-black tracking-tight">Agregar producto</h1>
            <span className="text-blue-500 text-3xl">🛡️</span>
          </div>
          <p className="text-gray-500 text-lg">Gestiona el inventario de tu sistema.</p>
        </header>

        <div className="bg-[#0f1115] border border-gray-900 p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
          {/* Efecto de brillo azul en el fondo */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/5 blur-[100px]"></div>
          
          <form onSubmit={handleSave} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className={labelStyle}>Nombre del producto</label>
              <input required name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej. CPU Intel i9" className={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>Precio (USD)</label>
              <input required name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="0.00" className={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>Stock disponible</label>
              <input required name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Cantidad" className={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>URL de la Imagen</label>
              <input required name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." className={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>Rating inicial</label>
              <input name="rating" value={form.rating} onChange={handleChange} className={inputStyle} />
            </div>

            <div className="space-y-1">
              <label className={labelStyle}>Reseñas</label>
              <input name="resenas" value={form.resenas} onChange={handleChange} className={inputStyle} />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className={labelStyle}>Descripción breve</label>
              <textarea name="descripcion" rows="2" value={form.descripcion} onChange={handleChange} className={inputStyle + " resize-none"} />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className={labelStyle}>Características (una por línea)</label>
              <textarea name="caracteristicas" rows="4" value={form.caracteristicas} onChange={handleChange} placeholder="Potencia: 500W&#10;Color: Negro" className={inputStyle + " resize-none"} />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="md:col-span-2 mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white py-5 rounded-2xl font-black text-xl shadow-[0_10px_30px_rgba(37,99,235,0.2)] hover:shadow-blue-500/40 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "GUARDANDO..." : "GUARDAR PRODUCTO"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}