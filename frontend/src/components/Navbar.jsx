import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          
          <Link to="/" className="text-3xl font-extrabold text-white tracking-tight">
            Auspify<span className="text-emerald-400">Store</span>
          </Link>

          <div className="flex items-center space-x-6">
            {/* Safe checks using optional chaining (?) */}
            {user && (
              <>
                <Link to="/myorders" className="text-slate-300 hover:text-white flex items-center font-medium">
                  <FiPackage className="mr-2" /> Orders
                </Link>
                <Link to="/profile" className="text-slate-300 hover:text-white flex items-center font-medium">
                  <FiUser className="mr-2" /> Profile
                </Link>
                <Link to="/settings" className="text-slate-300 hover:text-white flex items-center font-medium">
                  <FiSettings className="mr-2" /> Settings
                </Link>
                
                {user?.user?.isAdmin && (
                  <Link to="/admin" className="text-emerald-400 hover:text-emerald-300 flex items-center font-bold px-3 py-1 bg-emerald-400/10 rounded-lg">
                    Admin Panel
                  </Link>
                )}
              </>
            )}

            <Link to="/cart" className="relative text-slate-300 hover:text-white ml-2">
              <FiShoppingCart size={26} />
              {cartItems?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center space-x-4 border-l border-slate-700 pl-6 ml-2">
                <span className="text-sm font-medium text-emerald-400">Hi, {user?.user?.name}</span>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                  <FiLogOut size={22} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center px-5 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors font-medium ml-2">
                <FiUser className="mr-2" /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;