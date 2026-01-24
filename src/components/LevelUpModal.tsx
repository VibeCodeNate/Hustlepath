import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { Button } from './Button';
import { CharacterPreview, type AvatarConfig, DEFAULT_AVATAR } from './CharacterPreview';
import { useAuth } from '../lib/auth'; // To get current avatar

interface LevelUpModalProps {
    level: number;
    isOpen: boolean;
    onClose: () => void;
}

export function LevelUpModal({ level, isOpen, onClose }: LevelUpModalProps) {
    const { profile } = useAuth();
    const avatarConfig = (profile?.avatar_config as unknown as AvatarConfig) || DEFAULT_AVATAR;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        className="relative z-10 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(234,179,8,0.2)] overflow-hidden"
                    >
                        {/* God Rays */}
                        <div className="absolute inset-0 animate-spin-slow opacity-20 pointer-events-none">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-conic from-yellow-500/20 via-transparent to-transparent" />
                        </div>

                        {/* Confetti (CSS driven potentially, or simple particles) */}

                        <div className="relative mb-6 mx-auto w-32 h-32">
                            <motion.div
                                animate={{ rotateY: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            >
                                <CharacterPreview config={avatarConfig} size="lg" className="border-4 border-yellow-500" />
                            </motion.div>
                            <div className="absolute -bottom-4 -right-4 bg-yellow-500 rounded-full p-3 border-4 border-black text-black font-bold text-xl shadow-lg">
                                {level}
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent mb-2">
                            LEVEL UP!
                        </h2>
                        <p className="text-white/60 mb-8">
                            You've reached Level {level}. Keep hustling!
                        </p>

                        <div className="space-y-3">
                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <div className="text-left">
                                    <div className="text-xs text-muted-foreground uppercase">Reward</div>
                                    <div className="font-bold">+1 New Item Unlocked</div>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full mt-8 bg-yellow-500 text-black hover:bg-yellow-400 font-bold" onClick={onClose}>
                            Awesome!
                        </Button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
