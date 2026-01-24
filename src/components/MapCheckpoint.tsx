import { motion } from 'framer-motion';
import { Lock, CheckCircle, Star } from 'lucide-react';

export type CheckpointState = 'locked' | 'active' | 'completed' | 'upcoming';

interface MapCheckpointProps {
    day: number;
    week: number;
    state: CheckpointState;
    x: number;
    y: number;
    tasksCompleted: number;
    totalTasks: number;
    onClick: () => void;
    isSelected?: boolean;
}

export function MapCheckpoint({
    day,
    week,
    state,
    x,
    y,
    tasksCompleted,
    totalTasks,
    onClick,
    isSelected = false
}: MapCheckpointProps) {
    const getStateStyles = () => {
        switch (state) {
            case 'locked':
                return 'bg-zinc-800/80 border-zinc-700 text-zinc-500 cursor-not-allowed';
            case 'completed':
                return 'bg-green-500/20 border-green-500 text-green-400 cursor-pointer hover:scale-110';
            case 'active':
                return 'bg-primary/20 border-primary text-primary cursor-pointer hover:scale-110 checkpoint-active';
            case 'upcoming':
            default:
                return 'bg-zinc-800/60 border-zinc-600 text-zinc-400 cursor-pointer hover:border-white/30 hover:scale-105';
        }
    };

    const getIcon = () => {
        switch (state) {
            case 'locked':
                return <Lock className="w-4 h-4" />;
            case 'completed':
                return <CheckCircle className="w-5 h-5" />;
            case 'active':
                return <Star className="w-5 h-5 fill-current" />;
            default:
                return <span className="text-sm font-bold">{day}</span>;
        }
    };

    return (
        <motion.button
            className={`absolute w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 ${getStateStyles()} ${isSelected ? 'ring-4 ring-primary/50 scale-110' : ''}`}
            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
            onClick={state !== 'locked' ? onClick : undefined}
            whileTap={state !== 'locked' ? { scale: 0.95 } : undefined}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (week * 7 + day) * 0.02 }}
        >
            {getIcon()}

            {/* Progress Ring for Active/Completed */}
            {(state === 'active' || state === 'completed') && (
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle
                        cx="24"
                        cy="24"
                        r="22"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={`${(tasksCompleted / totalTasks) * 138} 138`}
                        className="opacity-50"
                    />
                </svg>
            )}

            {/* Day Label Tooltip */}
            <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none ${state === 'locked' ? 'text-zinc-600' : 'text-white/60'}`}>
                W{week} D{day}
            </div>

            {/* Glow Effect for Active */}
            {state === 'active' && (
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl -z-10" />
            )}
        </motion.button>
    );
}
