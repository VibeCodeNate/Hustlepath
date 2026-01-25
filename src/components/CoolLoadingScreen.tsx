import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Wifi, ShieldCheck, Lock } from 'lucide-react';
import { useSound } from '../lib/sound';

const LOADING_STEPS = [
    { text: "Establishing secure connection...", icon: Wifi, color: "text-blue-400" },
    { text: "Decrypting user profile data...", icon: Lock, color: "text-yellow-400" },
    { text: "Analyzing market trends...", icon: TrendingUp, color: "text-green-400" }, // TrendingUp unused, fixed below
    { text: "Computing skill matches...", icon: Cpu, color: "text-cyan-400" },
    { text: "Querying side hustle database...", icon: Database, color: "text-purple-400" },
    { text: "Finalizing mission parameters...", icon: ShieldCheck, color: "text-red-400" }
];

import { TrendingUp } from 'lucide-react'; // Fix missing import

export function CoolLoadingScreen() {
    const [progress, setProgress] = useState(0);
    const [stepIndex, setStepIndex] = useState(0);
    const { play } = useSound();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const diff = Math.random() * 2;
                const newProg = Math.min(prev + diff, 100);
                return newProg;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Change text step every ~15% progress
        const newIndex = Math.floor((progress / 100) * LOADING_STEPS.length);
        if (newIndex !== stepIndex && newIndex < LOADING_STEPS.length) {
            setStepIndex(newIndex);
            play('click'); // Sound effect on step change
        }
    }, [progress]);

    const CurrentIcon = LOADING_STEPS[Math.min(stepIndex, LOADING_STEPS.length - 1)].icon;
    const currentColor = LOADING_STEPS[Math.min(stepIndex, LOADING_STEPS.length - 1)].color;

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 relative overflow-hidden rounded-3xl border border-primary/20 bg-black/40 backdrop-blur-sm">
            {/* Matrix rain effect simplified */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse" />
                <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse delay-700" />
                <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary to-transparent animate-pulse delay-300" />
            </div>

            <div className="relative z-10 w-full max-w-md text-center">
                {/* Icon Circle */}
                <motion.div
                    key={stepIndex}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`w-20 h-20 mx-auto bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}
                >
                    <CurrentIcon className={`w-10 h-10 ${currentColor} animate-pulse`} />
                </motion.div>

                {/* Progress Bar Container */}
                <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/10 relative mb-4">
                    {/* Animated Bar */}
                    <motion.div
                        className="h-full bg-primary relative"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/30 animate-[shimmer_1s_infinite]" />
                    </motion.div>
                </div>

                {/* Percentage & Terminal Text */}
                <div className="flex justify-between items-center px-1 font-mono text-sm">
                    <span className="text-primary font-bold">{Math.round(progress)}%</span>
                    <motion.span
                        key={stepIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${currentColor}`}
                    >
                        {'>'} {LOADING_STEPS[Math.min(stepIndex, LOADING_STEPS.length - 1)].text}
                    </motion.span>
                </div>

                {/* Decorative Code Bits */}
                <div className="mt-8 grid grid-cols-2 gap-4 opacity-30 text-[10px] font-mono text-left">
                    <div>
                        <div className="text-green-500">GET /api/v1/skills 200 OK</div>
                        <div className="text-blue-500">Analyzing params...</div>
                    </div>
                    <div className="text-right">
                        <div className="text-yellow-500">Latency: 24ms</div>
                        <div className="text-purple-500">Optimizing...</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
