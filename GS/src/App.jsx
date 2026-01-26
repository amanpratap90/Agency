import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import GlowingBackground from './components/GlowingBackground';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';
import WhatsAppButton from './components/WhatsAppButton';
import Testimonials from './components/Testimonials';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import PlaceOrder from './pages/PlaceOrder';
import UserDashboard from './pages/UserDashboard';
import LoginModal from './components/LoginModal'; // Import LoginModal
import UserAuthModal from './components/Auth/UserAuthModal'; // Import User Auth Modal
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

function AppContent() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Admin Login
    const [isUserAuthModalOpen, setIsUserAuthModalOpen] = useState(false); // User Login

    return (
        <>
            <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/dashboard/orders" element={<AdminOrders />} />
                <Route path="/my-account" element={<UserDashboard />} />
                <Route path="/place-order" element={<PlaceOrder />} />
                <Route path="/" element={
                    <MainLayout
                        openLogin={() => setIsLoginModalOpen(true)}
                        openUserAuth={() => setIsUserAuthModalOpen(true)}
                    />
                } />
            </Routes>
            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
            <UserAuthModal isOpen={isUserAuthModalOpen} onClose={() => setIsUserAuthModalOpen(false)} />
        </>
    );
}

function MainLayout({ openLogin, openUserAuth }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [footerClicks, setFooterClicks] = useState(0);
    const { user } = useAuth(); // Access user state

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleFooterClick = () => {
        const newCount = footerClicks + 1;
        setFooterClicks(newCount);
        if (newCount === 3) {
            openLogin();
            setFooterClicks(0);
        }
    };

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-orange-500/30 selection:text-orange-200">
            <GlowingBackground />
            <WhatsAppButton />

            <main className="relative z-10 container mx-auto px-4 py-8 md:px-8">
                <header className="flex justify-between items-center mb-10 pt-4 sticky top-0 z-50 backdrop-blur-md -mx-4 px-4 py-4 md:static md:bg-transparent md:backdrop-blur-none">
                    <div className="flex items-center gap-3">
                        <img src="/gs-logo.jpg" alt="GS Logo" className="h-10 w-auto rounded-md object-contain" />
                        <div className="text-3xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">GS Promotion Company</div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="text-sm text-neutral-400 gap-8 hidden md:flex items-center bg-white/5 px-6 py-3 rounded-full border border-white/5 backdrop-blur-sm">
                        <a href="#home" className="hover:text-white transition-colors">Home</a>
                        <a href="#services" className="hover:text-white transition-colors">Services</a>
                        <a href="#testimonials" className="hover:text-white transition-colors">Reviews</a>
                        <a href="#about" className="hover:text-white transition-colors">About</a>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-neutral-400">Hello, <span className="text-white font-bold">{user.username}</span></span>
                                <a href="/my-account" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all">My Account</a>
                            </div>
                        ) : (
                            <a href="#contact" className="px-4 py-2 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors">Contact</a>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMenu} className="md:hidden text-white p-2 z-50 relative">
                        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>

                    {/* Mobile Nav Drawer */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, x: '100%' }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col justify-center items-center md:hidden"
                            >
                                <nav className="flex flex-col gap-8 text-2xl font-bold text-center">
                                    <a href="#home" onClick={closeMenu} className="text-white hover:text-purple-400 transition-colors">Home</a>
                                    <a href="#services" onClick={closeMenu} className="text-white hover:text-purple-400 transition-colors">Services</a>
                                    <a href="#testimonials" onClick={closeMenu} className="text-white hover:text-purple-400 transition-colors">Reviews</a>
                                    <a href="#about" onClick={closeMenu} className="text-white hover:text-purple-400 transition-colors">About</a>
                                    {user ? (
                                        <a href="/my-account" onClick={closeMenu} className="text-orange-500 hover:text-orange-400 transition-colors">My Account</a>
                                    ) : (
                                        <a href="#contact" onClick={closeMenu} className="text-white hover:text-purple-400 transition-colors">Contact</a>
                                    )}
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </header>

                <Hero />
                <Services openUserAuth={openUserAuth} />
                <About />
                <Testimonials />
                <Contact />

                <footer className="mt-20 py-8 border-t border-white/5 text-center text-neutral-600 text-sm">
                    <span onClick={handleFooterClick} className="cursor-pointer select-none">
                        © {new Date().getFullYear()} GS Agency All Custom Rights Reserved.
                    </span>
                </footer>

            </main>
        </div>
    );
}

export default App;
