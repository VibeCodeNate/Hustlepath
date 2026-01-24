import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Trophy, Sparkles } from 'lucide-react';
import { Button } from './Button';
import type { Objective } from '../lib/roadmap';

interface TaskDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    day: number;
    week: number;
    tasks: Objective[];
    onTaskToggle: (task: Objective) => void;
    processingTask: string | null;
}

export function TaskDrawer({
    isOpen,
    onClose,
    day,
    week,
    tasks,
    onTaskToggle,
    processingTask
}: TaskDrawerProps) {
    const completedCount = tasks.filter(t => t.completed).length;
    const allCompleted = completedCount === tasks.length;
    const totalXP = tasks.reduce((acc, t) => acc + t.xp, 0);
    const earnedXP = tasks.filter(t => t.completed).reduce((acc, t) => acc + t.xp, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-900 border-l border-white/10 z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-zinc-900/95 backdrop-blur-md border-b border-white/10 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
                                        Week {week} • Day {day}
                                    </div>
                                    <h2 className="text-2xl font-bold">
                                        Checkpoint Objectives
                                    </h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="bg-zinc-800 rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-primary to-green-400"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="flex justify-between text-xs mt-2 text-white/60">
                                <span>{completedCount}/{tasks.length} completed</span>
                                <span className="text-yellow-400">{earnedXP}/{totalXP} XP</span>
                            </div>
                        </div>

                        {/* Tasks */}
                        <div className="p-6 space-y-3">
                            {tasks.map((task, idx) => (
                                <motion.div
                                    key={task.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    onClick={() => onTaskToggle(task)}
                                    className={`p-4 rounded-xl border transition-all cursor-pointer group ${task.completed
                                            ? 'bg-green-500/10 border-green-500/30'
                                            : 'bg-white/5 border-white/10 hover:border-primary/50 hover:bg-white/10'
                                        } ${processingTask === task.id ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-white/30 group-hover:border-primary'
                                                }`}
                                        >
                                            {task.completed && (
                                                <CheckCircle className="w-4 h-4 text-black" />
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3
                                                className={`font-medium ${task.completed ? 'text-green-400 line-through opacity-70' : ''
                                                    }`}
                                            >
                                                {task.title}
                                            </h3>
                                        </div>
                                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                                            <Sparkles className="w-3 h-3" />
                                            +{task.xp}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Completion State */}
                        {allCompleted && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mx-6 mb-6 p-6 bg-gradient-to-br from-primary/20 to-green-500/20 border border-primary/30 rounded-2xl text-center"
                            >
                                <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-primary mb-1">
                                    Checkpoint Complete!
                                </h3>
                                <p className="text-sm text-white/60">
                                    You earned {totalXP} XP. Keep pushing forward!
                                </p>
                            </motion.div>
                        )}

                        {/* Continue Button */}
                        <div className="p-6 pt-0">
                            <Button
                                className="w-full"
                                onClick={onClose}
                            >
                                {allCompleted ? 'Continue Journey' : 'Back to Map'}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
