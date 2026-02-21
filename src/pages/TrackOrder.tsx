import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { Search, Package, Truck, MapPin, CheckCircle2, AlertCircle, Bitcoin, Landmark, Copy } from "lucide-react";

type OrderStatus = 'pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

interface Order {
  id: number;
  status: OrderStatus;
  customer_name: string;
  created_at: string;
  payment_method: 'bank_transfer' | 'bitcoin';
  total: number;
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Order not found. Please check the ID and try again.");
      }
      const data = await response.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const steps = [
    { label: 'Processing', icon: Package, status: ['pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'] },
    { label: 'Shipped', icon: Truck, status: ['Shipped', 'Out for Delivery', 'Delivered'] },
    { label: 'Out for Delivery', icon: MapPin, status: ['Out for Delivery', 'Delivered'] },
    { label: 'Delivered', icon: CheckCircle2, status: ['Delivered'] },
  ];

  const getStepStatus = (stepLabel: string) => {
    if (!order) return 'upcoming';
    
    // Map 'pending' to 'Processing' for visual consistency
    const currentStatus = order.status === 'pending' ? 'Processing' : order.status;
    
    const statusOrder = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const stepIndex = statusOrder.indexOf(stepLabel);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Track Your Order</h1>
        <p className="text-gray-500">Enter your order ID to see the current status of your delivery.</p>
      </div>

      <div className="max-w-md mx-auto mb-16">
        <form onSubmit={handleTrack} className="relative">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. 1)"
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5 shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white px-6 py-2 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
          >
            {loading ? "Searching..." : "Track"}
          </button>
        </form>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 text-sm"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}
      </div>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] border border-black/5 p-8 md:p-12 shadow-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
              <h2 className="text-2xl font-bold">#{order.id}</h2>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Customer</p>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
              <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          {order.status === 'pending' && (
            <div className="mb-12 p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
                {order.payment_method === 'bitcoin' ? <Bitcoin size={20} /> : <Landmark size={20} />}
                Payment Required
              </h3>
              <p className="text-sm text-emerald-800 mb-6">
                Your order is currently pending payment. Please complete the transfer using the details below to begin processing.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.payment_method === 'bitcoin' ? (
                  <div className="md:col-span-2 space-y-3">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest">Bitcoin Address</p>
                    <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200">
                      <code className="text-xs font-mono break-all flex-grow">bc1qt86g2czsdfgg9jxvdhckgvuafvcse4f4hesk0h</code>
                      <button onClick={() => copyToClipboard('bc1qt86g2czsdfgg9jxvdhckgvuafvcse4f4hesk0h')} className="p-2 hover:bg-emerald-50 rounded-lg transition-colors text-emerald-600">
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="text-[10px] text-emerald-600 italic">Send exactly £{order.total.toFixed(2)} worth of BTC.</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-xl border border-emerald-200">
                      <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1">Account Number</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-900">69898946</span>
                        <button onClick={() => copyToClipboard('69898946')} className="text-emerald-600 hover:text-emerald-800"><Copy size={14} /></button>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-emerald-200">
                      <p className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold mb-1">Sort Code</p>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-emerald-900">09-01-28</span>
                        <button onClick={() => copyToClipboard('09-01-28')} className="text-emerald-600 hover:text-emerald-800"><Copy size={14} /></button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-100 hidden md:block" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => {
                const status = getStepStatus(step.label);
                const Icon = step.icon;
                
                return (
                  <div key={step.label} className="flex md:flex-col items-center gap-4 md:gap-0">
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 mb-4
                      ${status === 'completed' ? 'bg-emerald-500 text-white' : 
                        status === 'current' ? 'bg-black text-white ring-4 ring-black/5' : 
                        'bg-gray-100 text-gray-400'}
                    `}>
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col md:items-center">
                      <p className={`text-sm font-bold uppercase tracking-tight ${status === 'upcoming' ? 'text-gray-400' : 'text-black'}`}>
                        {step.label}
                      </p>
                      {status === 'current' && (
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1 animate-pulse">
                          Current Status
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-16 p-6 bg-gray-50 rounded-3xl border border-black/5">
            <h4 className="font-bold mb-2">Delivery Information</h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your order is currently being {order.status === 'pending' ? 'processed' : order.status.toLowerCase()}. 
              You will receive further updates via email as your package moves through our delivery network.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
