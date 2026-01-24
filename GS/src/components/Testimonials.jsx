import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, User } from 'lucide-react';
import { API_URL } from '../config';

const initialReviews = [
    {
        id: 1,
        name: "Rahul Sharma",
        role: "App Developer",
        rating: 5,
        message: "GS Agency completely transformed our app launch. The keyword installs worked like magic, and we saw a 300% boost in organic traffic within a week!",
        initials: "RS"
    },
    {
        id: 2,
        name: "Priya Patel",
        role: "Business Owner",
        rating: 5,
        message: "Our GMB listing was stagnant for months. Their review management and optimization service got us to the top 3 pack in our local area.",
        initials: "PP"
    },
    {
        id: 3,
        name: "Amit Verma",
        role: "YouTuber",
        rating: 4,
        message: "The monetization package is legit. Genuine watch hours and subs. Finally got my channel monetized after struggling for a year.",
        initials: "AV"
    }
];

const Testimonials = () => {
    const [reviews, setReviews] = useState(initialReviews);
    const [formData, setFormData] = useState({ name: '', message: '', rating: 5 });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch(`${API_URL}/reviews`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0) {
                        const mappedReviews = data.map(r => ({
                            id: r._id,
                            name: r.name,
                            role: r.role,
                            rating: r.rating,
                            message: r.message,
                            initials: r.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                        }));
                        setReviews([...initialReviews, ...mappedReviews]);
                    }
                }
            } catch (error) { console.error("Error fetching reviews", error); }
        };
        fetchReviews();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.message) return;

        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                alert("Thank you! Your feedback has been submitted for review.");
                setFormData({ name: '', message: '', rating: 5 });
            } else {
                alert("Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting review", error);
            alert("Failed to submit review.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="py-20 relative z-10" id="testimonials">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">Clients <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 text-glow">Feedback</span></h2>
                <p className="text-neutral-400 max-w-2xl mx-auto">Don't just take our word for it. See what our partners have to say.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Reviews List */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        Recent Reviews <span className="text-sm font-normal text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full">{reviews.length}</span>
                    </h3>
                    <div className="max-h-[600px] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                        {reviews.map((review) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                layout
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
                                        {review.initials}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-bold text-white">{review.name}</h4>
                                            <span className="text-xs text-neutral-500">• {review.role}</span>
                                        </div>
                                        <div className="flex text-yellow-500 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-neutral-700"} />
                                            ))}
                                        </div>
                                        <p className="text-neutral-300 text-sm leading-relaxed">"{review.message}"</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Add Feedback Form */}
                <div className="sticky top-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-6 md:p-8 rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

                        <h3 className="text-xl md:text-2xl font-bold mb-6 flex items-center gap-2 relative z-10">
                            <MessageSquarePlus className="text-purple-400" />
                            Share your Feedback
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10 text-sm">
                            <div className="space-y-2">
                                <label className="text-neutral-400 pb-1">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-3 text-neutral-500" size={16} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-neutral-600"
                                        placeholder="Enter your name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-neutral-400 pb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className={`p-2 rounded-lg transition-colors ${formData.rating >= star ? 'text-yellow-400 bg-yellow-400/10' : 'text-neutral-600 hover:text-neutral-400'}`}
                                        >
                                            <Star size={20} fill={formData.rating >= star ? "currentColor" : "none"} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-neutral-400 pb-1">Message</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none placeholder:text-neutral-600"
                                    placeholder="How was your experience?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export default Testimonials;
