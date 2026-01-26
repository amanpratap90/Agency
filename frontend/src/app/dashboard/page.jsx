"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, MessageSquare, Briefcase, Users, Plus, Trash2, Check, X, LogOut, Package, ExternalLink, Clock } from 'lucide-react';
import { API_URL } from '@/config';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('orders'); // Default to orders as per user interest
    const [contacts, setContacts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [services, setServices] = useState([]);
    const [orders, setOrders] = useState([]);

    // Form states
    const [newService, setNewService] = useState({ title: '', description: '', icon: 'Smartphone', subServices: [] });

    const router = useRouter();

    useEffect(() => {
        const isAuth = localStorage.getItem('isAdminAuthenticated');
        if (!isAuth) {
            router.push('/');
            return;
        }

        // Fetch initial data based on tab or all
        fetchOrders();
        fetchContacts();
        fetchReviews();
        fetchServices();
    }, []);

    const fetchContacts = async () => {
        try {
            const res = await fetch(`${API_URL}/contact`);
            if (res.ok) setContacts(await res.json());
        } catch (error) { console.error("Error fetching contacts", error); }
    };

    const fetchReviews = async () => {
        try {
            const res = await fetch(`${API_URL}/reviews/all`);
            if (res.ok) setReviews(await res.json());
        } catch (error) { console.error("Error fetching reviews", error); }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch(`${API_URL}/services`);
            if (res.ok) setServices(await res.json());
        } catch (error) { console.error("Error fetching services", error); }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) console.error("No admin token found");

            const res = await fetch(`${API_URL}/orders`, {
                headers: { 'x-auth-token': token }
            });

            if (res.ok) {
                setOrders(await res.json());
            } else {
                console.error("Failed to fetch orders", res.status);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const updateOrderStatus = async (id, status) => {
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

    const approveReview = async (id, status) => {
        try {
            await fetch(`${API_URL}/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved: status })
            });
            fetchReviews();
        } catch (error) { console.error("Error updating review", error); }
    };

    const deleteReview = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await fetch(`${API_URL}/reviews/${id}`, { method: 'DELETE' });
            fetchReviews();
        } catch (error) { console.error("Error deleting review", error); }
    };

    const addService = async (e) => {
        e.preventDefault();
        try {
            await fetch(`${API_URL}/services`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newService)
            });
            setNewService({ title: '', description: '', icon: 'Smartphone', subServices: [] });
            fetchServices();
            alert("Service Added!");
        } catch (error) { console.error("Error adding service", error); }
    };

    const deleteService = async (id) => {
        if (!window.confirm("Delete this service?")) return;
        try {
            const res = await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Service deleted successfully");
                fetchServices();
            } else {
                const data = await res.json();
                alert(`Failed to delete: ${data.message}`);
            }
        } catch (error) {
            console.error("Error deleting service", error);
            alert("Error deleting service. Check console.");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
            <nav className="border-b border-white/10 px-8 py-4 flex justify-between items-center bg-neutral-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center font-bold text-xl">GS</div>
                    <h1 className="text-xl font-bold">Admin Dashboard</h1>
                </div>
                <button onClick={() => router.push('/')} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors">
                    <LogOut size={16} /> Exit to Site
                </button>
            </nav>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 border-r border-white/10 min-h-[calc(100vh-73px)] p-6 space-y-2 hidden md:block">
                    <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Package size={18} />} label="Orders Received" />
                    <TabButton active={activeTab === 'inquiries'} onClick={() => setActiveTab('inquiries')} icon={<MessageSquare size={18} />} label="Inquiries" />
                    <TabButton active={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} icon={<Users size={18} />} label="Reviews" />
                    <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')} icon={<Briefcase size={18} />} label="Services" />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-73px)]">

                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold mb-6">Received Orders</h2>
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
                                            {orders.length === 0 ? (
                                                <tr><td colSpan="7" className="p-8 text-center text-neutral-500">No orders received yet.</td></tr>
                                            ) : orders.map(order => (
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
                                                                <button onClick={() => updateOrderStatus(order._id, 'Done')} className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30" title="Mark Done">
                                                                    <Check size={16} />
                                                                </button>
                                                            )}
                                                            {order.status === 'Pending' && (
                                                                <button onClick={() => updateOrderStatus(order._id, 'In Progress')} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30" title="Mark In Progress">
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
                    )}

                    {activeTab === 'inquiries' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold mb-6">Contact Inquiries</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {contacts.map(contact => (
                                    <div key={contact._id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-lg">{contact.name}</h3>
                                            <span className="text-xs text-neutral-500">{new Date(contact.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="space-y-2 text-sm text-neutral-300">
                                            <p><span className="text-neutral-500">Email:</span> {contact.email}</p>
                                            <p><span className="text-neutral-500">Phone:</span> {contact.phone || 'N/A'}</p>
                                            <div className="pt-2 border-t border-white/5 mt-2">
                                                <p className="text-neutral-500 text-xs mb-1">Message:</p>
                                                <p>{contact.details}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {contacts.length === 0 && <p className="text-neutral-500">No inquiries yet.</p>}
                            </div>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold mb-6">Manage Reviews</h2>
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review._id} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="font-bold">{review.name}</h3>
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${review.isApproved ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {review.isApproved ? 'Live' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="text-neutral-400 text-sm">"{review.message}"</p>
                                            <div className="flex gap-1 mt-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-1.5 h-1.5 rounded-full ${i < review.rating ? 'bg-yellow-500' : 'bg-neutral-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            {!review.isApproved && (
                                                <button onClick={() => approveReview(review._id, true)} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors" title="Approve">
                                                    <Check size={20} />
                                                </button>
                                            )}
                                            {review.isApproved && (
                                                <button onClick={() => approveReview(review._id, false)} className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors" title="Hide">
                                                    <X size={20} />
                                                </button>
                                            )}
                                            <button onClick={() => deleteReview(review._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors" title="Delete">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'services' && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold mb-6">Manage Services</h2>

                            {/* Add Service Form */}
                            <form onSubmit={addService} className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 max-w-4xl">
                                <h3 className="font-bold mb-4 flex items-center gap-2 text-xl"><Plus size={20} /> Add New Service</h3>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            placeholder="Service Title"
                                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                            value={newService.title}
                                            onChange={e => setNewService({ ...newService, title: e.target.value })}
                                            required
                                        />
                                        <input
                                            placeholder="Icon Name (Lucide)"
                                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none"
                                            value={newService.icon}
                                            onChange={e => setNewService({ ...newService, icon: e.target.value })}
                                        />
                                    </div>
                                    <textarea
                                        placeholder="Service Description"
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-purple-500 outline-none h-24 resize-none"
                                        value={newService.description}
                                        onChange={e => setNewService({ ...newService, description: e.target.value })}
                                        required
                                    />

                                    {/* Sub-Services / Packages Section */}
                                    <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                                        <h4 className="font-bold mb-3 text-sm text-neutral-400 uppercase tracking-wider">Packages / Sub-services</h4>

                                        {/* List of added packages */}
                                        {newService.subServices && newService.subServices.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                                                {newService.subServices.map((sub, idx) => (
                                                    <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10 flex justify-between items-start">
                                                        <div>
                                                            <div className="font-bold">{sub.title}</div>
                                                            <div className="text-purple-400 text-sm">₹{sub.price}</div>
                                                            <div className="text-xs text-neutral-500 line-clamp-1">{sub.details}</div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const updated = newService.subServices.filter((_, i) => i !== idx);
                                                                setNewService({ ...newService, subServices: updated });
                                                            }}
                                                            className="text-red-400 hover:text-red-300"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add Package Inputs */}
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                                            <input
                                                placeholder="Package Title"
                                                id="pkg-title"
                                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                            />
                                            <input
                                                placeholder="Price (e.g. 500)"
                                                id="pkg-price"
                                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                            />
                                            <input
                                                placeholder="Details (comma sep)"
                                                id="pkg-details"
                                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const title = document.getElementById('pkg-title').value;
                                                    const price = document.getElementById('pkg-price').value;
                                                    const details = document.getElementById('pkg-details').value;

                                                    if (!title || !price) return alert("Title and Price required for package");

                                                    setNewService({
                                                        ...newService,
                                                        subServices: [
                                                            ...(newService.subServices || []),
                                                            { title, price, details, buttonText: "Buy Now", isPopular: false }
                                                        ]
                                                    });

                                                    // Clear inputs
                                                    document.getElementById('pkg-title').value = '';
                                                    document.getElementById('pkg-price').value = '';
                                                    document.getElementById('pkg-details').value = '';
                                                }}
                                                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-white/10"
                                            >
                                                + Add Package
                                            </button>
                                        </div>
                                    </div>

                                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20">
                                        Create Full Service
                                    </button>
                                </div>
                            </form>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {services.map(service => (
                                    <div key={service._id} className="p-5 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center group">
                                        <div>
                                            <h4 className="font-bold">{service.title}</h4>
                                            <p className="text-neutral-400 text-sm line-clamp-1">{service.description}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-neutral-500 text-xs px-2 py-1 bg-white/5 rounded">
                                                {service.icon}
                                            </div>
                                            <button
                                                onClick={() => deleteService(service._id)}
                                                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
                                                title="Delete Service"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-neutral-400 hover:bg-white/5 hover:text-white'}`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

export default AdminDashboard;
