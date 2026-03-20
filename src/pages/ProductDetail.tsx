import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProduct, useProducts } from '../hooks/useQueries';
import { useCartStore } from '../store/useCartStore';
import { useState } from 'react';
import { Star, MapPin, Leaf, ShieldCheck, Truck, ArrowLeft, ArrowRight, Plus, Minus, QrCode, ShoppingBag, Heart, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useWishlistStore } from '../store/useWishlistStore';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: allProducts } = useProducts();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const handleAddToCart = () => {
    if (product) {
      addItem({ ...product, quantity });
      toast.success(`Added ${quantity} ${product.unit} of ${product.name} to cart!`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Product not found</h2>
        <Link to="/shop" className="text-green-600 hover:underline">Return to Shop</Link>
      </div>
    );
  }

  const relatedProducts = allProducts?.filter((p: any) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/shop" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-green-50 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 p-6 lg:p-10">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-2xl overflow-hidden bg-slate-50 relative"
            >
              <img 
                src={product.images[activeImage] || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.isOrganic && (
                <div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-md">
                  <Leaf className="w-4 h-4" /> Certified Organic
                </div>
              )}
            </motion.div>
            
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-green-500 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-amber-500 mb-3">
              <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-semibold text-amber-700">{product.rating}</span>
              </div>
              <span className="text-slate-400 text-sm">({product.reviews?.length || 124} reviews)</span>
            </div>

            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">{product.name}</h1>
              <button 
                onClick={() => {
                  toggleItem(product.id);
                  toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist');
                }}
                className={`p-2 rounded-full border transition-colors shrink-0 ${isInWishlist(product.id) ? 'bg-rose-50 border-rose-200 text-rose-500' : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200'}`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>
            
            <Link to="/nearby" className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-800 mb-6 bg-green-50 w-max px-3 py-1.5 rounded-full text-sm font-medium transition-colors">
              <MapPin className="w-4 h-4" /> {product.farmName}, {product.location}
            </Link>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-4xl font-bold text-green-700">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-slate-400 line-through mb-1">₹{product.originalPrice}</span>
              )}
              <span className="text-slate-500 mb-1">/ {product.unit}</span>
            </div>

            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Quality Assured</p>
                  <p className="text-xs text-slate-500">Farm fresh guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <Truck className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-slate-800">Fast Delivery</p>
                  <p className="text-xs text-slate-500">Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center bg-slate-100 rounded-xl p-1 h-14 w-max">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-semibold text-slate-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-full flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors shadow-sm"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 text-white h-14 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                >
                  <ShoppingBag className="w-5 h-5" /> Add to Cart
                </button>
              </div>
              <p className="text-center text-sm text-slate-500 mt-3">
                {product.stock} {product.unit}s available in stock
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <section className="bg-white rounded-3xl p-8 border border-green-50 shadow-sm mb-16">
        <div className="flex gap-8 border-b border-slate-100 mb-8 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('desc')}
            className={`pb-4 font-semibold whitespace-nowrap transition-colors relative ${activeTab === 'desc' ? 'text-green-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Description
            {activeTab === 'desc' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />}
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`pb-4 font-semibold whitespace-nowrap transition-colors relative ${activeTab === 'specs' ? 'text-green-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Specifications
            {activeTab === 'specs' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />}
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 font-semibold whitespace-nowrap transition-colors relative ${activeTab === 'reviews' ? 'text-green-700' : 'text-slate-500 hover:text-slate-800'}`}
          >
            Reviews ({product.reviews?.length || 0})
            {activeTab === 'reviews' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600" />}
          </button>
        </div>

        <div className="min-h-[200px]">
          {activeTab === 'desc' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-slate-600 leading-relaxed max-w-3xl">
              <p className="mb-4">{product.description}</p>
              <p>All our products are sourced directly from farmers who practice sustainable agriculture. We ensure that the produce reaches you within 24 hours of harvest, preserving its nutritional value and fresh taste.</p>
            </motion.div>
          )}

          {activeTab === 'specs' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
              {product.specifications ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm text-slate-500 mb-1">{key}</span>
                      <span className="font-medium text-slate-800">{String(value)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500">No specific specifications available for this product.</p>
              )}
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any, idx: number) => (
                  <div key={idx} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                          {review.user.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800">{review.user}</span>
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-0.5 rounded text-xs text-green-700 font-medium">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </div>
                      </div>
                      <span className="text-sm text-slate-400">{review.date}</span>
                    </div>
                    <div className="flex text-amber-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-slate-600">{review.comment}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500">No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Traceability Section */}
      <section className="bg-amber-50 rounded-3xl p-8 lg:p-12 mb-16 border border-amber-100">
        <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-16">
          <div className="flex-1">
            <h2 className="text-2xl lg:text-3xl font-bold text-amber-900 mb-4">Know Your Farmer</h2>
            <p className="text-amber-800/80 leading-relaxed mb-6">
              This produce was grown with love by {product.farmName}. By purchasing this, you are directly supporting local farmers and sustainable agricultural practices in {product.location}.
            </p>
            <div className="flex items-center gap-4 text-sm font-medium text-amber-800">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-amber-100">
                Harvested: {new Date(product.harvestDate).toLocaleDateString()}
              </div>
              <Link to="/nearby" className="flex items-center gap-1 hover:text-green-700 transition-colors">
                View Farm on Map <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="w-48 h-48 bg-white rounded-2xl p-4 shadow-sm border border-amber-200 flex flex-col items-center justify-center shrink-0">
            <QrCode className="w-32 h-32 text-slate-800 mb-2" />
            <span className="text-xs text-slate-500 font-medium text-center">Scan for Traceability</span>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 mb-6">More from this category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p: any) => (
              <Link key={p.id} to={`/product/${p.id}`} className="bg-white rounded-2xl overflow-hidden border border-green-50 shadow-sm hover:shadow-md transition-all group">
                <div className="aspect-square overflow-hidden">
                  <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 mb-1 line-clamp-1">{p.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-700">₹{p.price}</span>
                    <span className="text-xs text-slate-500">per {p.unit}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
