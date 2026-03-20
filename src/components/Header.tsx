import { Link } from 'react-router-dom';
import { Heart, Search, ShoppingBasket, Menu, MapPin, Store } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

export default function Header() {
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  return (
    <header className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="md:hidden p-2 text-green-800 hover:bg-green-50 rounded-full transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              A
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent hidden sm:block">
              AgriFresh
            </span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
          <input
            type="text"
            placeholder="Search for fresh vegetables, fruits, dairy..."
            className="w-full bg-[#F5EDE2]/50 border border-green-200 rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
          <Search className="w-5 h-5 text-green-600 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/nearby" className="hidden sm:flex items-center gap-2 text-sm font-medium text-green-700 hover:bg-green-50 px-3 py-2 rounded-full transition-colors">
            <MapPin className="w-4 h-4" />
            <span>Near You</span>
          </Link>
          
          <Link to="/sell" className="hidden lg:flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-full transition-colors border border-amber-200">
            <Store className="w-4 h-4" />
            <span>Sell Produce</span>
          </Link>

          <Link to="/profile?tab=wishlist" className="relative p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors hidden sm:block">
            <Heart className="w-6 h-6" />
            {wishlistCount > 0 && (
              <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className="relative p-2 text-green-800 hover:bg-green-50 rounded-full transition-colors">
            <ShoppingBasket className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link to="/profile" className="hidden sm:block">
            <div className="w-8 h-8 rounded-full bg-green-100 border border-green-200 overflow-hidden">
              <img src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100" alt="Profile" className="w-full h-full object-cover" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
