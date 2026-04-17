import { Shield, Truck, CreditCard, HeadphonesIcon, Award, TrendingUp, Users } from 'lucide-react';

/**
 * Componente que muestra las tarjetas de beneficios.
 */
function FeatureCard({ icon: Icon, title, description, color, darkMode }) { 
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow`}>
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className={`${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>{title}</h3>
      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{description}</p>
    </div>
  );
}

/**
 * Componente principal de la vista de Inicio (Dashboard).
 */
export function HomeWelcome({ userName, onNavigateToCatalog, darkMode }) { 
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-black to-blue-900 rounded-2xl shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="p-8 lg:p-12 text-white">
            <h1 className="text-white mb-4">
              Bienvenido{userName ? `, ${userName.split('@')[0]}` : ""}
            </h1>
            <p className="text-blue-100 mb-6 leading-relaxed">
              En <strong>TechVault</strong> encontrarás los mejores productos tecnológicos del mercado. 
              Somos tu aliado confiable para equipar tu oficina, hogar o estudio con la última tecnología.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  4.8/5 Calificacion
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  Envio Gratis
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  100% Garantizado
                </p>
              </div>
            </div>
          </div>
          <div className="h-64 lg:h-full bg-gradient-to-br from-blue-600 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 p-8">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                  <TrendingUp className="w-12 h-12 text-white mb-2" />
                  <p className="text-white">Productos Top</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                  <Award className="w-12 h-12 text-white mb-2" />
                  <p className="text-white">Certificados</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                  <Shield className="w-12 h-12 text-white mb-2" />
                  <p className="text-white">Garantía</p>
                </div>
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl">
                  <Users className="w-12 h-12 text-white mb-2" />
                  <p className="text-white">+10K Clientes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>¿Por qué elegir TechVault?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <FeatureCard
            icon={Shield}
            title="Garantía Extendida"
            description="Todos nuestros productos incluyen garantía de fábrica más 6 meses adicionales sin costo"
            color="blue"
            darkMode={darkMode}
          />
          <FeatureCard
            icon={Truck}
            title="Envío Gratis"
            description="Envío gratuito en compras mayores a $100. Entrega en 24-48 horas"
            color="green"
            darkMode={darkMode}
          />
          <FeatureCard
            icon={CreditCard}
            title="Pago Seguro"
            description="Múltiples métodos de pago: tarjetas, PayPal, transferencias y más"
            color="purple"
            darkMode={darkMode}
          />
          <FeatureCard
            icon={HeadphonesIcon}
            title="Soporte 24/7"
            description="Equipo de atención al cliente disponible todos los días del año"
            color="orange"
            darkMode={darkMode}
          />
        </div>
      </div>

      {/* Guarantees */}
      <div>
        <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>Nuestras Garantías</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className={`${darkMode ? 'bg-gray-800 border-green-700' : 'bg-white border-green-200'} rounded-xl shadow-sm p-6 border-2`}>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Garantía de Satisfacción</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Si no estás 100% satisfecho, devuelve tu producto dentro de 30 días sin preguntas
            </p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-200'} rounded-xl shadow-sm p-6 border-2`}>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Productos Originales</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              100% productos originales y nuevos. Trabajamos directamente con fabricantes autorizados
            </p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800 border-purple-700' : 'bg-white border-purple-200'} rounded-xl shadow-sm p-6 border-2`}>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className={darkMode ? 'text-white' : 'text-gray-900'}>Pago Protegido</h3>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
              Tus datos están protegidos con encriptación SSL. Compra segura garantizada
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className={`${darkMode ? 'bg-black' : 'bg-gradient-to-br from-gray-800 to-gray-900'} rounded-2xl p-8 text-white`}>
        <h2 className="text-white mb-8 text-center">TechVault en Números</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-white mb-2">+10,000</p>
            <p className="text-gray-400">Clientes Satisfechos</p>
          </div>
          <div className="text-center">
            <p className="text-white mb-2">+500</p>
            <p className="text-gray-400">Productos Disponibles</p>
          </div>
          <div className="text-center">
            <p className="text-white mb-2">4.8/5</p>
            <p className="text-gray-400">Calificación Promedio</p>
          </div>
          <div className="text-center">
            <p className="text-white mb-2">24/7</p>
            <p className="text-gray-400">Soporte al Cliente</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={`${darkMode ? 'bg-gray-800 border-blue-700' : 'bg-white border-blue-200'} rounded-2xl shadow-sm p-8 text-center border-2`}>
        <h2 className={darkMode ? 'text-white' : 'text-gray-900'}>¿Listo para empezar?</h2>
        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mt-3 mb-6 max-w-2xl mx-auto`}>
          Explora nuestro catálogo completo y encuentra los mejores productos tecnológicos 
          al mejor precio del mercado
        </p>
        <button 
          onClick={onNavigateToCatalog}
          className="bg-gradient-to-r from-blue-600 to-black text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-gray-900 transition-all shadow-lg btn-animated hover:scale-105"
        >
          Ver Catálogo Completo
        </button>
      </div>
    </div>
  );
}
