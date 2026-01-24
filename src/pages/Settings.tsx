import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Settings as SettingsIcon, User, Bell, Shield, Trash2, Eye, EyeOff, AlertTriangle, Check, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export function Settings() {
    const navigate = useNavigate();
    const { user, profile, signOut } = useAuth();

    // Form states
    const [displayName, setDisplayName] = useState(profile?.display_name || '');
    const [username, setUsername] = useState(profile?.username || '');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [weeklyDigest, setWeeklyDigest] = useState(true);
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
                    username: username,
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
            // Delete user data from all tables
            // Note: In production, you'd want a server-side function for this
            await supabase.from('user_progress').delete().eq('user_id', user.id);
            await supabase.from('community_posts').delete().eq('user_id', user.id);
            await supabase.from('profiles').delete().eq('id', user.id);

            // Sign out and redirect
            await signOut();
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Failed to delete account');
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
                        <p className="text-sm md:text-base text-muted-foreground">Manage your account and preferences.</p>
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
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                placeholder="username"
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                            />
                            <p className="text-xs text-white/40 mt-1">Only lowercase letters, numbers, and underscores</p>
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
                            <p className="text-xs text-white/40 mt-1">Email cannot be changed here. Contact support for assistance.</p>
                        </div>
                    </div>
                </motion.section>

                {/* Notifications Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6"
                >
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Bell className="w-5 h-5 text-blue-400" />
                        Notifications
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-white/50">Receive updates about your progress</p>
                            </div>
                            <button
                                onClick={() => setEmailNotifications(!emailNotifications)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${emailNotifications ? 'bg-primary' : 'bg-white/20'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${emailNotifications ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Weekly Digest</p>
                                <p className="text-sm text-white/50">Get a summary of your hustle progress</p>
                            </div>
                            <button
                                onClick={() => setWeeklyDigest(!weeklyDigest)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${weeklyDigest ? 'bg-primary' : 'bg-white/20'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${weeklyDigest ? 'left-7' : 'left-1'}`} />
                            </button>
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
