import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Navbar } from '../components/Navbar';
import { XPBar } from '../components/XPBar';
import { LevelBadge } from '../components/LevelBadge';
import { StreakCounter } from '../components/StreakCounter';
import { CharacterPreview, DEFAULT_AVATAR, type AvatarConfig } from '../components/CharacterPreview';
import { Button } from '../components/Button';
import { Rocket, Target, Trophy, Clock, Map, Pencil, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
    const navigate = useNavigate();
    const { profile, progress } = useAuth();

    // Default values if data is still loading or missing
    const xp = progress?.xp || 0;
    const level = progress?.level || 1;
    const streak = progress?.streak_days || 0;
    const prestige = progress?.prestige || 0;

    // Cast profile avatar config to expected type
    const avatarConfig = (profile?.avatar_config as unknown as AvatarConfig) || DEFAULT_AVATAR;

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 md:pt-24">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mb-6 md:mb-10">
                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="relative group cursor-pointer" onClick={() => navigate('/character')}>
                            <CharacterPreview config={avatarConfig} size="md" className="border-2 border-white/20 group-hover:border-primary transition-colors glow-primary-pulse" />
                            <div className="absolute -bottom-2 -right-2 bg-black border border-white/20 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Pencil className="w-3 h-3" />
                            </div>
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    {profile?.display_name || 'Hustler'}
                                </h1>
                                <LevelBadge level={level} prestige={prestige} size="sm" />
                            </div>
                            <p className="text-sm md:text-base text-muted-foreground">Time to build your empire.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                        <StreakCounter days={streak} className="flex-1 md:flex-none justify-center" />
                        <Button className="flex-1 md:flex-none glow-primary text-sm md:text-base">
                            <Rocket className="mr-2 w-4 h-4" />
                            <span className="hidden sm:inline">Daily </span>Check-in
                        </Button>
                    </div>
                </div>

                {/* XP Progress */}
                <div className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-50" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                Progression
                            </h2>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">
                                Rank: {prestige > 0 ? `Prestige ${prestige}` : 'Rookie'}
                            </span>
                        </div>
                        <XPBar xp={xp} level={level} />
                    </div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Quest Map Preview */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors"
                        onClick={() => navigate('/roadmap')}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Map className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Target className="w-5 h-5 text-primary" />
                            Quest Map
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Your 90-day journey awaits. Navigate checkpoint to checkpoint.
                        </p>

                        {/* Mini Map Preview */}
                        <div className="relative h-20 bg-zinc-800/50 rounded-xl mb-4 overflow-hidden map-grid">
                            <div className="absolute inset-0 flex items-center justify-center gap-3 px-4">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className={`w-3 h-3 rounded-full ${i < 2 ? 'bg-green-500' : i === 2 ? 'bg-primary checkpoint-active' : 'bg-zinc-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <div className="absolute bottom-2 right-2 text-[10px] text-white/40">Week 1</div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full border-primary/20 hover:bg-primary/10"
                        >
                            Open Map
                        </Button>
                    </motion.div>

                    {/* Resources */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-6 cursor-pointer group hover:bg-white/5 transition-all hover:border-blue-500/30"
                        onClick={() => navigate('/resources')}
                    >
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-400" />
                            Resources
                        </h3>
                        <div className="h-24 bg-zinc-800/50 rounded-2xl p-4 flex items-center justify-center mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all" />
                            <div className="text-center relative z-10">
                                <div className="text-2xl font-bold">6</div>
                                <div className="text-xs text-muted-foreground uppercase">Guides Available</div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full border-blue-500/20 hover:bg-blue-500/10 hover:text-blue-400 group-hover:border-blue-500/40"
                        >
                            Open Library
                        </Button>
                    </motion.div>

                    {/* Community Hub */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-3xl p-6 relative overflow-hidden group cursor-pointer hover:border-purple-500/30 transition-colors"
                        onClick={() => navigate('/community')}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Sparkles className="w-24 h-24" />
                        </div>
                        <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-purple-400" />
                            Community
                        </h3>
                        <p className="text-sm text-muted-foreground mb-6">
                            Connect with other hustlers, share wins, and get feedback.
                        </p>
                        <Button
                            className="w-full bg-white/10 hover:bg-white/20 border-white/10"
                        >
                            Enter Hub
                        </Button>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

