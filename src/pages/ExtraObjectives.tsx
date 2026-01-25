import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { ArrowLeft, Dumbbell, Users, BookOpen, Heart, Check, Zap, RotateCcw, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { motion } from 'framer-motion';
import { useSound } from '../lib/sound';
import { completeTaskInDb } from '../lib/roadmap';
import { LevelUpModal } from '../components/LevelUpModal';

interface ExtraObjective {
    id: string;
    title: string;
    category: 'physical' | 'community' | 'learning' | 'wellness';
    xp: number;
    coins: number;
    completed: boolean;
}

const DAILY_OBJECTIVES: ExtraObjective[] = [
    // Physical
    { id: 'ex-1', title: 'Do 20 pushups', category: 'physical', xp: 30, coins: 10, completed: false },
    { id: 'ex-2', title: 'Take a 10-minute walk', category: 'physical', xp: 25, coins: 5, completed: false },
    { id: 'ex-3', title: 'Do a 5-minute stretch routine', category: 'physical', xp: 20, coins: 5, completed: false },
    { id: 'ex-4', title: 'Do 30 squats', category: 'physical', xp: 30, coins: 10, completed: false },
    // Community
    { id: 'ex-5', title: 'Post your progress in Community Hub', category: 'community', xp: 50, coins: 15, completed: false },
    { id: 'ex-6', title: 'Comment on 3 community posts', category: 'community', xp: 35, coins: 10, completed: false },
    { id: 'ex-7', title: 'Reply to someone asking for help', category: 'community', xp: 40, coins: 12, completed: false },
    { id: 'ex-8', title: 'Share a win or milestone', category: 'community', xp: 45, coins: 15, completed: false },
    // Learning
    { id: 'ex-9', title: 'Read for 15 minutes', category: 'learning', xp: 35, coins: 10, completed: false },
    { id: 'ex-10', title: 'Watch a tutorial/educational video', category: 'learning', xp: 30, coins: 10, completed: false },
    { id: 'ex-11', title: 'Take notes on something new', category: 'learning', xp: 25, coins: 8, completed: false },
    { id: 'ex-12', title: 'Listen to a business podcast', category: 'learning', xp: 30, coins: 10, completed: false },
    // Wellness
    { id: 'ex-13', title: 'Drink 8 glasses of water', category: 'wellness', xp: 25, coins: 5, completed: false },
    { id: 'ex-14', title: 'Get 7+ hours of sleep', category: 'wellness', xp: 30, coins: 10, completed: false },
    { id: 'ex-15', title: 'Meditate for 5 minutes', category: 'wellness', xp: 35, coins: 10, completed: false },
    { id: 'ex-16', title: 'Take a screen break (15 min)', category: 'wellness', xp: 20, coins: 5, completed: false },
];

const CATEGORY_CONFIG = {
    physical: { icon: Dumbbell, color: 'orange', label: 'Physical' },
    community: { icon: Users, color: 'fuchsia', label: 'Community' },
    learning: { icon: BookOpen, color: 'cyan', label: 'Learning' },
    wellness: { icon: Heart, color: 'green', label: 'Wellness' }
};

export function ExtraObjectives() {
    const navigate = useNavigate();
    const { user, refreshProfile } = useAuth();
    const { play } = useSound();
    const [objectives, setObjectives] = useState<ExtraObjective[]>(DAILY_OBJECTIVES);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [loading, setLoading] = useState<string | null>(null);

    // Level Up State
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(1);

    // Load saved progress from localStorage (resets daily)
    useEffect(() => {
        const today = new Date().toDateString();
        const savedData = localStorage.getItem('hustlepath_extra_objectives');
        if (savedData) {
            const { date, completedIds } = JSON.parse(savedData);
            if (date === today) {
                setObjectives(prev => prev.map(obj => ({
                    ...obj,
                    completed: completedIds.includes(obj.id)
                })));
            }
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = (updatedObjectives: ExtraObjective[]) => {
        const today = new Date().toDateString();
        const completedIds = updatedObjectives.filter(o => o.completed).map(o => o.id);
        localStorage.setItem('hustlepath_extra_objectives', JSON.stringify({ date: today, completedIds }));
    };

    const handleComplete = async (objective: ExtraObjective) => {
        if (!user || loading || objective.completed) return;

        setLoading(objective.id);
        const coinsEarned = Math.min(30, Math.max(5, objective.coins)); // Enforce 5-30 range

        try {
            // Use centralized function to update DB, handle levels, and coins
            const { error, newLevel, leveledUp } = await completeTaskInDb(
                user.id,
                objective.id,
                objective.xp,
                coinsEarned
            );

            if (error) throw error;

            if (leveledUp && newLevel) {
                setNewLevel(newLevel);
                setShowLevelUp(true);
                play('levelUp');
            } else {
                play('success');
            }

            // Update local state
            const updated = objectives.map(o =>
                o.id === objective.id ? { ...o, completed: true } : o
            );
            setObjectives(updated);
            saveProgress(updated);

            await refreshProfile();
        } catch (err) {
            console.error('Error completing objective:', err);
            play('error');
        } finally {
            setLoading(null);
        }
    };

    const handleReset = () => {
        const reset = objectives.map(o => ({ ...o, completed: false }));
        setObjectives(reset);
        localStorage.removeItem('hustlepath_extra_objectives');
        play('click');
    };

    const filteredObjectives = activeCategory === 'all'
        ? objectives
        : objectives.filter(o => o.category === activeCategory);

    const completedCount = objectives.filter(o => o.completed).length;
    const totalXpEarned = objectives.filter(o => o.completed).reduce((sum, o) => sum + o.xp, 0);
    const totalCoinsEarned = objectives.filter(o => o.completed).reduce((sum, o) => sum + o.coins, 0);

    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden">
            <Navbar />

            {/* Level Up Modal */}
            <LevelUpModal
                isOpen={showLevelUp}
                onClose={() => setShowLevelUp(false)}
                level={newLevel}
            />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-20 left-0 w-[400px] h-[400px] bg-orange-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-green-500/10 blur-[100px] rounded-full"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="container mx-auto px-4 pt-20 md:pt-24 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/roadmap')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                <Zap className="w-6 h-6 text-yellow-400" />
                                Extra Objectives
                            </h1>
                            <p className="text-sm text-muted-foreground">Bonus daily challenges for extra XP</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                </div>

                {/* Stats Bar */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <div className="text-2xl font-bold text-primary">{completedCount}/{objectives.length}</div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <div className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                                <Zap className="w-4 h-4" />
                                +{totalXpEarned}
                            </div>
                            <div className="text-xs text-muted-foreground">XP Earned</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <div className="text-2xl font-bold text-yellow-400 flex items-center gap-1">
                                <Coins className="w-4 h-4" />
                                +{totalCoinsEarned}
                            </div>
                            <div className="text-xs text-muted-foreground">Coins Earned</div>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground hidden sm:block">Resets daily at midnight</div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === 'all'
                            ? 'bg-white text-black'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        All
                    </button>
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === key
                                ? `bg-${config.color}-500 text-black`
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            <config.icon className="w-4 h-4" />
                            {config.label}
                        </button>
                    ))}
                </div>

                {/* Objectives Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    {filteredObjectives.map((objective, i) => {
                        const config = CATEGORY_CONFIG[objective.category];
                        const isLoading = loading === objective.id;

                        return (
                            <motion.div
                                key={objective.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`bg-black/40 backdrop-blur-xl border rounded-2xl p-4 transition-all ${objective.completed
                                    ? 'border-green-500/30 bg-green-500/5'
                                    : 'border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${objective.completed
                                            ? 'bg-green-500/20 text-green-400'
                                            : `bg-${config.color}-500/20 text-${config.color}-400`
                                            }`}>
                                            {objective.completed ? (
                                                <Check className="w-5 h-5" />
                                            ) : (
                                                <config.icon className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${objective.completed ? 'line-through text-white/50' : ''}`}>
                                                {objective.title}
                                            </h3>
                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                <span className="capitalize">{config.label}</span>
                                                <span className="flex items-center gap-1 text-yellow-400">
                                                    <Zap className="w-3 h-3" />
                                                    +{objective.xp} XP
                                                </span>
                                                <span className="flex items-center gap-1 text-yellow-400">
                                                    <Coins className="w-3 h-3" />
                                                    +{objective.coins}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {!objective.completed && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleComplete(objective)}
                                            disabled={isLoading}
                                            className="bg-white/10 hover:bg-white/20 border-white/10"
                                        >
                                            {isLoading ? (
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                'Complete'
                                            )}
                                        </Button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
