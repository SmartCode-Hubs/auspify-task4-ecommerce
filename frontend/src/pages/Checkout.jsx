import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FiCheckCircle, FiMapPin } from 'react-icons/fi';

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to place an order.");
      return navigate('/login');
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderItems: cartItems, totalPrice, shippingAddress: address })
      });

      if (res.ok) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/myorders');
      }
    } catch (err) {
      alert('Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto min-h-screen">
      <div className="bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="text-center mb-10">
          <FiCheckCircle className="mx-auto text-emerald-400 mb-4" size={64} />
          <h1 className="text-3xl font-bold text-white mb-2">Secure Checkout</h1>
          <p className="text-slate-400">Complete your order securely.</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center"><FiMapPin className="mr-2"/> Shipping Address</label>
            <textarea 
              required 
              rows="3" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full delivery address..."
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none"
            ></textarea>
          </div>

          <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Total Amount to Pay</span>
              <span className="text-2xl font-black text-emerald-400">₦{totalPrice.toLocaleString()}</span>
            </div>
            <p className="text-xs text-slate-500">Simulated payment gateway (All transactions are successful).</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors text-lg disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Place Order Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;