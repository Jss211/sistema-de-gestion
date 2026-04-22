import { ShieldCheckIcon, TruckIcon, CreditCardIcon, LifebuoyIcon } from "@heroicons/react/24/outline";

const BENEFITS = [
  {
    title: "Garantia Extendida",
    description: "Todos los productos incluyen garantia de fabrica y cobertura adicional por tiempo limitado.",
    icon: ShieldCheckIcon,
    accent: "green",
  },
  {
    title: "Entrega Rapida",
    description: "Pedidos entregados en tiempo reducido para que nunca te quedes sin tecnologia.",
    icon: TruckIcon,
    accent: "blue",
  },
  {
    title: "Pago Seguro",
    description: "Aceptamos tarjetas, billeteras digitales y otros metodos con proteccion de pago.",
    icon: CreditCardIcon,
    accent: "purple",
  },
  {
    title: "Soporte 24/7",
    description: "Nuestro equipo de soporte esta disponible todo el ano para ayudarte.",
    icon: LifebuoyIcon,
    accent: "orange",
  },
];

const accentClassMap = {
  green: "border-green-200 dark:border-green-500/40 bg-green-50 dark:bg-green-700/10 text-green-600",
  blue: "border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-700/10 text-blue-600",
  purple: "border-purple-200 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-700/10 text-purple-600",
  orange: "border-orange-200 dark:border-orange-500/30 bg-orange-50 dark:bg-orange-700/10 text-orange-600",
};

export default function BenefitsSection() {
  return (
    <div>
      <h2 className="text-xl font-semibold mt-10">Por que elegir TechVault</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {BENEFITS.map(({ title, description, icon: Icon, accent }) => (
          <div
            key={title}
            className={`bg-white dark:bg-gray-800 p-5 rounded-xl border shadow-sm text-slate-900 dark:text-white ${accentClassMap[accent].split(" ").filter(c => c.startsWith("border")).join(" ")}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${accentClassMap[accent].split(" ").filter(c => c.startsWith("bg-") || c.startsWith("text-")).join(" ")}`}>
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="font-medium mt-2">{title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
