import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, User, Key, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const LoginModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [mode, setMode] = useState('loading'); // loading, init, login, reset
    const [formData, setFormData] = useState({ username: '', secretKey: '', newSecretKey: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            checkInitialization();
        }
    }, [isOpen]);

    const checkInitialization = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/check`);
            const data = await res.json();
            setMode(data.initialized ? 'login' : 'init');
        } catch (err) {
            // If backend is down, maybe show error or default to login
            setMode('login');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let url = '';
            let body = {};

            if (mode === 'init') {
                url = `${API_URL}/admin/init`;
                body = { username: formData.username, secretKey: formData.secretKey };
            } else if (mode === 'login') {
                url = `${API_URL}/admin/login`;
                body = { username: formData.username, secretKey: formData.secretKey };
            } else if (mode === 'reset') {
                url = `${API_URL}/admin/reset`;
                body = { username: formData.username, newSecretKey: formData.newSecretKey };
            }

            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (res.ok) {
                if (mode === 'reset') {
                    alert("Secret Key Reset Successfully! Please Log In.");
                    setMode('login');
                    setFormData({ username: '', secretKey: '', newSecretKey: '' });
                } else {
                    localStorage.setItem('isAdminAuthenticated', 'true');
                    if (data.token) localStorage.setItem('adminToken', data.token); // Store Admin Token separately
                    onClose();
                    navigate('/dashboard');
                }
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            console.error(err);
            setError(`Network Error connecting to: ${url}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <div className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl">
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                        <X size={24} />
                    </button>

                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none -mr-16 -mt-16" />

                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        {mode === 'init' && <><ShieldCheck className="text-blue-400" /> Setup Admin</>}
                        {mode === 'login' && <><Lock className="text-purple-400" /> Admin Access</>}
                        {mode === 'reset' && <><RefreshCw className="text-orange-400" /> Reset Access</>}
                    </h2>
                    <p className="text-neutral-400 text-sm mb-6">
                        {mode === 'init' && "Create your admin credentials to secure the dashboard."}
                        {mode === 'login' && "Enter your credentials to access the dashboard."}
                        {mode === 'reset' && "Enter your username to set a new secret key."}
                    </p>

                    {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-sm mb-4 border border-red-500/20">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500 uppercase tracking-widest pl-1">Admin Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    placeholder="e.g. admin"
                                />
                            </div>
                        </div>

                        {mode !== 'reset' && (
                            <div className="space-y-1">
                                <label className="text-xs text-neutral-500 uppercase tracking-widest pl-1">Secret Key</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={formData.secretKey}
                                        onChange={e => setFormData({ ...formData, secretKey: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        )}

                        {mode === 'reset' && (
                            <div className="space-y-1">
                                <label className="text-xs text-neutral-500 uppercase tracking-widest pl-1">New Secret Key</label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 text-neutral-500" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={formData.newSecretKey}
                                        onChange={e => setFormData({ ...formData, newSecretKey: e.target.value })}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                        placeholder="Enter new key"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (mode === 'init' ? 'Create Admin' : mode === 'reset' ? 'Update Key' : 'Unlock Dashboard')}
                        </button>
                    </form>

                    {mode === 'login' && (
                        <div className="mt-4 text-center">
                            <button onClick={() => setMode('reset')} className="text-xs text-neutral-500 hover:text-white transition-colors">
                                Forgot Secret Key?
                            </button>
                        </div>
                    )}
                    {mode === 'reset' && (
                        <div className="mt-4 text-center">
                            <button onClick={() => setMode('login')} className="text-xs text-neutral-500 hover:text-white transition-colors">
                                Back to Login
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default LoginModal;
