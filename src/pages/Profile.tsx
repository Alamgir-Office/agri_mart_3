import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUser, useOrders, useProducts } from '../hooks/useQueries';
import { Package, MapPin, Award, LogOut, CheckCircle2, Clock, Heart, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../store/useWishlistStore';
import { Link, useSearchParams } from 'react-router-dom';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';
  
  const { data: user, isLoading: isUserLoading } = useUser();
  const { data: orders, isLoading: isOrdersLoading } = useOrders();
  const { data: allProducts, isLoading: isProductsLoading } = useProducts();
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    if (searchParams.get('tab')) {
      setActiveTab(searchParams.get('tab') as string);
    }
  }, [searchParams]);

  if (isUserLoading || isOrdersLoading || isProductsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
    { id: 'loyalty', label: 'Loyalty Points', icon: Award },
  ];

  const wishlistProducts = allProducts?.filter((p: any) => wishlistItems.includes(p.id)) || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-green-50 shadow-sm text-center mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-green-100 overflow-hidden mx-auto mb-4">
              <img src={user?.avatar} alt={user?.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-1">{user?.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{user?.email}</p>
            <div className="bg-amber-50 rounded-xl p-3 inline-flex items-center gap-2 border border-amber-100">
              <Award className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <div className="text-xs text-amber-800 font-medium">AgriRewards</div>
                <div className="text-sm font-bold text-amber-900">{user?.loyaltyPoints} pts</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden border border-green-50 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors border-b last:border-0 border-slate-50 ${activeTab === tab.id ? 'bg-green-50 text-green-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-green-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            ))}
            <button className="w-full flex items-center gap-3 p-4 text-left text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-50 shadow-sm min-h-[500px]">
            
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Order History</h2>
                <div className="space-y-6">
                  {orders?.map((order: any) => (
                    <div key={order.id} className="border border-slate-100 rounded-2xl p-6 hover:border-green-100 transition-colors shadow-sm bg-slate-50/50">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-slate-200">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-bold text-slate-800 text-lg">Order #{order.id.split('_')[1]}</h3>
                            <div className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                              {order.status === 'Delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              {order.status}
                            </div>
                          </div>
                          <p className="text-sm text-slate-500">Placed on {new Date(order.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                        <div className="text-right bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                          <p className="text-xs text-slate-500 mb-0.5">Total Amount</p>
                          <p className="font-bold text-green-700 text-lg">₹{order.total}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-700 mb-2">Items in this order:</h4>
                        {order.items.map((item: any, idx: number) => (
                          <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                <Package className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="font-medium text-slate-800 block">{item.name}</span>
                                <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                              </div>
                            </div>
                            <span className="text-slate-800 font-bold">₹{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <button className="text-slate-600 text-sm font-medium hover:text-green-700 transition-colors flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 hover:border-green-200">
                          Download Invoice
                        </button>
                        <button className="bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm shadow-green-600/20">
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-500" /> My Wishlist
                </h2>
                
                {wishlistProducts.length === 0 ? (
                  <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
                    <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">Your wishlist is empty</h3>
                    <p className="text-slate-500 mb-6">Save items you love to review them later.</p>
                    <Link to="/shop" className="bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors inline-block">
                      Explore Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistProducts.map((product: any) => (
                      <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:border-green-200 hover:shadow-md transition-all group flex flex-col">
                        <Link to={`/product/${product.id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-50">
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="p-4 flex flex-col flex-1">
                          <Link to={`/product/${product.id}`}>
                            <h3 className="font-semibold text-slate-800 mb-1 hover:text-green-600 line-clamp-1">{product.name}</h3>
                          </Link>
                          <p className="text-sm text-slate-500 mb-3">{product.farmName}</p>
                          <div className="mt-auto flex items-center justify-between">
                            <span className="font-bold text-green-700">₹{product.price} <span className="text-xs text-slate-500 font-normal">/{product.unit}</span></span>
                            <Link to={`/product/${product.id}`} className="bg-green-50 text-green-700 p-2 rounded-lg hover:bg-green-600 hover:text-white transition-colors">
                              <ShoppingBag className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-800">Saved Addresses</h2>
                  <button className="text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors">
                    Add New
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user?.addresses.map((addr: any) => (
                    <div key={addr.id} className="border-2 border-green-100 rounded-2xl p-5 relative">
                      {addr.isDefault && (
                        <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md">Default</span>
                      )}
                      <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                        <MapPin className="w-5 h-5 text-green-600" /> {addr.type}
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">
                        {addr.street}<br />
                        {addr.city}, {addr.state}<br />
                        {addr.pincode}
                      </p>
                      <div className="flex gap-3 text-sm font-medium">
                        <button className="text-green-600 hover:underline">Edit</button>
                        <button className="text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'loyalty' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="w-32 h-32 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-16 h-16 text-amber-500" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">{user?.loyaltyPoints} Points</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  You earn 1 point for every ₹100 spent. Points can be redeemed for discounts on future orders!
                </p>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 max-w-md mx-auto text-left">
                  <h3 className="font-semibold text-slate-800 mb-4">Available Rewards</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-medium text-slate-800">₹50 Off</p>
                        <p className="text-xs text-slate-500">Min order ₹500</p>
                      </div>
                      <button className="bg-amber-100 text-amber-800 px-3 py-1.5 rounded-lg text-sm font-bold" disabled={user?.loyaltyPoints < 500}>
                        500 pts
                      </button>
                    </div>
                    <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 opacity-50">
                      <div>
                        <p className="font-medium text-slate-800">Free Delivery</p>
                        <p className="text-xs text-slate-500">Any order value</p>
                      </div>
                      <button className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-lg text-sm font-bold" disabled>
                        1000 pts
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
