import { useState, useEffect, useContext } from 'react';
import { FiMail, FiPhone, FiMapPin, FiShield, FiRefreshCw } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { user: authUser } = useContext(AuthContext);

  useEffect(() => {
    // 1. Check if user is logged in
    if (!authUser || !authUser.token) {
      setError('You are not logged in. Please go to the Login page.');
      return;
    }

    // 2. Fetch the data
    fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${authUser.token}` }
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch profile. Token might be expired.');
      return res.json();
    })
    .then(data => {
      if (data.name) setUser(data);
      else setError('Invalid data received from server.');
    })
    .catch(err => {
      console.error(err);
      setError(err.message);
    });
  }, [authUser]);

  // Show Error if something went wrong
  if (error) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-2xl text-center max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-2">Oops! Something went wrong.</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-500 hover:bg-red-400 text-white font-bold rounded-lg flex items-center mx-auto">
            <FiRefreshCw className="mr-2" /> Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show Loading if user data isn't ready yet
  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <FiRefreshCw className="animate-spin text-emerald-400 mb-4" size={40} />
        <p className="text-emerald-400 font-medium">Loading your profile...</p>
      </div>
    );
  }

  // Show Profile if data is loaded
  return (
    <div className="p-8 max-w-3xl mx-auto mt-10">
      <div className="bg-slate-800 p-8 sm:p-12 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8 mb-10 border-b border-slate-700 pb-10">
          <div className="w-28 h-28 bg-gradient-to-tr from-emerald-400 to-blue-500 rounded-full flex items-center justify-center text-slate-900 font-black text-5xl shadow-[0_0_30px_rgba(16,185,129,0.4)]">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-slate-400 flex items-center justify-center sm:justify-start mt-2">
              <FiShield className="mr-2 text-emerald-400"/> Verified Customer
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center bg-slate-900 p-5 rounded-xl border border-slate-700">
            <FiMail className="text-emerald-400 mr-4" size={24}/>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Email</p>
              <p className="text-white font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center bg-slate-900 p-5 rounded-xl border border-slate-700">
            <FiPhone className="text-emerald-400 mr-4" size={24}/>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phone</p>
              <p className="text-white font-medium">{user.phone || 'Not provided'}</p>
            </div>
          </div>
          <div className="flex items-center bg-slate-900 p-5 rounded-xl border border-slate-700 md:col-span-2">
            <FiMapPin className="text-emerald-400 mr-4" size={24}/>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Shipping Address</p>
              <p className="text-white font-medium">{user.address || 'No address saved yet'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;