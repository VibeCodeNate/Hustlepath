import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { PricingCard } from '../components/PricingCard';
import { Brain, Target, TrendingUp, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function Landing() {
    const navigate = useNavigate();
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    const { user, profile } = useAuth();
    const [checkingOut, setCheckingOut] = useState(false);

    const handleFreeCta = () => {
        if (user) {
            navigate('/dashboard');
        } else {
            navigate('/assessment');
        }
    };

    const handleProCta = async () => {
        if (user) {
            if (profile?.is_pro) {
                navigate('/dashboard');
                return;
            }

            // User is logged in but not pro -> Checkout
            setCheckingOut(true);
            try {
                // Use the same function as Explainer, passing a generic hustle title or specific product intent
                const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                    body: { hustleTitle: 'HustlePath Pro Upgrade' }
                });

                if (error) throw error;
                if (data?.url) {
                    window.location.href = data.url;
                }
            } catch (err) {
                console.error('Checkout error:', err);
                alert('Failed to start checkout. Please try again.');
                setCheckingOut(false);
            }
        } else {
            // Not logged in -> Assessment (funnel start)
            navigate('/assessment');
        }
    };

    return (
        <div className="min-h-screen bg-background selection:bg-primary/20 overflow-x-hidden">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-32 overflow-hidden min-h-[90vh] flex items-center justify-center">
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                <motion.div
                    style={{ y: y1, x: -100 }}
                    className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 mix-blend-screen animate-pulse-slow"
                />
                <motion.div
                    style={{ y: y2, x: 100 }}
                    className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full pointer-events-none opacity-50 mix-blend-screen animate-pulse-slow delay-1000"
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(190,242,100,0.1)] hover:shadow-[0_0_30px_rgba(190,242,100,0.2)] transition-shadow cursor-default"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span>AI-Powered Side Hustle Engine</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1]"
                    >
                        Find Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-300 to-emerald-400 animate-gradient-text drop-shadow-[0_0_30px_rgba(190,242,100,0.3)]">
                            Multi-Income
                        </span> <br />
                        Future.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                    >
                        Stop guessing. Our AI analyzes your skills and psychology to build a
                        <span className="text-foreground font-medium mx-1 border-b border-primary/50">predictable roadmap</span>
                        to $5k/mo freedom.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-green-400 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                            <Button size="lg" className="relative h-14 px-10 text-lg bg-black text-white border border-primary/50 hover:bg-primary hover:text-black transition-all" onClick={handleFreeCta}>
                                <Sparkles className="mr-2 h-5 w-5" />
                                Start Engine
                            </Button>
                        </div>
                        <Button size="lg" variant="ghost" className="h-14 px-8 text-lg hover:bg-white/5 border border-transparent hover:border-white/10" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                            See functionality
                        </Button>
                    </motion.div>

                    {/* Trusted By / Tech Stack */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="mt-32 pt-10 border-t border-white/5"
                    >
                        <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-semibold flex items-center justify-center gap-2">
                            <ShieldCheck className="w-4 h-4" /> Powered By Next-Gen Tech
                        </p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
                            {['OpenAI GPT-4', 'Supabase Vector', 'React Fiber', 'Stripe Connect'].map((logo) => (
                                <span key={logo} className="text-lg font-bold text-white/40 hover:text-white transition-colors cursor-default">{logo}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* How It Works Section */}
            <motion.section
                id="how-it-works"
                className="py-32 relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Precision Engineering</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto text-lg">We don't just give you ideas. We give you a blueprint.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-[60px] left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent z-0"></div>

                        {[
                            { step: "01", title: "Neural Analysis", desc: "10-point psychometric assessment maps your strengths.", icon: Brain },
                            { step: "02", title: "Market Fit", desc: "Real-time data matches you to high-demand niches.", icon: Target },
                            { step: "03", title: "Execution", desc: "Daily task protocols to ensure consistent growth.", icon: Zap }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="relative z-10 pt-4 text-center group"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <div className={`mx-auto h-28 w-28 rounded-3xl flex items-center justify-center mb-8 bg-black borderborder-white/10 shadow-2xl relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2 ${i === 1 ? 'border-primary/50 shadow-[0_0_40px_rgba(190,242,100,0.15)]' : 'border border-white/10'}`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                                    <item.icon className="w-10 h-10 text-white/80 group-hover:text-primary transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Features Section - Bento Grid Style */}
            <section id="features" className="py-32 bg-white/5 border-y border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-6">Why HustlePath?</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Legacy advice says "follow your passion". We say "follow the data".</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div whileHover={{ y: -5 }} className="rounded-3xl bg-black border border-white/10 p-8 hover:border-primary/30 transition-colors">
                            <Brain className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-3">AI Skill Analysis</h3>
                            <p className="text-muted-foreground">Our advanced algorithms scan 50+ data points about you to find side hustles that match your natural strengths.</p>
                        </motion.div>
                        <motion.div whileHover={{ y: -5 }} className="rounded-3xl bg-black border border-white/10 p-8 hover:border-primary/30 transition-colors md:col-span-2 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Target className="w-10 h-10 text-blue-400 mb-6 relative z-10" />
                            <h3 className="text-xl font-bold mb-3 relative z-10">Personalized Roadmap</h3>
                            <p className="text-muted-foreground relative z-10">Get a step-by-step interactive plan with weekly objectives, milestones, and direct feedback loops. No generic PDFs.</p>

                            {/* Decorative Graph */}
                            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-t from-primary/10 to-transparent opacity-20 mask-image-gradient" />
                        </motion.div>
                        <motion.div whileHover={{ y: -5 }} className="rounded-3xl bg-black border border-white/10 p-8 hover:border-primary/30 transition-colors md:col-span-3 text-center">
                            <TrendingUp className="w-10 h-10 text-purple-400 mx-auto mb-6" />
                            <h3 className="text-xl font-bold mb-3">Gamified Growth Engine</h3>
                            <p className="text-muted-foreground max-w-2xl mx-auto">Stay consistent with XP, streaks, levels, and unlocks designed to keep your dopamine receptors firing on productivity, not scrolling.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-32 relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(190,242,100,0.05)_0%,transparent_70%)] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-bold mb-6">Invest In Yourself</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto">The best ROI you'll ever find. Start for free.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                            <PricingCard
                                title="Starter"
                                price="Free"
                                ctaText="Start Assessment"
                                onCtaClick={handleFreeCta}
                                features={[
                                    "Full Skill Assessment",
                                    "Top 3 Hustle Recommendations",
                                    "Basic Explainer Guides",
                                    "Limited Resource Library"
                                ]}
                            />
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
                            <PricingCard
                                title="Pro Hustler"
                                price="$5"
                                isPopular
                                ctaText={checkingOut ? "Processing..." : "Get Full Roadmap"}
                                onCtaClick={handleProCta}
                                features={[
                                    "Everything in Free",
                                    "Interactive Weekly Roadmap",
                                    "Gamified Progress Tracking",
                                    "Curated Video Masterclasses",
                                    "Financial Goal Trackers",
                                    "Priority Community Access"
                                ]}
                            />
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* Footer */}
            <footer className="py-12 border-t border-white/5 bg-black">
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-4 opacity-50">
                        <Sparkles className="h-5 w-5" />
                        <span className="font-bold tracking-tighter">HustlePath</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        © 2024 HustlePath. Built for builders.
                    </p>
                </div>
            </footer>
        </div>
    );
}
