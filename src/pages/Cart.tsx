import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBasket, Truck } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  const total = getTotal();
  const deliveryFee = total > 500 ? 0 : 50;
  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-green-50 rounded-full flex items-center justify-center mb-6"
        >
          <ShoppingBasket className="w-16 h-16 text-green-300" />
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any fresh produce yet. Discover farm-fresh goodies today!</p>
        <Link 
          to="/shop" 
          className="bg-green-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Fresh Basket</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-4 sm:p-6 border border-green-50 shadow-sm flex flex-col sm:flex-row items-center gap-6 group"
              >
                <Link to={`/product/${item.id}`} className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 bg-slate-50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </Link>

                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                    <div>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-semibold text-lg text-slate-800 hover:text-green-600 transition-colors">{item.name}</h3>
                      </Link>
                      <p className="text-sm text-slate-500">{item.farmName}</p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <div className="font-bold text-lg text-green-700">₹{item.price * item.quantity}</div>
                      {item.originalPrice > item.price && (
                        <div className="text-sm text-slate-400 line-through">₹{item.originalPrice * item.quantity}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-md transition-colors shadow-sm"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-medium text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-md transition-colors shadow-sm"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4" /> <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-green-100 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-slate-800">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-slate-800">{deliveryFee === 0 ? <span className="text-green-600">Free</span> : `₹${deliveryFee}`}</span>
              </div>
              
              {deliveryFee > 0 && (
                <div className="bg-amber-50 text-amber-800 text-sm p-3 rounded-lg border border-amber-100 flex items-start gap-2">
                  <Truck className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>Add ₹{500 - total} more to get free delivery!</p>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 mb-8">
              <div className="flex justify-between items-end">
                <span className="font-bold text-slate-800">Total</span>
                <span className="text-2xl font-bold text-green-700">₹{grandTotal}</span>
              </div>
              <p className="text-xs text-slate-500 text-right mt-1">Inclusive of all taxes</p>
            </div>

            <Link 
              to="/checkout"
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            <Link to="/shop" className="block text-center text-green-600 font-medium mt-4 hover:underline text-sm">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
