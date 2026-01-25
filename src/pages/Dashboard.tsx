import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { XPBar } from '../components/XPBar';
import { LevelBadge } from '../components/LevelBadge';
import { StreakCounter } from '../components/StreakCounter';
import { CharacterPreview, DEFAULT_AVATAR, type AvatarConfig } from '../components/CharacterPreview';
import { Button } from '../components/Button';
import { Rocket, Target, Trophy, Clock, Map, Pencil, Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
    const navigate = useNavigate();
    const { user, profile, progress, refreshProfile } = useAuth();
    const [checkingIn, setCheckingIn] = useState(false);
    const [checkedIn, setCheckedIn] = useState(false);

    // Default values if data is still loading or missing
    const xp = progress?.xp || 0;
    const level = progress?.level || 1;
    const streak = progress?.streak_days || 0;
    const prestige = progress?.prestige || 0;

    // Cast profile avatar config to expected type
    const avatarConfig = (profile?.avatar_config as unknown as AvatarConfig) || DEFAULT_AVATAR;

    // Daily Check-in Handler
    const handleDailyCheckIn = async () => {
        if (!user || checkingIn || checkedIn) return;

        setCheckingIn(true);
        try {
            // Update streak and award XP
            const { error } = await supabase
                .from('user_progress')
                .update({
                    streak_days: (progress?.streak_days || 0) + 1,
                    xp: (progress?.xp || 0) + 15,
                    last_activity: new Date().toISOString()
                })
                .eq('user_id', user.id);

            if (error) throw error;

            setCheckedIn(true);
            await refreshProfile();
        } catch (err) {
            console.error('Check-in error:', err);
        } finally {
            setCheckingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden">
            <Navbar />

            {/* 3D Floating Orbs Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, -40, 0],
                        x: [0, 20, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 left-0 w-[400px] h-[400px] bg-primary/15 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        y: [0, 50, 0],
                        x: [0, -30, 0],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-fuchsia-500/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full"
                />

                {/* Floating particles */}
                <motion.div
                    animate={{ y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute top-40 right-20 w-2 h-2 bg-primary rounded-full shadow-[0_0_15px_rgba(190,242,100,0.8)]"
                />
                <motion.div
                    animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                    className="absolute top-60 left-20 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.8)]"
                />
                <motion.div
                    animate={{ y: [0, -20, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-40 right-1/3 w-2 h-2 bg-fuchsia-400 rounded-full shadow-[0_0_12px_rgba(232,121,249,0.8)]"
                />

                {/* Grid overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="container mx-auto px-4 pt-20 md:pt-24 relative z-10">
                {/* Header Section - Enhanced Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10"
                >
                    <div className="flex items-center gap-4 md:gap-6">
                        {/* Avatar with neon glow */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative group cursor-pointer"
                            onClick={() => navigate('/character')}
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-cyan-400 to-fuchsia-500 rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity" />
                            <CharacterPreview
                                config={avatarConfig}
                                size="md"
                                className="relative border-2 border-white/30 group-hover:border-primary/50 transition-colors shadow-[0_0_30px_rgba(190,242,100,0.2)]"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-black/80 backdrop-blur border border-white/20 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Pencil className="w-3 h-3 text-primary" />
                            </div>
                        </motion.div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-primary/90 to-white">
                                    {profile?.display_name || 'Hustler'}
                                </h1>
                                <LevelBadge level={level} prestige={prestige} size="sm" />
                            </div>
                            <p className="text-sm md:text-base text-muted-foreground">Time to build your empire.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <StreakCounter days={streak} className="flex-1 md:flex-none justify-center" />
                        <Button
                            onClick={handleDailyCheckIn}
                            disabled={checkingIn || checkedIn}
                            className={`flex-1 md:flex-none text-sm md:text-base relative overflow-hidden transition-all duration-300 ${checkedIn
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                    : 'glow-primary hover:shadow-[0_0_30px_rgba(190,242,100,0.4)]'
                                }`}
                        >
                            {checkingIn ? (
                                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            ) : checkedIn ? (
                                <CheckCircle2 className="mr-2 w-4 h-4" />
                            ) : (
                                <Rocket className="mr-2 w-4 h-4" />
                            )}
                            {checkedIn ? 'Checked In!' : <><span className="hidden sm:inline">Daily </span>Check-in</>}
                        </Button>
                    </div>
                </motion.div>

                {/* XP Progress - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 mb-8 relative overflow-hidden group hover:border-primary/40 transition-colors"
                >
                    {/* Glow effect */}
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/20 blur-[80px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />

                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Progression</span>
                            </h2>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                Rank: {prestige > 0 ? `Prestige ${prestige}` : 'Rookie'}
                            </span>
                        </div>
                        <XPBar xp={xp} level={level} />
                    </div>
                </motion.div>

                {/* Dashboard Grid - Cyberpunk Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Quest Map Preview - Primary/Green Theme */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(190,242,100,0.15)]"
                        onClick={() => navigate('/roadmap')}
                    >
                        {/* Background glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/15 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Map className="w-24 h-24 text-primary" />
                        </div>

                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Target className="w-4 h-4 text-primary drop-shadow-[0_0_6px_rgba(190,242,100,0.5)]" />
                            </div>
                            <span className="group-hover:text-primary transition-colors">Quest Map</span>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 relative z-10">
                            Your 90-day journey awaits. Navigate checkpoint to checkpoint.
                        </p>

                        {/* Mini Map Preview */}
                        <div className="relative h-20 bg-black/50 rounded-xl mb-4 overflow-hidden border border-white/5">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(190,242,100,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(190,242,100,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                            <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={i === 2 ? { scale: [1, 1.2, 1] } : {}}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`w-3 h-3 rounded-full ${i < 2
                                                ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]'
                                                : i === 2
                                                    ? 'bg-primary shadow-[0_0_15px_rgba(190,242,100,0.8)]'
                                                    : 'bg-zinc-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="absolute bottom-2 right-2 text-[10px] text-white/40">Week 1</div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 group-hover:shadow-[0_0_20px_rgba(190,242,100,0.1)]"
                        >
                            Open Map
                        </Button>
                    </motion.div>

                    {/* Resources - Cyan Theme */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 cursor-pointer group transition-all duration-500 hover:border-cyan-500/50 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]"
                        onClick={() => navigate('/resources')}
                    >
                        {/* Background glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/15 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                <Clock className="w-4 h-4 text-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                            </div>
                            <span className="group-hover:text-cyan-300 transition-colors">Resources</span>
                        </h3>

                        <div className="h-24 bg-black/50 rounded-2xl p-4 flex items-center justify-center mb-6 relative overflow-hidden border border-cyan-500/10 group-hover:border-cyan-500/20 transition-colors">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-cyan-500/10 blur-xl"
                            />
                            <div className="text-center relative z-10">
                                <div className="text-3xl font-bold text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">6</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">Guides Available</div>
                            </div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/50"
                        >
                            Open Library
                        </Button>
                    </motion.div>

                    {/* Community Hub - Fuchsia/Purple Theme */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-fuchsia-500/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-fuchsia-500/50 hover:shadow-[0_0_40px_rgba(232,121,249,0.15)]"
                        onClick={() => navigate('/community')}
                    >
                        {/* Background glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-fuchsia-500/15 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Sparkles className="w-24 h-24 text-fuchsia-400" />
                        </div>

                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30">
                                <Rocket className="w-4 h-4 text-fuchsia-400 drop-shadow-[0_0_6px_rgba(232,121,249,0.5)]" />
                            </div>
                            <span className="group-hover:text-fuchsia-300 transition-colors">Community</span>
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6 relative z-10">
                            Connect with other hustlers, share wins, and get feedback.
                        </p>

                        {/* Animated particles */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            <motion.div
                                animate={{ y: [0, -60], opacity: [0, 1, 0] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute bottom-10 left-1/4 w-1 h-1 bg-fuchsia-400 rounded-full"
                            />
                            <motion.div
                                animate={{ y: [0, -40], opacity: [0, 1, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                className="absolute bottom-10 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full"
                            />
                        </div>

                        <Button
                            className="w-full bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/30 hover:border-fuchsia-500/50 text-fuchsia-300 hover:text-fuchsia-200 relative z-10"
                        >
                            Enter Hub
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
