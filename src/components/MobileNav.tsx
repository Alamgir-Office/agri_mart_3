import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User, Store } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { cn } from '../lib/utils';

export default function MobileNav() {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/shop' },
    { icon: Store, label: 'Sell', path: '/sell' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-green-100 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 relative",
                isActive ? "text-green-600" : "text-slate-500 hover:text-green-500"
              )}
            >
              <div className="relative">
                <item.icon className={cn("w-6 h-6", isActive && "fill-green-100")} />
                {item.badge ? (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
