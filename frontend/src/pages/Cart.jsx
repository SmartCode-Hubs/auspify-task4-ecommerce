import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowRight, FiMinus, FiPlus } from 'react-icons/fi';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, totalPrice } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-white">
        <h2 className="text-4xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/" className="px-8 py-3 bg-emerald-500 text-slate-900 font-bold rounded-xl hover:bg-emerald-400">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        
        <div className="flex-1 bg-slate-800 rounded-2xl border border-slate-700 p-6">
          {cartItems.map((item) => (
            <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between py-6 border-b border-slate-700 last:border-0 gap-4">
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-600" />
                <div>
                  <h3 className="text-white font-bold text-lg">{item.name}</h3>
                  <p className="text-emerald-400 font-semibold">₦{item.price.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between w-full sm:w-auto sm:space-x-8">
                {/* Quantity Controls */}
                <div className="flex items-center bg-slate-900 rounded-lg border border-slate-700">
                  <button onClick={() => updateQty(item._id, -1)} className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-l-lg"><FiMinus size={14}/></button>
                  <span className="px-4 py-1 text-white font-medium">{item.qty}</span>
                  <button onClick={() => updateQty(item._id, 1)} className="px-3 py-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-r-lg"><FiPlus size={14}/></button>
                </div>

                <span className="text-white font-bold text-lg w-24 text-right">₦{(item.price * item.qty).toLocaleString()}</span>
                <button onClick={() => removeFromCart(item._id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 sticky top-28">
            <h2 className="text-xl font-bold text-white mb-6 border-b border-slate-700 pb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-400"><span>Subtotal</span> <span className="text-white">₦{totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-slate-400"><span>Shipping</span> <span className="text-emerald-400">Free</span></div>
            </div>
            <div className="flex justify-between items-end border-t border-slate-700 pt-4 mb-8">
              <span className="text-slate-400 font-medium">Total</span>
              <span className="text-3xl font-black text-emerald-400">₦{totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={() => navigate('/checkout')} className="w-full flex items-center justify-center py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors text-lg">
              Checkout <FiArrowRight className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;