import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Settings as SettingsIcon, User, Shield, Trash2, Eye, EyeOff, AlertTriangle, Check, Loader2, HelpCircle, Crown, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';

function UpgradeButton() {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-checkout-session', {
                body: { hustleTitle: 'HustlePath Pro Upgrade' }
            });

            if (error) throw error;
            if (data?.url) window.location.href = data.url;
        } catch (err) {
            console.error('Upgrade error:', err);
            alert('Failed to start checkout.');
            setLoading(false);
        }
    };

    return (
        <Button onClick={handleUpgrade} disabled={loading} className="bg-yellow-400 text-black hover:bg-yellow-300">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Crown className="w-4 h-4 mr-2" />}
            Upgrade to Pro
        </Button>
    );
}

function ManageSubscriptionButton({ email }: { email: string }) {
    const [loading, setLoading] = useState(false);

    const handlePortal = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-portal-session', {
                body: { email }
            });

            if (error) throw error;
            if (data?.url) window.location.href = data.url;
        } catch (err: any) {
            console.error('Portal error:', err);
            // Fallback error message
            const msg = err.message || 'Failed to open billing portal.';
            alert(msg);
            setLoading(false);
        }
    };

    return (
        <Button onClick={handlePortal} disabled={loading} variant="outline" className="border-white/20 hover:bg-white/10">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CreditCard className="w-4 h-4 mr-2" />}
            Manage Billing
        </Button>
    );
}

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

                {/* Subscription Section */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 relative overflow-hidden"
                >
                    {profile?.is_pro && (
                        <div className="absolute top-0 right-0 p-4 opacity-20 hover:opacity-100 transition-opacity">
                            <Crown className="w-24 h-24 text-yellow-400 rotate-12" />
                        </div>
                    )}

                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2 relative z-10">
                        <CreditCard className="w-5 h-5 text-primary" />
                        Subscription
                    </h2>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-white/60 mb-1">Current Plan</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-xl font-bold ${profile?.is_pro ? 'text-yellow-400' : 'text-white'}`}>
                                        {profile?.is_pro ? 'Pro Hustler' : 'Starter (Free)'}
                                    </span>
                                    {profile?.is_pro && (
                                        <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-400 text-[10px] font-bold uppercase rounded tracking-wider">
                                            Active
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {profile?.is_pro ? (
                            <div className="bg-black/20 rounded-xl p-4 border border-white/5 mb-6">
                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-orange-400" />
                                    Downgrade Warning
                                </h3>
                                <p className="text-sm text-white/60 mb-0">
                                    Downgrading to the free tier will lock access to premium features, masterclasses, and advanced tools.
                                    <br /><br />
                                    <strong>Don't worry:</strong> Your progress and data will be safely saved if you decide to upgrade again later.
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-white/60 mb-6 max-w-lg">
                                Unlock interactive roadmaps, video masterclasses, and priority community access.
                            </p>
                        )}

                        <div className="flex gap-4">
                            {profile?.is_pro ? (
                                <ManageSubscriptionButton email={user?.email || ''} />
                            ) : (
                                <UpgradeButton />
                            )}
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
