import { useState, useEffect, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { MapCheckpoint, type CheckpointState } from '../components/MapCheckpoint';
import { MapPath } from '../components/MapPath';
import { TaskDrawer } from '../components/TaskDrawer';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, AlertCircle, Map, ChevronLeft, ChevronRight, Zap, Lock, Clock, Sparkles, DollarSign, Target } from 'lucide-react';
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

// Generate checkpoint positions for a winding path across the map
function generateCheckpointPositions(weekIndex: number): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const baseY = 15 + (weekIndex % 4) * 20;

    for (let day = 0; day < 7; day++) {
        const x = 8 + day * 12 + (day % 2 === 0 ? 2 : -2);
        const y = baseY + Math.sin(day * 0.8) * 8 + (day % 3) * 3;
        positions.push({ x: Math.min(92, Math.max(8, x)), y: Math.min(85, Math.max(15, y)) });
    }

    return positions;
}

export function Roadmap() {
    const navigate = useNavigate();
    const { user, profile, refreshProfile } = useAuth();
    const { play } = useSound();

    // State
    const [weeks, setWeeks] = useState<Week[]>([]);
    const [currentWeek, setCurrentWeek] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processingTask, setProcessingTask] = useState<string | null>(null);
    const [nicheId, setNicheId] = useState<NicheType>('general');

    // Drawer State
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState<{ weekIdx: number; dayIdx: number } | null>(null);

    // Level Up State
    const [showLevelUp, setShowLevelUp] = useState(false);
    const [newLevel, setNewLevel] = useState(1);

    // Generate checkpoint positions for current week
    const checkpointPositions = useMemo(() => generateCheckpointPositions(currentWeek), [currentWeek]);

    // Get niche info
    const nicheInfo = NICHE_INFO.find(n => n.id === nicheId) || NICHE_INFO[NICHE_INFO.length - 1];

    // Initial Data Fetch
    useEffect(() => {
        if (!user) return;

        const loadRoadmap = async () => {
            try {
                const { data } = await getRoadmap(user.id);

                if (data) {
                    setWeeks(data.roadmap_data.weeks);
                    setCurrentWeek(data.current_week - 1);
                    setNicheId(data.roadmap_data.nicheId || data.hustle_id || 'general');
                    return;
                }

                // Get niche from profile
                const userNiche = (profile?.current_hustle_id || 'freelancing') as NicheType;
                console.log('No roadmap found, creating for niche:', userNiche);

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

    // Get checkpoint state based on completion
    const getCheckpointState = (weekIdx: number, dayIdx: number): CheckpointState => {
        const week = weeks[weekIdx];
        if (!week) return 'locked';

        if (week.isLocked) return 'locked';

        const day = week.days[dayIdx];
        const allCompleted = day.tasks.every(t => t.completed);
        const someCompleted = day.tasks.some(t => t.completed);

        const isCurrentWeek = weekIdx === currentWeek;

        if (allCompleted) return 'completed';
        if (isCurrentWeek && someCompleted) return 'active';
        if (isCurrentWeek) return 'active';
        if (weekIdx < currentWeek) return 'completed';

        return 'upcoming';
    };

    // Handle checkpoint click
    const handleCheckpointClick = (dayIdx: number) => {
        setSelectedDay({ weekIdx: currentWeek, dayIdx });
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

        // Optimistic Update
        const newWeeks = [...weeks];
        newWeeks[weekIdx].days[dayIdx].tasks = newWeeks[weekIdx].days[dayIdx].tasks.map(t =>
            t.id === taskId ? { ...t, completed: isCompleting } : t
        );
        setWeeks(newWeeks);

        if (isCompleting) {
            play('click');
        }

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

    // Calculate week progress
    const getWeekProgress = (weekIdx: number) => {
        const week = weeks[weekIdx];
        if (!week) return 0;
        const totalTasks = week.days.reduce((acc, d) => acc + d.tasks.length, 0);
        const completedTasks = week.days.reduce((acc, d) => acc + d.tasks.filter(t => t.completed).length, 0);
        return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    };

    // Get time until next week unlocks
    const timeUntilUnlock = weeks.length > currentWeek + 1 ? getTimeUntilUnlock(currentWeek + 1, weeks) : null;

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

    const activeWeek = weeks[currentWeek];
    const weekProgress = getWeekProgress(currentWeek);

    return (
        <div className="min-h-screen bg-background overflow-hidden">
            <Navbar />
            <LevelUpModal level={newLevel} isOpen={showLevelUp} onClose={() => setShowLevelUp(false)} />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 left-0 w-[400px] h-[400px] bg-primary/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute top-1/2 right-0 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full"
                />
            </div>

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

            <div className="container mx-auto px-4 pt-20 pb-4 md:pb-8 h-screen flex flex-col relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 md:mb-4 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                                <Map className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                                Quest Map
                            </h1>
                            <p className="text-xs md:text-sm text-muted-foreground hidden sm:flex items-center gap-2">
                                <span className="text-lg">{nicheInfo.icon}</span>
                                <span>{nicheInfo.name}</span>
                            </p>
                        </div>
                    </div>

                    {/* Week Navigator */}
                    <div className="flex items-center justify-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
                            disabled={currentWeek === 0}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-center min-w-[100px] md:min-w-[120px]">
                            <div className="text-base md:text-lg font-bold">Week {currentWeek + 1}</div>
                            <div className="text-[10px] md:text-xs text-primary">{activeWeek.description}</div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentWeek(Math.min(weeks.length - 1, currentWeek + 1))}
                            disabled={currentWeek === weeks.length - 1 || weeks[currentWeek + 1]?.isLocked}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Quick Nav Tabs */}
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2 flex-shrink-0">
                    <button
                        onClick={() => navigate('/extra-objectives')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm whitespace-nowrap hover:bg-white/10 transition-colors"
                    >
                        <Sparkles className="w-4 h-4 text-yellow-400" />
                        Extra Objectives
                    </button>
                    <button
                        onClick={() => navigate('/earnings')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm whitespace-nowrap hover:bg-white/10 transition-colors"
                    >
                        <DollarSign className="w-4 h-4 text-green-400" />
                        Earnings
                    </button>
                    <button
                        onClick={() => navigate('/goals')}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm whitespace-nowrap hover:bg-white/10 transition-colors"
                    >
                        <Target className="w-4 h-4 text-fuchsia-400" />
                        Goals
                    </button>
                </div>

                {/* Week Progress Bar */}
                <div className="mb-3 md:mb-4 flex-shrink-0">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/60">Week Progress</span>
                        <span className="text-primary font-bold">{Math.round(weekProgress)}%</span>
                    </div>
                    <div className="h-1.5 md:h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary to-green-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${weekProgress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Time Lock Warning */}
                {timeUntilUnlock && weekProgress === 100 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 mb-4 flex items-center gap-3 flex-shrink-0"
                    >
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-yellow-400">Week {currentWeek + 2} unlocks in:</div>
                            <div className="text-lg font-bold">
                                {timeUntilUnlock.days}d {timeUntilUnlock.hours}h {timeUntilUnlock.minutes}m
                            </div>
                        </div>
                        <p className="text-xs text-yellow-400/60 hidden md:block">Complete daily objectives while you wait!</p>
                    </motion.div>
                )}

                {/* Map Container */}
                <div className="flex-1 relative rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden bg-zinc-900/50 map-grid terrain-gradient min-h-[300px]">
                    {/* Zone Label */}
                    <motion.div
                        key={currentWeek}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-2 left-2 md:top-4 md:left-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl px-2 py-1 md:px-4 md:py-2"
                    >
                        <div className="text-[10px] md:text-xs text-primary uppercase tracking-wider flex items-center gap-1">
                            <span>{nicheInfo.icon}</span>
                            Zone {currentWeek + 1}
                        </div>
                        <div className="text-sm md:text-base font-bold">{activeWeek.description}</div>
                    </motion.div>

                    {/* XP Indicator */}
                    <div className="hidden sm:flex absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-black/60 backdrop-blur-md border border-yellow-500/30 rounded-lg md:rounded-xl px-2 py-1 md:px-4 md:py-2 items-center gap-2">
                        <Zap className="w-3 h-3 md:w-4 md:h-4 text-yellow-400" />
                        <span className="text-xs md:text-sm font-bold text-yellow-400">
                            {activeWeek.days.reduce((acc, d) => acc + d.tasks.reduce((a, t) => a + t.xp, 0), 0)} XP
                        </span>
                    </div>

                    {/* Locked Week Overlay */}
                    {activeWeek.isLocked && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-30">
                            <Lock className="w-16 h-16 text-white/30 mb-4" />
                            <h3 className="text-xl font-bold mb-2">Week {currentWeek + 1} Locked</h3>
                            <p className="text-sm text-muted-foreground text-center max-w-[300px]">
                                Complete Week {currentWeek} and wait 7 days to unlock this week.
                            </p>
                        </div>
                    )}

                    {/* Paths connecting checkpoints */}
                    {!activeWeek.isLocked && checkpointPositions.slice(0, -1).map((pos, idx) => {
                        const nextPos = checkpointPositions[idx + 1];
                        const currentState = getCheckpointState(currentWeek, idx);
                        const nextState = getCheckpointState(currentWeek, idx + 1);

                        return (
                            <MapPath
                                key={`path-${idx}`}
                                startX={pos.x}
                                startY={pos.y}
                                endX={nextPos.x}
                                endY={nextPos.y}
                                isCompleted={currentState === 'completed' && nextState === 'completed'}
                                isActive={currentState === 'completed' || currentState === 'active'}
                            />
                        );
                    })}

                    {/* Checkpoints */}
                    {!activeWeek.isLocked && checkpointPositions.map((pos, dayIdx) => {
                        const day = activeWeek.days[dayIdx];
                        const state = getCheckpointState(currentWeek, dayIdx);
                        const tasksCompleted = day.tasks.filter(t => t.completed).length;

                        return (
                            <MapCheckpoint
                                key={`checkpoint-${dayIdx}`}
                                day={dayIdx + 1}
                                week={currentWeek + 1}
                                state={state}
                                x={pos.x}
                                y={pos.y}
                                tasksCompleted={tasksCompleted}
                                totalTasks={day.tasks.length}
                                onClick={() => handleCheckpointClick(dayIdx)}
                                isSelected={selectedDay?.dayIdx === dayIdx && selectedDay?.weekIdx === currentWeek}
                            />
                        );
                    })}

                    {/* Week Progress Markers */}
                    <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 md:gap-2 z-20">
                        {weeks.slice(0, 12).map((week, idx) => (
                            <button
                                key={week.id}
                                onClick={() => !week.isLocked && setCurrentWeek(idx)}
                                disabled={week.isLocked}
                                className={`w-6 h-6 md:w-8 md:h-8 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold transition-all flex items-center justify-center ${idx === currentWeek
                                    ? 'bg-primary text-black scale-110'
                                    : week.isLocked
                                        ? 'bg-zinc-800/50 text-zinc-600 cursor-not-allowed'
                                        : getWeekProgress(idx) === 100
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                            : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 border border-white/10'
                                    }`}
                            >
                                {week.isLocked ? <Lock className="w-3 h-3" /> : idx + 1}
                            </button>
                        ))}
                    </div>

                    {/* Instructions Hint */}
                    <div className="hidden md:block absolute bottom-4 right-4 z-20 text-xs text-white/40">
                        Click checkpoints to view tasks
                    </div>
                </div>
            </div>
        </div>
    );
}
