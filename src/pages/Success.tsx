import { useEffect } from 'react';
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

    const { refreshProfile, profile } = useAuth();

    useEffect(() => {
        // Fire confetti on mount
        fireConfetti();
        const timer = setTimeout(() => fireConfetti(), 500);

        // Force refresh profile to catch webhook update
        const checkProStatus = async () => {
            await refreshProfile();
        };

    // Poll for status update (webhook might delay 1-3s)
    checkProStatus();
    const interval = setInterval(() => {
        if (!profile?.is_pro) {
            checkProStatus();
        } else {
            clearInterval(interval);
            navigate('/'); // Redirect to home after successful payment verification
        }
    }, 2000);

    // Stop polling after 15s to save resources
    const stopTimer = setTimeout(() => clearInterval(interval), 15000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            clearTimeout(stopTimer);
        };
    }, [profile?.is_pro, navigate, refreshProfile]);

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
