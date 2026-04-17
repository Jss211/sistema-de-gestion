import {
  TagIcon,
} from "@heroicons/react/24/outline";
import CountUp from "./CountUp";

export default function SpecialOffersSection({ onNavigateToCatalog }) {
  return (
    <section className="rounded-[2rem] overflow-hidden bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-700 text-white shadow-2xl border border-white/10">
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] p-8">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm uppercase tracking-[0.25em] text-white/90">
            <TagIcon className="h-4 w-4" />
            Ofertas especiales del mes
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight">
              Descubre nuestras promociones exclusivas
            </h2>
            <p className="max-w-xl text-sm text-white/80 leading-7">
              Válido hasta el 12 de mayo de 2026. Artículos seleccionados con entrega rápida y precios especiales para tu oficina, hogar o estudio.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onNavigateToCatalog}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg transition hover:bg-slate-100"
            >
              Ver ofertas
            </button>
            <button
              onClick={onNavigateToCatalog}
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm text-white/90 transition hover:bg-white/20"
            >
              Ir al catálogo
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">Descuento</p>
                <p className="mt-3 text-xl font-semibold">
                  Hasta <CountUp to={25} duration={1.4} />% en accesorios
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/70">envío express</p>
                <p className="mt-3 text-xl font-semibold">
                  Gratis en compras + $<CountUp to={100} duration={1.6} />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
