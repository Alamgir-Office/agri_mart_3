import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts, useCategories } from '../hooks/useQueries';
import { Filter, Star, Leaf, MapPin, ShoppingBag, SlidersHorizontal, X, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';
import toast from 'react-hot-toast';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const queryParam = searchParams.get('q');
  
  const { data: products, isLoading: isProdLoading } = useProducts();
  const { data: categories, isLoading: isCatLoading } = useCategories();
  const addItem = useCartStore((state) => state.addItem);
  const { toggleItem, isInWishlist } = useWishlistStore();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    organicOnly: false,
    maxPrice: 1000,
    minRating: 0,
  });

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem(product);
    toast.success(`Added ${product.name} fresh from farm!`);
  };

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p: any) => {
      if (categoryParam && p.category !== categoryParam) return false;
      if (queryParam && !p.name.toLowerCase().includes(queryParam.toLowerCase()) && !p.description.toLowerCase().includes(queryParam.toLowerCase())) return false;
      if (filters.organicOnly && !p.isOrganic) return false;
      if (p.price > filters.maxPrice) return false;
      if (p.rating < filters.minRating) return false;
      return true;
    });
  }, [products, categoryParam, queryParam, filters]);

  if (isProdLoading || isCatLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800">Shop Fresh</h1>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <AnimatePresence>
          {(isFilterOpen || window.innerWidth >= 768) && (
            <motion.aside 
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className={`
                fixed md:static inset-y-0 left-0 z-50 w-72 bg-white md:bg-transparent shadow-2xl md:shadow-none p-6 md:p-0 overflow-y-auto
                ${isFilterOpen ? 'block' : 'hidden md:block'}
              `}
            >
              <div className="flex items-center justify-between md:hidden mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-8">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                    <Filter className="w-4 h-4" /> Categories
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSearchParams({})}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryParam ? 'bg-green-100 text-green-800 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                    >
                      All Products
                    </button>
                    {categories?.map((cat: any) => (
                      <button
                        key={cat.id}
                        onClick={() => setSearchParams({ category: cat.slug })}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryParam === cat.slug ? 'bg-green-100 text-green-800 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filters */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="font-semibold text-slate-800 mb-4">Refine Search</h3>
                  
                  <label className="flex items-center gap-3 mb-4 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={filters.organicOnly}
                        onChange={(e) => setFilters(prev => ({ ...prev, organicOnly: e.target.checked }))}
                        className="peer sr-only" 
                      />
                      <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-green-500 peer-checked:border-green-500 transition-colors"></div>
                      <Leaf className="w-3 h-3 text-white absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-slate-600 group-hover:text-slate-900">Organic Only</span>
                  </label>

                  <div className="mb-4">
                    <label className="text-sm text-slate-600 mb-2 block">Max Price: ₹{filters.maxPrice}</label>
                    <input 
                      type="range" 
                      min="10" 
                      max="2000" 
                      step="10"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                      className="w-full accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-slate-600 mb-2 block">Minimum Rating</label>
                    <div className="flex items-center gap-2">
                      {[4, 4.5, 4.8].map(rating => (
                        <button
                          key={rating}
                          onClick={() => setFilters(prev => ({ ...prev, minRating: prev.minRating === rating ? 0 : rating }))}
                          className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${filters.minRating === rating ? 'bg-amber-50 border-amber-200 text-amber-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                          {rating}+ <Star className="w-3 h-3 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Overlay for mobile filter */}
        {isFilterOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-slate-800 hidden md:block">
              {queryParam ? `Search results for "${queryParam}"` : categoryParam ? categories?.find((c:any) => c.slug === categoryParam)?.name : 'All Fresh Produce'}
            </h1>
            {queryParam && (
              <button 
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('q');
                  setSearchParams(newParams);
                }}
                className="text-sm bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors flex items-center gap-1"
              >
                Clear Search <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
              <Leaf className="w-16 h-16 text-green-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your filters or search criteria.</p>
              <button 
                onClick={() => {
                  setSearchParams({});
                  setFilters({ organicOnly: false, maxPrice: 1000, minRating: 0 });
                }}
                className="mt-6 text-green-600 font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product: any, index: number) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden border border-green-50 shadow-sm hover:shadow-md transition-all group flex flex-col"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {product.isOrganic && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                        <Leaf className="w-3 h-3" /> Organic
                      </div>
                    )}
                  </Link>
                  
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleItem(product.id);
                      toast.success(isInWishlist(product.id) ? 'Removed from wishlist' : 'Added to wishlist');
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors z-10 ${isInWishlist(product.id) ? 'bg-rose-50 text-rose-500' : 'bg-white text-slate-400 hover:text-rose-500'}`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-slate-600">{product.rating}</span>
                    </div>
                    
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-semibold text-lg text-slate-800 mb-1 hover:text-green-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-sm text-slate-500 mb-4 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 shrink-0" /> {product.farmName}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                      <div>
                        <span className="text-xl font-bold text-green-700">₹{product.price}</span>
                        <span className="text-xs text-slate-500 block">per {product.unit}</span>
                      </div>
                      
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className="bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition-colors shadow-sm shadow-green-600/20"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
