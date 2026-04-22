import { ShieldCheckIcon, CheckBadgeIcon, CreditCardIcon } from "@heroicons/react/24/outline";

const GUARANTEES = [
  {
    title: "Garantia de Satisfaccion",
    description: "Si no quedas conforme, puedes gestionar una devolucion dentro del plazo establecido.",
    icon: ShieldCheckIcon,
    accent: "green",
  },
  {
    title: "Productos Originales",
    description: "Trabajamos con distribuidores y fabricantes autorizados para cuidar la autenticidad.",
    icon: CheckBadgeIcon,
    accent: "blue",
  },
  {
    title: "Pago Protegido",
    description: "Los datos sensibles se procesan con practicas de seguridad y cifrado moderno.",
    icon: CreditCardIcon,
    accent: "purple",
  },
];

const accentClassMap = {
  green: "border-green-200 dark:border-green-500/40 bg-green-50 dark:bg-green-700/10 text-green-600",
  blue: "border-blue-200 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-700/10 text-blue-600",
  purple: "border-purple-200 dark:border-purple-500/40 bg-purple-50 dark:bg-purple-700/10 text-purple-600",
};

export default function GuaranteesSection() {
  return (
    <div>
      <h2 className="text-2xl font-bold mt-14 mb-4 text-left">Nuestras garantias</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 justify-items-center mb-12">
        {GUARANTEES.map(({ title, description, icon: Icon, accent }) => (
          <div
            key={title}
            className={`bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-lg max-w-sm w-full border ${accentClassMap[accent].split(" ").filter(c => c.startsWith("border")).join(" ")}`}
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-3 mx-auto ${accentClassMap[accent].split(" ").filter(c => c.startsWith("bg-") || c.startsWith("text-")).join(" ")}`}>
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-base font-semibold text-center">{title}</h3>
            <p className="text-gray-600 dark:text-gray-400 text-xs mt-2 text-center">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
