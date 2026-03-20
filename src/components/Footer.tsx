import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#F5EDE2] pt-12 pb-24 md:pb-12 border-t border-amber-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                A
              </div>
              <span className="text-xl font-bold text-green-800">AgriFresh</span>
            </Link>
            <p className="text-sm text-slate-600 mb-4">
              Connecting farmers directly to consumers for fresh, organic, and traceable produce.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-green-900 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/shop" className="hover:text-green-600">Shop Produce</Link></li>
              <li><Link to="/nearby" className="hover:text-green-600">Farms Near You</Link></li>
              <li><Link to="/sell" className="hover:text-green-600">Sell on AgriFresh</Link></li>
              <li><Link to="/about" className="hover:text-green-600">Our Story</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-green-900 mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><Link to="/shop?category=vegetables" className="hover:text-green-600">Fresh Vegetables</Link></li>
              <li><Link to="/shop?category=fruits" className="hover:text-green-600">Seasonal Fruits</Link></li>
              <li><Link to="/shop?category=dairy" className="hover:text-green-600">Dairy Products</Link></li>
              <li><Link to="/shop?category=organic" className="hover:text-green-600">Organic Range</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-green-900 mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>support@agrifresh.in</li>
              <li>1800-123-FARM</li>
              <li>Pune, Maharashtra, India</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-amber-200 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} AgriFresh Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
