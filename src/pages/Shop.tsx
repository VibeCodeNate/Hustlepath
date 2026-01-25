import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, ShoppingBag, Coins, Check, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { useSound } from '../lib/sound';
import {
    getDailyShopItems,
    getTimeUntilShopRefresh,
    getRarityGradient,
    type ShopItem,
    type ItemRarity
} from '../lib/shopItems';
import { supabase } from '../lib/supabase';

export function Shop() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { play } = useSound();

    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [ownedItems, setOwnedItems] = useState<string[]>([]);
    const [hustleBucks, setHustleBucks] = useState(0);
    const [refreshTimer, setRefreshTimer] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
    const [purchasing, setPurchasing] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('all');

    // Load shop items and user data
    useEffect(() => {
        setShopItems(getDailyShopItems());

        // Load owned items from localStorage
        const owned = localStorage.getItem(`hustlepath_owned_items_${user?.id}`);
        if (owned) {
            setOwnedItems(JSON.parse(owned));
        }

        // Load hustle bucks from profile
        if (user) {
            loadHustleBucks();
        }
    }, [user]);

    // Update refresh timer
    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshTimer(getTimeUntilShopRefresh());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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

    const handlePurchase = async (item: ShopItem) => {
        if (!user || purchasing) return;
        if (ownedItems.includes(item.id)) return;
        if (hustleBucks < item.price) {
            play('error');
            return;
        }

        setPurchasing(true);
        play('click');

        try {
            // Deduct hustle bucks
            const newBalance = hustleBucks - item.price;
            await supabase
                .from('user_progress')
                .update({ hustle_bucks: newBalance })
                .eq('user_id', user.id);

            // Add to owned items
            const newOwned = [...ownedItems, item.id];
            setOwnedItems(newOwned);
            localStorage.setItem(`hustlepath_owned_items_${user.id}`, JSON.stringify(newOwned));

            setHustleBucks(newBalance);
            play('success');
            setSelectedItem(null);
        } catch (err) {
            console.error('Purchase failed:', err);
            play('error');
        } finally {
            setPurchasing(false);
        }
    };

    const filteredItems = activeCategory === 'all'
        ? shopItems
        : shopItems.filter(item => item.category === activeCategory);

    const categories = [
        { id: 'all', name: 'All', icon: '🛒' },
        { id: 'outfit', name: 'Outfits', icon: '👔' },
        { id: 'hairstyle', name: 'Hairstyles', icon: '💇' },
        { id: 'accessory', name: 'Accessories', icon: '💎' },
        { id: 'emote', name: 'Emotes', icon: '💃' },
        { id: 'background', name: 'Backgrounds', icon: '🌅' },
        { id: 'calling_card', name: 'Calling Cards', icon: '🃏' },
    ];

    const getRarityBorder = (rarity: ItemRarity) => {
        switch (rarity) {
            case 'common': return 'border-gray-500';
            case 'rare': return 'border-blue-500';
            case 'epic': return 'border-purple-500';
            case 'legendary': return 'border-amber-500';
        }
    };

    const SpriteIcon = ({ item, size = 'md' }: { item: ShopItem, size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
        // Determine sheet URL (using placeholders if local assets missing)
        const sheetUrl = `/assets/sprites_${item.spriteSheet}.png`;

        // Calculate background position
        // Assuming 32x32px sprites in a 16 column grid (512px width)
        const col = item.spriteIndex % 16;
        const row = Math.floor(item.spriteIndex / 16);

        // Scale factor for display
        const scale = size === 'xl' ? 4 : size === 'lg' ? 3 : size === 'md' ? 2 : 1;
        const spriteSize = 32;

        return (
            <div
                className="rendering-pixelated relative overflow-hidden"
                style={{
                    width: spriteSize * scale,
                    height: spriteSize * scale,
                    imageRendering: 'pixelated'
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url('${sheetUrl}')`,
                        backgroundPosition: `-${col * spriteSize * scale}px -${row * spriteSize * scale}px`,
                        backgroundSize: `${spriteSize * 16 * scale}px auto`,
                        imageRendering: 'pixelated'
                    }}
                    onError={(e) => {
                        // Fallback to emoji if image fails
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerText = item.preview;
                        e.currentTarget.parentElement!.style.display = 'flex';
                        e.currentTarget.parentElement!.style.alignItems = 'center';
                        e.currentTarget.parentElement!.style.justifyContent = 'center';
                        e.currentTarget.parentElement!.style.fontSize = size === 'xl' ? '4rem' : '2rem';
                    }}
                />
            </div>
        );
    };

    // ... inside Shop component render ...

    // [Inside the Purchase Modal]
    // <SpriteIcon item={selectedItem} size="xl" />

    // [Inside the Grid Item]
    // <div className="aspect-square flex items-center justify-center p-4">
    //     <SpriteIcon item={item} size="md" />
    // </div>

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950 overflow-hidden">
            <Navbar />

            {/* Purchase Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/20 rounded-2xl p-6 w-full max-w-md"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">Purchase Item</h2>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white/10 rounded-full">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className={`bg-gradient-to-b ${getRarityGradient(selectedItem.rarity)} rounded-xl p-6 flex flex-col items-center text-center mb-4`}>
                                <SpriteIcon item={selectedItem} size="xl" />
                                <h3 className="text-xl font-bold mt-4">{selectedItem.name}</h3>
                                <p className="text-sm opacity-80 capitalize">{selectedItem.rarity} {selectedItem.category}</p>
                            </div>

                            <p className="text-muted-foreground text-center mb-4">{selectedItem.description}</p>

                            <div className="flex items-center justify-between mb-4 p-3 bg-white/5 rounded-xl">
                                <span>Price</span>
                                <div className="flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-yellow-400" />
                                    <span className="text-xl font-bold text-yellow-400">{selectedItem.price}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6 p-3 bg-white/5 rounded-xl">
                                <span>Your Balance</span>
                                <div className="flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-yellow-400" />
                                    <span className={`text-xl font-bold ${hustleBucks >= selectedItem.price ? 'text-green-400' : 'text-red-400'}`}>
                                        {hustleBucks}
                                    </span>
                                </div>
                            </div>

                            {ownedItems.includes(selectedItem.id) ? (
                                <Button disabled className="w-full bg-green-500/20 text-green-400 border-green-500/30">
                                    <Check className="w-5 h-5 mr-2" />
                                    Already Owned
                                </Button>
                            ) : hustleBucks < selectedItem.price ? (
                                <Button disabled className="w-full bg-red-500/20 text-red-400 border-red-500/30">
                                    Not Enough Hustle Bucks
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handlePurchase(selectedItem)}
                                    disabled={purchasing}
                                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold"
                                >
                                    {purchasing ? (
                                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-5 h-5 mr-2" />
                                            Purchase
                                        </>
                                    )}
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 pt-20 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                                <ShoppingBag className="w-7 h-7 text-cyan-400" />
                                Item Shop
                            </h1>
                            <p className="text-sm text-blue-300">New items every day!</p>
                        </div>
                    </div>

                    {/* Balance & Timer */}
                    <div className="flex items-center gap-4">
                        <div className="bg-black/30 border border-yellow-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
                            <Coins className="w-5 h-5 text-yellow-400" />
                            <span className="text-xl font-bold text-yellow-400">{hustleBucks}</span>
                        </div>
                        <div className="bg-black/30 border border-cyan-500/30 rounded-xl px-4 py-2 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-cyan-400" />
                            <span className="font-mono text-cyan-400">
                                {String(refreshTimer.hours).padStart(2, '0')}:
                                {String(refreshTimer.minutes).padStart(2, '0')}:
                                {String(refreshTimer.seconds).padStart(2, '0')}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Featured Banner */}
                <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 mb-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider mb-1">
                            <Sparkles className="w-4 h-4" />
                            Featured Items
                        </div>
                        <h2 className="text-2xl font-black">Daily Rotation</h2>
                    </div>
                    <div className="text-right">
                        <div className="text-sm opacity-80">Refreshes in</div>
                        <div className="text-2xl font-black">
                            {refreshTimer.hours}h {refreshTimer.minutes}m
                        </div>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat.id
                                ? 'bg-cyan-500 text-black'
                                : 'bg-white/10 text-white/70 hover:bg-white/20'
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {filteredItems.map((item, index) => {
                        const isOwned = ownedItems.includes(item.id);

                        return (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => setSelectedItem(item)}
                                className={`relative bg-gradient-to-b ${getRarityGradient(item.rarity)} rounded-xl overflow-hidden transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50 ${isOwned ? 'opacity-60' : ''
                                    }`}
                            >
                                {/* Owned Badge */}
                                {isOwned && (
                                    <div className="absolute top-2 right-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 z-10">
                                        <Check className="w-3 h-3" />
                                        Owned
                                    </div>
                                )}

                                {/* Item Preview */}
                                <div className="aspect-square flex items-center justify-center p-4">
                                    <SpriteIcon item={item} size="md" />
                                </div>

                                {/* Item Info */}
                                <div className="bg-black/50 p-3">
                                    <h3 className="font-bold text-sm truncate">{item.name}</h3>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs capitalize opacity-70">{item.rarity}</span>
                                        <div className="flex items-center gap-1">
                                            <Coins className="w-3 h-3 text-yellow-400" />
                                            <span className="text-sm font-bold text-yellow-400">{item.price}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Rarity Glow */}
                                <div className={`absolute inset-0 border-2 ${getRarityBorder(item.rarity)} rounded-xl pointer-events-none`} />
                            </motion.button>
                        );
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-blue-300">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>No items in this category today</p>
                        <p className="text-sm opacity-60">Check back tomorrow!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
