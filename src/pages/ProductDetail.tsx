import { useState, useEffect, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Product, Review } from "../types";
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RotateCcw, Star, MessageSquare, User } from "lucide-react";

export default function ProductDetail({ addToCart }: { addToCart: (p: Product) => void }) {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<{ quantity: number, price: number, label: string } | null>(null);
  const [reviewForm, setReviewForm] = useState({ customer_name: "", rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = () => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.pricing_tiers) {
          try {
            const tiers = JSON.parse(data.pricing_tiers);
            setSelectedTier(tiers[0]);
          } catch (e) {
            console.error("Failed to parse pricing tiers", e);
          }
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm)
      });
      if (res.ok) {
        setReviewForm({ customer_name: "", rating: 5, comment: "" });
        fetchProduct();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-gray-100 rounded-3xl" />;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft size={16} />
        Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="aspect-square rounded-3xl overflow-hidden bg-white border border-black/5"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-2">
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{product.category}</p>
            {product.avg_rating && product.avg_rating > 0 && (
              <div className="flex items-center gap-1 text-sm font-bold">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                {product.avg_rating.toFixed(1)}
                <span className="text-gray-400 font-normal">({product.review_count})</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-6">£{(selectedTier?.price || product.price).toFixed(2)}</p>

          {product.pricing_tiers && (
            <div className="mb-8">
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Select Quantity</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {JSON.parse(product.pricing_tiers).map((tier: any) => (
                  <button
                    key={tier.label}
                    onClick={() => setSelectedTier(tier)}
                    className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                      selectedTier?.label === tier.label
                        ? "border-black bg-black text-white shadow-md scale-105"
                        : "border-black/5 bg-white text-gray-600 hover:border-black/20"
                    }`}
                  >
                    <div className="truncate">{tier.label}</div>
                    <div className={selectedTier?.label === tier.label ? "text-white/70" : "text-emerald-600"}>
                      £{tier.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-500 leading-relaxed mb-8">
            {product.description}
          </p>

          <button
            onClick={() => addToCart({ ...product, price: selectedTier?.price || product.price })}
            className="flex items-center justify-center gap-3 w-full bg-black text-white py-4 rounded-2xl font-semibold hover:bg-gray-900 transition-colors mb-8"
          >
            <ShoppingBag size={20} />
            Add to Bag
          </button>

          <div className="grid grid-cols-1 gap-4 border-t border-black/5 pt-8">
            <div className="flex items-center gap-4 text-sm">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Truck size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Free Delivery</p>
                <p className="text-gray-500 text-xs">Orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ShieldCheck size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="font-medium">Secure Payment</p>
                <p className="text-gray-500 text-xs">Bank Transfer & Bitcoin</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-black/5 pt-16">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          <div className="bg-white p-6 rounded-2xl border border-black/5 mb-8">
            <div className="text-center mb-6">
              <p className="text-5xl font-bold mb-2">{product.avg_rating?.toFixed(1) || "0.0"}</p>
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star 
                    key={star} 
                    size={20} 
                    className={star <= Math.round(product.avg_rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                  />
                ))}
              </div>
              <p className="text-sm text-gray-500">Based on {product.review_count} reviews</p>
            </div>
          </div>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <h3 className="font-semibold">Write a review</h3>
            <input
              required
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5"
              value={reviewForm.customer_name}
              onChange={e => setReviewForm({ ...reviewForm, customer_name: e.target.value })}
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star 
                      size={20} 
                      className={star <= reviewForm.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              placeholder="Your experience..."
              className="w-full px-4 py-3 rounded-xl border border-black/5 focus:outline-none focus:ring-2 focus:ring-black/5 min-h-[100px]"
              value={reviewForm.comment}
              onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
            />
            <button
              disabled={submittingReview}
              type="submit"
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-8">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map(review => (
              <div key={review.id} className="border-b border-black/5 pb-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{review.customer_name}</p>
                      <p className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star 
                        key={star} 
                        size={14} 
                        className={star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
              <MessageSquare className="mx-auto text-gray-300 mb-4" size={40} />
              <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
