import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { ArrowLeft, Target, Plus, Check, Trash2, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../lib/sound';

interface Goal {
    id: string;
    title: string;
    type: 'daily' | 'weekly' | 'monthly';
    category: 'income' | 'tasks' | 'learning' | 'health' | 'custom';
    targetValue?: number;
    currentValue: number;
    isCompleted: boolean;
    createdAt: string;
    dueDate?: string;
}

const GOAL_TEMPLATES = [
    { title: 'Make $100 this week', type: 'weekly', category: 'income', targetValue: 100 },
    { title: 'Complete all daily tasks', type: 'daily', category: 'tasks' },
    { title: 'Read for 30 minutes', type: 'daily', category: 'learning' },
    { title: 'Land 1 new client', type: 'weekly', category: 'income' },
    { title: 'Post content 3 times', type: 'weekly', category: 'tasks', targetValue: 3 },
    { title: 'Exercise 5 days', type: 'weekly', category: 'health', targetValue: 5 },
    { title: 'Earn $1000 this month', type: 'monthly', category: 'income', targetValue: 1000 },
];

export function Goals() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { play } = useSound();

    const [goals, setGoals] = useState<Goal[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');
    const [newGoal, setNewGoal] = useState({
        title: '',
        type: 'weekly' as Goal['type'],
        category: 'custom' as Goal['category'],
        targetValue: ''
    });

    // Load goals from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`hustlepath_goals_${user?.id}`);
        if (saved) {
            setGoals(JSON.parse(saved));
        }
    }, [user]);

    // Save goals to localStorage
    const saveGoals = (updated: Goal[]) => {
        localStorage.setItem(`hustlepath_goals_${user?.id}`, JSON.stringify(updated));
        setGoals(updated);
    };

    const handleAddGoal = () => {
        if (!newGoal.title) return;

        const goal: Goal = {
            id: Date.now().toString(),
            title: newGoal.title,
            type: newGoal.type,
            category: newGoal.category,
            targetValue: newGoal.targetValue ? parseInt(newGoal.targetValue) : undefined,
            currentValue: 0,
            isCompleted: false,
            createdAt: new Date().toISOString()
        };

        saveGoals([goal, ...goals]);
        setNewGoal({ title: '', type: 'weekly', category: 'custom', targetValue: '' });
        setShowAddModal(false);
        play('success');
    };

    const handleAddFromTemplate = (template: typeof GOAL_TEMPLATES[0]) => {
        const goal: Goal = {
            id: Date.now().toString(),
            title: template.title,
            type: template.type as Goal['type'],
            category: template.category as Goal['category'],
            targetValue: template.targetValue,
            currentValue: 0,
            isCompleted: false,
            createdAt: new Date().toISOString()
        };

        saveGoals([goal, ...goals]);
        play('success');
    };

    const handleToggleComplete = (goalId: string) => {
        const updated = goals.map(g =>
            g.id === goalId ? { ...g, isCompleted: !g.isCompleted } : g
        );
        saveGoals(updated);
        play(goals.find(g => g.id === goalId)?.isCompleted ? 'click' : 'success');
    };

    const handleUpdateProgress = (goalId: string, value: number) => {
        const updated = goals.map(g => {
            if (g.id === goalId) {
                const newValue = Math.max(0, g.currentValue + value);
                return {
                    ...g,
                    currentValue: newValue,
                    isCompleted: g.targetValue ? newValue >= g.targetValue : g.isCompleted
                };
            }
            return g;
        });
        saveGoals(updated);
        play('click');
    };

    const handleDelete = (goalId: string) => {
        saveGoals(goals.filter(g => g.id !== goalId));
        play('click');
    };

    const filteredGoals = activeTab === 'all' ? goals : goals.filter(g => g.type === activeTab);
    const completedCount = goals.filter(g => g.isCompleted).length;
    const totalGoals = goals.length;

    const getTypeColor = (type: Goal['type']) => {
        switch (type) {
            case 'daily': return 'cyan';
            case 'weekly': return 'fuchsia';
            case 'monthly': return 'orange';
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-20 left-0 w-[400px] h-[400px] bg-fuchsia-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="container mx-auto px-4 pt-20 md:pt-24 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                <Target className="w-6 h-6 text-fuchsia-400" />
                                My Goals
                            </h1>
                            <p className="text-sm text-muted-foreground">Set and track your hustle goals</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAddModal(true)} className="bg-fuchsia-500 hover:bg-fuchsia-400 text-black">
                        <Plus className="w-4 h-4 mr-2" />
                        New Goal
                    </Button>
                </div>

                {/* Stats */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div>
                            <div className="text-2xl font-bold text-fuchsia-400">{completedCount}/{totalGoals}</div>
                            <div className="text-xs text-muted-foreground">Completed</div>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div>
                            <div className="text-2xl font-bold text-primary">
                                {totalGoals > 0 ? Math.round((completedCount / totalGoals) * 100) : 0}%
                            </div>
                            <div className="text-xs text-muted-foreground">Success Rate</div>
                        </div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-fuchsia-400/30" />
                </div>

                {/* Type Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['all', 'daily', 'weekly', 'monthly'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-fuchsia-500 text-black'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {tab === 'all' ? 'All Goals' : `${tab.charAt(0).toUpperCase() + tab.slice(1)}`}
                        </button>
                    ))}
                </div>

                {/* Quick Add Templates */}
                <div className="mb-6">
                    <h3 className="text-sm text-muted-foreground mb-3">Quick Add</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {GOAL_TEMPLATES.map((template, i) => (
                            <button
                                key={i}
                                onClick={() => handleAddFromTemplate(template)}
                                className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs whitespace-nowrap hover:bg-white/10 transition-colors"
                            >
                                + {template.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Goals List */}
                <div className="space-y-3">
                    {filteredGoals.length === 0 ? (
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-10 text-center">
                            <Target className="w-12 h-12 mx-auto mb-3 text-fuchsia-400/30" />
                            <p className="text-muted-foreground">No goals yet</p>
                            <p className="text-sm text-muted-foreground/60">Set your first goal to start tracking!</p>
                        </div>
                    ) : (
                        filteredGoals.map((goal) => {
                            const progress = goal.targetValue
                                ? Math.min(100, (goal.currentValue / goal.targetValue) * 100)
                                : goal.isCompleted ? 100 : 0;
                            const typeColor = getTypeColor(goal.type);

                            return (
                                <motion.div
                                    key={goal.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`bg-black/40 backdrop-blur-xl border rounded-2xl p-4 transition-all ${goal.isCompleted
                                        ? 'border-green-500/30 bg-green-500/5'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-start gap-3 flex-1">
                                            <button
                                                onClick={() => handleToggleComplete(goal.id)}
                                                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${goal.isCompleted
                                                    ? 'bg-green-500 border-green-500 text-black'
                                                    : 'border-white/20 hover:border-white/40'
                                                    }`}
                                            >
                                                {goal.isCompleted && <Check className="w-3 h-3" />}
                                            </button>
                                            <div className="flex-1">
                                                <h3 className={`font-medium ${goal.isCompleted ? 'line-through text-white/50' : ''}`}>
                                                    {goal.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full bg-${typeColor}-500/20 text-${typeColor}-400`}>
                                                        {goal.type}
                                                    </span>
                                                    {goal.targetValue && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {goal.currentValue}/{goal.targetValue}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Progress Bar */}
                                                {goal.targetValue && (
                                                    <div className="mt-2">
                                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${progress}%` }}
                                                                className={`h-full bg-${typeColor}-500`}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {goal.targetValue && !goal.isCompleted && (
                                                <>
                                                    <button
                                                        onClick={() => handleUpdateProgress(goal.id, -1)}
                                                        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60"
                                                    >
                                                        -
                                                    </button>
                                                    <button
                                                        onClick={() => handleUpdateProgress(goal.id, 1)}
                                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
                                                    >
                                                        +
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(goal.id)}
                                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-white/40 hover:text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Add Goal Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-md"
                        >
                            <h2 className="text-xl font-bold mb-6">Create New Goal</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Goal Title</label>
                                    <input
                                        type="text"
                                        value={newGoal.title}
                                        onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                                        placeholder="e.g., Make $500 this month"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-fuchsia-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Time Frame</label>
                                    <div className="flex gap-2">
                                        {(['daily', 'weekly', 'monthly'] as const).map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setNewGoal({ ...newGoal, type })}
                                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${newGoal.type === type
                                                    ? 'bg-fuchsia-500 text-black'
                                                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                                                    }`}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Target Value (optional)</label>
                                    <input
                                        type="number"
                                        value={newGoal.targetValue}
                                        onChange={(e) => setNewGoal({ ...newGoal, targetValue: e.target.value })}
                                        placeholder="e.g., 500"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-fuchsia-500/50"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Leave empty for simple checkbox goal</p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleAddGoal} className="flex-1 bg-fuchsia-500 hover:bg-fuchsia-400 text-black">
                                    Create Goal
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
