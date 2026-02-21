import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Product } from "../types";
import { Plus, Star, ArrowLeft, Filter, ChevronDown } from "lucide-react";

export default function Category({ addToCart }: { addToCart: (p: Product) => void }) {
  const { categoryName } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high" | "rating">("featured");
  const [minRating, setMinRating] = useState<number>(0);

  // 1. Clean up the Title display logic
  const getDisplayTitle = () => {
    const name = categoryName?.toLowerCase();
    if (name === "anxiety") return "Anxiety";
    if (name?.includes("pain")) return "Pain Killers";
    if (name === "tobacco") return "Tobacco";
    if (name === "leaf" || name === "bud-weed") return "Bud-Weed";
    return categoryName;
  };

  const displayCategory = getDisplayTitle() || "Products";

  useEffect(() => {
    setLoading(true);
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        const lowerParam = categoryName?.toLowerCase();
        
        const filtered = data.filter((p: Product) => {
          const productCat = p.category.toLowerCase();
          
          // General category matching (ignores spaces and case)
          return productCat === lowerParam || productCat.replace(/\s/g, "") === lowerParam?.replace(/%20/g, "");
        });

        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [categoryName]);

  const processedProducts = useMemo(() => {
    let result = [...products];

    // Filter by rating
    if (minRating > 0) {
      result = result.filter(p => (p.avg_rating || 0) >= minRating);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.avg_rating || 0) - (a.avg_rating || 0);
      return 0; // featured/default
    });

    return result;
  }, [products, sortBy, minRating]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map(i => (
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
      <header className="mb-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={16} />
          Back to all products
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{displayCategory}</h1>
            <p className="text-gray-500">Premium quality {displayCategory} available for secure delivery.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Rating Filter */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
              <Filter size={14} className="text-gray-400" />
              <select 
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="text-xs font-bold uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={3}>3+ Stars</option>
                <option value={2}>2+ Stars</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-black/5 shadow-sm">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-bold uppercase tracking-widest bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {processedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {processedProducts.map((product, index) => (
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
                  <p className="font-semibold text-lg">£{product.price.toFixed(2)}</p>
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
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <button 
            onClick={() => { setMinRating(0); setSortBy("featured"); }}
            className="text-blue-600 hover:underline mt-4 inline-block font-bold"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
