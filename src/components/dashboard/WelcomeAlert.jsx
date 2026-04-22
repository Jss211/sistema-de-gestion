import { CheckBadgeIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

export function WelcomeAlert({ userName, onClose }) {
  return (
    <div className="fixed top-4 right-4 max-w-xs w-full z-50">
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-xl shadow-xl overflow-hidden">
        <div className="p-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <CheckBadgeIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold text-sm truncate">Bienvenido, {userName}</div>
            <div className="text-green-100 text-xs">Explora nuestro catalogo tecnologico.</div>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-200"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function LogoutAlert() {
  return (
    <div className="fixed top-5 right-5 bg-blue-600/20 border border-blue-400 text-blue-200 px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fadeIn z-50">
      <InformationCircleIcon className="h-5 w-5" />
      <span>Sesion cerrada correctamente</span>
    </div>
  );
}
