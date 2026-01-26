import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Check, X, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Authenticated as Admin check (localStorage 'isAdminAuthenticated' from LoginModal)
        // Note: Real app should use token role check, but sticking to existing pattern for Admin
        if (localStorage.getItem('isAdminAuthenticated') !== 'true') {
            navigate('/');
            return;
        }
        fetchOrders();
    }, [navigate]);

    const fetchOrders = async () => {
        try {
            // Use adminToken which is safe from AuthContext interference
            const token = localStorage.getItem('adminToken');

            if (!token) {
                console.error("No admin token found");
                // Optional: redirect to login if strictly enforced
            }

            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                console.error("Failed to fetch orders", res.status);
                alert(`Failed to fetch orders. Status: ${res.status}`); // Alert User
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`${API_URL}/orders/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                fetchOrders(); // Refresh
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-3xl font-bold">Manage Orders</h1>
            </div>

            <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="p-4 text-neutral-400 font-medium text-sm">Date</th>
                                <th className="p-4 text-neutral-400 font-medium text-sm">User</th>
                                <th className="p-4 text-neutral-400 font-medium text-sm">Service</th>
                                <th className="p-4 text-neutral-400 font-medium text-sm">Details</th>
                                <th className="p-4 text-neutral-400 font-medium text-sm">Proof</th>
                                <th className="p-4 text-neutral-400 font-medium text-sm">Status</th>
                                <th className="p-4 text-neutral-400 font-medium text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-sm text-neutral-300">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-bold">{order.user?.username || 'Unknown'}</div>
                                        <div className="text-xs text-neutral-500">{order.user?.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium">{order.subServiceTitle}</div>
                                        <div className="text-xs text-neutral-500">{order.serviceTitle}</div>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <div>QTY: {order.quantity}</div>
                                        <div>AMT: ₹{order.amount}</div>
                                        <div className="text-xs text-blue-400 mt-1 truncate max-w-[150px]">{order.targetUrl}</div>
                                        {order.comments && <div className="text-xs text-neutral-500 mt-1 italic">"{order.comments}"</div>}
                                    </td>
                                    <td className="p-4">
                                        <a href={`${API_URL.replace('/api', '')}/${order.paymentScreenshot}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-orange-400 hover:underline text-xs">
                                            <ExternalLink size={12} /> View
                                        </a>
                                        <div className="text-xs text-neutral-500 mt-1">UTR: {order.utrNumber}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            order.status === 'In Progress' ? 'bg-blue-500/20 text-blue-400' :
                                                order.status === 'Done' ? 'bg-green-500/20 text-green-400' :
                                                    'bg-red-500/20 text-red-400'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {order.status !== 'Done' && (
                                                <button onClick={() => updateStatus(order._id, 'Done')} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30" title="Mark Done">
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {order.status === 'Pending' && (
                                                <button onClick={() => updateStatus(order._id, 'In Progress')} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30" title="Mark In Progress">
                                                    <Clock size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
