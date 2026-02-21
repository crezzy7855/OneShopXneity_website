import { motion } from "motion/react";
import { Star } from "lucide-react";

const reviews = [
  {
    id: 1,
    name: "James W.",
    rating: 5,
    text: "Fast delivery and very discreet packaging. The quality of the medication is top-notch. Highly recommend!",
    date: "2 days ago"
  },
  {
    id: 2,
    name: "Sarah M.",
    rating: 5,
    text: "Excellent service. I was a bit skeptical at first but everything arrived as promised. Great communication throughout.",
    date: "1 week ago"
  },
  {
    id: 3,
    name: "Robert L.",
    rating: 4,
    text: "Good prices and reliable tracking. Had a small delay with the courier but the support team was very helpful.",
    date: "3 days ago"
  }
];

export default function TrustpilotSection() {
  return (
    <section className="py-20 border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-8 h-8 bg-[#00b67a] flex items-center justify-center rounded-sm">
                    <Star size={18} className="fill-white text-white" />
                  </div>
                ))}
              </div>
              <span className="text-2xl font-bold ml-2">Trustpilot</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Excellent 4.8 out of 5</h2>
            <p className="text-gray-500 mt-2">Based on 1,240+ verified customer reviews</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-black/5 shadow-sm">
            <div className="text-center px-4 border-r border-black/5">
              <p className="text-2xl font-bold">100%</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Secure</p>
            </div>
            <div className="text-center px-4">
              <p className="text-2xl font-bold">24/7</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Support</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[2rem] border border-black/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-5 h-5 flex items-center justify-center rounded-sm ${i < review.rating ? 'bg-[#00b67a]' : 'bg-gray-200'}`}
                  >
                    <Star size={12} className="fill-white text-white" />
                  </div>
                ))}
              </div>
              <p className="text-gray-600 italic mb-6 leading-relaxed">"{review.text}"</p>
              <div className="flex justify-between items-center mt-auto pt-6 border-t border-black/5">
                <span className="font-bold text-sm">{review.name}</span>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a 
            href="https://www.trustpilot.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors"
          >
            See all our reviews on Trustpilot
            <Star size={14} className="fill-[#00b67a] text-[#00b67a]" />
          </a>
        </div>
      </div>
    </section>
  );
}
