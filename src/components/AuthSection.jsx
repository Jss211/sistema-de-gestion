import { useState, useEffect, lazy, Suspense } from "react";
import StarBorder from "./StarBorder";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const AuthModal = lazy(() => import("./AuthModal"));

export default function AuthSection() {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Si el usuario está autenticado, no mostrar nada
  if (user) {
    return null;
  }

  return (
    <section className="relative py-16 px-4 overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-[#0f172a] dark:via-[#111827] dark:to-[#1e293b] border border-blue-200 dark:border-slate-700/70 rounded-3xl p-8 md:p-10 shadow-2xl text-center">
          <div className="mx-auto w-fit px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-white/5 border border-blue-200 dark:border-white/15 text-blue-700 dark:text-slate-200 text-xs uppercase tracking-[0.2em]">
            Beneficios exclusivos
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300">
            <span className="text-sm">Unete gratis cuando quieras</span>
          </div>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-snug">
            Hey, todavia no te unes?
          </h2>
          <p className="mt-4 text-base md:text-lg text-slate-700 dark:text-blue-100 max-w-2xl mx-auto">
            Crea tu cuenta y desbloquea recompensas increibles, promos especiales y sorpresas para ti.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <StarBorder
              as="button"
              onClick={() => setShowModal(true)}
              className="star-border-primary w-full sm:w-auto min-w-[220px] rounded-full shadow-xl"
              color="#3b82f6"
              speed="5s"
              thickness={2}
            >
              Quiero unirme
            </StarBorder>
            <StarBorder
              as="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="star-border-secondary w-full sm:w-auto min-w-[220px] rounded-full"
              color="#60a5fa"
              speed="5s"
              thickness={2}
            >
              Seguir como invitado
            </StarBorder>
          </div>

          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            Rapido, gratis y con beneficios desde hoy.
          </p>
        </div>
      </div>

      {showModal && (
        <Suspense fallback={null}>
          <AuthModal
            onClose={() => setShowModal(false)}
            onSuccess={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          />
        </Suspense>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.7s ease-out; }
      `}</style>
    </section>
  );
}
