import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocations } from '../hooks/useQueries';
import L from 'leaflet';
import { MapPin, Navigation, Search, Store } from 'lucide-react';

// Fix Leaflet's default icon path issues
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to recenter map when user location changes
function RecenterAutomatically({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function MapPage() {
  const { data: locations, isLoading } = useLocations();
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Default center (Pune, India)
  const defaultCenter = { lat: 18.5204, lng: 73.8567 };
  const center = userLoc || defaultCenter;

  useEffect(() => {
    // Mock geolocation for demo purposes
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log("Geolocation blocked or failed. Using default.");
        }
      );
    }
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLoc({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        }
      );
    }
  };

  const filteredLocations = locations?.filter((loc: any) => 
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    loc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] relative flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white z-10 flex flex-col shadow-xl md:h-full">
        <div className="p-6 pb-4 border-b border-green-50">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Store className="w-6 h-6 text-green-600" /> Nearby Farms
          </h1>
          
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search farms or produce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <button 
            onClick={handleLocateMe}
            className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-700 py-3 rounded-xl font-medium hover:bg-green-100 transition-colors"
          >
            <Navigation className="w-4 h-4" /> Use My Location
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : filteredLocations?.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No farms found matching your search.
            </div>
          ) : (
            filteredLocations?.map((loc: any) => (
              <div 
                key={loc.id} 
                className="bg-white border border-slate-100 rounded-2xl p-4 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => setUserLoc({ lat: loc.lat, lng: loc.lng })}
              >
                <h3 className="font-bold text-slate-800 group-hover:text-green-700 transition-colors mb-1">{loc.name}</h3>
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">{loc.description}</p>
                <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 w-max px-2 py-1 rounded-md">
                  <MapPin className="w-3 h-3" /> View on Map
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 h-[50vh] md:h-full relative z-0">
        <MapContainer 
          center={[center.lat, center.lng]} 
          zoom={12} 
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          <RecenterAutomatically lat={center.lat} lng={center.lng} />

          {/* User Location Marker */}
          {userLoc && (
            <Marker position={[userLoc.lat, userLoc.lng]}>
              <Popup>
                <div className="font-semibold text-slate-800">You are here</div>
              </Popup>
            </Marker>
          )}

          {/* Farm Locations */}
          {filteredLocations?.map((loc: any) => (
            <Marker 
              key={loc.id} 
              position={[loc.lat, loc.lng]}
              icon={customIcon}
            >
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <h3 className="font-bold text-slate-800 mb-1">{loc.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{loc.description}</p>
                  <a href={`/shop?farm=${loc.id}`} className="block text-center bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    View Products
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
