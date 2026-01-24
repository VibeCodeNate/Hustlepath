import { Link, useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Sparkles, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function Navbar() {
    const { user, profile, signOut } = useAuth();
    const navigate = useNavigate();

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

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">{profile?.username || 'Dashboard'}</span>
                            </Link>
                            <Link
                                to="/settings"
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                title="Settings"
                            >
                                <Settings className="w-4 h-4" />
                            </Link>
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
                            <Link to="/signup" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
