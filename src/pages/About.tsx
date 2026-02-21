import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Truck, Clock, Heart, ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: ShieldCheck,
      title: "Quality Assured",
      description: "All our pharmaceutical products are sourced from reputable manufacturers and undergo strict quality control."
    },
    {
      icon: Truck,
      title: "Discreet Delivery",
      description: "We understand the importance of privacy. All orders are shipped in plain, unmarked packaging."
    },
    {
      icon: Clock,
      title: "Fast Turnaround",
      description: "Orders are processed within 24 hours, with express shipping options available for urgent needs."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Our support team is available via WhatsApp and Email to assist with any inquiries or concerns."
    }
  ];

  const faqs = [
    {
      question: "How long does delivery take?",
      answer: "Standard delivery typically takes 2-4 business days within the UK. Express shipping options are available at checkout for next-day delivery if ordered before 2 PM."
    },
    {
      question: "Is the packaging discreet?",
      answer: "Yes, absolutely. We use plain, unmarked padded envelopes or boxes with no mention of the contents or our website name on the outside to ensure your privacy."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We currently accept Bank Transfers and Bitcoin. Both methods are secure and help us maintain the privacy and safety of our customers."
    },
    {
      question: "Do I need a prescription?",
      answer: "Our platform operates as a private marketplace. While we provide high-quality pharmaceutical-grade products, we recommend consulting with a healthcare professional before starting any new medication."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you can use our 'Track Order' page with your Order ID and Email to see the current status of your delivery."
    },
    {
      question: "What if my order doesn't arrive?",
      answer: "We guarantee delivery on all tracked orders. If your package is lost in transit, we will investigate with the courier and either reship your order or provide a solution."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-20"
      >
        <h1 className="text-5xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600">
          About OP=ANXIETY
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Your trusted partner for premium pharmaceutical solutions and specialty products, delivered with care and absolute discretion.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold tracking-tight">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At OP=ANXIETY-=PainRealif.co, we believe that access to essential medication and quality relaxation products should be simple, secure, and stress-free. We've built our platform to bridge the gap between premium quality and convenient delivery.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you're managing chronic pain, seeking relief from anxiety, or looking for premium tobacco and cannabis products, we provide a curated selection that meets the highest standards of excellence.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 rounded-[2.5rem] border border-black/5 shadow-sm"
        >
          <h3 className="text-xl font-bold mb-6">What We Offer</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold">Anxiety Medication:</span>
                <p className="text-sm text-gray-500">Trusted solutions like Xanax and Diazepam to help manage stress and anxiety disorders.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold">Pain Management:</span>
                <p className="text-sm text-gray-500">Effective relief options including Pregabalin and Gabapentin for chronic and acute pain.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold">Premium Tobacco:</span>
                <p className="text-sm text-gray-500">A selection of the finest rolling tobacco brands including Amber Leaf and Gold Leaf.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
              <div>
                <span className="font-bold">Bud-Weed (Cannabis):</span>
                <p className="text-sm text-gray-500">Top-shelf cannabis strains like Cali Purple Runts and Stardawg, curated for potency and flavor.</p>
              </div>
            </li>
          </ul>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-gray-50 rounded-3xl border border-black/5"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <feature.icon size={24} className="text-black" />
            </div>
            <h4 className="font-bold mb-2">{feature.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <HelpCircle size={14} />
            Common Questions
          </div>
          <h2 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl border border-black/5 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-lg">{faq.question}</span>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} 
                />
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-500 leading-relaxed border-t border-black/5 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-black text-white p-12 rounded-[3rem] text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Browse our full collection of premium products and experience our seamless ordering process today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/" className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors">
            Shop All Products
          </a>
          <a href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-colors border border-white/10">
            Contact Support
          </a>
        </div>
      </motion.div>
    </div>
  );
}
