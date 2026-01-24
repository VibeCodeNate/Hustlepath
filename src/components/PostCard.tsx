import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Share2, MoreHorizontal } from 'lucide-react';
import { CharacterPreview, type AvatarConfig } from './CharacterPreview';
import { LevelBadge } from './LevelBadge';
import { formatDistanceToNow } from 'date-fns';

export interface Post {
    id: string;
    author: {
        id: string;
        name: string;
        avatar_config: AvatarConfig;
        level: number;
        prestige: number;
    };
    content: string;
    likes: number;
    comments: number;
    liked_by_user: boolean;
    created_at: string;
}

import { useSound } from '../lib/sound';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
    const [liked, setLiked] = useState(post.liked_by_user);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [isAnimating, setIsAnimating] = useState(false);
    const { play } = useSound();

    const handleLike = () => {
        if (!liked) {
            setLikesCount(prev => prev + 1);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
            play('success'); // Satisfying ding for like
        } else {
            setLikesCount(prev => prev - 1);
            play('click');
        }
        setLiked(!liked);
        onLike(post.id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div className="relative">
                        <CharacterPreview config={post.author.avatar_config} size="sm" className="rounded-full border border-white/10" />
                        <div className="absolute -bottom-1 -right-1 scale-75">
                            <LevelBadge level={post.author.level} prestige={post.author.prestige} size="sm" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-wide">{post.author.name}</h3>
                        <p className="text-xs text-white/40">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <p className="text-white/90 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                {post.content}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm transition-colors group ${liked ? 'text-pink-500' : 'text-white/40 hover:text-pink-400'
                        }`}
                >
                    <div className="relative">
                        <Heart className={`w-5 h-5 ${liked ? 'fill-pink-500' : ''}`} />
                        {isAnimating && (
                            <motion.div
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                className="absolute inset-0 text-pink-500"
                            >
                                <Heart className="w-5 h-5 fill-pink-500" />
                            </motion.div>
                        )}
                    </div>
                    <span className="font-medium">{likesCount}</span>
                </button>

                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-primary transition-colors">
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{post.comments}</span>
                </button>

                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-primary transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}
