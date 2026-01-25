import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Share2, MoreHorizontal, Send, Repeat2, Bookmark, ChevronDown, ChevronUp } from 'lucide-react';
import { CharacterPreview, DEFAULT_AVATAR, type AvatarConfig } from './CharacterPreview';
import { LevelBadge } from './LevelBadge';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

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

interface Reply {
    id: string;
    content: string;
    author: {
        name: string;
        avatar_config: AvatarConfig;
        level: number;
    };
    created_at: string;
}

import { useSound } from '../lib/sound';

interface PostCardProps {
    post: Post;
    onLike: (postId: string) => void;
}

export function PostCard({ post, onLike }: PostCardProps) {
    const { user, profile } = useAuth();
    const [liked, setLiked] = useState(post.liked_by_user);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [isAnimating, setIsAnimating] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const { play } = useSound();

    // Reply state
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [replyText, setReplyText] = useState('');
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [submittingReply, setSubmittingReply] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments);

    const handleLike = () => {
        if (!liked) {
            setLikesCount(prev => prev + 1);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1000);
            play('success');
        } else {
            setLikesCount(prev => prev - 1);
            play('click');
        }
        setLiked(!liked);
        onLike(post.id);
    };

    const handleBookmark = () => {
        setBookmarked(!bookmarked);
        play('click');
    };

    const handleToggleReplies = async () => {
        if (!showReplies && replies.length === 0) {
            setLoadingReplies(true);
            try {
                const { data, error } = await supabase
                    .from('post_comments')
                    .select(`
                        id,
                        content,
                        created_at,
                        profiles (
                            display_name,
                            username,
                            avatar_config,
                            user_progress ( level )
                        )
                    `)
                    .eq('post_id', post.id)
                    .order('created_at', { ascending: true });

                if (error) throw error;

                const formattedReplies: Reply[] = (data || []).map((item: any) => ({
                    id: item.id,
                    content: item.content,
                    created_at: item.created_at,
                    author: {
                        name: item.profiles?.display_name || item.profiles?.username || 'Anonymous',
                        avatar_config: item.profiles?.avatar_config || DEFAULT_AVATAR,
                        level: item.profiles?.user_progress?.[0]?.level || 1
                    }
                }));

                setReplies(formattedReplies);
            } catch (err) {
                console.error('Error fetching replies:', err);
            } finally {
                setLoadingReplies(false);
            }
        }
        setShowReplies(!showReplies);
    };

    const handleSubmitReply = async () => {
        if (!replyText.trim() || !user || submittingReply) return;

        setSubmittingReply(true);
        try {
            const { data, error } = await supabase
                .from('post_comments')
                .insert({
                    post_id: post.id,
                    user_id: user.id,
                    content: replyText.trim()
                })
                .select()
                .single();

            if (error) throw error;

            // Optimistic add
            const newReply: Reply = {
                id: data.id,
                content: replyText.trim(),
                created_at: new Date().toISOString(),
                author: {
                    name: profile?.display_name || 'You',
                    avatar_config: (profile?.avatar_config as unknown as AvatarConfig) || DEFAULT_AVATAR,
                    level: 1
                }
            };

            setReplies([...replies, newReply]);
            setCommentsCount(prev => prev + 1);
            setReplyText('');
            play('success');
        } catch (err) {
            console.error('Error posting reply:', err);
        } finally {
            setSubmittingReply(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-fuchsia-500/20 transition-all duration-300 group"
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500/30 to-purple-500/30 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <CharacterPreview config={post.author.avatar_config} size="sm" className="relative rounded-full border border-white/20" />
                        <div className="absolute -bottom-1 -right-1 scale-75">
                            <LevelBadge level={post.author.level} prestige={post.author.prestige} size="sm" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-wide group-hover:text-fuchsia-300 transition-colors">{post.author.name}</h3>
                        <p className="text-xs text-white/40">
                            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </p>
                    </div>
                </div>
                <button className="text-white/40 hover:text-white hover:bg-white/5 p-2 rounded-full transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <p className="text-white/90 text-sm mb-4 leading-relaxed whitespace-pre-wrap">
                {post.content}
            </p>

            {/* Actions - Twitter Style */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                {/* Reply */}
                <button
                    onClick={handleToggleReplies}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-cyan-400 transition-colors group/btn p-2 -ml-2 rounded-full hover:bg-cyan-500/10"
                >
                    <MessageSquare className="w-5 h-5" />
                    <span className="font-medium">{commentsCount}</span>
                </button>

                {/* Repost */}
                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-green-400 transition-colors group/btn p-2 rounded-full hover:bg-green-500/10">
                    <Repeat2 className="w-5 h-5" />
                </button>

                {/* Like */}
                <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 text-sm transition-colors group/btn p-2 rounded-full ${liked ? 'text-pink-500' : 'text-white/40 hover:text-pink-400 hover:bg-pink-500/10'
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

                {/* Bookmark */}
                <button
                    onClick={handleBookmark}
                    className={`flex items-center gap-2 text-sm transition-colors p-2 rounded-full ${bookmarked ? 'text-fuchsia-400' : 'text-white/40 hover:text-fuchsia-400 hover:bg-fuchsia-500/10'
                        }`}
                >
                    <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-fuchsia-400' : ''}`} />
                </button>

                {/* Share */}
                <button className="flex items-center gap-2 text-sm text-white/40 hover:text-primary transition-colors p-2 rounded-full hover:bg-primary/10">
                    <Share2 className="w-4 h-4" />
                </button>
            </div>

            {/* Replies Section */}
            <AnimatePresence>
                {showReplies && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 mt-4 border-t border-white/5">
                            {/* Reply Input */}
                            <div className="flex gap-3 mb-4">
                                <CharacterPreview
                                    config={(profile?.avatar_config as unknown as AvatarConfig) || DEFAULT_AVATAR}
                                    size="sm"
                                    className="rounded-full border border-white/10 flex-shrink-0"
                                />
                                <div className="flex-1 relative">
                                    <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
                                        placeholder="Post your reply..."
                                        className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-4 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all"
                                    />
                                    <button
                                        onClick={handleSubmitReply}
                                        disabled={!replyText.trim() || submittingReply}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-fuchsia-500 hover:bg-fuchsia-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <Send className="w-3.5 h-3.5 text-black" />
                                    </button>
                                </div>
                            </div>

                            {/* Loading */}
                            {loadingReplies && (
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin w-5 h-5 border-2 border-fuchsia-500 border-t-transparent rounded-full" />
                                </div>
                            )}

                            {/* Replies List */}
                            <div className="space-y-3">
                                {replies.map((reply) => (
                                    <motion.div
                                        key={reply.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex gap-3 pl-2 border-l-2 border-fuchsia-500/20"
                                    >
                                        <CharacterPreview
                                            config={reply.author.avatar_config}
                                            size="sm"
                                            className="rounded-full border border-white/10 flex-shrink-0 w-8 h-8"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-sm font-medium">{reply.author.name}</span>
                                                <span className="text-xs text-white/30">
                                                    {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/80">{reply.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {replies.length === 0 && !loadingReplies && (
                                <p className="text-center text-sm text-muted-foreground py-4">
                                    No replies yet. Be the first to reply!
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Show/Hide Replies Toggle */}
            {commentsCount > 0 && (
                <button
                    onClick={handleToggleReplies}
                    className="flex items-center justify-center gap-1 w-full pt-3 text-xs text-muted-foreground hover:text-fuchsia-400 transition-colors"
                >
                    {showReplies ? (
                        <>
                            <ChevronUp className="w-4 h-4" />
                            Hide replies
                        </>
                    ) : (
                        <>
                            <ChevronDown className="w-4 h-4" />
                            Show {commentsCount} {commentsCount === 1 ? 'reply' : 'replies'}
                        </>
                    )}
                </button>
            )}
        </motion.div>
    );
}
