import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import { CreditCard, Bitcoin, MessageCircle, Mail, Star } from "lucide-react";
import { Product, CartItem } from "./types";

// Components
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Contact from "./pages/Contact";
import Category from "./pages/Category";
import TrackOrder from "./pages/TrackOrder";
import ChatBot from "./components/ChatBot";
import About from "./pages/About";
import PaymentInstructions from "./pages/PaymentInstructions";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a] font-sans">
        <Navbar 
          cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)} 
          addToCart={addToCart}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Home addToCart={addToCart} />} />
            <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route 
              path="/cart" 
              element={
                <Cart 
                  cart={cart} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                />
              } 
            />
            <Route 
              path="/checkout" 
              element={<Checkout cart={cart} clearCart={clearCart} />} 
            />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/contact" element={<Contact />} />
            {/* The :categoryName here must match what you click in the footer */}
            <Route path="/category/:categoryName" element={<Category addToCart={addToCart} />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/about" element={<About />} />
            <Route path="/payment-instructions/:orderId" element={<PaymentInstructions />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-black/5 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">OP=ANXIETY-=PainRealif.co</h3>
                <p className="text-gray-500 max-w-xs">
                  Premium pharmaceutical solutions delivered to your doorstep.
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-4 uppercase text-xs tracking-widest text-gray-400">Shop</h4>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/" className="hover:text-black transition-colors">All Products</Link></li>
                  <li><Link to="/about" className="hover:text-black transition-colors">About Us</Link></li>
                  {/* FIXED CATEGORY LINKS TO MATCH DATABASE */}
                  <li><Link to="/category/Anxiety" className="hover:text-black transition-colors">Anxiety</Link></li>
                  <li><Link to="/category/Pain%20Killers" className="hover:text-black transition-colors">Pain Killers</Link></li>
                  <li><Link to="/category/Tobacco" className="hover:text-black transition-colors">Tobacco</Link></li>
                  <li><Link to="/category/Bud-Weed" className="hover:text-black transition-colors">Bud-Weed</Link></li>
                  <li><Link to="/track" className="hover:text-black transition-colors">Track Order</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-4 uppercase text-xs tracking-widest text-gray-400">Contact</h4>
                <ul className="space-y-4 text-sm">
                  <li>
                    <a href="https://wa.me/447871081869" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-black transition-colors">
                      <MessageCircle size={16} className="text-emerald-500" />
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a href="mailto:crezzyocco@gmail.com" className="flex items-center gap-2 hover:text-black transition-colors">
                      <Mail size={16} className="text-blue-500" />
                      Email Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-black/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-xs text-gray-400">© 2026 OP=ANXIETY-=PainRealif.co.</p>
              <div className="flex items-center gap-4 opacity-50 grayscale">
                <CreditCard size={20} /><Bitcoin size={20} />
              </div>
            </div>
          </div>
        </footer>
        <ChatBot />
      </div>
    </Router>
  );
}