import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, MapPin, Phone, Facebook, Youtube, Star } from 'lucide-react';

const services = [
    {
        icon: <Smartphone size={32} className="text-blue-400 group-hover:text-blue-300 transition-colors" />,
        title: "App Promotions",
        description: "Buy App Reviews, Direct Installs, Keyword Installs etc. from any location as per your requirement.",
        gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
        icon: <MapPin size={32} className="text-green-400 group-hover:text-green-300 transition-colors" />,
        title: "GMB Listing Promotions",
        description: "Buy guaranteed GMB reviews, get negative comments removed service, Paid GMB listing live service.",
        gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
        icon: <Phone size={32} className="text-orange-400 group-hover:text-orange-300 transition-colors" />,
        title: "Justdial Promotion",
        description: "Get authentic Justdial ratings and reviews to grow your business.",
        gradient: "from-orange-500/20 to-red-500/20"
    },
    {
        icon: <Facebook size={32} className="text-blue-600 group-hover:text-blue-400 transition-colors" />,
        title: "Facebook Promotions",
        description: "Get Facebook Reviews, followers, comments & likes etc.",
        gradient: "from-blue-600/20 to-indigo-600/20"
    },
    {
        icon: <Youtube size={32} className="text-red-500 group-hover:text-red-400 transition-colors" />,
        title: "YouTube Monetization",
        description: "Buy Full monetization package, YT subs, likes, comments, watchtime etc.",
        gradient: "from-red-600/20 to-pink-600/20"
    },
    {
        icon: <Star size={32} className="text-yellow-400 group-hover:text-yellow-300 transition-colors" />,
        title: "Other Platform Reviews",
        description: "Buy guaranteed Swiggy reviews, Zomato reviews, Mouthshut reviews, Glassdoor reviews & all other.",
        gradient: "from-yellow-500/20 to-amber-500/20"
    }
];

const Services = () => {
    const [servicesList, setServicesList] = useState(services);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/services');
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        // Map backend data to frontend structure if needed
                        // Assuming backend returns similar structure but we need to map icons properly
                        const mappedServices = data.map(s => ({
                            ...s,
                            icon: getIcon(s.icon), // We need a helper to map string to component
                            gradient: s.gradient || "from-blue-500/20 to-cyan-500/20"
                        }));
                        setServicesList([...services, ...mappedServices]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            }
        };
        fetchServices();
    }, []);

    const getIcon = (iconName) => {
        const icons = { Smartphone, MapPin, Phone, Facebook, Youtube, Star };
        const IconComponent = icons[iconName] || Smartphone;
        return <IconComponent size={32} className="text-purple-400 group-hover:text-purple-300 transition-colors" />;
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {servicesList.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative p-6 md:p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:bg-white/10 backdrop-blur-sm overflow-hidden"
                    >
                        {/* Hover Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />

                        <div className="relative z-10">
                            <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/20">
                                {/* Clone element to override size prop if needed, or just re-render with new size */}
                                {React.cloneElement(service.icon, { size: 32 })}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{service.title}</h3>
                            <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">
                                {service.description}
                            </p>

                            <button className="mt-6 text-sm font-semibold text-white/50 group-hover:text-white flex items-center gap-2 transition-colors">
                                Promote with us <span className="block w-1 h-1 bg-purple-500 rounded-full group-hover:w-full transition-all duration-300 h-[1px]"></span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Services;
