import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Bitcoin, Truck, Landmark, Loader2 } from "lucide-react";
import { CartItem, Order } from "../types";

export default function Checkout({ cart, clearCart }: { cart: CartItem[], clearCart: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'bitcoin'>('bank_transfer');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    zip: ""
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const orderData: Order = {
      customer_name: formData.name,
      customer_email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.zip}`,
      items: cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.price })),
      total: total,
      payment_method: paymentMethod
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (data.orderId) {
        setIsSuccess(true);
        clearCart();
        navigate(`/payment-instructions/${data.orderId}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !isSuccess) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-10">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Truck size={20} />
              Delivery Details
            </h2>
            <div className="space-y-4">
              <input
                required
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
              <input
                required
                type="text"
                placeholder="Shipping Address"
                className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  placeholder="City"
                  className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
                <input
                  required
                  type="text"
                  placeholder="ZIP Code"
                  className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
                  value={formData.zip}
                  onChange={e => setFormData({ ...formData, zip: e.target.value })}
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard size={20} />
              Payment Method
            </h2>
            <div className="grid grid-cols-1 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  paymentMethod === 'bank_transfer' ? 'border-black bg-black text-white' : 'border-black/5 hover:border-black/20'
                }`}
              >
                <Landmark size={24} />
                <div className="text-left">
                  <p className="font-medium">Bank Transfer</p>
                  <p className={`text-xs ${paymentMethod === 'bank_transfer' ? 'text-gray-400' : 'text-gray-500'}`}>
                    Direct transfer to our account
                  </p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bitcoin')}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  paymentMethod === 'bitcoin' ? 'border-[#f7931a] bg-[#f7931a] text-white' : 'border-black/5 hover:border-[#f7931a]/20'
                }`}
              >
                <Bitcoin size={24} />
                <div className="text-left">
                  <p className="font-medium">Bitcoin</p>
                  <p className={`text-xs ${paymentMethod === 'bitcoin' ? 'text-orange-100' : 'text-gray-500'}`}>
                    Pay with BTC via Lightning or On-chain
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-black/5">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.name} x {item.quantity}</span>
                  <span className="font-medium">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-black/5 pt-4 mb-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>£{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : `£${shipping.toFixed(2)}`}</span>
              </div>
            </div>
            <div className="flex justify-between font-bold text-lg mb-8">
              <span>Total</span>
              <span>£{total.toFixed(2)}</span>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                `Pay £${total.toFixed(2)}`
              )}
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-black/5">
            <p className="text-xs text-gray-500 leading-relaxed">
              {paymentMethod === 'bank_transfer' ? (
                "After clicking 'Pay', you will receive our bank details to complete the transfer. Your order will be processed once the funds are received."
              ) : (
                "You will be redirected to our secure Bitcoin payment gateway. Please ensure you have your wallet ready to scan the QR code."
              )}
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
