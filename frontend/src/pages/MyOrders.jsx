import { useState, useEffect, useContext } from 'react';
import { FiPackage, FiMapPin } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user: authUser } = useContext(AuthContext);
  const token = authUser?.token;

  useEffect(() => {
    if (!token) return;
    
    fetch('http://localhost:5000/api/orders/myorders', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => { if(Array.isArray(data)) setOrders(data); })
    .catch(err => console.error(err));
  }, [token]);

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8 flex items-center"><FiPackage className="mr-3 text-emerald-400"/> My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center text-slate-400">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <div className="bg-slate-900 px-6 py-4 flex justify-between items-center border-b border-slate-700">
                <div>
                  <p className="text-sm text-slate-400">Order ID: <span className="text-white font-mono">{order._id}</span></p>
                  <p className="text-sm text-slate-400">Date: <span className="text-white">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Total</p>
                  <p className="text-lg font-bold text-emerald-400">₦{order.totalPrice.toLocaleString()}</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center mb-4 text-slate-300 text-sm"><FiMapPin className="mr-2"/> {order.shippingAddress}</div>
                <div className="space-y-4">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{item.name}</p>
                        <p className="text-slate-400 text-sm">Qty: {item.qty}</p>
                      </div>
                      <p className="text-white font-bold">₦{(item.price * item.qty).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;