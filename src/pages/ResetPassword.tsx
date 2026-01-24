import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, CheckCircle, KeyRound, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../lib/auth';

export function ResetPassword() {
    const navigate = useNavigate();
    // Use the global auth session instead of managing our own listeners
    // This avoids race conditions where the session is consumed by one listener but not the other
    const { session, loading: authLoading } = useAuth();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Check if we have a valid session for password recovery
    // The session is automatically handled by AuthProvider when it processes the URL hash
    const hasValidSession = !!session;

    useEffect(() => {
        // Check for URL errors (like expired links)
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));

        const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
        if (errorDescription) {
            setError(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (!session) {
                setError('Your session has expired. Please request a new reset link.');
                setLoading(false);
                return;
            }

            console.log('Attempting password update...');

            // Just trust the update call - no fancy timeouts or manual refreshes
            // We already have a valid session from useAuth()
            const { error: updateError } = await supabase.auth.updateUser({
                password: password
            });

            if (updateError) {
                throw updateError;
            }

            setSuccess(true);
            setLoading(false);

            // Sign out to force re-login with new password
            await supabase.auth.signOut();

            setTimeout(() => {
                navigate('/signup');
            }, 3000);
        } catch (err: any) {
            console.error('Password update error:', err);
            setError(err.message || 'Failed to reset password. Please try again.');
            setLoading(false);
        }
    };

    // Show loading state while AuthProvider initializes
    if (authLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Verifying reset link...</p>
                </div>
            </div>
        );
    }

    // If no session and no error in URL, it might be an invalid link or direct navigation
    // BUT if we just succeeded, don't show this error (because signOut() clears the session)
    if (!hasValidSession && !error && !success) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
                        >
                            <AlertCircle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Invalid or Expired Link</h2>
                            <p className="text-white/60 mb-6">
                                The password reset link appears to be invalid or expired.
                                Please request a new one.
                            </p>
                            <Button onClick={() => navigate('/signup')}>
                                Back to Login <ArrowRight className="ml-2" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !hasValidSession) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-md mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
                        >
                            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2">Reset Link Error</h2>
                            <p className="text-white/60 mb-6">{error}</p>
                            <Button onClick={() => navigate('/signup')}>
                                Back to Login <ArrowRight className="ml-2" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-md mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-8"
                    >
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-green-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(190,242,100,0.3)]">
                            <KeyRound className="w-8 h-8 text-black" />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">
                            {success ? 'Password Reset!' : 'Set New Password'}
                        </h1>
                        <p className="text-white/60">
                            {success
                                ? 'Your password has been updated successfully'
                                : 'Enter your new password below'}
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-8"
                    >
                        {success ? (
                            <div className="text-center py-8">
                                <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                                <p className="text-white/70 mb-4">
                                    Redirecting you to login...
                                </p>
                                <Button onClick={() => navigate('/signup')}>
                                    Go to Login <ArrowRight className="ml-2" />
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* New Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter new password"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            required
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

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-2">
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Confirm new password"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="text-xs text-white/40">
                                    <p>• Password must be at least 6 characters</p>
                                    <p>• Must be different from your previous password</p>
                                </div>

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
                                    disabled={loading || !password || !confirmPassword}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            Reset Password
                                            <ArrowRight className="ml-2" />
                                        </>
                                    )}
                                </Button>

                                {/* Back to Login */}
                                <button
                                    type="button"
                                    onClick={() => navigate('/signup')}
                                    className="w-full text-center text-sm text-white/50 hover:text-primary transition-colors"
                                >
                                    Back to Login
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
