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
  const [paymentMethod, setPaymentMethod] = useState(""); 
  const [step, setStep] = useState(1); 

  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    date: "",
    cvv: ""
  });

  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("techvault_cart") || "[]");
    setCart(savedCart);
  }, []);

  const total = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  const removeItem = (id) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("techvault_cart", JSON.stringify(updated));
  };

  const handleFinishPayment = () => {

    if (!paymentMethod) {
      alert("Selecciona un método de pago");
      return;
    }

    if (paymentMethod === "mercado-pago") {
      if (!cardData.number || !cardData.name || !cardData.date || !cardData.cvv) {
        alert("Completa los datos de la tarjeta");
        return;
      }
    }

    if ((paymentMethod === "yape" || paymentMethod === "banco") && !voucher) {
      alert("Debes subir tu voucher");
      return;
    }

    // Guardar pedido
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder = {
      id: Date.now(),
      products: cart,
      total,
      paymentMethod,
      status: paymentMethod === "mercado-pago" ? "pagado" : "en_revision",
      voucher: voucher ? voucher.name : null,
      date: new Date().toLocaleString()
    };

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));

    setStep(3);
    localStorage.removeItem("techvault_cart");
  };

  return (
    <div className="flex min-h-screen bg-[#f5f7fb] dark:bg-[#0f172a] text-slate-900 dark:text-white">
      <Sidebar />
      
      <div className="flex-1 p-6 lg:p-10">
        <h1 className="text-3xl font-bold mb-8">Tu Carrito de Compras</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* STEP 1 */}
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

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-full"
                      >
                        <TrashIcon className="h-5 w-5"/>
                      </button>
                    </div>
                  ))
                )}

                <button 
                  onClick={() => setStep(2)} 
                  disabled={cart.length === 0} 
                  className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50"
                >
                  Continuar al Pago
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
                <h2 className="text-xl font-semibold text-blue-600">2. Método de pago</h2>
                
                {/* TARJETA */}
                <div 
                  onClick={() => setPaymentMethod("mercado-pago")}
                  className={`p-4 border-2 rounded-2xl cursor-pointer ${paymentMethod === 'mercado-pago' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCardIcon className="h-6 w-6 text-blue-500" />
                    <p className="font-bold">Tarjeta Visa / Mercado Pago</p>
                  </div>
                </div>

                {paymentMethod === "mercado-pago" && (
                  <div className="space-y-3">
                    <input placeholder="Número de tarjeta" className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700"
                      onChange={(e)=>setCardData({...cardData, number:e.target.value})}/>
                    <input placeholder="Nombre del titular" className="w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-700"
                      onChange={(e)=>setCardData({...cardData, name:e.target.value})}/>
                    <div className="flex gap-3">
                      <input placeholder="MM/YY" className="w-1/2 p-3 rounded-lg bg-slate-100 dark:bg-slate-700"
                        onChange={(e)=>setCardData({...cardData, date:e.target.value})}/>
                      <input placeholder="CVV" className="w-1/2 p-3 rounded-lg bg-slate-100 dark:bg-slate-700"
                        onChange={(e)=>setCardData({...cardData, cvv:e.target.value})}/>
                    </div>
                  </div>
                )}

                {/* YAPE */}
                <div onClick={() => setPaymentMethod("yape")} className="p-4 border-2 rounded-2xl cursor-pointer">
                  <QrCodeIcon className="h-6 w-6 text-purple-500" />
                  <p className="font-bold">Yape</p>
                </div>

                {/* BANCO */}
                <div onClick={() => setPaymentMethod("banco")} className="p-4 border-2 rounded-2xl cursor-pointer">
                  <BanknotesIcon className="h-6 w-6 text-orange-500" />
                  <p className="font-bold">BCP / Scotiabank</p>
                </div>

                {/* VOUCHER PARA YAPE Y BANCO */}
                {(paymentMethod === "yape" || paymentMethod === "banco") && (
                  <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl">
                    <p className="font-bold mb-2">Sube tu voucher</p>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e)=>setVoucher(e.target.files[0])}
                    />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(1)} className="flex-1">Regresar</button>
                  <button onClick={handleFinishPayment} className="flex-[2] bg-green-600 text-white py-3 rounded-xl">
                    Confirmar Pago S/ {total}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center">
                <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">¡Pedido Registrado!</h2>
                <p className="text-slate-500">Tu pedido está en revisión o pagado según el método.</p>
              </div>
            )}
          </div>

          {/* RESUMEN */}
          <div>
            <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm">
              <h2 className="text-lg font-bold mb-4">Resumen</h2>
              <p>Total: S/ {total}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )};