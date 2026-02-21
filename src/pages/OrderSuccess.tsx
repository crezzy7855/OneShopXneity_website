import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Package, Mail, Bitcoin, Landmark, Copy } from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(res => res.json())
      .then(data => setOrder(data))
      .catch(err => console.error(err));
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-2xl mx-auto text-center py-20 px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12 }}
        className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full mb-8"
      >
        <CheckCircle2 size={40} />
      </motion.div>

      <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-500 mb-8">
        Thank you for your purchase. Your order <span className="font-mono font-bold text-black">#{id}</span> has been placed and is being processed.
      </p>

      {order && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl border-2 border-emerald-500/20 shadow-xl mb-12 text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5">
            {order.payment_method === 'bitcoin' ? <Bitcoin size={120} /> : <Landmark size={120} />}
          </div>

          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            {order.payment_method === 'bitcoin' ? (
              <><Bitcoin className="text-[#f7931a]" /> Bitcoin Payment Details</>
            ) : (
              <><Landmark className="text-blue-600" /> Bank Transfer Details</>
            )}
          </h3>

          <div className="space-y-6 relative z-10">
            {order.payment_method === 'bitcoin' ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">Please send exactly <span className="font-bold text-black">£{order.total.toFixed(2)}</span> worth of BTC to:</p>
                <div className="flex items-center gap-2 bg-gray-50 p-4 rounded-xl border border-black/5 group">
                  <code className="text-xs font-mono break-all flex-grow">bc1qt86g2czsdfgg9jxvdhckgvuafvcse4f4hesk0h</code>
                  <button 
                    onClick={() => copyToClipboard('bc1qt86g2czsdfgg9jxvdhckgvuafvcse4f4hesk0h')}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-gray-400 hover:text-black"
                  >
                    <Copy size={16} />
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-3 italic">Your order will be marked as paid automatically once the transaction is confirmed on the blockchain.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-black/5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Account Number</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">69898946</span>
                    <button onClick={() => copyToClipboard('69898946')} className="text-gray-400 hover:text-black"><Copy size={14} /></button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-black/5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Sort Code</p>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold">09-01-28</span>
                    <button onClick={() => copyToClipboard('09-01-28')} className="text-gray-400 hover:text-black"><Copy size={14} /></button>
                  </div>
                </div>
                <div className="sm:col-span-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <p className="text-xs text-emerald-800">
                    <strong>Reference:</strong> Please use order ID <span className="font-bold">#{id}</span> as your payment reference.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-black/5 flex items-start gap-4 text-left">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
            <Mail size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Check your email</h4>
            <p className="text-xs text-gray-500">We've sent a confirmation email with your order details and payment instructions.</p>
          </div>
        </div>
        <Link to="/track" className="bg-white p-6 rounded-2xl border border-black/5 flex items-start gap-4 text-left hover:border-black/10 transition-colors">
          <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
            <Package size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-1">Track delivery</h4>
            <p className="text-xs text-gray-500">Click here to track your order status using your Order ID.</p>
          </div>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/" 
          className="w-full sm:w-auto bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors"
        >
          Continue Shopping
        </Link>
        <button className="w-full sm:w-auto text-gray-500 hover:text-black transition-colors text-sm font-medium flex items-center gap-2">
          View Order History
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
