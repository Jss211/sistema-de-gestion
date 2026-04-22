import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { X, Eye, EyeOff } from "lucide-react";

export default function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState("login"); // "login" | "register" | "reset"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const messages = {
        "auth/email-already-in-use": "Este correo ya está registrado.",
        "auth/invalid-email": "Correo inválido.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/invalid-credential": "Correo o contraseña incorrectos.",
      };
      setError(messages[err.code] || "Ocurrió un error. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Error al iniciar sesión con Google.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (err) {
      const messages = {
        "auth/user-not-found": "No existe una cuenta con ese correo.",
        "auth/invalid-email": "Correo inválido.",
      };
      setError(messages[err.code] || "Error al enviar el correo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Logo/Brand */}
          {mode === "login" && (
            <div className="flex flex-col items-center mb-6 -mt-4">
              <img 
                src="/logo_god_-removebg-preview.png" 
                alt="TechVault Logo" 
                className="h-28 w-28 object-contain -mb-3"
              />
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                TechVault
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Sistema de Gestión
              </p>
            </div>
          )}

          <h2 className="text-xl font-bold text-center text-slate-900 dark:text-white mb-1 mt-2">
            {mode === "register" ? "Crear Cuenta" : mode === "reset" ? "Recuperar Contraseña" : "Iniciar Sesión"}
          </h2>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">
            {mode === "register"
              ? "Únete y disfruta de beneficios exclusivos"
              : mode === "reset"
              ? "Ingresa tu email y te enviaremos instrucciones"
              : "Ingresa tus datos para continuar"}
          </p>

          {/* Google Button */}
          {mode === "login" && (
            <>
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-60"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">O continúa con email</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
              </div>
            </>
          )}

          <form onSubmit={mode === "reset" ? handlePasswordReset : handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {mode !== "reset" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                  {mode === "login" && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode("reset");
                        setError("");
                        setResetEmailSent(false);
                      }}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2 inline-block"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>

                {mode === "register" && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Confirmar contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repite tu contraseña"
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {resetEmailSent && mode === "reset" && (
              <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl px-4 py-3">
                ✓ Instrucciones enviadas a tu correo
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Cargando..."
                : mode === "register"
                ? "Crear Cuenta"
                : mode === "reset"
                ? "Enviar Instrucciones"
                : "Iniciar Sesión"}
            </button>
          </form>

          <div className="mt-4 text-center">
            {mode === "reset" ? (
              <button
                onClick={() => {
                  setMode("login");
                  setError("");
                  setResetEmailSent(false);
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Volver al inicio de sesión
              </button>
            ) : (
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                {mode === "login"
                  ? "¿No tienes cuenta? Crear cuenta"
                  : "¿Ya tienes cuenta? Inicia sesión"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}
