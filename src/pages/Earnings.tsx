import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { ArrowLeft, DollarSign, TrendingUp, Plus, X, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../lib/sound';

interface Earning {
    id: string;
    amount: number;
    source: string;
    notes: string;
    date: string;
}

export function Earnings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { play } = useSound();

    const [earnings, setEarnings] = useState<Earning[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEarning, setNewEarning] = useState({ amount: '', source: '', notes: '', date: new Date().toISOString().split('T')[0] });
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('month');

    // Load earnings from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(`hustlepath_earnings_${user?.id}`);
        if (saved) {
            setEarnings(JSON.parse(saved));
        }
    }, [user]);

    // Save earnings to localStorage
    const saveEarnings = (updated: Earning[]) => {
        localStorage.setItem(`hustlepath_earnings_${user?.id}`, JSON.stringify(updated));
        setEarnings(updated);
    };

    const handleAddEarning = () => {
        if (!newEarning.amount || !newEarning.source) return;

        const earning: Earning = {
            id: Date.now().toString(),
            amount: parseFloat(newEarning.amount),
            source: newEarning.source,
            notes: newEarning.notes,
            date: newEarning.date
        };

        saveEarnings([earning, ...earnings]);
        setNewEarning({ amount: '', source: '', notes: '', date: new Date().toISOString().split('T')[0] });
        setShowAddModal(false);
        play('success');
    };

    const handleDelete = (id: string) => {
        saveEarnings(earnings.filter(e => e.id !== id));
        play('click');
    };

    // Calculate stats
    const now = new Date();
    const filteredEarnings = earnings.filter(e => {
        const earningDate = new Date(e.date);
        if (selectedPeriod === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return earningDate >= weekAgo;
        } else if (selectedPeriod === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return earningDate >= monthAgo;
        }
        return true;
    });

    const totalEarnings = filteredEarnings.reduce((sum, e) => sum + e.amount, 0);
    const avgPerEntry = filteredEarnings.length > 0 ? totalEarnings / filteredEarnings.length : 0;

    // Group by date for chart
    const chartData = filteredEarnings.reduce((acc, e) => {
        const date = e.date;
        acc[date] = (acc[date] || 0) + e.amount;
        return acc;
    }, {} as Record<string, number>);

    const maxAmount = Math.max(...Object.values(chartData), 1);

    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden">
            <Navbar />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-20 right-0 w-[400px] h-[400px] bg-green-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-primary/10 blur-[100px] rounded-full"
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
                                <DollarSign className="w-6 h-6 text-green-400" />
                                Earnings Tracker
                            </h1>
                            <p className="text-sm text-muted-foreground">Track your side hustle income</p>
                        </div>
                    </div>
                    <Button onClick={() => setShowAddModal(true)} className="bg-green-500 hover:bg-green-400 text-black">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Earning
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-black/40 backdrop-blur-xl border border-green-500/20 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-green-400" />
                            </div>
                            <span className="text-sm text-muted-foreground">Total Earnings</span>
                        </div>
                        <div className="text-3xl font-bold text-green-400">${totalEarnings.toFixed(2)}</div>
                    </div>

                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <span className="text-sm text-muted-foreground">Avg per Entry</span>
                        </div>
                        <div className="text-3xl font-bold">${avgPerEntry.toFixed(2)}</div>
                    </div>

                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-cyan-400" />
                            </div>
                            <span className="text-sm text-muted-foreground">Entries</span>
                        </div>
                        <div className="text-3xl font-bold">{filteredEarnings.length}</div>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="flex gap-2 mb-6">
                    {(['week', 'month', 'all'] as const).map((period) => (
                        <button
                            key={period}
                            onClick={() => setSelectedPeriod(period)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedPeriod === period
                                ? 'bg-green-500 text-black'
                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                }`}
                        >
                            {period === 'week' ? 'Last 7 Days' : period === 'month' ? 'Last 30 Days' : 'All Time'}
                        </button>
                    ))}
                </div>

                {/* Simple Chart */}
                {Object.keys(chartData).length > 0 && (
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 mb-6">
                        <h3 className="font-bold mb-4">Earnings Over Time</h3>
                        <div className="flex items-end gap-2 h-32">
                            {Object.entries(chartData).slice(-14).map(([date, amount]) => (
                                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(amount / maxAmount) * 100}%` }}
                                        className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t min-h-[4px]"
                                    />
                                    <span className="text-[9px] text-muted-foreground">
                                        {new Date(date).getDate()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Earnings List */}
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
                    <h3 className="font-bold mb-4">Recent Earnings</h3>
                    <div className="space-y-3">
                        {filteredEarnings.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p>No earnings recorded yet</p>
                                <p className="text-sm">Add your first earning to start tracking!</p>
                            </div>
                        ) : (
                            filteredEarnings.map((earning) => (
                                <motion.div
                                    key={earning.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium">{earning.source}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {new Date(earning.date).toLocaleDateString()}
                                                {earning.notes && ` • ${earning.notes}`}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl font-bold text-green-400">+${earning.amount.toFixed(2)}</span>
                                        <button
                                            onClick={() => handleDelete(earning.id)}
                                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                                        >
                                            <X className="w-4 h-4 text-white/40 hover:text-red-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Add Earning Modal */}
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
                            <h2 className="text-xl font-bold mb-6">Add New Earning</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Amount ($)</label>
                                    <input
                                        type="number"
                                        value={newEarning.amount}
                                        onChange={(e) => setNewEarning({ ...newEarning, amount: e.target.value })}
                                        placeholder="0.00"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Source</label>
                                    <input
                                        type="text"
                                        value={newEarning.source}
                                        onChange={(e) => setNewEarning({ ...newEarning, source: e.target.value })}
                                        placeholder="e.g., Freelance project, Product sale"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Date</label>
                                    <input
                                        type="date"
                                        value={newEarning.date}
                                        onChange={(e) => setNewEarning({ ...newEarning, date: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500/50"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-muted-foreground mb-1 block">Notes (optional)</label>
                                    <input
                                        type="text"
                                        value={newEarning.notes}
                                        onChange={(e) => setNewEarning({ ...newEarning, notes: e.target.value })}
                                        placeholder="Add any notes..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-green-500/50"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">
                                    Cancel
                                </Button>
                                <Button onClick={handleAddEarning} className="flex-1 bg-green-500 hover:bg-green-400 text-black">
                                    Add Earning
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
