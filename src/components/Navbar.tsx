import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Sparkles, User, LogOut, Settings, ShoppingBag, Coins, Zap } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function Navbar() {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();
    const [hustleBucks, setHustleBucks] = useState(0);

    useEffect(() => {
        if (user) {
            loadHustleBucks();
        }
    }, [user]);

    const loadHustleBucks = async () => {
        if (!user) return;
        const { data } = await supabase
            .from('user_progress')
            .select('hustle_bucks')
            .eq('user_id', user.id)
            .single();

        if (data) {
            setHustleBucks(data.hustle_bucks || 0);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tighter">
                    <Sparkles className="text-primary h-5 w-5" />
                    <span>Hustle<span className="text-primary">Path</span></span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
                    <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
                    <a href="/#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
                    <a href="/#pricing" className="hover:text-foreground transition-colors">Pricing</a>
                </div>

                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            {/* PRO ONLY: Shop & Coins & Profile */}
                            {profile?.is_pro && (
                                <>
                                    {/* SHOP - Prominent Button with Animation */}
                                    <Link to="/shop">
                                        <Button
                                            size="sm"
                                            className="relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] animate-pulse-subtle"
                                        >
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Shop
                                            <Zap className="w-3 h-3 ml-1 text-yellow-300" />
                                            {/* New badge */}
                                            <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full animate-bounce">
                                                NEW
                                            </span>
                                        </Button>
                                    </Link>

                                    {/* Hustle Bucks */}
                                    <Link
                                        to="/shop"
                                        className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-1.5 hover:bg-yellow-500/20 transition-colors"
                                    >
                                        <Coins className="w-4 h-4 text-yellow-400" />
                                        <span className="text-sm font-bold text-yellow-400">{hustleBucks}</span>
                                    </Link>

                                    {/* Profile */}
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <User className="w-4 h-4" />
                                        <span className="hidden sm:inline">{profile?.username || 'Profile'}</span>
                                    </Link>
                                </>
                            )}

                            {/* Settings (Always Visible) */}
                            <Link
                                to="/settings"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                title="Settings"
                            >
                                <Settings className="w-4 h-4" />
                            </Link>

                            {/* Sign Out */}
                            <button
                                onClick={handleSignOut}
                                className="text-sm font-medium text-muted-foreground hover:text-red-400 transition-colors"
                                title="Sign Out"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                                Login
                            </Link>
                            <Link to="/assessment">
                                <Button size="sm">Start Free</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
