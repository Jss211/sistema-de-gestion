import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { 
  TrashIcon, 
  CreditCardIcon, 
  QrCodeIcon, 
  BanknotesIcon,
  CheckCircleIcon 
} from "@heroicons/react/24/outline";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(""); // 'mercado-pago', 'yape', 'banco'
  const [step, setStep] = useState(1); // 1: Carrito, 2: Pago, 3: Confirmación

  // Cargar productos del carrito al iniciar
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
    setCart(savedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const handleFinishPayment = () => {
    if (paymentMethod === "mercado-pago") {
      // Aquí disparas el SDK de Mercado Pago
      alert("Redirigiendo a Checkout Pro de Mercado Pago...");
    }
    setStep(3); // Simular éxito
    localStorage.removeItem("techvault_cart");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0f172a] text-slate-900 dark:text-white">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* SECCIÓN IZQUIERDA: PRODUCTOS / MÉTODOS */}
          <div className="lg:col-span-2 space-y-6">
            
            {step === 1 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-blue-600">1. Revisa tus productos</h2>
                {cart.length === 0 ? (
                  <p className="text-slate-500">El carrito está vacío.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b dark:border-slate-700 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-lg" />
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-sm text-slate-500">S/ {item.price}</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:bg-red-50 p-2 rounded-full"><TrashIcon className="h-5 w-5"/></button>
                    </div>
                  ))
                )}
                <button onClick={() => setStep(2)} disabled={cart.length === 0} className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50">
                  Continuar al Pago
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <h2 className="text-xl font-semibold text-blue-600">2. Elige tu método de pago</h2>
                
                {/* OPCIÓN: MERCADO PAGO (VISA) */}
                <div 
                  onClick={() => setPaymentMethod("mercado-pago")}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'mercado-pago' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-bold">Tarjeta Visa (Mercado Pago)</p>
                      <p className="text-xs text-slate-500">Pago instantáneo y seguro</p>
                    </div>
                  </div>
                </div>

                {/* OPCIÓN: YAPE */}
                <div 
                  onClick={() => setPaymentMethod("yape")}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'yape' ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <QrCodeIcon className="h-6 w-6 text-purple-500" />
                    <div>
                      <p className="font-bold">Yape (QR / Teléfono)</p>
                      <p className="text-xs text-slate-500">Transfiere y adjunta tu comprobante</p>
                    </div>
                  </div>
                </div>

                {/* OPCIÓN: TRANSFERENCIA */}
                <div 
                  onClick={() => setPaymentMethod("banco")}
                  className={`p-4 border-2 rounded-2xl cursor-pointer transition ${paymentMethod === 'banco' ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <BanknotesIcon className="h-6 w-6 text-orange-500" />
                    <div>
                      <p className="font-bold">BCP / Scotiabank</p>
                      <p className="text-xs text-slate-500">Depósito a cuenta bancaria</p>
                    </div>
                  </div>
                </div>

                {/* DETALLE SEGÚN ELECCIÓN */}
                {paymentMethod === "yape" && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-center border-t-4 border-purple-500">
                    <p className="font-bold mb-2">Escanea el QR para pagar</p>
                    <div className="w-32 h-32 bg-slate-300 mx-auto mb-2">[IMAGEN QR AQUÍ]</div>
                    <p className="text-sm">Número: <strong>999 888 777</strong></p>
                    <p className="text-xs text-slate-500 mt-2">Envía la captura al WhatsApp de soporte.</p>
                  </div>
                )}

                {paymentMethod === "banco" && (
                  <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl space-y-3 border-t-4 border-orange-500">
                    <div>
                      <p className="text-xs font-bold text-orange-500">BCP</p>
                      <p className="text-sm font-mono">191-XXXXXXXX-0-XX</p>
                    </div>
                    <div className="pt-2 border-t dark:border-slate-700">
                      <p className="text-xs font-bold text-blue-500">SCOTIABANK</p>
                      <p className="text-sm font-mono">000-XXXXXXX-X</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 text-slate-500 font-semibold">Regresar</button>
                  <button onClick={handleFinishPayment} className="flex-[2] bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                    Confirmar Pago de S/ {total}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-sm text-center">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">¡Pedido Recibido!</h2>
                <p className="text-slate-500 mb-6">Estamos procesando tu compra. Si pagaste por Yape o Banco, no olvides enviar tu comprobante.</p>
                <button onClick={() => window.location.href = "/"} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">
                  Volver al Inicio
                </button>
              </div>
            )}
          </div>

          {/* RESUMEN DE COMPRA (STAMP) */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold mb-4">Resumen</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>S/ {total}</span></div>
                <div className="flex justify-between"><span>Envío</span><span className="text-green-500">Gratis</span></div>
                <div className="border-t dark:border-slate-700 my-4 pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>S/ {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}