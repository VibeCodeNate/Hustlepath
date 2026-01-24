import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { CreatePost } from '../components/CreatePost';
import { PostCard, type Post } from '../components/PostCard';
import { Button } from '../components/Button';
import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { type AvatarConfig } from '../components/CharacterPreview';

export function Community() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch Posts
    useEffect(() => {
        if (!user) return;

        const fetchPosts = async () => {
            try {
                // Determine user's business type from profile if applicable (Phase 6)
                // For now, fetch global feed

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

                // Transform data
                const formattedPosts: Post[] = data.map((item: any) => ({
                    id: item.id,
                    content: item.content,
                    created_at: item.created_at,
                    likes: item.likes_count,
                    comments: item.comments_count,
                    liked_by_user: false, // TODO: Check likes table
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

        // Subscribe to new posts would go here (Realtime)
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

            // Optimistic Add
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
                        level: 1, // Need to fetch active progress from context to be accurate
                        prestige: 0
                    }
                };
                setPosts([newPost, ...posts]);
            }

            // Award XP for posting (Gamification)
            // TODO: Call API to award XP
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    const handleLike = async (postId: string) => {
        // Optimistic update handled in PostCard
        // Sync to DB
        console.log('Syncing like for', postId);
        // TODO: Insert/Delete from post_likes table
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 md:pt-24">
                {/* Header */}
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                            <Users className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Community Hub
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">Connect with other hustlers.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Feed */}
                    <div className="lg:col-span-3">
                        <CreatePost onSubmit={handleCreatePost} />

                        {loading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {posts.map(post => (
                                    <PostCard key={post.id} post={post} onLike={handleLike} />
                                ))}
                                {posts.length === 0 && (
                                    <div className="text-center py-10 opacity-50">
                                        No posts yet. Be the first!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block lg:col-span-1 space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h3 className="font-bold mb-4">Trending Topics</h3>
                            <div className="space-y-2">
                                <div className="text-sm text-white/60 hover:text-primary cursor-pointer">#Dropshipping</div>
                                <div className="text-sm text-white/60 hover:text-primary cursor-pointer">#SaaS</div>
                                <div className="text-sm text-white/60 hover:text-primary cursor-pointer">#ContentCreation</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
