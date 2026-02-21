import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Package, Search, ChevronDown, X, Plus, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Product } from "../types";

export default function Navbar({ cartCount, addToCart }: { cartCount: number, addToCart: (p: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedId, setAddedId] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/products")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then(data => {
        console.log("Navbar products loaded:", data.length);
        setProducts(data);
      })
      .catch(err => console.error("Navbar fetch error:", err));
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleQuickAdd = (product: Product) => {
    addToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const anxietyProducts = products.filter(p => p.category?.toLowerCase() === "anxiety");
  console.log("Anxiety Products:", anxietyProducts.length);
  const painKillerProducts = products.filter(p => p.category?.toLowerCase() === "pain killers");
  console.log("Pain Killers Products:", painKillerProducts.length);
  const tobaccoProducts = products.filter(p => p.category?.toLowerCase() === "tobacco");
  console.log("Tobacco Products:", tobaccoProducts.length);
  const leafProducts = products.filter(p => p.category?.toLowerCase() === "bud-weed");
  console.log("Bud-Weed Products:", leafProducts.length);

  const filteredProducts = searchQuery.trim() === "" 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);

  const NavItem = ({ label, to, dropdownItems, category }: { label: string, to: string, dropdownItems?: Product[], category?: string }) => (
    <div 
      className="relative h-full flex items-center"
      onMouseEnter={() => dropdownItems && setActiveDropdown(category || label)}
      onMouseLeave={() => setActiveDropdown(null)}
    >
      <Link 
        to={to} 
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[13px] font-bold uppercase tracking-wider transition-all duration-200 ${
          activeDropdown === (category || label) ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'
        }`}
      >
        {label}
        {dropdownItems && <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === (category || label) ? 'rotate-180' : ''}`} />}
      </Link>

      <AnimatePresence>
        {activeDropdown === (category || label) && dropdownItems && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 w-72 pt-2 z-[60]"
          >
            <div className="bg-white border border-black/5 shadow-2xl rounded-2xl overflow-hidden">
              <div className="p-2">
              <div className="px-3 py-2 mb-1 border-b border-black/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Products</p>
              </div>
              <div className="space-y-1 max-h-[400px] overflow-y-auto no-scrollbar">
                {dropdownItems.length > 0 ? (
                  dropdownItems.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group relative"
                    >
                      <Link
                        to={`/product/${product.id}`}
                        className="flex items-center gap-3 flex-grow min-w-0"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-black/5 flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <p className="text-xs font-bold truncate">{product.name}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">£{product.price.toFixed(2)}</p>
                        </div>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuickAdd(product);
                        }}
                        className={`p-2 rounded-lg transition-all transform active:scale-95 ${
                          addedId === product.id 
                            ? "bg-emerald-500 text-white" 
                            : "bg-black text-white opacity-0 group-hover:opacity-100 hover:scale-110"
                        }`}
                      >
                        {addedId === product.id ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-8 text-center">
                    <p className="text-xs text-gray-400 font-medium italic">No products currently available in this category.</p>
                  </div>
                )}
              </div>
              <Link
                to={to}
                className="block text-center py-2 mt-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors border-t border-black/5"
                onClick={() => setActiveDropdown(null)}
              >
                View All {label}
              </Link>
            </div>
          </div>
        </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-10 h-full">
              <Link to="/" className="text-xl font-black tracking-tighter group">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 group-hover:from-emerald-500 group-hover:to-indigo-500 transition-all duration-300">
                  OP=ANXIETY-=PainRealif.co
                </span>
              </Link>
              
              <div className="hidden md:flex items-center gap-2 h-full">
                <NavItem label="Shop" to="/" />
                <NavItem label="Anxiety" to="/category/anxiety" dropdownItems={anxietyProducts} category="Anxiety" />
                <NavItem label="Pain Killers" to="/category/pain killers" dropdownItems={painKillerProducts} category="Pain Killers" />
                <NavItem label="Tobacco" to="/category/tobacco" dropdownItems={tobaccoProducts} category="Tobacco" />
                <NavItem label="Bud-Weed" to="/category/bud-weed" dropdownItems={leafProducts} category="Bud-Weed" />
                <NavItem label="About" to="/about" />
                <NavItem label="Track Order" to="/track" />
                <NavItem label="Contact" to="/contact" />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center mr-2">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-black/5 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                    <span className="text-[11px] font-bold tracking-tight text-gray-800">
                      op=anxiety-=painrelief.co
                    </span>
                  </div>
                </motion.div>
              </div>

              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-400 hover:text-black transition-colors"
              >
                <Search size={20} />
              </button>
              <Link to="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-md"
          >
            <div className="max-w-3xl mx-auto px-4 pt-20">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-2xl font-black tracking-tighter">Search Products</h2>
                <button 
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="p-3 bg-black text-white rounded-full hover:scale-110 transition-transform"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="relative mb-12">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, category, or description..."
                  className="w-full pl-16 pr-8 py-6 bg-gray-100 rounded-[2rem] text-xl font-medium focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                />
              </div>

              <div className="space-y-4">
                {filteredProducts.length > 0 ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-2">Top Results</p>
                    {filteredProducts.map(product => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group"
                      >
                        <Link
                          to={`/product/${product.id}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="flex items-center gap-6 p-4 bg-white rounded-3xl border border-black/5 hover:border-black/20 transition-all shadow-sm hover:shadow-md"
                        >
                          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-black/5 flex-shrink-0">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold text-lg">{product.name}</h4>
                            <p className="text-sm text-gray-500">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-black text-emerald-600">£{product.price.toFixed(2)}</p>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">View Product</p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </>
                ) : searchQuery.trim() !== "" ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400 text-lg">No products found matching "{searchQuery}"</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {["Anxiety", "Pain Killers", "Tobacco", "Bud-Weed"].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSearchQuery(cat)}
                        className="p-4 bg-gray-50 rounded-2xl text-sm font-bold hover:bg-black hover:text-white transition-all border border-black/5"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
