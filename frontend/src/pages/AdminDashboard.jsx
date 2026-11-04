import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FiPieChart, FiBox, FiShoppingCart, FiUsers, FiPlus, FiTrash2, 
  FiDollarSign, FiTrendingUp, FiCheckCircle, FiClock, FiTruck, FiEdit 
} from 'react-icons/fi';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', image: '', category: '', countInStock: '', description: '' });

  const { user } = useContext(AuthContext);
  const token = user?.token;

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [statsRes, ordersRes, productsRes, usersRes] = await Promise.all([
        fetch('http://localhost:5000/api/orders/stats', { headers }),
        fetch('http://localhost:5000/api/orders', { headers }),
        fetch('http://localhost:5000/api/products'),
        fetch('http://localhost:5000/api/users', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (productsRes.ok) setProducts(await productsRes.json());
      if (usersRes.ok) setCustomers(await usersRes.json());
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // --- ACTIONS ---
  const updateOrderStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchData();
  };

  const deleteProduct = async (id) => {
    if(window.confirm('Delete this product?')) {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      fetchData();
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          ...newProduct,
          // Ensure numbers are sent as numbers, not strings
          price: Number(newProduct.price),
          countInStock: Number(newProduct.countInStock)
        })
      });
      
      const data = await res.json();

      if (res.ok) {
        setShowProductModal(false);
        setNewProduct({ name: '', price: '', image: '', category: '', countInStock: '', description: '' });
        fetchData(); 
      } else {
        // THIS WILL SHOW YOU THE EXACT ERROR
        alert(`Backend Error: ${data.error || data.message}`);
      }
    } catch (error) {
      alert('Failed to connect to server.');
      console.error(error);
    }

  };

  if (loading || !stats) return <div className="min-h-screen flex items-center justify-center text-emerald-400">Loading Admin Data...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center"><FiPieChart className="mr-3 text-emerald-400"/> Store Admin Control</h1>
          <p className="text-slate-400 mt-1">Manage products, orders, and view analytics.</p>
        </div>
        <div className="flex space-x-2 bg-slate-800 p-1 rounded-xl border border-slate-700">
          {['overview', 'products', 'orders', 'customers'].map(tab => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${activeTab === tab ? 'bg-emerald-500 text-slate-900' : 'text-slate-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* --- OVERVIEW TAB --- */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-400 font-medium">Total Revenue</p>
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><FiDollarSign size={20}/></div>
              </div>
              <h3 className="text-3xl font-bold text-white">₦{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-400 font-medium">Total Orders</p>
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><FiShoppingCart size={20}/></div>
              </div>
              <h3 className="text-3xl font-bold text-white">{stats.totalOrders}</h3>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-400 font-medium">Total Products</p>
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><FiBox size={20}/></div>
              </div>
              <h3 className="text-3xl font-bold text-white">{stats.totalProducts}</h3>
            </div>
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <p className="text-slate-400 font-medium">Customers</p>
                <div className="p-2 bg-orange-500/10 text-orange-400 rounded-lg"><FiUsers size={20}/></div>
              </div>
              <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mt-10 mb-4">Order Status Analysis</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-yellow-400 font-medium flex items-center"><FiClock className="mr-2"/> Pending</span>
              <span className="text-xl font-bold text-white">{stats.statusCounts.Pending}</span>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-blue-400 font-medium flex items-center"><FiTrendingUp className="mr-2"/> Processing</span>
              <span className="text-xl font-bold text-white">{stats.statusCounts.Processing}</span>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-purple-400 font-medium flex items-center"><FiTruck className="mr-2"/> Shipped</span>
              <span className="text-xl font-bold text-white">{stats.statusCounts.Shipped}</span>
            </div>
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex items-center justify-between">
              <span className="text-emerald-400 font-medium flex items-center"><FiCheckCircle className="mr-2"/> Delivered</span>
              <span className="text-xl font-bold text-white">{stats.statusCounts.Delivered}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* --- PRODUCTS TAB --- */}
      {activeTab === 'products' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Product Management</h2>
            <button onClick={() => setShowProductModal(true)} className="flex items-center px-4 py-2 bg-emerald-500 text-slate-900 font-bold rounded-lg hover:bg-emerald-400">
              <FiPlus className="mr-2"/> Add Product
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
              <tr><th className="px-6 py-4">Product</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {products.map(p => (
                <tr key={p._id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    <span className="text-white font-medium">{p.name}</span>
                  </td>
                  <td className="px-6 py-4 text-emerald-400 font-bold">₦{p.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-300">{p.countInStock} units</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteProduct(p._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg"><FiTrash2/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* --- ORDERS TAB --- */}
      {activeTab === 'orders' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700"><h2 className="text-xl font-bold text-white">Order Fulfillment</h2></div>
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
              <tr><th className="px-6 py-4">Order</th><th className="px-6 py-4">Customer</th><th className="px-6 py-4">Total</th><th className="px-6 py-4">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-xs font-mono text-slate-400">{o._id}</td>
                  <td className="px-6 py-4 text-white">{o.user?.name || 'Guest'}</td>
                  <td className="px-6 py-4 font-bold text-emerald-400">₦{o.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={o.status || 'Pending'} 
                      onChange={(e) => updateOrderStatus(o._id, e.target.value)}
                      className="bg-slate-900 text-white border border-slate-600 rounded p-2 text-sm outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* --- CUSTOMERS TAB --- */}
      {activeTab === 'customers' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-6 border-b border-slate-700"><h2 className="text-xl font-bold text-white">Customer Directory</h2></div>
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 text-sm uppercase">
              <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Role</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {customers.map(c => (
                <tr key={c._id} className="hover:bg-slate-700/50">
                  <td className="px-6 py-4 text-white font-medium">{c.name}</td>
                  <td className="px-6 py-4 text-slate-400">{c.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.isAdmin ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-700 text-slate-300'}`}>
                      {c.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg p-6 relative">
            <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>
            <h3 className="text-2xl font-bold text-white mb-6">Add New Product</h3>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <input type="text" placeholder="Product Name" required className="w-full p-3 bg-slate-900 rounded-lg text-white" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Price (₦)" required className="w-full p-3 bg-slate-900 rounded-lg text-white" onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input type="number" placeholder="Stock Qty" required className="w-full p-3 bg-slate-900 rounded-lg text-white" onChange={e => setNewProduct({...newProduct, countInStock: e.target.value})} />
              </div>
              <input type="text" placeholder="Image URL" required className="w-full p-3 bg-slate-900 rounded-lg text-white" onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
              <input type="text" placeholder="Category" required className="w-full p-3 bg-slate-900 rounded-lg text-white" onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
              <textarea placeholder="Description" required rows="3" className="w-full p-3 bg-slate-900 rounded-lg text-white" onChange={e => setNewProduct({...newProduct, description: e.target.value})}></textarea>
              <button type="submit" className="w-full py-3 bg-emerald-500 text-slate-900 font-bold rounded-lg hover:bg-emerald-400">Save Product</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;