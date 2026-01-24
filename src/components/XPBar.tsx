import { motion } from 'framer-motion';
import { getLevelProgress, getXpForNextLevel, getXpRequiredForLevel } from '../lib/gamification';

interface XPBarProps {
    xp: number;
    level: number;
    className?: string;
}

export function XPBar({ xp, level, className = '' }: XPBarProps) {
    const progress = getLevelProgress(xp, level);
    const currentLevelBaseXp = getXpRequiredForLevel(level);
    const xpInLevel = xp - currentLevelBaseXp;
    const xpNeeded = getXpForNextLevel(level);

    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                <span>Level {level}</span>
                <span>{Math.floor(xpInLevel)} / {xpNeeded} XP</span>
            </div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                {/* Background glow */}
                <div className="absolute inset-0 bg-primary/5"></div>

                {/* Progress Fill */}
                <motion.div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary relative overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-white/20 skew-x-12 translate-x-[-100%] animate-shimmer"></div>
                </motion.div>
            </div>
        </div>
    );
}
