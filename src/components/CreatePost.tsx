import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon, Smile, MapPin, BarChart3 } from 'lucide-react';
import { Button } from './Button';
import { useAuth } from '../lib/auth';
import { CharacterPreview, type AvatarConfig, DEFAULT_AVATAR } from './CharacterPreview';

interface CreatePostProps {
    onSubmit: (content: string) => Promise<void>;
}

export function CreatePost({ onSubmit }: CreatePostProps) {
    const { profile } = useAuth();
    const [content, setContent] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) return;
        setLoading(true);
        await onSubmit(content);
        setContent('');
        setLoading(false);
        setIsFocused(false);
    };

    const avatarConfig = (profile?.avatar_config as unknown as AvatarConfig) || DEFAULT_AVATAR;
    const charCount = content.length;
    const maxChars = 280;

    return (
        <div className={`bg-black/40 backdrop-blur-xl border rounded-2xl p-4 mb-6 transition-all duration-300 ${isFocused
                ? 'border-fuchsia-500/30 shadow-[0_0_30px_rgba(232,121,249,0.1)]'
                : 'border-white/10 hover:border-white/20'
            }`}>
            <div className="flex gap-4">
                {/* Avatar with glow on focus */}
                <div className="relative hidden md:flex flex-shrink-0">
                    {isFocused && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500/30 to-purple-500/30 rounded-full blur" />
                    )}
                    <CharacterPreview config={avatarConfig} size="sm" className="relative rounded-full border border-white/20" />
                </div>

                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value.slice(0, maxChars))}
                        onFocus={() => setIsFocused(true)}
                        placeholder="What's happening with your hustle?"
                        className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white placeholder:text-white/30 resize-none min-h-[50px] text-base leading-relaxed"
                        rows={isFocused ? 3 : 1}
                    />

                    <AnimatePresence>
                        {isFocused && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex justify-between items-center pt-3 mt-2 border-t border-white/10"
                            >
                                {/* Media Actions */}
                                <div className="flex gap-1">
                                    <button className="p-2 hover:bg-fuchsia-500/10 rounded-full text-fuchsia-400 transition-colors">
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-fuchsia-500/10 rounded-full text-fuchsia-400 transition-colors">
                                        <Smile className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-fuchsia-500/10 rounded-full text-fuchsia-400 transition-colors">
                                        <BarChart3 className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 hover:bg-fuchsia-500/10 rounded-full text-fuchsia-400 transition-colors">
                                        <MapPin className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Submit Actions */}
                                <div className="flex items-center gap-3">
                                    {/* Character count */}
                                    <div className="flex items-center gap-2">
                                        <div className={`text-xs ${charCount > maxChars * 0.9 ? 'text-red-400' : 'text-muted-foreground'}`}>
                                            {charCount}/{maxChars}
                                        </div>
                                        <div className="w-px h-5 bg-white/10" />
                                    </div>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setIsFocused(false);
                                            setContent('');
                                        }}
                                        disabled={loading}
                                        className="text-muted-foreground hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSubmit}
                                        disabled={!content.trim() || loading}
                                        className="bg-fuchsia-500 hover:bg-fuchsia-400 text-black font-semibold px-4 shadow-[0_0_20px_rgba(232,121,249,0.3)] hover:shadow-[0_0_30px_rgba(232,121,249,0.5)] transition-all"
                                    >
                                        {loading ? (
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Post
                                                <Send className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
