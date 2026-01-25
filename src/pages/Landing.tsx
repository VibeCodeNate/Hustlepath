import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { PricingCard } from '../components/PricingCard';
import { Brain, Target, Sparkles, Zap, ShieldCheck, ShoppingBag, Palette, Users, Coins, Trophy, CalendarCheck, Rocket, Star, Flame } from 'lucide-react';
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
                            className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-200 to-white drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]"
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

            {/* Features Section - Comprehensive Platform Overview */}
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium text-primary mb-6"
                        >
                            <Star className="w-4 h-4" />
                            <span>Complete Feature Overview</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-200 to-white"
                        >
                            Everything You Need to Win
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-muted-foreground max-w-3xl mx-auto text-lg"
                        >
                            HustlePath isn't just another course or PDF. It's a full gamified platform designed to keep you motivated,
                            track your progress, and reward your hustle with real perks.
                        </motion.p>
                    </div>

                    {/* Bento Grid Layout */}
                    <div className="grid md:grid-cols-4 gap-6">

                        {/* Card 1 - AI Skill Analysis (2 cols) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="md:col-span-2 rounded-3xl bg-black/60 backdrop-blur-xl border border-primary/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(190,242,100,0.15),inset_0_0_40px_rgba(190,242,100,0.02)]"
                        >
                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(190,242,100,0.3)] transition-shadow duration-500">
                                    <Brain className="w-7 h-7 text-primary drop-shadow-[0_0_8px_rgba(190,242,100,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">AI-Powered Assessment</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Take our comprehensive 10-question assessment that analyzes your skills, personality,
                                    available time, and goals. Our AI matches you with the perfect side hustle from 15+ curated options
                                    spanning freelancing, content creation, e-commerce, and more.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2 - Personalized Roadmap (2 cols) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="md:col-span-2 rounded-3xl bg-black/60 backdrop-blur-xl border border-cyan-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15),inset_0_0_40px_rgba(34,211,238,0.02)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(34,211,238,0.3)] transition-shadow duration-500">
                                    <Rocket className="w-7 h-7 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-cyan-300 transition-colors duration-300">Personalized Roadmap</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Get a step-by-step interactive plan with weekly objectives, milestones, and direct feedback loops.
                                    Each roadmap is tailored to YOUR specific side hustle with actionable tasks that adapt to your pace.
                                    No generic PDFs—real progress tracking.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3 - XP & Leveling System */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-fuchsia-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-fuchsia-500/50 hover:shadow-[0_0_40px_rgba(232,121,249,0.15)]"
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 to-purple-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(232,121,249,0.3)] transition-shadow duration-500">
                                    <Trophy className="w-7 h-7 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-fuchsia-300 transition-colors duration-300">XP & Leveling</h3>
                                <p className="text-muted-foreground">
                                    Earn XP for every task you complete. Level up from "Newbie Hustler" to "Empire Builder"
                                    and unlock exclusive perks at each tier. Your level is displayed on your public profile.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 4 - Hustle Bucks Currency */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-yellow-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-yellow-500/50 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)]"
                        >
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(234,179,8,0.3)] transition-shadow duration-500">
                                    <Coins className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-yellow-300 transition-colors duration-300">Hustle Bucks 💰</h3>
                                <p className="text-muted-foreground">
                                    Earn coins (5-30) for completing tasks. Get bonus coins for leveling up!
                                    Spend them in the shop on avatar customizations, calling cards, and exclusive titles.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 5 - Avatar Shop */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-emerald-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-emerald-500/50 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]"
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-shadow duration-500">
                                    <ShoppingBag className="w-7 h-7 text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-300 transition-colors duration-300">Reward Shop</h3>
                                <p className="text-muted-foreground">
                                    Browse 50+ items including animated avatar frames, exclusive titles like "Side Hustle Legend",
                                    calling card backgrounds, and seasonal limited editions.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 6 - Avatar Customization */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-pink-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-pink-500/50 hover:shadow-[0_0_40px_rgba(236,72,153,0.15)]"
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/10 border border-pink-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(236,72,153,0.3)] transition-shadow duration-500">
                                    <Palette className="w-7 h-7 text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-pink-300 transition-colors duration-300">Full Customization</h3>
                                <p className="text-muted-foreground">
                                    Express yourself! Customize your avatar frame, calling card background,
                                    and display title. Show off your achievements and style to the community.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 7 - Community (2 cols) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.01 }}
                            className="md:col-span-2 rounded-3xl bg-black/60 backdrop-blur-xl border border-blue-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
                        >
                            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 pointer-events-none">
                                <motion.div
                                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    className="absolute bottom-8 right-8 w-32 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent"
                                />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.3)] transition-shadow duration-500">
                                    <Users className="w-7 h-7 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-300 transition-colors duration-300">Community Hub</h3>
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    Connect with fellow hustlers! Share wins, ask questions, and get motivated by others on the same journey.
                                    See community posts, like and comment, and build your network. Your calling card and level are displayed
                                    on every interaction—flex your progress!
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 8 - Daily Objectives */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-orange-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-orange-500/50 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)]"
                        >
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(249,115,22,0.3)] transition-shadow duration-500">
                                    <CalendarCheck className="w-7 h-7 text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-300 transition-colors duration-300">Daily Objectives</h3>
                                <p className="text-muted-foreground">
                                    Fresh tasks every day tailored to your roadmap. Complete them to earn XP, coins,
                                    and maintain your streak. Small consistent actions = massive results.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 9 - Streaks & Consistency */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="rounded-3xl bg-black/60 backdrop-blur-xl border border-red-500/20 p-8 relative overflow-hidden group transition-all duration-500 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.15)]"
                        >
                            <motion.div
                                animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-4 right-4"
                            >
                                <Flame className="w-6 h-6 text-red-400/50" />
                            </motion.div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/10 border border-red-500/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] transition-shadow duration-500">
                                    <Flame className="w-7 h-7 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-red-300 transition-colors duration-300">🔥 Streak System</h3>
                                <p className="text-muted-foreground">
                                    Build momentum! Your streak grows each day you complete at least one task.
                                    Long streaks unlock bonus rewards and special badges. Don't break the chain!
                                </p>
                            </div>
                        </motion.div>

                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        viewport={{ once: true }}
                        className="text-center mt-16"
                    >
                        <p className="text-muted-foreground mb-6 text-lg">
                            Ready to turn your side hustle dreams into reality?
                        </p>
                        <Button size="lg" className="h-14 px-10 text-lg" onClick={handleFreeCta}>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Start Your Journey
                        </Button>
                    </motion.div>
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
                        © 2026 HustlePath. Built for builders.
                    </p>
                </div>
            </footer>
        </div>
    );
}
