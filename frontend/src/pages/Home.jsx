import { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiSearch, FiTrendingUp, FiShield, FiTruck, FiRefreshCw } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

// Array of high-quality background images for the slider
const heroImages = [
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop", // Headphones
  "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop", // Tech Gear
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2070&auto=format&fit=crop"  // Watch
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  
  // State for the background slider
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Changes every 5 seconds
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  const fetchProducts = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const seedDatabase = async () => {
    setLoading(true);
    await fetch('http://localhost:5000/api/products/seed', { method: 'POST' });
    fetchProducts();
  };

  const filteredProducts = Array.isArray(products) 
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) 
    : [];

  return (
    <div className="min-h-screen bg-slate-900 pb-20">
      
      {/* 🌟 HERO SECTION WITH BACKGROUND SLIDER */}
      <div className="relative overflow-hidden h-[600px] flex items-center border-b border-slate-700">
        
        {/* Background Slider Images */}
        {heroImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url('${img}')` }}
          />
        ))}

        {/* Dark Gradient Overlay (Ensures text is always readable) */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="md:w-1/2">
            <motion.h1 
              key={`title-${currentSlide}`} // Re-animate on slide change
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6"
            >
              Upgrade Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">
                Lifestyle Today.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-slate-300 text-lg md:text-xl mb-8 max-w-lg"
            >
              Discover premium electronics and accessories. Quality guaranteed, delivered to your doorstep in Nigeria.
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
              onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.5)] transform hover:-translate-y-1"
            >
              Shop Now
            </motion.button>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-emerald-500 w-8' : 'bg-slate-500 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 🛍️ PRODUCT CATALOG */}
      <div id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">Premium Products</h2>
            <p className="text-slate-400 mt-1">Discover our latest collection.</p>
          </div>
          <div className="relative w-full md:w-96">
            <FiSearch className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none shadow-lg"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64 text-emerald-400">
            <FiRefreshCw className="animate-spin mr-3" size={32} /> Loading products...
          </div>
        )}

        {/* Empty State */}
        {!loading && products.length === 0 && (
          <div className="text-center bg-slate-800 p-10 rounded-2xl border border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-4">Your Store is Empty</h3>
            <p className="text-slate-400 mb-6">Click the button below to automatically populate the database with sample products.</p>
            <button onClick={seedDatabase} className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors">
              Initialize Store Database
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all flex flex-col"
              >
                <div className="h-56 overflow-hidden relative">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-slate-700">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-2">{product.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-700">
                    <span className="text-2xl font-black text-white">₦{product.price.toLocaleString()}</span>
                    <button 
                      onClick={() => addToCart(product)}
                      className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]"
                    >
                      <FiShoppingCart size={22} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 🌟 FEATURES SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-emerald-500/30 transition-colors">
            <div className="p-4 bg-emerald-500/10 text-emerald-400 rounded-full mr-4"><FiTruck size={28}/></div>
            <div><h4 className="text-white font-bold text-lg">Fast Delivery</h4><p className="text-slate-400 text-sm">Nationwide shipping</p></div>
          </div>
          <div className="flex items-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/30 transition-colors">
            <div className="p-4 bg-blue-500/10 text-blue-400 rounded-full mr-4"><FiShield size={28}/></div>
            <div><h4 className="text-white font-bold text-lg">Secure Payments</h4><p className="text-slate-400 text-sm">100% protected</p></div>
          </div>
          <div className="flex items-center p-6 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-purple-500/30 transition-colors">
            <div className="p-4 bg-purple-500/10 text-purple-400 rounded-full mr-4"><FiTrendingUp size={28}/></div>
            <div><h4 className="text-white font-bold text-lg">Premium Quality</h4><p className="text-slate-400 text-sm">Guaranteed authentic</p></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;