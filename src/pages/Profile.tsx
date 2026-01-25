import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { PostCard, type Post } from '../components/PostCard';
import { Button } from '../components/Button';
import { ArrowLeft, Settings, UserPlus, UserMinus, Ban, Trophy, Coins, Calendar, Users, Shield, Edit2, X, Image } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth, type UserProgress } from '../lib/auth';
import { useSound } from '../lib/sound';
import { NICHE_INFO } from '../lib/nicheRoadmaps';
import { supabase } from '../lib/supabase';

interface UserProfile {
    id: string;
    username: string;
    avatar_url?: string;
    current_hustle_id?: string;
    created_at?: string;
    calling_card?: string;
    profile_pic?: string;
}



interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedAt: string;
}

// Pre-defined calling cards
const CALLING_CARDS = [
    { id: 'hustler', name: 'Hustler Certified', gradient: 'from-yellow-600 to-orange-600' },
    { id: 'grinder', name: 'Grind Never Stops', gradient: 'from-red-600 to-pink-600' },
    { id: 'boss', name: 'Boss Mode', gradient: 'from-purple-600 to-indigo-600' },
    { id: 'legend', name: 'Legend Status', gradient: 'from-cyan-600 to-blue-600' },
    { id: 'empire', name: 'Empire Builder', gradient: 'from-green-600 to-teal-600' },
    { id: 'diamond', name: 'Diamond Hands', gradient: 'from-blue-400 to-purple-400' },
    { id: 'moon', name: 'To The Moon', gradient: 'from-indigo-600 to-purple-600' },
    { id: 'fire', name: 'On Fire', gradient: 'from-orange-500 to-red-500' },
    { id: 'default', name: '', gradient: 'from-fuchsia-900/50 via-purple-900/50 to-indigo-900/50' },
];

// Pre-defined profile pictures
const PROFILE_PICS = [
    '👤', '😎', '🧑‍💼', '👨‍💻', '👩‍💻', '🦁', '🐺', '🦅', '🔥', '💎',
    '🚀', '⚡', '🎯', '💰', '👑', '🏆', '💪', '🎮', '🌟', '✨'
];

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
    const [posts, setPosts] = useState<Post[]>([]);
    const [reposts, setReposts] = useState<Post[]>([]);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'posts' | 'reposts' | 'saved'>('posts');

    // Modal states
    const [showProfilePicModal, setShowProfilePicModal] = useState(false);
    const [showCallingCardModal, setShowCallingCardModal] = useState(false);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);
    const [followerProfiles, setFollowerProfiles] = useState<UserProfile[]>([]);
    const [followingProfiles, setFollowingProfiles] = useState<UserProfile[]>([]);

    // Local customization
    const [selectedProfilePic, setSelectedProfilePic] = useState('👤');
    const [selectedCallingCard, setSelectedCallingCard] = useState('default');

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
                    streak_days: progressData.streak_days || 0,
                    prestige: progressData.prestige || 0,
                    is_master_prestige: progressData.is_master_prestige || false,
                    badges: progressData.badges || [],
                    unlocked_items: progressData.unlocked_items || [],
                    niche_id: progressData.niche_id || undefined
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
                const formattedPosts: Post[] = postsData.map((item: any) => ({
                    id: item.id,
                    content: item.content,
                    created_at: item.created_at,
                    likes: item.likes_count,
                    comments: item.comments_count,
                    liked_by_user: false,
                    author: {
                        id: profileData.id,
                        name: profileData.display_name || profileData.username || 'Unknown',
                        avatar_config: profileData.avatar_config || {},
                        level: progressData?.level || 1,
                        prestige: progressData?.prestige || 0,
                    }
                }));

                setPosts(formattedPosts.filter(p => !p.content.startsWith('🔄 Reposted from ')));
                setReposts(formattedPosts.filter(p => p.content.startsWith('🔄 Reposted from ')));
            }

            // Load saved posts if own profile
            if (profileId === user?.id) {
                const savedIds = JSON.parse(localStorage.getItem(`hustlepath_saved_posts_${profileId}`) || '[]');
                if (savedIds.length > 0) {
                    const { data: savedData } = await supabase
                        .from('community_posts')
                        .select(`
                            id, content, created_at, likes_count, comments_count,
                            profiles (id, username, display_name, avatar_config, user_progress (level, prestige))
                        `)
                        .in('id', savedIds);

                    if (savedData) {
                        const formattedSaved: Post[] = savedData.map((item: any) => ({
                            id: item.id,
                            content: item.content,
                            created_at: item.created_at,
                            likes: item.likes_count,
                            comments: item.comments_count,
                            liked_by_user: false,
                            author: {
                                id: item.profiles.id,
                                name: item.profiles.display_name || item.profiles.username || 'Unknown',
                                avatar_config: item.profiles.avatar_config || {},
                                level: item.profiles.user_progress?.[0]?.level || 1,
                                prestige: item.profiles.user_progress?.[0]?.prestige || 0,
                            }
                        }));
                        setSavedPosts(formattedSaved);
                    }
                }
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

                // Load customization
                const customization = localStorage.getItem(`hustlepath_customization_${profileId}`);
                if (customization) {
                    const { profilePic, callingCard } = JSON.parse(customization);
                    setSelectedProfilePic(profilePic || '👤');
                    setSelectedCallingCard(callingCard || 'default');
                }
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

    const saveCustomization = (profilePic: string, callingCard: string) => {
        if (!user) return;
        localStorage.setItem(`hustlepath_customization_${user.id}`, JSON.stringify({
            profilePic,
            callingCard
        }));
        setSelectedProfilePic(profilePic);
        setSelectedCallingCard(callingCard);
        play('success');
    };

    const loadFollowerProfiles = async () => {
        if (followers.length === 0) return;
        const { data } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', followers);
        if (data) setFollowerProfiles(data as UserProfile[]);
    };

    const loadFollowingProfiles = async () => {
        if (following.length === 0) return;
        const { data } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', following);
        if (data) setFollowingProfiles(data as UserProfile[]);
    };

    const handleRepost = async (post: any) => {
        if (!user) return;
        try {
            await supabase.from('community_posts').insert({
                user_id: user.id,
                content: `🔄 Reposted from @${viewedProfile?.username}:\n\n${post.content}`,
                post_type: 'repost'
            });
            play('success');
        } catch (err) {
            console.error('Repost failed:', err);
        }
    };

    const getRank = (level: number) => {
        return RANKS.reduce((acc, rank) => level >= rank.minLevel ? rank : acc, RANKS[0]);
    };

    const nicheInfo = NICHE_INFO.find(n => n.id === viewedProfile?.current_hustle_id) || NICHE_INFO[0];
    const rank = getRank(progress?.level || 1);
    const currentCard = CALLING_CARDS.find(c => c.id === selectedCallingCard) || CALLING_CARDS[8];

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

            {/* Profile Pic Modal */}
            {showProfilePicModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowProfilePicModal(false)}>
                    <div className="bg-zinc-900 border border-white/20 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Choose Profile Picture</h2>
                            <button onClick={() => setShowProfilePicModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-5 gap-3">
                            {PROFILE_PICS.map((pic) => (
                                <button
                                    key={pic}
                                    onClick={() => {
                                        saveCustomization(pic, selectedCallingCard);
                                        setShowProfilePicModal(false);
                                    }}
                                    className={`aspect-square rounded-xl flex items-center justify-center text-3xl transition-all ${selectedProfilePic === pic
                                        ? 'bg-primary/30 border-2 border-primary scale-110'
                                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {pic}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Calling Card Modal */}
            {showCallingCardModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowCallingCardModal(false)}>
                    <div className="bg-zinc-900 border border-white/20 rounded-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Choose Calling Card</h2>
                            <button onClick={() => setShowCallingCardModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {CALLING_CARDS.filter(c => c.id !== 'default').map((card) => (
                                <button
                                    key={card.id}
                                    onClick={() => {
                                        saveCustomization(selectedProfilePic, card.id);
                                        setShowCallingCardModal(false);
                                    }}
                                    className={`p-4 rounded-xl bg-gradient-to-r ${card.gradient} text-center font-bold transition-all ${selectedCallingCard === card.id
                                        ? 'ring-2 ring-primary scale-105'
                                        : 'hover:scale-105'
                                        }`}
                                >
                                    {card.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Followers Modal */}
            {showFollowersModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowFollowersModal(false)}>
                    <div className="bg-zinc-900 border border-white/20 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Followers ({followers.length})</h2>
                            <button onClick={() => setShowFollowersModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {followerProfiles.length > 0 ? followerProfiles.map((profile) => (
                                <button
                                    key={profile.id}
                                    onClick={() => {
                                        navigate(`/profile/${profile.id}`);
                                        setShowFollowersModal(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 text-left"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                                        {profile.avatar_url || '👤'}
                                    </div>
                                    <span className="font-medium">{profile.username}</span>
                                </button>
                            )) : (
                                <p className="text-center text-muted-foreground py-8">No followers yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Following Modal */}
            {showFollowingModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowFollowingModal(false)}>
                    <div className="bg-zinc-900 border border-white/20 rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold">Following ({following.length})</h2>
                            <button onClick={() => setShowFollowingModal(false)} className="p-2 hover:bg-white/10 rounded-full">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                            {followingProfiles.length > 0 ? followingProfiles.map((profile) => (
                                <button
                                    key={profile.id}
                                    onClick={() => {
                                        navigate(`/profile/${profile.id}`);
                                        setShowFollowingModal(false);
                                    }}
                                    className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 text-left"
                                >
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-xl">
                                        {profile.avatar_url || '👤'}
                                    </div>
                                    <span className="font-medium">{profile.username}</span>
                                </button>
                            )) : (
                                <p className="text-center text-muted-foreground py-8">Not following anyone yet</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 pt-20 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back
                    </Button>
                </div>

                {/* Profile Header Card with Calling Card */}
                <div className={`bg-gradient-to-r ${currentCard.gradient} border border-white/10 rounded-2xl overflow-hidden mb-6`}>
                    {/* Calling Card Edit Button */}
                    {isOwnProfile && (
                        <button
                            onClick={() => setShowCallingCardModal(true)}
                            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-black/50 rounded-lg z-10"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}

                    <div className="flex flex-col md:flex-row">
                        {/* Left: Avatar & Basic Info */}
                        <div className="p-6 bg-black/30 flex flex-col items-center text-center md:w-64">
                            <div className="relative mb-4">
                                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary to-purple-600 p-1">
                                    <div className="w-full h-full rounded-lg bg-zinc-900 flex items-center justify-center text-4xl">
                                        {selectedProfilePic}
                                    </div>
                                </div>
                                {isOwnProfile && (
                                    <button
                                        onClick={() => setShowProfilePicModal(true)}
                                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black"
                                    >
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

                        {/* Right: Character Display - NO USERNAME TEXT */}
                        <div className="flex-1 p-6 relative min-h-[300px] flex items-center justify-center">
                            {/* Character placeholder */}
                            <div className="text-9xl">{selectedProfilePic}</div>
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
                                {/* Clickable Followers */}
                                <button
                                    onClick={() => {
                                        loadFollowerProfiles();
                                        setShowFollowersModal(true);
                                    }}
                                    className="flex items-center justify-between text-sm w-full hover:bg-white/5 rounded p-1 -m-1"
                                >
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Followers
                                    </span>
                                    <span className="font-bold text-primary">{followers.length}</span>
                                </button>
                                {/* Clickable Following */}
                                <button
                                    onClick={() => {
                                        loadFollowingProfiles();
                                        setShowFollowingModal(true);
                                    }}
                                    className="flex items-center justify-between text-sm w-full hover:bg-white/5 rounded p-1 -m-1"
                                >
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Users className="w-4 h-4" /> Following
                                    </span>
                                    <span className="font-bold text-cyan-400">{following.length}</span>
                                </button>
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

                    {/* Main Content Tabs - Twitter Style */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex border-b border-white/10 mb-2">
                            <button
                                onClick={() => setActiveTab('posts')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'posts' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
                            >
                                Posts
                            </button>
                            <button
                                onClick={() => setActiveTab('reposts')}
                                className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'reposts' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
                            >
                                Reposts
                            </button>
                            {isOwnProfile && (
                                <button
                                    onClick={() => setActiveTab('saved')}
                                    className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'saved' ? 'border-primary text-white' : 'border-transparent text-muted-foreground hover:bg-white/5'}`}
                                >
                                    Saved
                                </button>
                            )}
                        </div>

                        <div className="space-y-4">
                            {activeTab === 'posts' && (
                                posts.length > 0 ? posts.map(post => (
                                    <PostCard key={post.id} post={post} onLike={() => { }} onRepost={handleRepost} />
                                )) : <div className="text-center py-10 text-muted-foreground bg-white/5 rounded-xl">No posts yet</div>
                            )}

                            {activeTab === 'reposts' && (
                                reposts.length > 0 ? reposts.map(post => (
                                    <PostCard key={post.id} post={post} onLike={() => { }} onRepost={handleRepost} />
                                )) : <div className="text-center py-10 text-muted-foreground bg-white/5 rounded-xl">No reposts yet</div>
                            )}

                            {activeTab === 'saved' && isOwnProfile && (
                                savedPosts.length > 0 ? savedPosts.map(post => (
                                    <PostCard key={post.id} post={post} onLike={() => { }} onRepost={handleRepost} isBookmarked={true} />
                                )) : <div className="text-center py-10 text-muted-foreground bg-white/5 rounded-xl">No saved posts</div>
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
