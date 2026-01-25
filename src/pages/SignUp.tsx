import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Lock,
    ArrowRight,
    Sparkles,
    Shield,
    Rocket,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';

interface SignUpProps {
    initialMode?: 'login' | 'signup';
    allowToggle?: boolean;
}

export function SignUp({ initialMode = 'signup', allowToggle = true }: SignUpProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const { signUp, signIn } = useAuth();

    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Get the redirect path and state from location
    const { from, ...forwardState } = (location.state as { from?: string;[key: string]: any }) || {};
    const redirectPath = from || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            if (isForgotPassword) {
                // Handle password reset
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                });
                if (error) throw error;
                setSuccessMessage('Password reset email sent! Check your inbox.');
                setLoading(false);
                return;
            } else if (isLogin) {
                const { error } = await signIn(email, password);
                if (error) throw error;
            } else {
                if (!username.trim()) {
                    throw new Error('Username is required');
                }
                if (username.length < 3) {
                    throw new Error('Username must be at least 3 characters');
                }

                // Check if username exists
                const { data: existingUser } = await supabase
                    .from('profiles')
                    .select('username')
                    .eq('username', username)
                    .single();

                if (existingUser) {
                    throw new Error('Username is already taken');
                }

                const { error } = await signUp(email, password, username);
                if (error) throw error;
            }
            // Navigate to original destination with preserved state (e.g. quiz answers)
            navigate(redirectPath, { replace: true, state: forwardState });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none opacity-30" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none opacity-30" />

            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(190,242,100,0.3)]">
                            <Sparkles className="w-8 h-8 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            {isLogin ? 'Welcome Back, Hustler' : 'Join the Mission'}
                        </h1>
                        <p className="text-white/60">
                            {isLogin
                                ? 'Sign in to continue your side hustle journey'
                                : 'Create your account to unlock your personalized roadmap'}
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username (signup only) */}
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Choose your hustler name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            required={!isLogin}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-white/70 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password (not shown for forgot password) */}
                            {!isForgotPassword && (
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            required={!isForgotPassword}
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Success Message */}
                            {successMessage && (
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-green-400 text-sm">
                                    {successMessage}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 animate-spin" />
                                        {isForgotPassword ? 'Sending...' : isLogin ? 'Signing in...' : 'Creating account...'}
                                    </>
                                ) : (
                                    <>
                                        {isForgotPassword ? 'Send Reset Email' : isLogin ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="ml-2" />
                                    </>
                                )}
                            </Button>

                            {/* Forgot Password Link (login mode only) */}
                            {isLogin && !isForgotPassword && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotPassword(true);
                                        setError('');
                                        setSuccessMessage('');
                                    }}
                                    className="w-full text-center text-sm text-white/50 hover:text-primary transition-colors"
                                >
                                    Forgot your password?
                                </button>
                            )}
                        </form>

                        {/* Toggle Login/Signup */}
                        {allowToggle && (
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsLogin(!isLogin);
                                        setIsForgotPassword(false);
                                        setError('');
                                        setSuccessMessage('');
                                    }}
                                    className="text-white/60 hover:text-primary transition-colors"
                                >
                                    {isForgotPassword
                                        ? 'Back to Sign In'
                                        : isLogin
                                            ? "Don't have an account? Sign up"
                                            : 'Already have an account? Sign in'}
                                </button>
                            </div>
                        )}
                    </motion.div>

                    {/* Benefits (signup only) */}
                    {!isLogin && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-8 grid grid-cols-2 gap-4"
                        >
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <Rocket className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-sm text-white/70">Personalized Roadmap</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                                <p className="text-sm text-white/70">Track Your Progress</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
