import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { Product } from "../types";
import { Plus, Star, ShoppingBag } from "lucide-react";
import TrustpilotSection from "../components/TrustpilotSection";

export default function Home({ addToCart }: { addToCart: (p: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery) || 
    p.category.toLowerCase().includes(searchQuery) ||
    (p.description && p.description.toLowerCase().includes(searchQuery))
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-square rounded-2xl mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <header className="mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] bg-[#eef2f3] min-h-[400px] flex items-center"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[#5a8a6a] rounded-l-full translate-x-1/4 -translate-y-1/4 opacity-10 pointer-events-none"></div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 items-center w-full">
            <div>
              <p className="text-[#86a789] font-bold mb-4 uppercase tracking-tight">Sleep Better, Live Healthier</p>
              <h1 className="text-4xl md:text-6xl font-bold text-[#b22222] leading-[1.1] mb-6">
                A Dose Of Positivity A Day + Keeps The Depression Away
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-md">
                Shop quality medications that promote deep sleep, reduce stress, and support your long-term well-being.
              </p>
              <button className="bg-[#86a789] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#759678] transition-colors flex items-center gap-2">
                <ShoppingBag size={20} />
                Shop Now
              </button>
            </div>
            
            <div className="hidden lg:flex justify-center relative">
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                {/* Red border circle */}
                <div className="absolute inset-0 border-[12px] border-[#b22222] rounded-full z-10"></div>
                {/* Image circle */}
                <div className="absolute inset-2 rounded-full overflow-hidden bg-white">
                  <img 
                    src="https://images.weserv.nl/?url=picsum.photos/seed/sleep/800/800" 
                    alt="Healthy Sleep" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Decorative dots pattern */}
                <div className="absolute -top-10 -left-10 grid grid-cols-6 gap-2 opacity-20">
                  {[...Array(24)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Anxiety Management
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Our anxiety solutions, including Alprazolam and Diazepam, are designed to help you regain calm and focus. 
              We offer various strengths and quantities to suit your specific needs, all with discreet packaging.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Pain Relief
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              From muscle relaxants like Pain O Soma to nerve pain specialists like Pregabalin, our pain management 
              range provides effective relief for chronic and acute conditions, helping you maintain your quality of life.
            </p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-black/5 shadow-sm">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              Tobacco Products
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              We now offer premium rolling tobacco products, starting with high-quality Amber Leaf pouches. 
              More premium tobacco options will be added to our catalog soon, all with fast and discreet delivery.
            </p>
          </div>
        </div>
      </header>

      <div className="mb-12 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          {searchQuery ? `Search Results for "${searchQuery}"` : "Our Catalog"}
        </h2>
        <div className="h-px flex-grow mx-8 bg-black/5 hidden sm:block"></div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No products found matching your search.</p>
          <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Clear search</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/product/${product.id}`}>
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-white border border-black/5 mb-4">
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
                {product.avg_rating && product.avg_rating > 0 && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold shadow-sm">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    {product.avg_rating.toFixed(1)}
                  </div>
                )}
              </div>
            </Link>
            <div className="flex justify-between items-start">
              <div>
                <Link to={`/product/${product.id}`}>
                  <h3 className="font-medium text-lg hover:underline underline-offset-4">{product.name}</h3>
                </Link>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">£{product.price.toFixed(2)}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 p-2 bg-black text-white rounded-full hover:scale-110 active:scale-95 transition-transform"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <TrustpilotSection />
    </div>
  );
}
