import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { TaskDrawer } from '../components/TaskDrawer';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, Map, ChevronLeft, ChevronRight, Zap, Lock, Clock, Sparkles, DollarSign, Target, Check, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import {
    type Week,
    type Objective,
    getRoadmap,
    createInitialRoadmap,
    updateRoadmapProgress,
    completeTaskInDb,
    getTimeUntilUnlock
} from '../lib/roadmap';
import { NICHE_INFO, type NicheType } from '../lib/nicheRoadmaps';
import { useSound } from '../lib/sound';
import { LevelUpModal } from '../components/LevelUpModal';

// Siege-style color scheme for weeks
const WEEK_COLORS = [
    { bg: 'bg-red-600', border: 'border-red-500', text: 'text-red-400', gradient: 'from-red-600 to-red-700' },
    { bg: 'bg-amber-600', border: 'border-amber-500', text: 'text-amber-400', gradient: 'from-amber-600 to-amber-700' },
    { bg: 'bg-blue-600', border: 'border-blue-500', text: 'text-blue-400', gradient: 'from-blue-600 to-blue-700' },
    { bg: 'bg-green-600', border: 'border-green-500', text: 'text-green-400', gradient: 'from-green-600 to-green-700' },
    { bg: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400', gradient: 'from-purple-600 to-purple-700' },
    { bg: 'bg-cyan-600', border: 'border-cyan-500', text: 'text-cyan-400', gradient: 'from-cyan-600 to-cyan-700' },
    { bg: 'bg-fuchsia-600', border: 'border-fuchsia-500', text: 'text-fuchsia-400', gradient: 'from-fuchsia-600 to-fuchsia-700' },
    { bg: 'bg-orange-600', border: 'border-orange-500', text: 'text-orange-400', gradient: 'from-orange-600 to-orange-700' },
    { bg: 'bg-indigo-600', border: 'border-indigo-500', text: 'text-indigo-400', gradient: 'from-indigo-600 to-indigo-700' },
    { bg: 'bg-rose-600', border: 'border-rose-500', text: 'text-rose-400', gradient: 'from-rose-600 to-rose-700' },
    { bg: 'bg-teal-600', border: 'border-teal-500', text: 'text-teal-400', gradient: 'from-teal-600 to-teal-700' },
    { bg: 'bg-lime-600', border: 'border-lime-500', text: 'text-lime-400', gradient: 'from-lime-600 to-lime-700' },
];

// Category rows for the grid
const CATEGORIES = [
    { id: 'daily', name: 'Daily Objectives', icon: '📋', description: 'Core tasks for each day' },
    { id: 'skills', name: 'Skill Building', icon: '🎯', description: 'Learn and practice' },
    { id: 'action', name: 'Action Items', icon: '⚡', description: 'Execute and deliver' },
    { id: 'growth', name: 'Growth & Review', icon: '📈', description: 'Analyze and improve' },
];

export function Roadmap() {
    const navigate = useNavigate();
    const { user, profile, refreshProfile } = useAuth();
    const { play } = useSound();

    // State
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingTask, setProcessingTask] = useState<string | null>(null);
    const [nicheId, setNicheId] = useState<NicheType>('general');
    const [viewRange, setViewRange] = useState({ start: 0, end: 4 }); // Show 4 weeks at a time

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<{ weekIdx: number; dayIdx: number } | null>(null);

    // Level Up State
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(1);

    // Get niche info
    const nicheInfo = NICHE_INFO.find(n => n.id === nicheId) || NICHE_INFO[0];

    // Initial Data Fetch
    useEffect(() => {
        if (!user) return;

        const loadRoadmap = async () => {
            try {
                const { data } = await getRoadmap(user.id);

                if (data) {
                    setWeeks(data.roadmap_data.weeks);
                    setNicheId(data.roadmap_data.nicheId || data.hustle_id || 'general');
                    return;
                }

                const userNiche = (profile?.current_hustle_id || 'freelancing') as NicheType;
                const { data: newData, error: createError } = await createInitialRoadmap(user.id, userNiche);

                if (createError) throw createError;
                if (newData) {
                    setWeeks(newData.roadmap_data.weeks);
                    setNicheId(userNiche);
                }
            } catch (err) {
                console.error('Failed to load roadmap:', err);
                setError('Failed to load your roadmap. Please try refreshing.');
            } finally {
                setLoading(false);
            }
        };

        loadRoadmap();
    }, [user, profile]);

    // Handle clicking a day cell
    const handleCellClick = (weekIdx: number, dayIdx: number) => {
        if (weeks[weekIdx]?.isLocked) {
            play('error');
            return;
        }
        setSelectedDay({ weekIdx, dayIdx });
        setDrawerOpen(true);
        play('click');
    };

    // Handle Task Completion
    const toggleTask = async (task: Objective) => {
        if (!user || !selectedDay) return;
        if (processingTask) return;

        const { weekIdx, dayIdx } = selectedDay;
        const isCompleting = !task.completed;
        const taskId = task.id;

        const newWeeks = [...weeks];
        newWeeks[weekIdx].days[dayIdx].tasks = newWeeks[weekIdx].days[dayIdx].tasks.map(t =>
            t.id === taskId ? { ...t, completed: isCompleting } : t
        );
        setWeeks(newWeeks);

        if (isCompleting) play('click');

        try {
            setProcessingTask(taskId);
            const { error: saveError } = await updateRoadmapProgress(user.id, newWeeks);
            if (saveError) throw saveError;

            if (isCompleting) {
                const { newLevel: updatedLevel, leveledUp, error: xpError } = await completeTaskInDb(user.id, taskId, task.xp);
                if (xpError) throw xpError;

                play('xp');
                await refreshProfile();

                if (leveledUp) {
                    setNewLevel(updatedLevel);
                    setShowLevelUp(true);
                    play('levelUp');
                }
            }
        } catch (err) {
            console.error('Task update failed:', err);
            play('error');
        } finally {
            setProcessingTask(null);
        }
    };

    // Calculate progress
    const getWeekProgress = (weekIdx: number) => {
        const week = weeks[weekIdx];
        if (!week) return 0;
        const totalTasks = week.days.reduce((acc, d) => acc + d.tasks.length, 0);
        const completedTasks = week.days.reduce((acc, d) => acc + d.tasks.filter(t => t.completed).length, 0);
        return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    };

    const getDayProgress = (weekIdx: number, dayIdx: number) => {
        const day = weeks[weekIdx]?.days[dayIdx];
        if (!day) return { completed: 0, total: 0 };
        return {
            completed: day.tasks.filter(t => t.completed).length,
            total: day.tasks.length
        };
    };

    // Navigation
    const canGoBack = viewRange.start > 0;
    const canGoForward = viewRange.end < weeks.length;

    const navigateWeeks = (direction: 'back' | 'forward') => {
        if (direction === 'back' && canGoBack) {
            setViewRange({ start: viewRange.start - 1, end: viewRange.end - 1 });
        } else if (direction === 'forward' && canGoForward) {
            setViewRange({ start: viewRange.start + 1, end: viewRange.end + 1 });
        }
        play('click');
    };

    // Time until unlock for locked weeks
    const getUnlockInfo = (weekIdx: number) => {
        if (weekIdx === 0) return null;
        return getTimeUntilUnlock(weekIdx, weeks);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                <p className="text-white/60 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    if (weeks.length === 0) return null;

    const visibleWeeks = weeks.slice(viewRange.start, viewRange.end);

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 overflow-x-hidden">
            <Navbar />
            <LevelUpModal level={newLevel} isOpen={showLevelUp} onClose={() => setShowLevelUp(false)} />

            {/* Task Drawer */}
            {selectedDay && (
                <TaskDrawer
                    isOpen={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                    day={selectedDay.dayIdx + 1}
                    week={selectedDay.weekIdx + 1}
                    tasks={weeks[selectedDay.weekIdx]?.days[selectedDay.dayIdx]?.tasks || []}
                    onTaskToggle={toggleTask}
                    processingTask={processingTask}
                />
            )}

            <div className="container mx-auto px-4 pt-20 pb-8 relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                <Map className="w-6 h-6 text-primary" />
                                {nicheInfo.icon} {nicheInfo.name} Roadmap
                            </h1>
                            <p className="text-sm text-muted-foreground">Your 12-Week Journey to Success</p>
                        </div>
                    </div>
                </div>

                {/* Quick Nav Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => navigate('/extra-objectives')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg text-sm whitespace-nowrap hover:from-yellow-500/30 hover:to-orange-500/30 transition-all"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        Extra Objectives
                    </button>
                    <button
                        onClick={() => navigate('/earnings')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg text-sm whitespace-nowrap hover:from-green-500/30 hover:to-emerald-500/30 transition-all"
                    >
                        <DollarSign className="w-4 h-4 text-green-400" />
                        Earnings Tracker
                    </button>
                    <button
                        onClick={() => navigate('/goals')}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-fuchsia-500/20 to-purple-500/20 border border-fuchsia-500/30 rounded-lg text-sm whitespace-nowrap hover:from-fuchsia-500/30 hover:to-purple-500/30 transition-all"
                    >
                        <Target className="w-4 h-4 text-fuchsia-400" />
                        Goals
                    </button>
                </div>

                {/* Title Banner - Siege Style */}
                <div className="bg-gradient-to-r from-primary/30 via-primary/10 to-transparent border-l-4 border-primary rounded-r-lg px-6 py-4 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-wider">12-Week Roadmap</h2>
                            <p className="text-sm text-muted-foreground">Click any day to view and complete tasks</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateWeeks('back')}
                                disabled={!canGoBack}
                                className="bg-white/5"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <span className="text-sm font-medium px-3">
                                Weeks {viewRange.start + 1}-{Math.min(viewRange.end, weeks.length)}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigateWeeks('forward')}
                                disabled={!canGoForward}
                                className="bg-white/5"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Siege-Style Grid Roadmap */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        {/* Week Headers */}
                        <thead>
                            <tr>
                                <th className="w-32 p-2"></th>
                                {visibleWeeks.map((week, idx) => {
                                    const actualWeekIdx = viewRange.start + idx;
                                    const color = WEEK_COLORS[actualWeekIdx % WEEK_COLORS.length];
                                    const progress = getWeekProgress(actualWeekIdx);
                                    const isLocked = week.isLocked;
                                    const unlockInfo = getUnlockInfo(actualWeekIdx);

                                    return (
                                        <th key={week.id} className="p-2 min-w-[180px]">
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                className={`relative rounded-t-xl overflow-hidden ${isLocked ? 'opacity-60' : ''}`}
                                            >
                                                {/* Week Header Card */}
                                                <div className={`bg-gradient-to-b ${color.gradient} p-4 text-center`}>
                                                    {isLocked && (
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                            <Lock className="w-6 h-6 text-white/70" />
                                                        </div>
                                                    )}
                                                    <div className="text-xs uppercase tracking-widest opacity-80">Week</div>
                                                    <div className="text-3xl font-black">{actualWeekIdx + 1}</div>
                                                    <div className="text-xs font-medium mt-1 opacity-90">{week.description}</div>
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="bg-black/40 px-3 py-2">
                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                        <span className="opacity-70">Progress</span>
                                                        <span className={`font-bold ${color.text}`}>{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${color.bg} transition-all duration-500`}
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                    {isLocked && unlockInfo && (
                                                        <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
                                                            <Clock className="w-3 h-3" />
                                                            <span>Unlocks in {unlockInfo.days}d {unlockInfo.hours}h</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>

                        {/* Day Rows */}
                        <tbody>
                            {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => (
                                <tr key={dayIdx}>
                                    {/* Day Label */}
                                    <td className="p-2">
                                        <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                                            <div className="text-xs text-muted-foreground uppercase tracking-wider">Day</div>
                                            <div className="text-xl font-bold">{dayIdx + 1}</div>
                                        </div>
                                    </td>

                                    {/* Day Cells for Each Week */}
                                    {visibleWeeks.map((week, weekColIdx) => {
                                        const actualWeekIdx = viewRange.start + weekColIdx;
                                        const color = WEEK_COLORS[actualWeekIdx % WEEK_COLORS.length];
                                        const { completed, total } = getDayProgress(actualWeekIdx, dayIdx);
                                        const isAllComplete = completed === total && total > 0;
                                        const isLocked = week.isLocked;
                                        const day = week.days[dayIdx];

                                        return (
                                            <td key={`${week.id}-${dayIdx}`} className="p-2">
                                                <motion.button
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: weekColIdx * 0.05 + dayIdx * 0.02 }}
                                                    onClick={() => handleCellClick(actualWeekIdx, dayIdx)}
                                                    disabled={isLocked}
                                                    className={`w-full p-4 rounded-xl border-2 transition-all ${isLocked
                                                            ? 'bg-zinc-800/30 border-zinc-700/30 cursor-not-allowed opacity-50'
                                                            : isAllComplete
                                                                ? `bg-gradient-to-br from-green-500/20 to-emerald-500/10 ${color.border} border-green-500/50 hover:scale-105`
                                                                : `bg-zinc-800/50 ${color.border} border-opacity-30 hover:border-opacity-100 hover:bg-zinc-700/50 hover:scale-105`
                                                        } focus:outline-none focus:ring-2 focus:ring-primary/50`}
                                                >
                                                    {isLocked ? (
                                                        <Lock className="w-5 h-5 mx-auto text-zinc-600" />
                                                    ) : (
                                                        <>
                                                            {/* Task Count */}
                                                            <div className="flex items-center justify-center gap-2 mb-2">
                                                                {isAllComplete ? (
                                                                    <Check className="w-5 h-5 text-green-400" />
                                                                ) : (
                                                                    <Circle className={`w-5 h-5 ${color.text}`} />
                                                                )}
                                                                <span className={`text-lg font-bold ${isAllComplete ? 'text-green-400' : ''}`}>
                                                                    {completed}/{total}
                                                                </span>
                                                            </div>

                                                            {/* Task Previews */}
                                                            <div className="space-y-1">
                                                                {day?.tasks.slice(0, 2).map((task) => (
                                                                    <div
                                                                        key={task.id}
                                                                        className={`text-[10px] truncate px-2 py-0.5 rounded ${task.completed
                                                                                ? 'bg-green-500/20 text-green-300 line-through'
                                                                                : 'bg-white/5 text-white/60'
                                                                            }`}
                                                                    >
                                                                        {task.title}
                                                                    </div>
                                                                ))}
                                                                {day?.tasks.length > 2 && (
                                                                    <div className="text-[10px] text-muted-foreground">
                                                                        +{day.tasks.length - 2} more
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* XP Badge */}
                                                            <div className="mt-2 flex items-center justify-center gap-1">
                                                                <Zap className="w-3 h-3 text-yellow-400" />
                                                                <span className="text-xs text-yellow-400 font-medium">
                                                                    {day?.tasks.reduce((sum, t) => sum + t.xp, 0)} XP
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>

                        {/* Week XP Totals Row */}
                        <tfoot>
                            <tr>
                                <td className="p-2">
                                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 text-center">
                                        <Zap className="w-5 h-5 text-yellow-400 mx-auto" />
                                        <div className="text-xs text-yellow-400 font-bold mt-1">TOTAL XP</div>
                                    </div>
                                </td>
                                {visibleWeeks.map((week, idx) => {
                                    const actualWeekIdx = viewRange.start + idx;
                                    const color = WEEK_COLORS[actualWeekIdx % WEEK_COLORS.length];
                                    const totalXp = week.days.reduce(
                                        (sum, d) => sum + d.tasks.reduce((s, t) => s + t.xp, 0), 0
                                    );
                                    const earnedXp = week.days.reduce(
                                        (sum, d) => sum + d.tasks.filter(t => t.completed).reduce((s, t) => s + t.xp, 0), 0
                                    );

                                    return (
                                        <td key={`xp-${week.id}`} className="p-2">
                                            <div className={`bg-gradient-to-b ${color.gradient} rounded-b-xl p-3 text-center`}>
                                                <div className="text-2xl font-black">{earnedXp}</div>
                                                <div className="text-xs opacity-70">/ {totalXp} XP</div>
                                            </div>
                                        </td>
                                    );
                                })}
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Bottom Legend */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500/30 border border-green-500" />
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-zinc-700 border border-white/20" />
                        <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-zinc-600" />
                        <span>Locked (Complete previous week + wait 7 days)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
