"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserAuthModal = ({ isOpen, onClose }) => {
    const { login, register } = useAuth();
    const [mode, setMode] = useState('login'); // login, signup
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let res;
            if (mode === 'login') {
                res = await login(formData.email, formData.password);
            } else {
                res = await register(formData.username, formData.email, formData.password);
            }

            if (res.success) {
                onClose();
                // User will be redirected by the component that opened this, or just stay on page
            } else {
                setError(res.msg || 'Authentication failed');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-neutral-900 border border-white/10 p-8 rounded-3xl w-full max-w-md relative overflow-hidden shadow-2xl"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-neutral-400 hover:text-white">
                        <X size={24} />
                    </button>

                    <h2 className="text-3xl font-bold mb-2 text-white">
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-neutral-400 mb-8">
                        {mode === 'login' ? 'Login to manage your orders' : 'Sign up to start promoting'}
                    </p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                            <div className="space-y-1">
                                <label className="text-xs text-neutral-500 uppercase tracking-widest pl-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-neutral-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.username}
                                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                        placeholder="johndoe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500 uppercase tracking-widest pl-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-neutral-500" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-neutral-500 uppercase tracking-widest pl-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-neutral-500" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-orange-500 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Processing...' : (mode === 'login' ? 'Login' : 'Sign Up')} <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-neutral-400">
                        {mode === 'login' ? (
                            <>
                                Don't have an account?{' '}
                                <button onClick={() => setMode('signup')} className="text-orange-500 hover:text-orange-400 font-bold ml-1">
                                    Sign Up
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{' '}
                                <button onClick={() => setMode('login')} className="text-orange-500 hover:text-orange-400 font-bold ml-1">
                                    Login
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UserAuthModal;
