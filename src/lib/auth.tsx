import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from './supabase';
import type { User, Session } from '@supabase/supabase-js';

interface Profile {
    id: string;
    username: string | null;
    display_name: string | null;
    avatar_config: Record<string, unknown>;
    current_hustle_id: string | null;
    current_hustle_title: string | null;
    hustle_locked_until: string | null;
    hustle_started_at: string | null;
    is_pro: boolean;
    quiz_answers: any;
}

export interface UserProgress {
    xp: number;
    level: number;
    prestige: number;
    is_master_prestige: boolean;
    streak_days: number;
    badges: string[];
    unlocked_items: string[];
    niche_id?: string;
    hustle_bucks: number;
    generated_hustles?: any; // Stores the 3 quests to persist them
    rerolls_remaining?: number;
}

interface AuthContextType {
    user: User | null;
    session: Session | null;
    profile: Profile | null;
    progress: UserProgress | null;
    loading: boolean;
    signUp: (email: string, password: string, username: string) => Promise<{ error: Error | null }>;
    signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [progress, setProgress] = useState<UserProgress | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId: string) => {
        try {
            // Create a 5s timeout promise
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Profile fetch timed out')), 5000)
            );

            // Fetch profile with timeout
            const profilePromise = supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            const { data: profileData } = await Promise.race([
                profilePromise,
                timeoutPromise
            ]) as any;

            if (profileData) {
                setProfile(profileData as Profile);
            }

            // Fetch progress with timeout
            const progressPromise = supabase
                .from('user_progress')
                .select('*')
                .eq('user_id', userId)
                .single();

            const { data: progressData } = await Promise.race([
                progressPromise,
                timeoutPromise
            ]) as any;

            if (progressData) {
                setProgress(progressData as UserProgress);
            }
        } catch (error) {
            console.warn('Error fetching profile/progress:', error);
            // Don't block auth loading on profile errors
        }
    };

    useEffect(() => {
        let mounted = true;

        // Global safety timeout
        // If Supabase init takes longer than 8 seconds, force the app to load
        // This prevents the "infinite spinner" verification issue
        const safetyTimer = setTimeout(() => {
            if (mounted && loading) {
                console.warn('Auth initialization timed out, forcing load');
                setLoading(false);
            }
        }, 8000);

        // Get initial session
        const initSession = async () => {
            try {
                // Wrap getSession in a timeout race too
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
                    setTimeout(() => resolve({ data: { session: null } }), 10000)
                );

                const { data: { session } } = await Promise.race([
                    sessionPromise,
                    timeoutPromise
                ]) as any;

                if (!mounted) return;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                }
            } catch (err) {
                console.error('Auth init error:', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (!mounted) return;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                    setProgress(null);
                }

                setLoading(false);
            }
        );

        return () => {
            mounted = false;
            subscription.unsubscribe();
            clearTimeout(safetyTimer);
        };
    }, []);

    const signUp = async (email: string, password: string, username: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    display_name: username,
                    quiz_answers: (window.history.state?.usr?.answers || window.history.state?.state?.answers || sessionStorage.getItem('hustlepath_answers') ? JSON.parse(sessionStorage.getItem('hustlepath_answers')!) : null)
                },
            },
        });
        return { error: error as Error | null };
    };

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error: error as Error | null };
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setProfile(null);
        setProgress(null);
    };

    const refreshProfile = async () => {
        if (user) {
            await fetchProfile(user.id);
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!user) return { error: new Error('Not authenticated') };

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id);

        if (!error) {
            await refreshProfile();
        }

        return { error: error as Error | null };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                profile,
                progress,
                loading,
                signUp,
                signIn,
                signOut,
                refreshProfile,
                updateProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
