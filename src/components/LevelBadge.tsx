import { Hexagon, Crown, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface LevelBadgeProps {
    level: number;
    prestige?: number;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function LevelBadge({ level, prestige = 0, size = 'md', className = '' }: LevelBadgeProps) {
    const sizeClasses = {
        sm: 'w-8 h-8 text-[10px]',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-lg'
    };

    const iconSizes = {
        sm: 16,
        md: 24,
        lg: 32
    };

    const isPrestige = prestige > 0;
    const prestigeColor = isPrestige ? 'text-yellow-400' : 'text-primary';
    const borderColor = isPrestige ? 'border-yellow-400/50' : 'border-primary/50';

    return (
        <div className={`relative flex items-center justify-center font-bold ${sizeClasses[size]} ${className}`}>
            {/* Background shape */}
            <motion.div
                className={`absolute inset-0 ${prestigeColor} opacity-20`}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <Hexagon size={iconSizes[size] * 2} fill="currentColor" className="opacity-20 blur-sm" />
            </motion.div>

            <div className={`relative z-10 w-full h-full flex items-center justify-center bg-black/60 rounded-full border-2 ${borderColor} backdrop-blur-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]`}>
                {isPrestige ? (
                    <div className="relative">
                        <Crown size={iconSizes[size]} className="text-yellow-400 absolute -top-4 -left-[2px]" />
                        <span className="text-white">{level}</span>
                    </div>
                ) : (
                    <span className="text-white">{level}</span>
                )}
            </div>

            {/* Prestige Star if applicable */}
            {isPrestige && (
                <div className="absolute -bottom-1 bg-black rounded-full p-0.5 border border-yellow-400/50">
                    <Star size={10} className="text-yellow-400 fill-yellow-400" />
                </div>
            )}
        </div>
    );
}
