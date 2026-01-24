import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CharacterPreview, DEFAULT_AVATAR, type AvatarConfig } from './CharacterPreview';
import { Button } from './Button';
import { Save, RefreshCw, Shirt, User, Scissors } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

// Option Lists
const SKIN_COLORS = ['#f5d0b0', '#e0ac69', '#9e764c', '#5c3a21', '#ffdac7'];
const HAIR_COLORS = ['#1a1a1a', '#4a3000', '#8b5a2b', '#d4a04d', '#a83232', '#eeeeee'];
const CLOTHING_COLORS = ['#BEF264', '#ef4444', '#3b82f6', '#a855f7', '#10b981', '#ffffff', '#1f2937'];
const HAIR_STYLES = ['short', 'long', 'mohawk', 'bald'] as const;
const ACCESSORIES = ['none', 'glasses', 'hat', 'headphones'] as const;

export function CharacterCreator() {
    const { user, profile, refreshProfile } = useAuth();
    const [config, setConfig] = useState<AvatarConfig>(DEFAULT_AVATAR);
    const [activeTab, setActiveTab] = useState<'body' | 'hair' | 'style'>('body');
    const [saving, setSaving] = useState(false);

    // Load existing avatar if available
    useEffect(() => {
        if (profile?.avatar_config && Object.keys(profile.avatar_config).length > 0) {
            setConfig(profile.avatar_config as unknown as AvatarConfig);
        }
    }, [profile]);

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_config: config })
                .eq('id', user.id);

            if (error) throw error;
            await refreshProfile();
        } catch (err) {
            console.error('Failed to save avatar:', err);
        } finally {
            setSaving(false);
        }
    };

    const randomize = () => {
        setConfig({
            skinColor: SKIN_COLORS[Math.floor(Math.random() * SKIN_COLORS.length)],
            hairStyle: HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)],
            hairColor: HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)],
            topColor: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)],
            bottomColor: CLOTHING_COLORS[Math.floor(Math.random() * CLOTHING_COLORS.length)],
            accessory: ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)],
            background: 'bg-black/20'
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Preview Section */}
            <div className="w-full md:w-1/3 flex flex-col items-center gap-6">
                <motion.div
                    layout
                    className="p-8 bg-gradient-to-br from-white/10 to-transparent border border-white/10 rounded-3xl"
                >
                    <CharacterPreview config={config} size="xl" />
                </motion.div>

                <div className="flex gap-4 w-full">
                    <Button
                        variant="outline"
                        onClick={randomize}
                        className="flex-1 bg-white/5 border-white/10 hover:bg-white/10"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Random
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </div>

            {/* Controls Section */}
            <div className="w-full md:w-2/3 bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('body')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'body' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-white/60 hover:bg-white/5'
                            }`}
                    >
                        <User className="w-4 h-4" /> Body
                    </button>
                    <button
                        onClick={() => setActiveTab('hair')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'hair' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-white/60 hover:bg-white/5'
                            }`}
                    >
                        <Scissors className="w-4 h-4" /> Hair
                    </button>
                    <button
                        onClick={() => setActiveTab('style')}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors ${activeTab === 'style' ? 'bg-primary/10 text-primary border-b-2 border-primary' : 'text-white/60 hover:bg-white/5'
                            }`}
                    >
                        <Shirt className="w-4 h-4" /> Style
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {activeTab === 'body' && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-white/60 mb-3 block">Skin Tone</label>
                                <div className="flex flex-wrap gap-3">
                                    {SKIN_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, skinColor: color })}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${config.skinColor === color ? 'border-primary' : 'border-white/20'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'hair' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm text-white/60 mb-3 block">Hair Style</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {HAIR_STYLES.map(style => (
                                        <button
                                            key={style}
                                            onClick={() => setConfig({ ...config, hairStyle: style })}
                                            className={`p-3 rounded-xl border text-sm capitalize transition-all ${config.hairStyle === style
                                                ? 'bg-primary/20 border-primary text-primary'
                                                : 'bg-black/20 border-white/10 hover:bg-white/5'
                                                }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-3 block">Hair Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {HAIR_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, hairColor: color })}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${config.hairColor === color ? 'border-primary' : 'border-white/20'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'style' && (
                        <div className="space-y-6">
                            <div>
                                <label className="text-sm text-white/60 mb-3 block">Outfit Color</label>
                                <div className="flex flex-wrap gap-3">
                                    {CLOTHING_COLORS.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, topColor: color })}
                                            className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110 ${config.topColor === color ? 'border-primary' : 'border-white/20'
                                                }`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-sm text-white/60 mb-3 block">Accessories</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {ACCESSORIES.map(acc => (
                                        <button
                                            key={acc}
                                            onClick={() => setConfig({ ...config, accessory: acc })}
                                            className={`p-3 rounded-xl border text-sm capitalize transition-all ${config.accessory === acc
                                                ? 'bg-primary/20 border-primary text-primary'
                                                : 'bg-black/20 border-white/10 hover:bg-white/5'
                                                }`}
                                        >
                                            {acc}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
