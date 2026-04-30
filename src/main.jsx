import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./firebase"; // Pre-carga Firebase al iniciar la app

import { BrowserRouter } from "react-router-dom";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import productosLocales from "./data/productos.json";

// Migración automática: sube los productos locales a Firestore solo si está vacío
async function migrarSiVacio() {
  try {
    const snap = await getDocs(collection(db, "productos"));
    if (!snap.empty) return; // Ya hay productos, no hacer nada

    for (const producto of productosLocales) {
      const { id: _localId, ...datos } = producto;
      await addDoc(collection(db, "productos"), {
        ...datos,
        precioAntes: datos.precioAntes ?? null,
        badge: datos.badge ?? null,
        rating: 4.0,
        resenas: 0,
        creadoEn: serverTimestamp(),
      });
    }
    console.log(`✅ ${productosLocales.length} productos migrados a Firestore`);
  } catch (e) {
    console.warn("Migración omitida:", e.message);
  }
}

migrarSiVacio();

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
