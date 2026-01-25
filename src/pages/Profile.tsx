import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';

import { ArrowLeft, Settings, UserPlus, UserMinus, Ban, Search, Trophy, Coins, Calendar, Users, MessageSquare, Image, Shield, Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useSound } from '../lib/sound';
import { NICHE_INFO } from '../lib/nicheRoadmaps';
import { supabase } from '../lib/supabase';

interface UserProfile {
    id: string;
    username: string;
    avatar_url?: string;
    current_hustle_id?: string;
    created_at?: string;
}

interface UserProgress {
    level: number;
    xp: number;
    hustle_bucks: number;
    current_streak: number;
}

interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: string;
}

// Pre-defined badges
const ALL_BADGES: Badge[] = [
    { id: 'first_login', name: 'First Steps', icon: '👟', description: 'Completed first login', earnedAt: '' },
    { id: 'week_1', name: 'Week 1 Complete', icon: '🏆', description: 'Completed Week 1', earnedAt: '' },
    { id: 'streak_7', name: '7 Day Streak', icon: '🔥', description: 'Maintained 7 day streak', earnedAt: '' },
    { id: 'streak_30', name: 'Month Warrior', icon: '💪', description: '30 day streak', earnedAt: '' },
    { id: 'first_earnings', name: 'First Earnings', icon: '💵', description: 'Logged first earning', earnedAt: '' },
    { id: 'community_post', name: 'Community Voice', icon: '📣', description: 'First community post', earnedAt: '' },
    { id: 'level_5', name: 'Rising Star', icon: '⭐', description: 'Reached Level 5', earnedAt: '' },
    { id: 'level_10', name: 'Grinder', icon: '💎', description: 'Reached Level 10', earnedAt: '' },
    { id: 'level_25', name: 'Hustler', icon: '🚀', description: 'Reached Level 25', earnedAt: '' },
    { id: 'level_50', name: 'Legend', icon: '👑', description: 'Reached Level 50', earnedAt: '' },
];

// Rank tiers
const RANKS = [
    { name: 'Rookie', minLevel: 1, color: 'gray' },
    { name: 'Apprentice', minLevel: 5, color: 'green' },
    { name: 'Hustler', minLevel: 10, color: 'blue' },
    { name: 'Grinder', minLevel: 20, color: 'purple' },
    { name: 'Expert', minLevel: 35, color: 'orange' },
    { name: 'Master', minLevel: 50, color: 'red' },
    { name: 'Legend', minLevel: 75, color: 'yellow' },
    { name: 'Champion', minLevel: 100, color: 'cyan' },
];

export function Profile() {
    const navigate = useNavigate();
    const { userId } = useParams<{ userId?: string }>();
    const { user } = useAuth();
    const { play } = useSound();

    const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [ownedItems, setOwnedItems] = useState<string[]>([]);
    const [earnedBadges, setEarnedBadges] = useState<string[]>(['first_login']);
    const [followers, setFollowers] = useState<string[]>([]);
    const [following, setFollowing] = useState<string[]>([]);
    const [blocked, setBlocked] = useState<string[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
    const [showSearch, setShowSearch] = useState(false);

    const isOwnProfile = !userId || userId === user?.id;
    const profileId = userId || user?.id;

    // Load profile data
    useEffect(() => {
        if (!profileId) return;
        loadProfileData();
    }, [profileId]);

    const loadProfileData = async () => {
        if (!profileId) return;
        setLoading(true);

        try {
            // Load profile
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', profileId)
                .single();

            if (profileData) {
                setViewedProfile(profileData);
            }

            // Load progress
            const { data: progressData } = await supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', profileId)
                .single();

            if (progressData) {
                setProgress({
                    level: progressData.level || 1,
                    xp: progressData.xp || 0,
                    hustle_bucks: progressData.hustle_bucks || 0,
                    current_streak: progressData.current_streak || 0
                });
            }

            // Load posts by this user
            const { data: postsData } = await supabase
                .from('community_posts')
                .select('*')
                .eq('user_id', profileId)
                .order('created_at', { ascending: false })
                .limit(5);

            if (postsData) {
                setPosts(postsData);
            }

            // Load owned items, followers, etc from localStorage
            if (profileId === user?.id) {
                const owned = localStorage.getItem(`hustlepath_owned_items_${profileId}`);
                if (owned) setOwnedItems(JSON.parse(owned));

                const social = localStorage.getItem(`hustlepath_social_${profileId}`);
                if (social) {
                    const { followers: f, following: fw, blocked: b } = JSON.parse(social);
                    setFollowers(f || []);
                    setFollowing(fw || []);
                    setBlocked(b || []);
                }

                const badges = localStorage.getItem(`hustlepath_badges_${profileId}`);
                if (badges) setEarnedBadges(JSON.parse(badges));
            }
        } catch (err) {
            console.error('Error loading profile:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!user || !profileId || isOwnProfile) return;

        const newFollowing = following.includes(profileId)
            ? following.filter(id => id !== profileId)
            : [...following, profileId];

        setFollowing(newFollowing);
        localStorage.setItem(`hustlepath_social_${user.id}`, JSON.stringify({
            followers,
            following: newFollowing,
            blocked
        }));

        play(following.includes(profileId) ? 'click' : 'success');
    };

    const handleBlock = async () => {
        if (!user || !profileId || isOwnProfile) return;

        const newBlocked = blocked.includes(profileId)
            ? blocked.filter(id => id !== profileId)
            : [...blocked, profileId];

        setBlocked(newBlocked);
        localStorage.setItem(`hustlepath_social_${user.id}`, JSON.stringify({
            followers,
            following,
            blocked: newBlocked
        }));

        play('click');
    };

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        const { data } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .ilike('username', `%${query}%`)
            .limit(10);

        if (data) {
            setSearchResults(data);
        }
    };

    const getRank = (level: number) => {
        return RANKS.reduce((acc, rank) => level >= rank.minLevel ? rank : acc, RANKS[0]);
    };

    const nicheInfo = NICHE_INFO.find(n => n.id === viewedProfile?.current_hustle_id) || NICHE_INFO[0];
    const rank = getRank(progress?.level || 1);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const daysSinceJoined = viewedProfile?.created_at
        ? Math.floor((Date.now() - new Date(viewedProfile.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Button>

                    {/* Search */}
                    <div className="relative">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {showSearch && (
                            <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl p-4 shadow-2xl z-50">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    placeholder="Search users..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary/50"
                                    autoFocus
                                />
                                {searchResults.length > 0 && (
                                    <div className="mt-2 space-y-1 max-h-60 overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.id}
                                                onClick={() => {
                                                    navigate(`/profile/${result.id}`);
                                                    setShowSearch(false);
                                                    setSearchQuery('');
                                                }}
                                                className="w-full flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg text-left"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                                    {result.username?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <span>{result.username}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Header Card */}
                <div className="bg-gradient-to-r from-fuchsia-900/50 via-purple-900/50 to-indigo-900/50 border border-white/10 rounded-2xl overflow-hidden mb-6">
                    <div className="flex flex-col md:flex-row">
                        {/* Left: Avatar & Basic Info */}
                        <div className="p-6 bg-black/30 flex flex-col items-center text-center md:w-64">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-purple-600 p-1">
                                    <div className="w-full h-full rounded-lg bg-zinc-900 flex items-center justify-center text-3xl">
                                        {viewedProfile?.avatar_url || '👤'}
                                    </div>
                                </div>
                                {isOwnProfile && (
                                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <h1 className="text-xl font-bold">{viewedProfile?.username || 'User'}</h1>
                            <p className="text-sm text-muted-foreground">@{viewedProfile?.username?.toLowerCase().replace(/\s/g, '')}</p>

                            {isOwnProfile ? (
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/character')}
                                    className="mt-4 w-full"
                                >
                                    <Settings className="w-4 h-4 mr-2" />
                                    Setup
                                </Button>
                            ) : (
                                <div className="flex gap-2 mt-4">
                                    <Button
                                        size="sm"
                                        onClick={handleFollow}
                                        className={following.includes(profileId!) ? 'bg-white/10' : 'bg-primary text-black'}
                                    >
                                        {following.includes(profileId!) ? (
                                            <><UserMinus className="w-4 h-4 mr-1" /> Unfollow</>
                                        ) : (
                                            <><UserPlus className="w-4 h-4 mr-1" /> Follow</>
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleBlock}
                                        className="text-red-400 hover:bg-red-500/20"
                                    >
                                        <Ban className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Right: Character Display */}
                        <div className="flex-1 p-6 relative min-h-[300px] flex items-center justify-center">
                            {/* Large username display */}
                            <h2 className="absolute right-6 top-1/2 -translate-y-1/2 text-6xl md:text-8xl font-black text-white/10 tracking-widest select-none" style={{ writingMode: 'vertical-rl' }}>
                                {viewedProfile?.username?.toUpperCase().slice(0, 6) || 'USER'}
                            </h2>

                            {/* Character placeholder */}
                            <div className="text-9xl">👤</div>
                        </div>

                        {/* Stats Sidebar */}
                        <div className="md:w-72 p-6 bg-black/30 space-y-4">
                            {/* Level & Rank */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Level</span>
                                <span className="text-2xl font-bold">{progress?.level || 1}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Shield className={`w-5 h-5 text-${rank.color}-400`} />
                                <span className="font-bold">{rank.name}</span>
                                <span className="text-xs text-muted-foreground">{progress?.xp} XP</span>
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm">Badges</span>
                                    <span className="text-sm font-bold">{earnedBadges.length}</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {ALL_BADGES.slice(0, 4).map((badge) => (
                                        <div
                                            key={badge.id}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${earnedBadges.includes(badge.id)
                                                ? 'bg-yellow-500/20 border border-yellow-500/50'
                                                : 'bg-white/5 grayscale opacity-30'
                                                }`}
                                            title={badge.name}
                                        >
                                            {badge.icon}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Coins className="w-4 h-4 text-yellow-400" /> Hustle Bucks
                                    </span>
                                    <span className="font-bold text-yellow-400">{progress?.hustle_bucks || 0}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="w-4 h-4" /> Days Active
                                    </span>
                                    <span className="font-bold">{daysSinceJoined}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Followers
                                    </span>
                                    <span className="font-bold">{followers.length}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        {nicheInfo.icon} Side Hustle
                                    </span>
                                    <span className="font-bold text-sm">{nicheInfo.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {/* Inventory */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Image className="w-5 h-5 text-primary" />
                            Inventory
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {ownedItems.slice(0, 8).map((_, i) => (
                                <div key={i} className="aspect-square bg-white/5 rounded-lg flex items-center justify-center text-2xl">
                                    {['👔', '💇', '💎', '🎨'][i % 4]}
                                </div>
                            ))}
                            {ownedItems.length === 0 && (
                                <div className="col-span-4 text-center py-8 text-muted-foreground">
                                    No items yet
                                </div>
                            )}
                        </div>
                        {ownedItems.length > 8 && (
                            <p className="text-sm text-muted-foreground mt-3 text-center">
                                +{ownedItems.length - 8} more
                            </p>
                        )}
                    </div>

                    {/* Recent Posts */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-cyan-400" />
                            Recent Posts
                        </h3>
                        <div className="space-y-3">
                            {posts.length > 0 ? posts.slice(0, 3).map((post, i) => (
                                <div key={i} className="p-3 bg-white/5 rounded-lg">
                                    <p className="text-sm line-clamp-2">{post.content}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No posts yet
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-400" />
                            All Badges
                        </h3>
                        <div className="grid grid-cols-5 gap-2">
                            {ALL_BADGES.map((badge) => (
                                <div
                                    key={badge.id}
                                    className={`aspect-square rounded-lg flex items-center justify-center text-2xl ${earnedBadges.includes(badge.id)
                                        ? 'bg-yellow-500/20 border border-yellow-500/50'
                                        : 'bg-white/5 grayscale opacity-30'
                                        }`}
                                    title={`${badge.name}: ${badge.description}`}
                                >
                                    {badge.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
