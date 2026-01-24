import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Settings as SettingsIcon, User, Shield, Trash2, Eye, EyeOff, AlertTriangle, Check, Loader2, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Settings() {
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();

    // Form states
    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [showEmail, setShowEmail] = useState(false);

    // UI states
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        setError(null);

        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    display_name: displayName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!user || deleteConfirmText !== 'DELETE') return;
        setDeleting(true);
        setError(null);

        try {
            // Get the current session token
            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                throw new Error('No active session');
            }

            // Call the Edge Function to delete the account completely
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to delete account');
            }

            // Sign out and redirect
            await signOut();
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to delete account. Please contact support.');
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background pb-20">
            <Navbar />

            <div className="container mx-auto px-4 pt-20 md:pt-24 max-w-3xl">
                {/* Header */}
                <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                            <SettingsIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                            Settings
                        </h1>
                        <p className="text-sm md:text-base text-muted-foreground">Manage your account.</p>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
                    >
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{error}</p>
                    </motion.div>
                )}

                {/* Success Banner */}
                {saved && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 flex items-center gap-3"
                    >
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <p className="text-green-400 text-sm">Settings saved successfully!</p>
                    </motion.div>
                )}

                {/* Profile Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
                >
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Profile
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Username</label>
                            <input
                                type="text"
                                value={profile?.username || ''}
                                readOnly
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed"
                            />
                            <p className="text-xs text-white/40 mt-1">Username cannot be changed.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                            <div className="relative">
                                <input
                                    type={showEmail ? 'text' : 'password'}
                                    value={user?.email || ''}
                                    readOnly
                                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white/50 cursor-not-allowed"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowEmail(!showEmail)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                >
                                    {showEmail ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Save Button */}
                <div className="flex justify-end mb-8">
                    <Button onClick={handleSaveProfile} disabled={saving} className="min-w-32">
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Check className="w-4 h-4 mr-2" />
                                Save Changes
                            </>
                        )}
                    </Button>
                </div>

                {/* Help Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
                >
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-blue-400" />
                        Need Help?
                    </h2>
                    <p className="text-white/60 text-sm">
                        For account changes like email updates, password resets, or username changes, please contact support at <a href="mailto:support@hustlepath.app" className="text-primary hover:underline">support@hustlepath.app</a>
                    </p>
                </motion.section>

                {/* Danger Zone */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6"
                >
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-red-400">
                        <Shield className="w-5 h-5" />
                        Danger Zone
                    </h2>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <p className="font-medium text-red-400">Delete Account</p>
                            <p className="text-sm text-white/50">Permanently delete your account and all data</p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(true)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    </div>
                </motion.section>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-zinc-900 border border-red-500/30 rounded-2xl p-6 max-w-md w-full"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-red-500/20 p-3 rounded-full">
                                    <AlertTriangle className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold text-red-400">Delete Account?</h3>
                            </div>

                            <p className="text-white/70 mb-4">
                                This action is <strong className="text-red-400">permanent</strong> and cannot be undone. All your data, progress, and posts will be deleted forever.
                            </p>

                            <p className="text-sm text-white/50 mb-2">Type <strong className="text-white">DELETE</strong> to confirm:</p>
                            <input
                                type="text"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="DELETE"
                                className="w-full bg-black/50 border border-red-500/30 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-red-500/50 mb-4"
                            />

                            <div className="flex gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeleteConfirmText('');
                                    }}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleDeleteAccount}
                                    disabled={deleteConfirmText !== 'DELETE' || deleting}
                                    className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {deleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Delete Forever'
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
