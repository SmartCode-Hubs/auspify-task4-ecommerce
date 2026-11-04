import { useState, useEffect, useContext } from 'react';
import { FiSettings, FiUser, FiLock, FiSave, FiBell } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [notifications, setNotifications] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  
  // Get user from AuthContext
  const { user: authUser } = useContext(AuthContext);
  // Extract token securely
  const token = authUser?.token;

  useEffect(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.name) {
        setFormData({ name: data.name, email: data.email, phone: data.phone || '', address: data.address || '' });
        setNotifications(data.notifications);
      }
    })
    .catch(err => console.error("Error fetching profile:", err));
  }, [token]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, notifications })
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Profile updated successfully!' });
      } else {
        setStatus({ type: 'error', message: 'Failed to update profile.' });
      }
    } catch (err) { setStatus({ type: 'error', message: 'Server error.' }); }
    finally { setLoading(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      const res = await fetch('http://localhost:5000/api/users/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(passwords)
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: 'Password changed successfully!' });
        setPasswords({ currentPassword: '', newPassword: '' });
      } else {
        setStatus({ type: 'error', message: data.error });
      }
    } catch (err) { setStatus({ type: 'error', message: 'Server error.' }); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="mb-8 border-b border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center"><FiSettings className="mr-3 text-emerald-400" /> Account Settings</h1>
          <p className="text-slate-400 mt-2">Manage your profile, security, and preferences.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          <button onClick={() => {setActiveTab('profile'); setStatus({type:'',message:''});}} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'profile' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}>
            <FiUser className="mr-3" /> Profile Info
          </button>
          <button onClick={() => {setActiveTab('security'); setStatus({type:'',message:''});}} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'security' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}>
            <FiLock className="mr-3" /> Security
          </button>
          <button onClick={() => {setActiveTab('preferences'); setStatus({type:'',message:''});}} className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors font-medium ${activeTab === 'preferences' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-800'}`}>
            <FiBell className="mr-3" /> Preferences
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl">
          
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium border ${status.type === 'success' ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' : 'bg-red-400/10 text-red-400 border-red-400/20'}`}>
              {status.message}
            </div>
          )}

          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+234..." className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Delivery Address</label>
                  <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Street, City, State" className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors">
                <FiSave className="mr-2"/> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Change Password</h2>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Current Password</label>
                <input type="password" required value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">New Password</label>
                <input type="password" required value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-400 outline-none" />
              </div>
              <button type="submit" disabled={loading} className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors">
                <FiLock className="mr-2"/> {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {/* PREFERENCES TAB */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
              <div className="flex items-center justify-between p-5 bg-slate-900 rounded-xl border border-slate-700">
                <div>
                  <p className="text-white font-medium">Email Notifications</p>
                  <p className="text-sm text-slate-400">Receive updates about your orders and promos.</p>
                </div>
                <div onClick={() => setNotifications(!notifications)} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${notifications ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                  <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
              <button onClick={handleProfileUpdate} disabled={loading} className="flex items-center px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-xl transition-colors">
                <FiSave className="mr-2"/> {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;