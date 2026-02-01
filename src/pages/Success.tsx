import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { useAuth } from '../lib/auth';
import { motion } from 'framer-motion';
import { fireConfetti } from '../lib/confetti';
import {
    CheckCircle,
    Rocket,
    Shield,
    Zap,
    ArrowRight
} from 'lucide-react';

export function Success() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const hasNavigated = useRef(false);

    const { refreshProfile, profile, user } = useAuth();

    useEffect(() => {
        // Fire confetti on mount
        fireConfetti();
        const timer = setTimeout(() => fireConfetti(), 500);

        // Force refresh profile to catch webhook update
        const checkProStatus = async () => {
            await refreshProfile();
        };

        // Start polling immediately
        checkProStatus();

        const interval = setInterval(async () => {
            // Prevent navigation if we've already done it
            if (hasNavigated.current) {
                clearInterval(interval);
                return;
            }

            await checkProStatus();
        }, 2000);

        // Stop polling after 20s to save resources
        const stopTimer = setTimeout(() => clearInterval(interval), 20000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            clearTimeout(stopTimer);
        };
    }, [refreshProfile]);

    // Separate effect for handling navigation when is_pro becomes true
    useEffect(() => {
        if (!profile?.is_pro || hasNavigated.current) return;

        hasNavigated.current = true;

        // Check for pending hustle in localStorage using user.id (consistent with Explainer.tsx)
        const pendingHustleKey = user ? `hustlepath_pending_hustle_${user.id}` : null;
        const pendingHustleData = pendingHustleKey ? localStorage.getItem(pendingHustleKey) : null;

        if (pendingHustleData) {
            try {
                const hustle = JSON.parse(pendingHustleData);
                // Clear the pending hustle from localStorage
                localStorage.removeItem(pendingHustleKey!);
                // Redirect to explainer with the hustle state
                navigate('/explainer', { state: { hustle }, replace: true });
            } catch (e) {
                console.error('Failed to parse pending hustle:', e);
                navigate('/dashboard', { replace: true });
            }
        } else {
            // No pending hustle, go to dashboard
            navigate('/dashboard', { replace: true });
        }
    }, [profile?.is_pro, user, navigate]);

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 max-w-3xl text-center">
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-green-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(190,242,100,0.4)]">
                        <CheckCircle className="w-12 h-12 text-black" />
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Mission Data <span className="text-primary">Unlocked!</span>
                    </h1>
                    <p className="text-xl text-white/70 mb-12">
                        You now have full access to HustlePath Pro. Your side hustle journey just leveled up.
                    </p>
                </motion.div>

                {/* What's Unlocked */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-12"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center justify-center gap-2">
                        <Shield className="text-primary" />
                        Your Pro Access Includes
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                                <Rocket className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">Advanced Tactics</h3>
                            <p className="text-sm text-white/60">Growth strategies used by top earners in your hustle category.</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">Pro Tools List</h3>
                            <p className="text-sm text-white/60">Curated software and resources to accelerate your launch.</p>
                        </div>
                        <div className="bg-white/5 rounded-2xl p-6">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="font-bold mb-2">Community Access</h3>
                            <p className="text-sm text-white/60">Connect with other hustlers on the same mission.</p>
                        </div>
                    </div>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Button
                        size="lg"
                        className="text-lg px-12 py-6"
                        onClick={() => navigate('/dashboard')}
                    >
                        Go to Dashboard <ArrowRight className="ml-2" />
                    </Button>
                    <p className="text-sm text-white/40 mt-4">
                        Session ID: {sessionId || 'N/A'}
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
