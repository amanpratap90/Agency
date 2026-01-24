import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send } from 'lucide-react';

const Contact = () => {
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Map frontend fields to backend schema
            const payload = {
                name: `${formData.firstName} ${formData.lastName}`.trim(),
                email: formData.email,
                phone: formData.phone,
                details: formData.message
            };

            const res = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Message sent successfully! We will get back to you soon.");
                setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error sending message", error);
            alert("Failed to send message.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-20 relative z-10" id="contact">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-bold mb-4">Contact <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 text-glow">Us</span></h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-1 p-8 rounded-3xl bg-neutral-900/50 border border-white/5 backdrop-blur-md h-fit"
                >
                    <h3 className="text-xl font-bold mb-8">Get in Touch</h3>

                    <div className="flex items-start gap-4 mb-8 group">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400 mb-1">EMAIL</p>
                            <a href="mailto:gspromotioncompany@gmail.com" className="text-white font-medium hover:text-purple-400 transition-colors">gspromotioncompany@gmail.com</a>
                        </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-400 group-hover:bg-green-500/20 transition-colors">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-neutral-400 mb-1">PHONE</p>
                            <a href="tel:+917607911769" className="text-white font-medium hover:text-green-400 transition-colors">+91 7607911769</a>
                        </div>
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
                >
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400 ml-1">First name *</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-light"
                                    placeholder="Enter your First Name *"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400 ml-1">Last name *</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-light"
                                    placeholder="Enter your Last Name *"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400 ml-1">Phone number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-light"
                                placeholder="+91 0000000000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400 ml-1">Email address *</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-light"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400 ml-1">Your Message *</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all font-light resize-none"
                                placeholder="Tell us about your project..."
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl font-bold text-white shadow-lg shadow-orange-900/20 hover:shadow-orange-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Sending...' : 'Submit Form'} <Send size={18} />
                        </button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default Contact;
