import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { CartItem } from "../types";

export default function Cart({ 
  cart, 
  updateQuantity, 
  removeFromCart 
}: { 
  cart: CartItem[], 
  updateQuantity: (id: number, price: number, delta: number) => void,
  removeFromCart: (id: number, price: number) => void
}) {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Your bag is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything to your bag yet.</p>
        <Link to="/" className="inline-block bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-10">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.map(item => (
            <div key={`${item.id}-${item.price}`} className="flex gap-6 bg-white p-4 rounded-2xl border border-black/5">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id, item.price)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button 
                      onClick={() => updateQuantity(item.id, item.price, -1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.price, 1)}
                      className="p-1 hover:bg-white rounded-md transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="font-semibold">£{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-black/5 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Summary</h2>
            <div className="space-y-4 text-sm mb-6 pb-6 border-b border-black/5">
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
            <Link 
              to="/checkout" 
              className="flex items-center justify-center gap-2 w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-colors"
            >
              Checkout
              <ArrowRight size={18} />
            </Link>
            <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-widest">
              Secure checkout powered by SwiftShip
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
