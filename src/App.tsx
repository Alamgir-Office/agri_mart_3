import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import MapPage from './pages/MapPage';
import Sell from './pages/Sell';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/nearby" element={<MapPage />} />
            <Route path="/sell" element={<Sell />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#E8F5E9',
            color: '#166534',
            borderRadius: '12px',
            border: '1px solid #BBF7D0',
          },
          success: {
            iconTheme: {
              primary: '#22C55E',
              secondary: '#E8F5E9',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
