import { motion } from 'framer-motion';
import { useCategories, useProducts, useBanners } from '../hooks/useQueries';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Leaf, MapPin, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import toast from 'react-hot-toast';

export default function Home() {
  const { data: categories, isLoading: isCatLoading } = useCategories();
  const { data: products, isLoading: isProdLoading } = useProducts();
  const { data: banners, isLoading: isBannerLoading } = useBanners();
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    e.preventDefault();
    addItem(product);
    toast.success(`Added ${product.name} fresh from farm!`);
  };

  if (isCatLoading || isProdLoading || isBannerLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFBF7]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#E8F5E9] to-[#F5EDE2] py-20 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold text-green-900 mb-6 leading-tight"
            >
              Straight from the farm to your kitchen ❤️
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-green-800/80 mb-8"
            >
              Discover fresh, organic, and traceable produce directly from local farmers. 
              Support the community while eating healthy.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link 
                to="/shop" 
                className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 text-center"
              >
                Explore Products
              </Link>
              <Link 
                to="/nearby" 
                className="bg-white text-green-700 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition-colors shadow-sm border border-green-100 flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                Find Nearby Farms
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-20 pointer-events-none hidden lg:block">
          <Leaf className="w-96 h-96 text-green-600" />
        </div>
      </section>

      {/* Categories Horizontal Scroll */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Shop by Category</h2>
          <Link to="/shop" className="text-green-600 font-medium flex items-center gap-1 hover:text-green-700">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide">
          {categories?.map((category: any, index: number) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="snap-start shrink-0"
            >
              <Link 
                to={`/shop?category=${category.slug}`}
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-green-50 hover:border-green-200 hover:shadow-md transition-all w-32 group"
              >
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <span className="text-2xl">{category.name[0]}</span>
                </div>
                <span className="font-medium text-slate-700 text-sm text-center">{category.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 bg-[#FDFBF7]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            Fresh Arrivals <Leaf className="w-6 h-6 text-green-500" />
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.slice(0, 4).map((product: any, index: number) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl overflow-hidden border border-green-50 shadow-sm hover:shadow-md transition-all group"
            >
              <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
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
              
              <div className="p-5">
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
                  <MapPin className="w-3 h-3" /> {product.farmName}, {product.location.split(',')[0]}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-xl font-bold text-green-700">₹{product.price}</span>
                    <span className="text-sm text-slate-400 line-through ml-2">₹{product.originalPrice}</span>
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
      </section>

      {/* Seasonal Banners */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners?.map((banner: any, index: number) => (
            <motion.div
              key={banner.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative rounded-3xl overflow-hidden aspect-[2/1] md:aspect-[21/9] group"
            >
              <img 
                src={banner.image} 
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center p-8 md:p-12">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 max-w-md">{banner.title}</h3>
                <p className="text-white/90 mb-6 max-w-sm">{banner.subtitle}</p>
                <Link 
                  to={banner.link}
                  className="bg-white text-slate-900 px-6 py-3 rounded-full font-medium w-max hover:bg-green-50 transition-colors"
                >
                  {banner.cta}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
