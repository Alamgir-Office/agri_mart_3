import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/useCartStore';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, CheckCircle2, ArrowLeft, PartyPopper } from 'lucide-react';
import toast from 'react-hot-toast';

const steps = ['Address', 'Payment', 'Confirmation'];

export default function Checkout() {
  const [currentStep, setCurrentStep] = useState(0);
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  const total = getTotal();
  const deliveryFee = total > 500 ? 0 : 50;
  const grandTotal = total + deliveryFee;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'upi'
  });

  const handleNext = () => {
    if (currentStep === 0) {
      if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
        toast.error('Please fill all address fields');
        return;
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Simulate payment processing
      const toastId = toast.loading('Processing payment securely...');
      setTimeout(() => {
        toast.success('Payment successful!', { id: toastId });
        setCurrentStep(2);
        clearCart();
      }, 2000);
    }
  };

  if (items.length === 0 && currentStep !== 2) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[80vh]">
      {currentStep < 2 && (
        <Link to="/cart" className="inline-flex items-center gap-2 text-slate-500 hover:text-green-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
      )}

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 rounded-full -z-10"></div>
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full -z-10 transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${index <= currentStep ? 'bg-green-600 text-white shadow-md shadow-green-600/30' : 'bg-slate-100 text-slate-400'}`}>
                {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`text-xs font-medium ${index <= currentStep ? 'text-green-800' : 'text-slate-400'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-green-50 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-green-600" /> Delivery Details
                </h2>
                
                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow" 
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow" 
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Complete Address</label>
                    <textarea 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow min-h-[100px]" 
                      placeholder="House/Flat No, Building Name, Street"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                      <input 
                        type="text" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow" 
                        placeholder="Pune"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                      <input 
                        type="text" 
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-shadow" 
                        placeholder="411001"
                      />
                    </div>
                  </div>
                </form>

                <div className="mt-8 flex justify-end">
                  <button 
                    onClick={handleNext}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-green-50 shadow-sm"
              >
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-green-600" /> Payment Method
                </h2>

                <div className="space-y-4">
                  {[
                    { id: 'upi', title: 'UPI (GPay, PhonePe, Paytm)', desc: 'Pay securely via UPI app' },
                    { id: 'card', title: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'cod', title: 'Cash on Delivery', desc: 'Pay when your order arrives' }
                  ].map((method) => (
                    <label 
                      key={method.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === method.id ? 'border-green-500 bg-green-50' : 'border-slate-100 hover:border-green-200 hover:bg-slate-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === method.id ? 'border-green-500' : 'border-slate-300'}`}>
                          {formData.paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{method.title}</h3>
                          <p className="text-sm text-slate-500">{method.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button 
                    onClick={() => setCurrentStep(0)}
                    className="text-slate-500 hover:text-slate-800 font-medium"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleNext}
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                  >
                    Pay ₹{grandTotal}
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 sm:p-12 border border-green-50 shadow-sm text-center col-span-1 lg:col-span-3"
              >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <PartyPopper className="w-12 h-12" />
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="absolute -bottom-2 -right-2 bg-white rounded-full p-1"
                  >
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </motion.div>
                </div>
                
                <h1 className="text-3xl font-bold text-slate-800 mb-4">Order Confirmed!</h1>
                <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
                  Thank you for supporting local farmers. Your fresh produce will be delivered to you shortly.
                </p>

                <div className="bg-slate-50 rounded-2xl p-6 max-w-sm mx-auto mb-8 text-left border border-slate-100">
                  <p className="text-sm text-slate-500 mb-1">Order ID</p>
                  <p className="font-semibold text-slate-800 mb-4">#AGRI-{Math.floor(100000 + Math.random() * 900000)}</p>
                  
                  <p className="text-sm text-slate-500 mb-1">Delivery Address</p>
                  <p className="font-medium text-slate-800">{formData.name}</p>
                  <p className="text-sm text-slate-600">{formData.address}, {formData.city} - {formData.pincode}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to="/profile"
                    className="bg-green-50 text-green-700 px-8 py-4 rounded-xl font-semibold hover:bg-green-100 transition-colors border border-green-200"
                  >
                    View Order Status
                  </Link>
                  <Link 
                    to="/shop"
                    className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {currentStep < 2 && (
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 sticky top-24">
              <h3 className="font-bold text-slate-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {items.map(item => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-slate-500">{item.quantity} x ₹{item.price}</p>
                    </div>
                    <div className="font-semibold text-slate-800">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm text-slate-600 border-t border-slate-200 pt-4 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-800">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="font-medium text-slate-800">{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between items-end">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="text-xl font-bold text-green-700">₹{grandTotal}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
