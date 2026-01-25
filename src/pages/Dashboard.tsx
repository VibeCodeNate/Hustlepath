import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { XPBar } from '../components/XPBar';
import { LevelBadge } from '../components/LevelBadge';
import { StreakCounter } from '../components/StreakCounter';
import { CharacterPreview, DEFAULT_AVATAR, type AvatarConfig } from '../components/CharacterPreview';
import { Button } from '../components/Button';
import { Rocket, Target, Trophy, Clock, Map, Pencil, Sparkles, CheckCircle2, Loader2, DollarSign, Coins, X, Search, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomQuote } from '../lib/motivationalQuotes';
import { useSound } from '../lib/sound';
import Confetti from 'react-confetti';

interface SearchResult {
    id: string;
    username: string;
    avatar_url?: string;
}

export function Dashboard() {
    const navigate = useNavigate();
    const { user, profile, progress, refreshProfile } = useAuth();
    const { play } = useSound();
    const [checkingIn, setCheckingIn] = useState(false);
    const [canCheckIn, setCanCheckIn] = useState(true);
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [currentQuote, setCurrentQuote] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);
    const [hustleBucks, setHustleBucks] = useState(0);
    const [countdownTimer, setCountdownTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });

    // Friend search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searching, setSearching] = useState(false);

    // Default values if data is still loading or missing
    const xp = progress?.xp || 0;
    const level = progress?.level || 1;
    const streak = progress?.streak_days || 0;
    const prestige = progress?.prestige || 0;

    // Cast profile avatar config to expected type
    const avatarConfig = (profile?.avatar_config as unknown as AvatarConfig) || DEFAULT_AVATAR;

    // Check if can check in (resets at midnight local time)
    useEffect(() => {
        if (!user) return;

        const checkReset = () => {
            const lastCheckIn = localStorage.getItem(`hustlepath_last_checkin_${user.id}`);
            const now = new Date();

            // Get midnight of today in local time
            const todayMidnight = new Date(now);
            todayMidnight.setHours(0, 0, 0, 0);

            // Get midnight of tomorrow
            const tomorrowMidnight = new Date(todayMidnight);
            tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

            if (lastCheckIn) {
                const lastDate = new Date(lastCheckIn);
                // Can check in if last check-in was before today's midnight
                setCanCheckIn(lastDate < todayMidnight);
            } else {
                setCanCheckIn(true);
            }

            // Calculate countdown to midnight
            const diff = tomorrowMidnight.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setCountdownTimer({ hours, minutes, seconds });
        };

        checkReset();
        const interval = setInterval(checkReset, 1000);

        // Load hustle bucks
        loadHustleBucks();

        return () => clearInterval(interval);
    }, [user]);

    const loadHustleBucks = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('user_progress')
            .select('hustle_bucks')
            .eq('user_id', user.id)
            .single();

        if (data) {
            setHustleBucks(data.hustle_bucks || 0);
        }
    };

    // Friend search handler
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const { data } = await supabase
                .from('profiles')
                .select('id, username, avatar_url')
                .neq('id', user?.id || '')
                .ilike('username', `%${query}%`)
                .limit(5);

            if (data) {
                setSearchResults(data);
            }
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setSearching(false);
        }
    };

    // Daily Check-in Handler
    const handleDailyCheckIn = async () => {
        if (!user || checkingIn || !canCheckIn) return;

        setCheckingIn(true);
        try {
            // Update streak, XP, and award Hustle Bucks
            const { error } = await supabase
                .from('user_progress')
                .update({
                    streak_days: (progress?.streak_days || 0) + 1,
                    xp: (progress?.xp || 0) + 15,
                    hustle_bucks: hustleBucks + 100,
                    last_activity: new Date().toISOString()
                })
                .eq('user_id', user.id);

            if (error) throw error;

            // Save check-in timestamp
            localStorage.setItem(`hustlepath_last_checkin_${user.id}`, new Date().toISOString());

            // Show success
            setCanCheckIn(false);
            setHustleBucks(prev => prev + 100);
            setCurrentQuote(getRandomQuote());
            setShowQuoteModal(true);
            setShowConfetti(true);
            play('success');

            // Hide confetti after 5 seconds
            setTimeout(() => setShowConfetti(false), 5000);

            await refreshProfile();
        } catch (err) {
            console.error('Check-in error:', err);
            play('error');
        } finally {
            setCheckingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden">
            <Navbar />

            {/* Confetti */}
            {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    numberOfPieces={200}
                    colors={['#BEF264', '#22D3EE', '#E879F9', '#FBBF24', '#34D399']}
                />
            )}

            {/* Quote Modal */}
            <AnimatePresence>
                {showQuoteModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowQuoteModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-primary/30 rounded-3xl p-8 w-full max-w-md text-center relative overflow-hidden"
                        >
                            {/* Glow effects */}
                            <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 blur-[80px] rounded-full" />
                            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-cyan-500/20 blur-[80px] rounded-full" />

                            <button
                                onClick={() => setShowQuoteModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: 'spring', delay: 0.2 }}
                                className="text-6xl mb-4"
                            >
                                🎉
                            </motion.div>

                            <h2 className="text-2xl font-bold mb-2 text-primary">Daily Check-in Complete!</h2>

                            <div className="flex items-center justify-center gap-4 my-4">
                                <div className="bg-primary/20 border border-primary/30 rounded-xl px-4 py-2">
                                    <span className="text-primary font-bold">+15 XP</span>
                                </div>
                                <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
                                    <Coins className="w-4 h-4 text-yellow-400" />
                                    <span className="text-yellow-400 font-bold">+100</span>
                                </div>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-6 mt-6 relative z-10">
                                <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-3" />
                                <p className="text-lg italic text-white/90 leading-relaxed">
                                    "{currentQuote}"
                                </p>
                            </div>

                            <Button
                                onClick={() => setShowQuoteModal(false)}
                                className="mt-6 w-full bg-primary text-black font-bold"
                            >
                                Let's Hustle!
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            onClick={() => navigate('/profile')}
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
                        {/* Hustle Bucks Display */}
                        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-3 py-2">
                            <Coins className="w-5 h-5 text-yellow-400" />
                            <span className="font-bold text-yellow-400">{hustleBucks}</span>
                        </div>

                        <StreakCounter days={streak} className="flex-1 md:flex-none justify-center" />

                        {/* Check-in with Countdown */}
                        <div className="flex flex-col items-center">
                            <Button
                                onClick={handleDailyCheckIn}
                                disabled={checkingIn || !canCheckIn}
                                className={`flex-1 md:flex-none text-sm md:text-base relative overflow-hidden transition-all duration-300 ${!canCheckIn
                                    ? 'bg-green-500/20 border-green-500/50 text-green-400'
                                    : 'glow-primary hover:shadow-[0_0_30px_rgba(190,242,100,0.4)]'
                                    }`}
                            >
                                {checkingIn ? (
                                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                                ) : !canCheckIn ? (
                                    <CheckCircle2 className="mr-2 w-4 h-4" />
                                ) : (
                                    <Rocket className="mr-2 w-4 h-4" />
                                )}
                                {!canCheckIn ? 'Checked In!' : <><span className="hidden sm:inline">Daily </span>Check-in</>}
                            </Button>
                            {/* Countdown timer */}
                            {!canCheckIn && (
                                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Resets in {countdownTimer.hours}h {countdownTimer.minutes}m
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* XP Progress - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-black/40 backdrop-blur-xl border border-primary/20 rounded-2xl p-6 mb-8 relative overflow-hidden group hover:border-primary/40 transition-colors"
                >
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

                {/* Friend Search Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="bg-black/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 mb-8 relative overflow-hidden"
                >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 blur-[60px] rounded-full" />

                    <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-purple-400" />
                        Find Friends
                    </h2>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search by username..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
                        />
                        {searching && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
                        )}
                    </div>

                    {searchResults.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {searchResults.map((result) => (
                                <button
                                    key={result.id}
                                    onClick={() => navigate(`/profile/${result.id}`)}
                                    className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
                                >
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg">
                                        {result.avatar_url || result.username?.charAt(0).toUpperCase() || '👤'}
                                    </div>
                                    <span className="font-medium">{result.username}</span>
                                    <span className="ml-auto text-xs text-muted-foreground">View Profile →</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {searchQuery.length >= 2 && searchResults.length === 0 && !searching && (
                        <p className="mt-3 text-sm text-muted-foreground text-center">No users found</p>
                    )}
                </motion.div>

                {/* Dashboard Grid - 5 Cards */}
                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {/* Quest Map Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(190,242,100,0.15)]"
                        onClick={() => navigate('/roadmap')}
                    >
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/15 blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Map className="w-20 h-20 text-primary" />
                        </div>

                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                                <Target className="w-4 h-4 text-primary" />
                            </div>
                            <span className="group-hover:text-primary transition-colors">Quest Map</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 relative z-10">
                            12-week journey
                        </p>

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-primary/30 hover:bg-primary/10"
                        >
                            Open Map
                        </Button>
                    </motion.div>

                    {/* Resources */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-6 cursor-pointer group transition-all duration-500 hover:border-cyan-500/50"
                        onClick={() => navigate('/resources')}
                    >
                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30">
                                <Clock className="w-4 h-4 text-cyan-400" />
                            </div>
                            <span className="group-hover:text-cyan-300 transition-colors">Resources</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4">Guides & tools</p>

                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-400"
                        >
                            Open Library
                        </Button>
                    </motion.div>

                    {/* Community Hub */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-fuchsia-500/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-fuchsia-500/50"
                        onClick={() => navigate('/community')}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Sparkles className="w-20 h-20 text-fuchsia-400" />
                        </div>

                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 flex items-center justify-center border border-fuchsia-500/30">
                                <Rocket className="w-4 h-4 text-fuchsia-400" />
                            </div>
                            <span className="group-hover:text-fuchsia-300 transition-colors">Community</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 relative z-10">
                            Connect & share
                        </p>

                        <Button
                            size="sm"
                            className="w-full bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 relative z-10"
                        >
                            Enter Hub
                        </Button>
                    </motion.div>

                    {/* Earnings */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-green-500/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-green-500/50"
                        onClick={() => navigate('/earnings')}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <DollarSign className="w-20 h-20 text-green-400" />
                        </div>

                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/30">
                                <DollarSign className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="group-hover:text-green-300 transition-colors">Earnings</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 relative z-10">
                            Track income
                        </p>

                        <Button
                            size="sm"
                            className="w-full bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-300 relative z-10"
                        >
                            View Earnings
                        </Button>
                    </motion.div>

                    {/* Goals */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="bg-black/50 backdrop-blur-xl border border-orange-500/20 rounded-3xl p-6 relative overflow-hidden group cursor-pointer transition-all duration-500 hover:border-orange-500/50"
                        onClick={() => navigate('/goals')}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Target className="w-20 h-20 text-orange-400" />
                        </div>

                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
                                <Target className="w-4 h-4 text-orange-400" />
                            </div>
                            <span className="group-hover:text-orange-300 transition-colors">Goals</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mb-4 relative z-10">
                            Set & track
                        </p>

                        <Button
                            size="sm"
                            className="w-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-300 relative z-10"
                        >
                            View Goals
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
