import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
    days: number;
    className?: string;
}

export function StreakCounter({ days, className = '' }: StreakCounterProps) {
    const isActive = days > 0;

    return (
        <div className={`flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3 py-1.5 ${className}`}>
            <div className="relative">
                <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <Flame
                        className={`w-5 h-5 ${isActive ? 'text-orange-500 fill-orange-500/20' : 'text-muted-foreground'}`}
                    />
                </motion.div>
                {isActive && (
                    <motion.div
                        className="absolute inset-0 bg-orange-500/50 blur-md rounded-full"
                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                )}
            </div>
            <div className="flex flex-col leading-none">
                <span className={`text-sm font-bold ${isActive ? 'text-orange-100' : 'text-muted-foreground'}`}>
                    {days}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                    Day Streak
                </span>
            </div>
        </div>
    );
}
