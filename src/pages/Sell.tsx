import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts, useCategories } from '../hooks/useQueries';
import { Store, Upload, Plus, Package, TrendingUp, IndianRupee, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  price: z.number().min(1, 'Price must be greater than 0'),
  unit: z.string().min(1, 'Please select a unit'),
  stock: z.number().min(1, 'Stock must be greater than 0'),
  description: z.string().min(10, 'Description is required'),
  isOrganic: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function Sell() {
  const { data: categories } = useCategories();
  const { data: existingProducts } = useProducts();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'add'>('dashboard');
  const [myProducts, setMyProducts] = useState<any[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Initialize mock products for the farmer
  useState(() => {
    if (existingProducts) {
      setMyProducts(existingProducts.slice(0, 3));
    }
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isOrganic: false,
    }
  });

  const onSubmit = (data: ProductFormValues) => {
    const newProduct = {
      id: `p_${Math.random().toString(36).substr(2, 9)}`,
      ...data,
      originalPrice: data.price * 1.2, // Mock original price
      farmName: "My Farm",
      location: "Local",
      rating: 5.0,
      images: [imagePreview || "https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg"],
      harvestDate: new Date().toISOString().split('T')[0],
    };

    setMyProducts([newProduct, ...myProducts]);
    toast.success('Product added successfully!');
    reset();
    setImagePreview(null);
    setActiveTab('dashboard');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create fake preview URL
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Store className="w-8 h-8 text-amber-600" /> Farmer Dashboard
          </h1>
          <p className="text-slate-500 mt-1">Manage your farm listings and track sales.</p>
        </div>
        
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all ${activeTab === 'dashboard' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('add')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${activeTab === 'add' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-green-50 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center shrink-0">
                  <IndianRupee className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Total Sales</p>
                  <h3 className="text-2xl font-bold text-slate-800">₹45,200</h3>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-green-50 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Active Listings</p>
                  <h3 className="text-2xl font-bold text-slate-800">{myProducts.length}</h3>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border border-green-50 shadow-sm flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">Store Rating</p>
                  <h3 className="text-2xl font-bold text-slate-800">4.8 / 5.0</h3>
                </div>
              </div>
            </div>

            {/* Product List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-green-50 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">My Products</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-100">
                      <th className="pb-4 font-semibold text-slate-500 text-sm">Product</th>
                      <th className="pb-4 font-semibold text-slate-500 text-sm">Category</th>
                      <th className="pb-4 font-semibold text-slate-500 text-sm">Price</th>
                      <th className="pb-4 font-semibold text-slate-500 text-sm">Stock</th>
                      <th className="pb-4 font-semibold text-slate-500 text-sm text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myProducts.map((product) => (
                      <tr key={product.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800">{product.name}</p>
                              {product.isOrganic && <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Organic</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-slate-600 capitalize">{product.category}</td>
                        <td className="py-4 font-medium text-slate-800">₹{product.price}/{product.unit}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${product.stock > 20 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {product.stock} {product.unit}s
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-amber-600 hover:underline text-sm font-medium mr-3">Edit</button>
                          <button 
                            className="text-red-500 hover:underline text-sm font-medium"
                            onClick={() => {
                              setMyProducts(myProducts.filter(p => p.id !== product.id));
                              toast.success('Product removed');
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {myProducts.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    No products listed yet. Click "Add Product" to start selling.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'add' && (
          <motion.div
            key="add"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-3xl p-6 sm:p-10 border border-green-50 shadow-sm max-w-3xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-8">Add New Produce</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors relative overflow-hidden group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                      <div className="relative z-10">
                        <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-2 bg-white rounded-full" />
                        <span className="text-sm font-medium text-slate-800 bg-white px-3 py-1 rounded-full">Image Selected</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-sm text-slate-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400">PNG, JPG up to 5MB</p>
                    </>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                  <input 
                    {...register('name')}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                    placeholder="e.g. Fresh Tomatoes"
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    {...register('category')}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow bg-white"
                  >
                    <option value="">Select Category</option>
                    {categories?.map((cat: any) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input 
                    type="number"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                    placeholder="0.00"
                  />
                  {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                    <select 
                      {...register('unit')}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow bg-white"
                    >
                      <option value="kg">Per Kg</option>
                      <option value="bunch">Per Bunch</option>
                      <option value="dozen">Per Dozen</option>
                      <option value="liter">Per Liter</option>
                      <option value="piece">Per Piece</option>
                    </select>
                    {errors.unit && <p className="text-red-500 text-xs mt-1">{errors.unit.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                    <input 
                      type="number"
                      {...register('stock', { valueAsNumber: true })}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow" 
                      placeholder="Qty"
                    />
                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea 
                  {...register('description')}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow min-h-[120px]" 
                  placeholder="Describe your produce, farming methods, etc."
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                <input 
                  type="checkbox" 
                  id="organic"
                  {...register('isOrganic')}
                  className="w-5 h-5 accent-green-600 rounded"
                />
                <label htmlFor="organic" className="font-medium text-green-900 cursor-pointer select-none">
                  This product is certified organic
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-4">
                <button 
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="px-8 py-4 rounded-xl font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-amber-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" /> Publish Listing
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
