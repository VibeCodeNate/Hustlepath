import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Image as ImageIcon } from 'lucide-react';
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

    return (
        <div className={`bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 transition-all ${isFocused ? 'ring-1 ring-primary/50 bg-white/10' : ''}`}>
            <div className="flex gap-4">
                <CharacterPreview config={avatarConfig} size="sm" className="hidden md:flex rounded-full border border-white/10 flex-shrink-0" />

                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        placeholder="Share your progress, wins, or questions..."
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-white/30 resize-none min-h-[40px]"
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
                                <div className="flex gap-2">
                                    <button className="p-2 hover:bg-white/10 rounded-full text-primary transition-colors">
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsFocused(false)}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSubmit}
                                        disabled={!content.trim() || loading}
                                    >
                                        {loading ? 'Posting...' : 'Post'}
                                        <Send className="w-4 h-4 ml-2" />
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
