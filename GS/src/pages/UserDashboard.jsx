import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { Package, User, Lock, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const UserDashboard = () => {
    const { user, logout, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('orders'); // orders, profile
    const [profileData, setProfileData] = useState({ username: '', password: '' });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        if (!user) navigate('/');
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders/my-orders`, {
                headers: { 'x-auth-token': token }
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const res = await updateProfile(profileData.username, profileData.password);
        if (res.success) {
            setMsg('Profile Updated Successfully');
            setProfileData({ username: '', password: '' });
        } else {
            setMsg(res.msg);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4">
            <div className="container mx-auto max-w-5xl">
                <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold">My Account</h1>
                        <p className="text-neutral-400">Welcome, {user?.username}</p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'orders' ? 'bg-orange-600 text-white' : 'bg-white/5 hover:bg-white/10 text-neutral-400'}`}
                        >
                            <Package size={20} /> My Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full text-left p-4 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'profile' ? 'bg-orange-600 text-white' : 'bg-white/5 hover:bg-white/10 text-neutral-400'}`}
                        >
                            <User size={20} /> Profile Settings
                        </button>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                        {activeTab === 'orders' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-xl font-bold mb-6">Order History</h2>
                                <div className="space-y-4">
                                    {orders.length === 0 ? (
                                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 text-neutral-500">
                                            No orders found.
                                        </div>
                                    ) : (
                                        orders.map(order => (
                                            <div key={order._id} className="bg-[#111] border border-white/10 p-6 rounded-2xl md:flex justify-between items-center gap-4 hover:border-orange-500/30 transition-colors">
                                                <div>
                                                    <h3 className="font-bold text-lg mb-1">{order.subServiceTitle} <span className="text-neutral-500 text-sm font-normal">({order.serviceTitle})</span></h3>
                                                    <div className="text-sm text-neutral-400 flex flex-wrap gap-4">
                                                        <span>Quantity: {order.quantity}</span>
                                                        <span>Amount: ₹{order.amount}</span>
                                                        <span>Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="mt-2 text-sm text-neutral-500 truncate max-w-md">
                                                        URL: {order.targetUrl}
                                                    </div>
                                                </div>
                                                <div className="mt-4 md:mt-0 flex items-center gap-4">
                                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            order.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                                                                order.status === 'Done' ? 'bg-green-500/20 text-green-400' :
                                                                    'bg-red-500/20 text-red-400'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h2 className="text-xl font-bold mb-6">Update Profile</h2>
                                <div className="bg-[#111] border border-white/10 p-8 rounded-3xl max-w-md">
                                    {msg && <div className={`p-3 rounded-lg text-sm mb-4 ${msg.includes('Success') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{msg}</div>}

                                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm text-neutral-400">New Username</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 text-neutral-500" size={18} />
                                                <input
                                                    type="text"
                                                    value={profileData.username}
                                                    onChange={e => setProfileData({ ...profileData, username: e.target.value })}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500"
                                                    placeholder={user?.username}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm text-neutral-400">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 text-neutral-500" size={18} />
                                                <input
                                                    type="password"
                                                    value={profileData.password}
                                                    onChange={e => setProfileData({ ...profileData, password: e.target.value })}
                                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500"
                                                    placeholder="Leave blank to keep current"
                                                />
                                            </div>
                                        </div>
                                        <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors">
                                            Update Profile
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
