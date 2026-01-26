import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';
import { ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

const PlaceOrder = () => {
    const { state } = useLocation();
    const { user } = useAuth();
    const navigate = useNavigate();

    // Default values if navigated directly (optional handling)
    const serviceTitle = state?.serviceTitle || 'General Service';
    const subService = state?.subService || { title: 'Custom Package', price: 0 };

    const [formData, setFormData] = useState({
        country: '',
        url: '',
        comments: '',
        quantity: 1,
        utrNumber: '',
    });
    const [screenshot, setScreenshot] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!user) navigate('/');
    }, [user, navigate]);

    const calculateAmount = () => {
        return (subService.price * formData.quantity).toFixed(2);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!screenshot) {
            alert("Please upload payment screenshot");
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();
            data.append('serviceTitle', serviceTitle);
            data.append('subServiceTitle', subService.title);
            data.append('amount', calculateAmount());
            data.append('quantity', formData.quantity);
            data.append('country', formData.country);
            data.append('targetUrl', formData.url);
            data.append('comments', formData.comments);
            data.append('utrNumber', formData.utrNumber);
            data.append('paymentScreenshot', screenshot);

            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/orders`, {
                method: 'POST',
                headers: { 'x-auth-token': token }, // Content-Type handled automatically by FormData
                body: data
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/my-account'), 2000);
            } else {
                alert("Order failed. Please try again.");
            }
        } catch (err) {
            console.error(err);
            alert("Server Error");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center p-8 bg-neutral-900 rounded-3xl border border-white/10">
                    <CheckCircle2 size={64} className="text-green-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">Order Placed!</h2>
                    <p className="text-neutral-400">Redirecting to your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-neutral-950 text-white pt-24 pb-12 px-4">
            <div className="max-w-2xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-neutral-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back
                </button>

                <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h1 className="text-3xl font-bold mb-2">Place New Order</h1>
                    <p className="text-neutral-400 mb-8 border-b border-white/5 pb-6">
                        Complete your purchase for <span className="text-orange-500 font-bold">{subService.title}</span> ({serviceTitle})
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Select Country *</label>
                                <input
                                    type="text" required
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                                    placeholder="e.g. India, USA"
                                    value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-300">Select Quantity *</label>
                                <input
                                    type="number" required min="1"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                                    value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Target URL *</label>
                            <input
                                type="url" required
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                                placeholder="https://..."
                                value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })}
                            />
                            <p className="text-xs text-neutral-500">Enter your App, Video, or Profile URL to promote.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Comments (Optional)</label>
                            <textarea
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none h-24 resize-none"
                                placeholder="Any specific instructions..."
                                value={formData.comments} onChange={e => setFormData({ ...formData, comments: e.target.value })}
                            />
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 flex justify-between items-center border border-white/10">
                            <span className="text-neutral-400">Total Amount:</span>
                            <span className="text-2xl font-bold text-white">₹{calculateAmount()}</span>
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white rounded-2xl p-6 text-black flex flex-col items-center text-center space-y-4">
                            <h3 className="font-bold text-lg">Scan to Pay</h3>
                            <div className="bg-white p-2 rounded-lg shadow-sm border border-neutral-200">
                                {/* Use uploaded QR code or placeholder */}
                                <img src="/qr-code-placeholder.png" alt="Payment QR" className="w-48 h-48 object-contain" />
                            </div>
                            <p className="text-sm text-neutral-600">Scan via Any UPI App</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">UTR / Transaction ID *</label>
                            <input
                                type="text" required
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
                                placeholder="Enter 12-digit UTR number"
                                value={formData.utrNumber} onChange={e => setFormData({ ...formData, utrNumber: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">Upload Screenshot *</label>
                            <div className={`border-2 border-dashed ${preview ? 'border-orange-500' : 'border-white/20'} rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer relative`}>
                                <input
                                    type="file" accept="image/*" required
                                    onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {preview ? (
                                    <div className="relative h-40">
                                        <img src={preview} alt="Preview" className="h-full mx-auto rounded-lg object-contain" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-medium opacity-0 hover:opacity-100 transition-opacity">Change</div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-neutral-400">
                                        <Upload size={32} className="mb-2" />
                                        <span>Click to upload payment proof</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Processing Order...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
