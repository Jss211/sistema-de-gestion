export default function CtaSection() {
  return (
    <div className="mt-14 p-10 rounded-3xl shadow-xl border border-blue-100 bg-white text-center dark:bg-gray-800 dark:text-white dark:border-blue-500/40 mb-10">
      <p className="text-slate-900 dark:text-white text-lg font-semibold">
        Listo para empezar
      </p>
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
        Explora nuestro catalogo completo y encuentra productos tecnologicos
        con una presentacion mas limpia y profesional.
      </p>
      <div className="flex justify-center mt-6">
        <button
          onClick={() => (window.location.href = "/catalogo")}
          className="px-8 py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-2xl hover:scale-[1.03] transition cursor-pointer relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          Ver catálogo completo
        </button>
      </div>
    </div>
  );
}
