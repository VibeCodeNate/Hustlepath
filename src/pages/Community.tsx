import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { CreatePost } from '../components/CreatePost';
import { PostCard, type Post } from '../components/PostCard';
import { Button } from '../components/Button';
import { ArrowLeft, Users, Loader2, TrendingUp, Sparkles, Flame, Hash, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { type AvatarConfig } from '../components/CharacterPreview';
import { motion } from 'framer-motion';

export function Community() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'trending'>('for-you');

    // Fetch Posts
    useEffect(() => {
        if (!user) return;

        const fetchPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from('community_posts')
                    .select(`
                        id,
                        content,
                        created_at,
                        likes_count,
                        comments_count,
                        profiles (
                            id,
                            username,
                            display_name,
                            avatar_config,
                            user_progress ( level, prestige )
                        )
                    `)
                    .order('created_at', { ascending: false })
                    .limit(20);

                if (error) throw error;

                const formattedPosts: Post[] = data.map((item: any) => ({
                    id: item.id,
                    content: item.content,
                    created_at: item.created_at,
                    likes: item.likes_count,
                    comments: item.comments_count,
                    liked_by_user: false,
                    author: {
                        id: item.profiles.id,
                        name: item.profiles.display_name || item.profiles.username || 'Unknown',
                        avatar_config: item.profiles.avatar_config as AvatarConfig,
                        level: item.profiles.user_progress?.[0]?.level || 1,
                        prestige: item.profiles.user_progress?.[0]?.prestige || 0,
                    }
                }));

                setPosts(formattedPosts);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user]);

    const handleCreatePost = async (content: string) => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('community_posts')
                .insert({
                    user_id: user.id,
                    content: content
                })
                .select(`
                    id,
                    content,
                    created_at,
                    likes_count,
                    comments_count,
                    profiles (
                        id,
                        username,
                        display_name,
                        avatar_config,
                        user_progress ( level, prestige )
                    )
                `)
                .single();

            if (error) throw error;

            if (data) {
                const newPost: Post = {
                    id: data.id,
                    content: data.content,
                    created_at: data.created_at,
                    likes: 0,
                    comments: 0,
                    liked_by_user: false,
                    author: {
                        id: profile!.id,
                        name: profile!.display_name || 'You',
                        avatar_config: profile!.avatar_config as unknown as AvatarConfig,
                        level: 1,
                        prestige: 0
                    }
                };
                setPosts([newPost, ...posts]);
            }
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    const handleLike = async (postId: string) => {
        console.log('Syncing like for', postId);
    };

    const trendingTopics = [
        { tag: 'Dropshipping', posts: 1245 },
        { tag: 'SaaS', posts: 892 },
        { tag: 'ContentCreation', posts: 756 },
        { tag: 'Freelancing', posts: 643 },
        { tag: 'CryptoHustles', posts: 521 }
    ];

    return (
        <div className="min-h-screen bg-background pb-20 overflow-hidden">
            <Navbar />

            {/* 3D Background Effects */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-0 left-0 w-[400px] h-[400px] bg-fuchsia-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{ y: [0, 40, 0], x: [0, -20, 0] }}
                    transition={{ duration: 12, repeat: Infinity, delay: 1 }}
                    className="absolute top-1/3 right-0 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full"
                />
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-0 left-1/3 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="container mx-auto px-4 pt-20 md:pt-24 relative z-10">
                {/* Header - Twitter/X Style */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 md:gap-4 mb-6"
                >
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="hover:bg-white/5">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="flex-1">
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/30 to-purple-500/20 flex items-center justify-center border border-fuchsia-500/30">
                                <Users className="w-5 h-5 text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.5)]" />
                            </div>
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-200 to-white">
                                Community Hub
                            </span>
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground mt-1">Connect with other hustlers.</p>
                    </div>
                </motion.div>

                {/* Tab Navigation - Twitter Style */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex border-b border-white/10 mb-6"
                >
                    {[
                        { id: 'for-you', label: 'For You', icon: Sparkles },
                        { id: 'following', label: 'Following', icon: Users },
                        { id: 'trending', label: 'Trending', icon: Flame }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-4 px-4 text-sm font-medium transition-all relative group ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'text-muted-foreground hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-fuchsia-400' : ''}`} />
                                {tab.label}
                            </span>
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Main Feed */}
                    <div className="lg:col-span-3">
                        {/* Create Post - Enhanced */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <CreatePost onSubmit={handleCreatePost} />
                        </motion.div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20">
                                <Loader2 className="w-10 h-10 text-fuchsia-400 animate-spin mb-4" />
                                <p className="text-muted-foreground">Loading the feed...</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="space-y-4"
                            >
                                {posts.map((post, i) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                    >
                                        <PostCard post={post} onLike={handleLike} />
                                    </motion.div>
                                ))}
                                {posts.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-center py-20 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10"
                                    >
                                        <Sparkles className="w-12 h-12 text-fuchsia-400/50 mx-auto mb-4" />
                                        <p className="text-muted-foreground text-lg mb-2">No posts yet</p>
                                        <p className="text-sm text-muted-foreground/60">Be the first to share your hustle journey!</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar - Twitter Style */}
                    <div className="hidden lg:block lg:col-span-1 space-y-4">
                        {/* Search */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
                        >
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search HustlePath"
                                    className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-fuchsia-500/50 focus:ring-1 focus:ring-fuchsia-500/20 transition-all"
                                />
                            </div>
                        </motion.div>

                        {/* Trending Topics */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 relative overflow-hidden group"
                        >
                            <div className="absolute -top-10 -right-10 w-20 h-20 bg-fuchsia-500/10 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />

                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-fuchsia-400" />
                                Trending
                            </h3>
                            <div className="space-y-3">
                                {trendingTopics.map((topic, i) => (
                                    <motion.div
                                        key={topic.tag}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + (i * 0.05) }}
                                        className="group/topic cursor-pointer hover:bg-white/5 -mx-2 px-2 py-2 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-fuchsia-400/60" />
                                            <span className="text-sm font-medium text-white group-hover/topic:text-fuchsia-400 transition-colors">
                                                {topic.tag}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground ml-6">{topic.posts.toLocaleString()} posts</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Who to Follow (placeholder) */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
                        >
                            <h3 className="font-bold text-lg mb-4">Who to Follow</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Sarah K.', handle: '@sarahbuilds', hustle: 'SaaS Founder' },
                                    { name: 'Mike R.', handle: '@mikehustle', hustle: 'Dropshipper' },
                                    { name: 'Jamie L.', handle: '@jamiecreates', hustle: 'Content Creator' }
                                ].map((user, i) => (
                                    <motion.div
                                        key={user.handle}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 + (i * 0.05) }}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-500/30 to-purple-500/20 border border-fuchsia-500/20" />
                                            <div>
                                                <p className="text-sm font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.hustle}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" variant="outline" className="text-xs h-8 border-fuchsia-500/30 hover:bg-fuchsia-500/10 hover:text-fuchsia-400">
                                            Follow
                                        </Button>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
