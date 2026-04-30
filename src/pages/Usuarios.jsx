import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { UserGroupIcon, ShieldCheckIcon, UserIcon } from "@heroicons/react/24/outline";

export default function Usuarios() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "usuarios"), (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    });
    return () => unsubscribe();
  }, []);

  const actualizarRol = async (id, nuevoRol) => {
    try {
      const userRef = doc(db, "usuarios", id);
      await updateDoc(userRef, { rol: nuevoRol });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const totalAdmins = users.filter(u => u.rol?.toLowerCase() === "admin").length;

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex items-center gap-4">
          <div className="bg-blue-600/20 p-3 rounded-2xl border border-blue-500/30">
            <ShieldCheckIcon className="h-8 w-8 text-blue-500" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Gestión de usuarios</h1>
            <p className="text-gray-500 uppercase text-[10px] font-bold tracking-widest mt-1">Control de acceso TechVault</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#0f1115] border border-gray-800 p-6 rounded-[24px] flex items-center gap-4">
            <div className="bg-blue-600/20 p-3 rounded-xl"><UserGroupIcon className="h-6 w-6 text-blue-500" /></div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase">Total Usuarios</p>
              <h2 className="text-3xl font-black">{users.length}</h2>
            </div>
          </div>
          <div className="bg-[#0f1115] border border-gray-800 p-6 rounded-[24px] flex items-center gap-4">
            <div className="bg-emerald-600/20 p-3 rounded-xl"><ShieldCheckIcon className="h-6 w-6 text-emerald-500" /></div>
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase">Administradores</p>
              <h2 className="text-3xl font-black text-emerald-500">{totalAdmins}</h2>
            </div>
          </div>
        </div>

        <div className="bg-[#0f1115] border border-gray-800 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="divide-y divide-gray-800">
            {users.map((user) => (
              <div key={user.id} className="p-6 hover:bg-[#161b22] transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center font-black">
                    {user.email?.[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold">{user.nombre || "Usuario"}</h4>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
                <select
                  value={user.rol || "Cliente"}
                  onChange={(e) => actualizarRol(user.id, e.target.value)}
                  className="bg-black border border-gray-700 text-white text-sm rounded-xl p-2 outline-none focus:border-blue-500"
                >
                  <option value="Cliente">Cliente</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}