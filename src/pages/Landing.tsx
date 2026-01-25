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

            {/* How It Works Section - Neon Cyberpunk Style */}
            <motion.section
                id="how-it-works"
                className="py-32 relative overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                {/* 3D Floating Orbs Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Large Neon Orbs */}
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            x: [0, 15, 0],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-20 left-10 w-[300px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            y: [0, 40, 0],
                            x: [0, -20, 0],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-fuchsia-500/15 blur-[120px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            y: [0, -50, 0],
                            rotate: [0, 180, 360]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-20 left-1/4 w-[200px] h-[200px] bg-primary/20 blur-[80px] rounded-full"
                    />

                    {/* 3D Geometric Elements */}
                    <motion.div
                        animate={{ rotateY: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute top-40 right-20 w-16 h-16 border border-cyan-500/30 rounded-lg"
                        style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                    />
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-40 right-1/3 w-24 h-24 border border-fuchsia-500/20 rounded-full"
                    />
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-60 left-1/3 w-4 h-4 bg-primary rounded-full shadow-[0_0_20px_rgba(190,242,100,0.8)]"
                    />
                    <motion.div
                        animate={{
                            y: [0, 15, 0],
                            opacity: [0.2, 0.5, 0.2]
                        }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-60 right-20 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                    />
                    <motion.div
                        animate={{
                            y: [0, -25, 0],
                            opacity: [0.3, 0.7, 0.3]
                        }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-1/2 left-10 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_12px_rgba(232,121,249,0.8)]"
                    />
                </div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                        >
                            Precision Engineering
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-muted-foreground max-w-xl mx-auto text-lg"
                        >
                            We don't just give you ideas. We give you a blueprint.
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Neon Connecting Line */}
                        <div className="hidden md:block absolute top-[70px] left-[15%] right-[15%] h-[2px] z-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
                            <motion.div
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent w-1/3"
                            />
                        </div>

                        {[
                            { step: "01", title: "Neural Analysis", desc: "10-point psychometric assessment maps your strengths.", icon: Brain, color: "cyan" },
                            { step: "02", title: "Market Fit", desc: "Real-time data matches you to high-demand niches.", icon: Target, color: "primary" },
                            { step: "03", title: "Execution", desc: "Daily task protocols to ensure consistent growth.", icon: Zap, color: "fuchsia" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="relative z-10 pt-4 text-center group"
                                initial={{ y: 50, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                            >
                                {/* Neon Card */}
                                <motion.div
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className={`mx-auto h-32 w-32 rounded-3xl flex items-center justify-center mb-8 bg-black/80 backdrop-blur-xl border relative overflow-hidden transition-all duration-500
                                        ${item.color === 'primary'
                                            ? 'border-primary/60 shadow-[0_0_40px_rgba(190,242,100,0.25),inset_0_0_40px_rgba(190,242,100,0.05)]'
                                            : item.color === 'cyan'
                                                ? 'border-cyan-500/40 shadow-[0_0_30px_rgba(34,211,238,0.2),inset_0_0_30px_rgba(34,211,238,0.03)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.35)]'
                                                : 'border-fuchsia-500/40 shadow-[0_0_30px_rgba(232,121,249,0.2),inset_0_0_30px_rgba(232,121,249,0.03)] group-hover:shadow-[0_0_50px_rgba(232,121,249,0.35)]'
                                        }`}
                                >
                                    {/* Inner Glow */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color === 'primary' ? 'from-primary/10' : item.color === 'cyan' ? 'from-cyan-500/10' : 'from-fuchsia-500/10'
                                        } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                                    {/* Animated Ring */}
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className={`absolute inset-2 border rounded-2xl ${item.color === 'primary' ? 'border-primary/20' : item.color === 'cyan' ? 'border-cyan-500/15' : 'border-fuchsia-500/15'
                                            }`}
                                        style={{ borderStyle: 'dashed' }}
                                    />

                                    <item.icon className={`w-12 h-12 transition-all duration-300 ${item.color === 'primary'
                                            ? 'text-primary drop-shadow-[0_0_10px_rgba(190,242,100,0.5)]'
                                            : item.color === 'cyan'
                                                ? 'text-cyan-400 group-hover:text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]'
                                                : 'text-fuchsia-400 group-hover:text-fuchsia-300 drop-shadow-[0_0_10px_rgba(232,121,249,0.4)] group-hover:drop-shadow-[0_0_20px_rgba(232,121,249,0.6)]'
                                        }`} />
                                </motion.div>

                                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${item.color === 'primary'
                                        ? 'group-hover:text-primary group-hover:drop-shadow-[0_0_10px_rgba(190,242,100,0.4)]'
                                        : item.color === 'cyan'
                                            ? 'group-hover:text-cyan-300 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]'
                                            : 'group-hover:text-fuchsia-300 group-hover:drop-shadow-[0_0_10px_rgba(232,121,249,0.4)]'
                                    }`}>{item.title}</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Features Section - Neon Bento Grid Style */}
            <section id="features" className="py-32 relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent" />
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.1, 0.2, 0.1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full"
                    />
                    <motion.div
                        animate={{
                            y: [0, -30, 0],
                            opacity: [0.05, 0.15, 0.05]
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-500/10 blur-[120px] rounded-full"
                    />
                </div>

                {/* Subtle grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-200 to-white"
                        >
                            Why HustlePath?
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-muted-foreground max-w-2xl mx-auto text-lg"
                        >
                            Legacy advice says "follow your passion". We say "follow the data".
                        </motion.p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Card 1 - AI Skill Analysis */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-primary/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(190,242,100,0.15),inset_0_0_40px_rgba(190,242,100,0.02)]"
                        >
                            {/* Glow Effect */}
                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(190,242,100,0.3)] transition-shadow duration-500">
                                    <Brain className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(190,242,100,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">AI Skill Analysis</h3>
                                <p className="text-muted-foreground">Our advanced algorithms scan 50+ data points about you to find side hustles that match your natural strengths.</p>
                            </div>
                        </motion.div>

                        {/* Card 2 - Personalized Roadmap (Large) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.01 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-cyan-500/20 p-8 md:col-span-2 relative overflow-hidden group transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15),inset_0_0_40px_rgba(34,211,238,0.02)]"
                        >
                            {/* Animated Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Decorative Lines */}
                            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none">
                                <motion.div
                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute bottom-8 right-8 w-32 h-[1px] bg-gradient-to-r from-cyan-500/50 to-transparent"
                                />
                                <motion.div
                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                                    className="absolute bottom-16 right-8 w-24 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent"
                                />
                                <motion.div
                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                    className="absolute bottom-24 right-8 w-16 h-[1px] bg-gradient-to-r from-cyan-500/20 to-transparent"
                                />
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-shadow duration-500">
                                    <Target className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300">Personalized Roadmap</h3>
                                <p className="text-muted-foreground">Get a step-by-step interactive plan with weekly objectives, milestones, and direct feedback loops. No generic PDFs.</p>
                            </div>
                        </motion.div>

                        {/* Card 3 - Gamified Growth Engine (Full Width) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-fuchsia-500/20 p-8 md:col-span-3 text-center relative overflow-hidden group transition-all duration-500 hover:border-fuchsia-500/50 hover:shadow-[0_0_40px_rgba(232,121,249,0.12),inset_0_0_40px_rgba(232,121,249,0.02)]"
                        >
                            {/* Animated particles */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <motion.div
                                    animate={{ y: [0, -100], opacity: [0, 1, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
                                    className="absolute bottom-0 left-1/4 w-1 h-1 bg-fuchsia-400 rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -80], opacity: [0, 1, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeOut", delay: 1 }}
                                    className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-purple-400 rounded-full"
                                />
                                <motion.div
                                    animate={{ y: [0, -120], opacity: [0, 1, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeOut", delay: 2 }}
                                    className="absolute bottom-0 right-1/4 w-1 h-1 bg-fuchsia-300 rounded-full"
                                />
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(232,121,249,0.3)] transition-shadow duration-500">
                                    <TrendingUp className="w-7 h-7 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-fuchsia-300 transition-colors duration-300">Gamified Growth Engine</h3>
                                <p className="text-muted-foreground max-w-2xl mx-auto">Stay consistent with XP, streaks, levels, and unlocks designed to keep your dopamine receptors firing on productivity, not scrolling.</p>
                            </div>
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
