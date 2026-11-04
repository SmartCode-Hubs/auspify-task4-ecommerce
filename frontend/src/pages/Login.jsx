import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import bgImage from '../assets/background.jpg'; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const endpoint = isLogin ? 'login' : 'register';

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (res.ok) {
        if (isLogin) {
          login(data); 
          navigate('/'); 
        } else {
          setIsLogin(true); 
          setError('Registration successful! Please log in.');
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
      
      {/* Left Side - Branding with Background Image */}
      <div 
        className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Dark Overlay to ensure text is readable over the image */}
        <div className="absolute inset-0 bg-slate-900/80 z-0"></div>

        {/* Glowing Blobs (Optional flair on top of the image) */}
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 text-center px-12">
          <FiShoppingBag className="text-emerald-400 mx-auto mb-6" size={80} />
          <h1 className="text-5xl font-extrabold text-white mb-6">
            Auspify<span className="text-emerald-400">Store</span>
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
            The premier destination for premium electronics and accessories in Nigeria. Experience seamless shopping.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">
              {isLogin ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-slate-400">
              {isLogin ? 'Enter your details to access your account.' : 'Join us and start shopping today.'}
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
              className={`p-4 rounded-xl mb-6 text-sm text-center font-medium border ${error.includes('successful') ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <div className="relative">
                    <FiUser className="absolute left-4 top-4 text-slate-500" size={20} />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      required 
                      value={formData.name}
                      className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none transition-all" 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <FiMail className="absolute left-4 top-4 text-slate-500" size={20} />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none transition-all" 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-4 text-slate-500" size={20} />
              <input 
                type="password" 
                placeholder="Password" 
                required 
                value={formData.password}
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none transition-all" 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')} 
              {!loading && <FiArrowRight className="ml-2" />}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-400">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }} 
                className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;