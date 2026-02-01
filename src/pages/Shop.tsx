import { useState, useEffect, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Coins, Check, X } from 'lucide-react';
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

    // Track the date to detect day changes
    const lastDateRef = useRef(new Date().toDateString());

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

    // Update refresh timer and check for day change
    useEffect(() => {
        const interval = setInterval(() => {
            const timeUntil = getTimeUntilShopRefresh();
            setRefreshTimer(timeUntil);

            // Check if date has changed
            const currentDate = new Date().toDateString();
            if (currentDate !== lastDateRef.current) {
                // Day changed! Refresh items
                console.log("New day detected! Refreshing shop...");
                setShopItems(getDailyShopItems());
                lastDateRef.current = currentDate;
                play('success'); // Optional: play sound on refresh
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [play]);

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
        { id: 'character', name: 'Characters', icon: '👤' },
        { id: 'monster', name: 'Monsters', icon: '👹' },
        { id: 'item', name: 'Items', icon: '🎒' },
        { id: 'dino', name: 'Dinos', icon: '🦖' },
    ];

    const getRarityBorder = (rarity: ItemRarity) => {
        switch (rarity) {
            case 'common': return 'border-gray-500';
            case 'rare': return 'border-blue-500';
            case 'epic': return 'border-purple-500';
            case 'legendary': return 'border-amber-500';
        }
    };

    const SpriteIcon = ({ item, size = 'md' }: { item: ShopItem, size?: 'sm' | 'md' | 'lg' | 'xl' | 'giant' }) => {
        // Construct visual src
        const visualUrl = `/assets/${item.src}`;

        // Scale factor for display
        // Increased scales significantly
        const scale = size === 'giant' ? 8 : size === 'xl' ? 6 : size === 'lg' ? 4 : size === 'md' ? 3 : 2;

        const baseSize = item.baseSize || 32;
        const sheetCols = item.sheetCols || 16;

        const col = item.spriteIndex % sheetCols;
        const row = Math.floor(item.spriteIndex / sheetCols);

        // If it's a sheet, we use background-position. 
        // If it's not a sheet, we simply show the image.
        const style = item.isSheet ? {
            width: baseSize * scale,
            height: baseSize * scale,
            backgroundImage: `url('${visualUrl}')`,
            backgroundPosition: `-${col * baseSize * scale}px -${row * baseSize * scale}px`,
            backgroundSize: `${baseSize * sheetCols * scale}px auto`,
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated' as const
        } : {
            width: baseSize * scale,
            height: baseSize * scale,
            backgroundImage: `url('${visualUrl}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            imageRendering: 'pixelated' as const
        };

        return (
            <div
                className="rendering-pixelated relative overflow-hidden"
                style={{
                    width: baseSize * scale,
                    height: baseSize * scale,
                    // If it's not a sheet, we might want to just contain the image
                    ...(!item.isSheet ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {})
                }}
            >
                <div
                    style={{
                        ...style,
                        position: item.isSheet ? 'absolute' : 'relative',
                        top: 0,
                        left: 0,
                    }}
                    onError={(e) => {
                        // Fallback to emoji if image fails/missing
                        if (item.preview) {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerText = item.preview;
                            e.currentTarget.parentElement!.style.display = 'flex';
                            e.currentTarget.parentElement!.style.alignItems = 'center';
                            e.currentTarget.parentElement!.style.justifyContent = 'center';
                            e.currentTarget.parentElement!.style.fontSize = size === 'xl' ? '4rem' : '2rem';
                        }
                    }}
                />
            </div>
        );
    };

    return (
        // Darker background: slate-950 to black
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black overflow-hidden font-sans text-white">
            <Navbar />

            {/* Purchase Modal */}
            <AnimatePresence>
                {selectedItem && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-zinc-900 border border-white/20 rounded-2xl p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">Purchase Item</h2>
                                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white/10 rounded-full">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className={`bg-gradient-to-b ${getRarityGradient(selectedItem.rarity)} rounded-2xl p-10 flex flex-col items-center justify-center text-center mb-6`}>
                                <div className="scale-150 transform origin-center">
                                    <SpriteIcon item={selectedItem} size="giant" />
                                </div>
                                <h3 className="text-3xl font-black mt-8 drop-shadow-lg">{selectedItem.name}</h3>
                                <p className="text-lg opacity-90 font-medium capitalize mt-2 bg-black/30 px-4 py-1 rounded-full">
                                    {selectedItem.rarity} {selectedItem.category}
                                </p>
                            </div>

                            <p className="text-muted-foreground text-center text-lg mb-8">{selectedItem.description}</p>

                            <div className="flex items-center justify-between mb-4 p-4 bg-white/5 rounded-xl">
                                <span className="text-lg">Price</span>
                                <div className="flex items-center gap-2">
                                    <Coins className="w-6 h-6 text-yellow-400" />
                                    <span className="text-2xl font-bold text-yellow-400">{selectedItem.price}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-8 p-4 bg-white/5 rounded-xl">
                                <span className="text-lg">Your Balance</span>
                                <div className="flex items-center gap-2">
                                    <Coins className="w-6 h-6 text-yellow-400" />
                                    <span className={`text-2xl font-bold ${hustleBucks >= selectedItem.price ? 'text-green-400' : 'text-red-400'}`}>
                                        {hustleBucks}
                                    </span>
                                </div>
                            </div>

                            {ownedItems.includes(selectedItem.id) ? (
                                <Button disabled className="w-full h-14 text-lg bg-green-500/20 text-green-400 border-green-500/30">
                                    <Check className="w-6 h-6 mr-2" />
                                    Already Owned
                                </Button>
                            ) : hustleBucks < selectedItem.price ? (
                                <Button disabled className="w-full h-14 text-lg bg-red-500/20 text-red-400 border-red-500/30">
                                    Not Enough Hustle Bucks
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => handlePurchase(selectedItem)}
                                    disabled={purchasing}
                                    className="w-full h-14 text-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold hover:scale-105 transition-transform"
                                >
                                    {purchasing ? (
                                        <div className="w-6 h-6 border-3 border-black border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-6 h-6 mr-2" />
                                            Purchase
                                        </>
                                    )}
                                </Button>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="lg" onClick={() => navigate('/dashboard')} className="hover:bg-white/10">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black flex items-center gap-3">
                                <ShoppingBag className="w-10 h-10 text-cyan-400" />
                                Item Shop
                            </h1>
                            <p className="text-lg text-blue-300 mt-1">Daily deals refresh in <span className="font-mono font-bold text-white">{String(refreshTimer.hours).padStart(2, '0')}:{String(refreshTimer.minutes).padStart(2, '0')}</span></p>
                        </div>
                    </div>

                    {/* Balance */}
                    <div className="flex items-center gap-4">
                        <div className="bg-black/40 border-2 border-yellow-500/30 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-lg backdrop-blur-sm">
                            <Coins className="w-8 h-8 text-yellow-400 drop-shadow-md" />
                            <div className="flex flex-col items-end leading-none">
                                <span className="text-xs text-yellow-500/80 font-bold tracking-wider">BALANCE</span>
                                <span className="text-3xl font-black text-yellow-400 tracking-tight">{hustleBucks}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="flex justify-center mb-10">
                    <div className="bg-black/30 p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full backdrop-blur-md border border-white/5">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-md font-bold whitespace-nowrap transition-all ${activeCategory === cat.id
                                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                                    : 'text-white/60 hover:text-white hover:bg-white/10'
                                    }`}
                            >
                                <span className="text-xl">{cat.icon}</span>
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Items Grid */}
                {/* Using responsive grid: 1 col mobile, 2 col tablet, 3-4 col desktop depending on width. 
                    Since only 5 items, justify-center keeps them centered. */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 xl:gap-8 justify-center`}>
                    {filteredItems.map((item, index) => {
                        const isOwned = ownedItems.includes(item.id);

                        return (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, type: "spring" }}
                                onClick={() => setSelectedItem(item)}
                                className={`group relative flex flex-col bg-gradient-to-b ${getRarityGradient(item.rarity)} rounded-3xl overflow-hidden transition-all hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10 focus:outline-none focus:ring-4 focus:ring-white/30 ${isOwned ? 'opacity-80 grayscale-[0.5]' : ''
                                    }`}
                            >
                                {/* Active Selection Border */}
                                <div className={`absolute inset-0 border-4 ${getRarityBorder(item.rarity)} rounded-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none z-20`} />

                                {/* Owned Badge */}
                                {isOwned && (
                                    <div className="absolute top-4 right-4 bg-green-500 text-black text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 z-20 shadow-lg">
                                        <Check className="w-4 h-4" />
                                        Owned
                                    </div>
                                )}

                                {/* Item Preview Area - Stacked on top */}
                                <div className="aspect-square w-full flex items-center justify-center p-8 bg-black/20 group-hover:bg-black/10 transition-colors relative">
                                    {/* Spotlight effect */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                    <div className="relative z-10 scale-125 group-hover:scale-150 transition-transform duration-300">
                                        <SpriteIcon item={item} size="xl" />
                                    </div>
                                </div>

                                {/* Item Info - Stacked below */}
                                <div className="w-full bg-slate-900/95 backdrop-blur-md p-5 border-t border-white/10 flex flex-col justify-between flex-grow">
                                    <h3 className="font-extrabold text-xl truncate text-left text-white mb-3" title={item.name}>{item.name}</h3>
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded ${item.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-300' :
                                            item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                                                item.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                                                    'bg-gray-500/20 text-gray-300'
                                            }`}>{item.rarity}</span>

                                        <div className="flex items-center gap-1.5">
                                            <Coins className="w-4 h-4 text-yellow-400" />
                                            <span className="text-lg font-black text-yellow-400">{item.price}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {filteredItems.length === 0 && (
                    <div className="text-center py-32 text-blue-300/50">
                        <ShoppingBag className="w-24 h-24 mx-auto mb-6 opacity-20" />
                        <h3 className="text-2xl font-bold mb-2">Empty Shelf</h3>
                        <p className="text-lg">No items in this category today.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
