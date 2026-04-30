import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // 1. IMPORTANTE: Debes importar esto

const firebaseConfig = {
  apiKey: "AIzaSyB6H0MF7j0Wb2E6wcvXwYbMr7d_L-f0yko",
  authDomain: "sistema-de-gestion-6f67b.firebaseapp.com",
  projectId: "sistema-de-gestion-6f67b",
  storageBucket: "sistema-de-gestion-6f67b.firebasestorage.app",
  messagingSenderId: "442724414383",
  appId: "1:442724414383:web:575ca72f4a236275a4b55a",
  measurementId: "G-536J1WSJ5K",
};

const app = initializeApp(firebaseConfig);

// 2. EXPORTACIONES (Asegúrate de que 'db' esté aquí)
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app); // <--- ESTA LÍNEA ES LA QUE FALTA O ESTÁ MAL
export default app;