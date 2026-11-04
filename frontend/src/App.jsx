import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';

// 1. Import Contexts
import { CartProvider } from './context/CartContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

// 2. Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <--- ADDED FOOTER IMPORT

// 3. Import Pages
import Home from './pages/Home';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Checkout from './pages/Checkout';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';

// --- ROUTE GUARDS ---

const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  
  return user && user.user.isAdmin ? <Outlet /> : <Navigate to="/" replace />; 
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-slate-900 flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                
                {/* Protected User Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/myorders" element={<MyOrders />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>

                {/* Protected Admin Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                </Route>
              </Routes>
            </main>
            
            <Footer /> {/* <--- ADDED FOOTER COMPONENT HERE */}
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;