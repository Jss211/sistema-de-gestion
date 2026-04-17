const paymentMethods = [
  { name: "Visa", src: "/payment-logos/visa.png" },
  { name: "Yape", src: "/payment-logos/yape.png" },
  { name: "BCP", src: "/payment-logos/bcp.png" },
  { name: "Scotiabank", src: "/payment-logos/scotiabank.png" },
];

export default function PaymentMethodsSection() {
  const baseLoop = [...paymentMethods, ...paymentMethods, ...paymentMethods];
  const marqueeItems = [...baseLoop, ...baseLoop];

  return (
    <section className="mt-10 mb-10 rounded-3xl border border-blue-100 dark:border-blue-500/30 bg-white dark:bg-gray-800 shadow-xl p-6 md:p-8 overflow-hidden">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
        Metodos de pago
      </h3>
      <p className="text-sm mt-1 mb-5 text-slate-600 dark:text-slate-300">
        Aceptamos Visa, Yape, BCP y Scotiabank.
      </p>

      <div className="payment-marquee">
        <div className="payment-track">
          {marqueeItems.map((method, index) => (
            <div
              className="payment-logo-card"
              key={`${method.name}-${index}`}
              title={method.name}
            >
              <img src={method.src} alt={method.name} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .payment-marquee {
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .payment-track {
          display: flex;
          width: max-content;
          gap: 16px;
          animation: paymentLoop 22s linear infinite;
        }

        .payment-logo-card {
          height: 74px;
          min-width: 160px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #dbeafe;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 14px;
        }

        .dark .payment-logo-card {
          background: rgba(15, 23, 42, 0.95);
          border-color: rgba(96, 165, 250, 0.35);
        }

        .payment-logo-card img {
          max-width: 130px;
          max-height: 52px;
          width: auto;
          height: auto;
          object-fit: contain;
        }

        @keyframes paymentLoop {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
