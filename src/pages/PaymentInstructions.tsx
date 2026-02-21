import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Landmark, Bitcoin, Copy, Check, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { Order } from "../types";

export default function PaymentInstructions() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`)
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Return to shop</Link>
      </div>
    );
  }

  const isBankTransfer = order.payment_method === 'bank_transfer';

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-black tracking-tight mb-2">Order Received!</h1>
        <p className="text-gray-500 font-medium">Order ID: #{orderId?.slice(-6).toUpperCase()}</p>
        <p className="text-gray-500 mt-4">
          To complete your order, please follow the payment instructions below. 
          Your order will be processed as soon as we confirm receipt of your payment.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[2.5rem] border border-black/5 shadow-xl overflow-hidden"
      >
        <div className={`p-8 ${isBankTransfer ? 'bg-blue-50' : 'bg-orange-50'} flex items-center justify-between`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isBankTransfer ? 'bg-blue-600 text-white' : 'bg-[#f7931a] text-white'}`}>
              {isBankTransfer ? <Landmark size={24} /> : <Bitcoin size={24} />}
            </div>
            <div>
              <h2 className="font-bold text-lg">{isBankTransfer ? 'Bank Transfer' : 'Bitcoin Payment'}</h2>
              <p className="text-sm opacity-70">Amount to pay: £{order.total.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 bg-white/50 rounded-full">Pending</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          {isBankTransfer ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 relative group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Sort Code</p>
                  <p className="font-mono text-xl font-bold">09-08-01</p>
                  <button 
                    onClick={() => copyToClipboard("090801", "sort")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    {copied === "sort" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-gray-400" />}
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 relative group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Account Number</p>
                  <p className="font-mono text-xl font-bold">69898946</p>
                  <button 
                    onClick={() => copyToClipboard("69898946", "account")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    {copied === "account" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-gray-400" />}
                  </button>
                </div>
                <div className="p-4 bg-gray-50 rounded-2xl border border-black/5 relative group">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Reference</p>
                  <p className="font-mono text-xl font-bold">ORDER-{orderId?.slice(-6).toUpperCase()}</p>
                  <button 
                    onClick={() => copyToClipboard(`ORDER-${orderId?.slice(-6).toUpperCase()}`, "ref")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-black/5 rounded-lg transition-colors"
                  >
                    {copied === "ref" ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-gray-400" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-6 bg-gray-50 rounded-3xl border border-black/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Bitcoin Wallet Address</p>
                <div className="bg-white p-4 rounded-2xl border border-black/5 mb-4 break-all font-mono text-sm font-bold">
                  bc1qt86g2czsdfgg9jxvdhckgvuafvcse4f4hesk0h
                </div>
                <button 
                  onClick={() => copyToClipboard("bc1qt86g2czsdfgg9jxvdhckgvuafvcse4f4hesk0h", "btc")}
                  className="flex items-center gap-2 mx-auto px-6 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 transition-transform"
                >
                  {copied === "btc" ? <Check size={18} /> : <Copy size={18} />}
                  {copied === "btc" ? "Copied!" : "Copy Address"}
                </button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-orange-50 text-orange-700 rounded-2xl border border-orange-100">
                <Clock size={20} className="flex-shrink-0" />
                <p className="text-xs font-medium">Please send the exact amount. Bitcoin transactions may take 10-30 minutes to confirm.</p>
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-black/5">
            <h3 className="font-bold mb-4">Next Steps:</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold mt-0.5">1</div>
                <span>Complete the {isBankTransfer ? 'transfer' : 'payment'} using the details above.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold mt-0.5">2</div>
                <span>Take a screenshot of your payment confirmation.</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold mt-0.5">3</div>
                <span>Send the screenshot to our WhatsApp support for faster processing.</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link 
          to="/track" 
          className="flex-grow flex items-center justify-center gap-2 bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-900 transition-all"
        >
          Track My Order
          <ArrowRight size={18} />
        </Link>
        <Link 
          to="/" 
          className="flex-grow flex items-center justify-center gap-2 bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
}
