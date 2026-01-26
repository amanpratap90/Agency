import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, MapPin, Phone, Facebook, Youtube, Star, X, Check, ArrowRight } from 'lucide-react';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Services = ({ openUserAuth }) => {
    const [servicesList, setServicesList] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch(`${API_URL}/services`);
                if (res.ok) {
                    const data = await res.json();
                    const mappedServices = data.map(s => ({
                        ...s,
                        icon: getIcon(s.icon),
                        gradient: s.gradient || "from-blue-500/20 to-cyan-500/20"
                    }));
                    setServicesList(mappedServices);
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            }
        };
        fetchServices();
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedService) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedService]);

    const getIcon = (iconName) => {
        const icons = { Smartphone, MapPin, Phone, Facebook, Youtube, Star };
        const IconComponent = icons[iconName] || Smartphone;
        return <IconComponent size={32} className="text-white" />;
    };

    const handleBuyNow = (service, subService) => {
        if (!user) {
            // Close modal if open (optional, but good UX)
            setSelectedService(null);
            openUserAuth();
        } else {
            // Navigate to Place Order with data
            navigate('/place-order', {
                state: {
                    serviceTitle: service.title,
                    subService: subService
                }
            });
        }
    };

    return (
        <section className="py-20 relative z-10" id="services">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-20"
            >
                <h2 className="text-5xl md:text-7xl font-bold mb-6">Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 text-glow">Services</span></h2>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto">Unlock your business's potential with our digital marketing expertise.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
                {servicesList.map((service, index) => (
                    <motion.div
                        key={service._id || index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-purple-500/30 transition-all hover:bg-white/10 backdrop-blur-sm overflow-hidden flex flex-col h-full"
                    >
                        {/* Hover Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`} />

                        <div className="relative z-10 flex-1">
                            <div className="mb-6 bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform duration-300">
                                {React.cloneElement(service.icon, { size: 32 })}
                            </div>
                            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">{service.title}</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                                {service.description}
                            </p>
                        </div>

                        <div className="relative z-10 mt-auto">
                            <button
                                onClick={() => setSelectedService(service)}
                                className="group/btn relative w-full overflow-hidden bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
                                <span className="relative flex items-center justify-center gap-2">
                                    Promote with us <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Sub-Services Modal via Portal */}
            {createPortal(
                <AnimatePresence>
                    {selectedService && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedService(null)}
                                className="absolute inset-0"
                            />

                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="relative w-full max-w-7xl bg-[#111] text-gray-200 rounded-[2.5rem] p-8 md:p-12 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl shadow-orange-900/10 border border-white/10 z-[10000]"
                            >
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-50"
                                >
                                    <X size={24} />
                                </button>

                                <div className="text-center mb-16 relative">
                                    <h3 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">
                                        {selectedService.title}
                                        <span className="block text-2xl md:text-3xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mt-2">Premium Packages</span>
                                    </h3>
                                    <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-600 mx-auto rounded-full" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                    {selectedService.subServices && selectedService.subServices.length > 0 ? (
                                        selectedService.subServices.map((sub, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className="relative bg-white/5 rounded-[2rem] p-8 shadow-lg hover:shadow-orange-500/10 border border-white/10 hover:border-orange-500/50 transition-all duration-300 group flex flex-col items-center text-center hover:-translate-y-2"
                                            >
                                                {sub.isPopular && (
                                                    <div className="absolute -top-4 w-full flex justify-center">
                                                        <span className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-[11px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/30">
                                                            Most Popular
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="mb-6 w-full">
                                                    <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wide leading-tight">{sub.title}</h4>
                                                    <div className="w-12 h-1 bg-white/20 mx-auto rounded-full group-hover:bg-orange-500 transition-colors shadow-sm" />
                                                </div>

                                                <div className="text-sm text-gray-400 mb-8 leading-relaxed flex-1 w-full space-y-2">
                                                    {/* Logic for bullet points if comma separated, or just text */}
                                                    {sub.details && sub.details.includes(',') ? (
                                                        sub.details.split(',').map((d, i) => (
                                                            <div key={i} className="flex items-center justify-center gap-2">
                                                                <Check size={14} className="text-orange-500 shrink-0" />
                                                                <span className="text-gray-300 font-medium">{d.trim()}</span>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="font-medium text-gray-300">{sub.details}</p>
                                                    )}
                                                </div>

                                                <div className="mb-8 relative">
                                                    <span className="text-4xl font-black text-white tracking-tighter">₹{sub.price}</span>
                                                </div>

                                                <button
                                                    onClick={() => handleBuyNow(selectedService, sub)}
                                                    className="w-full bg-[#FF4500] hover:bg-[#FF3300] text-white font-extrabold py-4 px-6 rounded-2xl transition-all shadow-[0_10px_20px_-5px_rgba(255,69,0,0.3)] hover:shadow-[0_15px_30px_-5px_rgba(255,69,0,0.4)] active:scale-95 uppercase text-xs tracking-widest flex items-center justify-center gap-2 group-hover:gap-3"
                                                >
                                                    {sub.buttonText || "Buy Now"} <ArrowRight size={16} />
                                                </button>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="col-span-full flex flex-col items-center justify-center py-24 text-gray-400 bg-white/5 rounded-[2.5rem] shadow-sm border border-white/10">
                                            <Smartphone size={64} className="mb-6 text-gray-600" strokeWidth={1.5} />
                                            <p className="text-2xl font-bold text-white">Coming Soon</p>
                                            <p className="text-gray-500 mt-2 mb-8">Packages for this service are being updated.</p>
                                            <button
                                                onClick={() => setSelectedService(null)}
                                                className="text-orange-500 hover:text-orange-400 font-bold flex items-center gap-2 hover:gap-3 transition-all"
                                            >
                                                Back to Services <ArrowRight size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </section>
    );
};

export default Services;
