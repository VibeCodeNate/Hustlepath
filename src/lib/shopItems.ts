// Shop Items Generator - 5000+ procedurally generated items
// Outfits, Hairstyles, Accessories, Colors, and more

export type ItemCategory = 'outfit' | 'hairstyle' | 'accessory' | 'color' | 'emote' | 'background' | 'calling_card';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
    id: string;
    name: string;
    category: ItemCategory;
    rarity: ItemRarity;
    price: number;
    description: string;
    preview: string; // Emoji or icon representation
    colors?: string[];
}

// Price tiers by rarity
const RARITY_PRICES: Record<ItemRarity, number> = {
    common: 100,
    rare: 300,
    epic: 750,
    legendary: 1500
};

const RARITY_COLORS: Record<ItemRarity, string> = {
    common: 'gray',
    rare: 'blue',
    epic: 'purple',
    legendary: 'amber'
};

// Item name components
const PREFIXES = [
    'Cyber', 'Neon', 'Shadow', 'Crystal', 'Mystic', 'Atomic', 'Solar', 'Lunar', 'Frost', 'Fire',
    'Thunder', 'Storm', 'Ocean', 'Forest', 'Desert', 'Arctic', 'Tropical', 'Urban', 'Royal', 'Elite',
    'Prime', 'Ultra', 'Mega', 'Supreme', 'Legendary', 'Ancient', 'Future', 'Retro', 'Vintage', 'Modern',
    'Cosmic', 'Stellar', 'Galaxy', 'Nova', 'Nebula', 'Quantum', 'Plasma', 'Laser', 'Holographic', 'Digital',
    'Pixel', 'Glitch', 'Matrix', 'Binary', 'Alchemy', 'Phoenix', 'Dragon', 'Tiger', 'Wolf', 'Eagle',
    'Shark', 'Viper', 'Cobra', 'Panther', 'Lion', 'Bear', 'Falcon', 'Hawk', 'Raven', 'Ghost',
    'Phantom', 'Spirit', 'Soul', 'Dark', 'Light', 'Bright', 'Midnight', 'Dawn', 'Dusk', 'Twilight'
];

const OUTFIT_NAMES = [
    'Hustler', 'Grinder', 'Boss', 'CEO', 'Entrepreneur', 'Mogul', 'Tycoon', 'Legend', 'Champion', 'Warrior',
    'Knight', 'Ranger', 'Agent', 'Specialist', 'Expert', 'Master', 'Prodigy', 'Genius', 'Visionary', 'Pioneer',
    'Trailblazer', 'Pathfinder', 'Explorer', 'Adventurer', 'Voyager', 'Nomad', 'Wanderer', 'Seeker', 'Hunter', 'Collector',
    'Creator', 'Builder', 'Maker', 'Designer', 'Artist', 'Craftsman', 'Inventor', 'Innovator', 'Disruptor', 'Rebel',
    'Rogue', 'Outlaw', 'Maverick', 'Outsider', 'Lone Wolf', 'Solo', 'Independent', 'Freelancer', 'Consultant', 'Advisor'
];

const HAIRSTYLE_NAMES = [
    'Fade', 'Buzz', 'Undercut', 'Pompadour', 'Quiff', 'Flow', 'Waves', 'Curls', 'Afro', 'Dreads',
    'Braids', 'Cornrows', 'Mohawk', 'Faux Hawk', 'Spikes', 'Slick Back', 'Side Part', 'Crew Cut', 'Taper', 'Mullet',
    'Shag', 'Layers', 'Bob', 'Pixie', 'Bangs', 'Ponytail', 'Bun', 'Twist', 'Locs', 'Coils',
    'High Top', 'Flat Top', 'Bowl Cut', 'Curtains', 'Wolf Cut', 'Butterfly', 'Hime', 'Scene', 'Emo', 'Punk'
];

const ACCESSORY_NAMES = [
    'Glasses', 'Shades', 'Goggles', 'Visor', 'Mask', 'Bandana', 'Headband', 'Cap', 'Beanie', 'Snapback',
    'Chain', 'Necklace', 'Pendant', 'Choker', 'Ring', 'Bracelet', 'Watch', 'Earrings', 'Studs', 'Hoops',
    'Backpack', 'Bag', 'Messenger', 'Satchel', 'Belt', 'Suspenders', 'Tie', 'Bowtie', 'Scarf', 'Gloves',
    'Tattoo', 'Piercing', 'Scar', 'Marking', 'Highlight', 'Streak', 'Pin', 'Badge', 'Patch', 'Emblem'
];

const EMOTE_NAMES = [
    'Victory Dance', 'Celebration', 'Flex', 'Salute', 'Wave', 'Thumbs Up', 'Fist Bump', 'High Five', 'Clap', 'Cheer',
    'Laugh', 'Cry', 'Think', 'Shock', 'Angry', 'Love', 'Mind Blown', 'Shrug', 'Face Palm', 'Eye Roll',
    'Dance Off', 'Moonwalk', 'Robot', 'Floss', 'Dab', 'Orange Justice', 'Take the L', 'Electro Shuffle', 'Boogie', 'Groove',
    'Air Guitar', 'Drum Solo', 'DJ Drop', 'Mic Drop', 'Bow', 'Curtsy', 'Meditate', 'Yoga', 'Push Up', 'Crunch'
];

const BACKGROUND_NAMES = [
    'Skyline', 'Mountains', 'Beach', 'Forest', 'Desert', 'Jungle', 'Tundra', 'Volcano', 'Underwater', 'Space',
    'City Lights', 'Sunset', 'Sunrise', 'Northern Lights', 'Starfield', 'Galaxy', 'Nebula', 'Black Hole', 'Wormhole', 'Portal',
    'Mansion', 'Penthouse', 'Yacht', 'Private Jet', 'Lamborghini', 'Rolex Store', 'Stock Exchange', 'Tech Office', 'Startup HQ', 'Conference',
    'Abstract', 'Geometric', 'Gradient', 'Neon Grid', 'Matrix Rain', 'Binary', 'Glitch Art', 'Vaporwave', 'Synthwave', 'Retrowave'
];

const CALLING_CARD_NAMES = [
    'Hustler Certified', 'Grind Never Stops', 'Self Made', 'Started From Bottom', 'Level Up', 'Boss Mode', 'CEO Energy',
    'Built Different', 'No Days Off', 'Rise and Grind', 'Dream Chaser', 'Goal Getter', 'Path Maker', 'Trail Blazer',
    'Money Moves', 'Cash Flow', 'Wealth Builder', 'Empire Mode', 'Kingdom Come', 'Legacy Maker', 'Icon Status',
    'Diamond Hands', 'Bull Market', 'Bear Slayer', 'Market Mover', 'Crypto King', 'NFT Lord', 'Tech Titan',
    'Side Hustle King', 'Passive Income', 'Multiple Streams', 'Diversified', 'Portfolio Pro', 'Investment Guru', 'Finance Wizard'
];

const COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8B500', '#FF5733', '#C70039', '#900C3F', '#581845', '#1ABC9C', '#3498DB', '#9B59B6', '#E74C3C', '#2ECC71',
    '#000000', '#FFFFFF', '#FFD700', '#C0C0C0', '#CD7F32', '#E0115F', '#50C878', '#7851A9', '#FF7F50', '#40E0D0'
];

const DESCRIPTIONS: Record<ItemCategory, string[]> = {
    outfit: [
        'Look like a true hustler with this premium outfit.',
        'Stand out from the crowd with this exclusive fit.',
        'Dress for the success you deserve.',
        'Premium threads for premium grinders.',
        'Make a statement with this iconic look.'
    ],
    hairstyle: [
        'Fresh cut for a fresh start.',
        'Your style, your rules.',
        'Top tier hair for top tier hustlers.',
        'Stand out with this signature style.',
        'Premium grooming for premium grinders.'
    ],
    accessory: [
        'The perfect finishing touch.',
        'Small details make big impressions.',
        'Accessorize your success.',
        'Complete your look with style.',
        'Premium accessories for premium hustlers.'
    ],
    color: [
        'Express yourself with this custom color.',
        'Stand out with this unique shade.',
        'Premium color for premium style.',
        'Make your mark with color.',
        'Your signature shade awaits.'
    ],
    emote: [
        'Express yourself in style.',
        'Celebrate your wins properly.',
        'Show them what you got.',
        'Your signature celebration.',
        'Premium expression for premium players.'
    ],
    background: [
        'Set the scene for success.',
        'Your profile, your world.',
        'Premium backdrop for premium hustlers.',
        'Make your profile unforgettable.',
        'Stand out with this stunning background.'
    ],
    calling_card: [
        'Make a statement before you say a word.',
        'Your digital business card.',
        'First impressions matter.',
        'Show them who you are.',
        'Premium calling card for premium players.'
    ]
};

const EMOJIS: Record<ItemCategory, string[]> = {
    outfit: ['👔', '👕', '👖', '🧥', '👗', '🧤', '🥋', '🦺', '👘', '🥻'],
    hairstyle: ['💇', '💈', '✂️', '🧴', '💅', '🎀', '👑', '🌟', '✨', '💫'],
    accessory: ['👓', '🕶️', '⌚', '💎', '📿', '🎩', '🎭', '🧢', '👜', '💍'],
    color: ['🎨', '🖌️', '🌈', '💠', '🔮', '💜', '💙', '💚', '💛', '🧡'],
    emote: ['💃', '🕺', '🙌', '👏', '🤙', '✌️', '🤘', '👊', '💪', '🔥'],
    background: ['🌅', '🌄', '🏙️', '🌌', '🌊', '🏔️', '🌴', '🏜️', '🌋', '🚀'],
    calling_card: ['🃏', '🎴', '📇', '💳', '🏷️', '📋', '📄', '🔖', '🏆', '🎖️']
};

// Seeded random number generator
function seededRandom(seed: number): () => number {
    return function () {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}

// Generate a single item
function generateItem(category: ItemCategory, index: number, rng: () => number): ShopItem {
    const prefix = PREFIXES[Math.floor(rng() * PREFIXES.length)];

    let baseName: string;
    switch (category) {
        case 'outfit':
            baseName = OUTFIT_NAMES[Math.floor(rng() * OUTFIT_NAMES.length)];
            break;
        case 'hairstyle':
            baseName = HAIRSTYLE_NAMES[Math.floor(rng() * HAIRSTYLE_NAMES.length)];
            break;
        case 'accessory':
            baseName = ACCESSORY_NAMES[Math.floor(rng() * ACCESSORY_NAMES.length)];
            break;
        case 'emote':
            baseName = EMOTE_NAMES[Math.floor(rng() * EMOTE_NAMES.length)];
            break;
        case 'background':
            baseName = BACKGROUND_NAMES[Math.floor(rng() * BACKGROUND_NAMES.length)];
            break;
        case 'calling_card':
            baseName = CALLING_CARD_NAMES[Math.floor(rng() * CALLING_CARD_NAMES.length)];
            break;
        case 'color':
            baseName = `Palette ${index}`;
            break;
        default:
            baseName = 'Item';
    }

    const name = `${prefix} ${baseName}`;

    // Determine rarity based on RNG
    const rarityRoll = rng();
    let rarity: ItemRarity;
    if (rarityRoll < 0.5) rarity = 'common';
    else if (rarityRoll < 0.8) rarity = 'rare';
    else if (rarityRoll < 0.95) rarity = 'epic';
    else rarity = 'legendary';

    const descriptions = DESCRIPTIONS[category];
    const description = descriptions[Math.floor(rng() * descriptions.length)];

    const emojis = EMOJIS[category];
    const preview = emojis[Math.floor(rng() * emojis.length)];

    // For color items, generate random colors
    const colors = category === 'color' ? [
        COLORS[Math.floor(rng() * COLORS.length)],
        COLORS[Math.floor(rng() * COLORS.length)],
        COLORS[Math.floor(rng() * COLORS.length)]
    ] : undefined;

    return {
        id: `${category}_${index}_${name.replace(/\s/g, '_').toLowerCase()}`,
        name,
        category,
        rarity,
        price: RARITY_PRICES[rarity],
        description,
        preview,
        colors
    };
}

// Generate all items (5000+)
export function generateAllItems(): ShopItem[] {
    const items: ShopItem[] = [];
    const categories: ItemCategory[] = ['outfit', 'hairstyle', 'accessory', 'color', 'emote', 'background', 'calling_card'];

    // Generate ~700 items per category = 4900+ items
    let globalIndex = 0;
    for (const category of categories) {
        const rng = seededRandom(category.charCodeAt(0) * 1000);
        for (let i = 0; i < 750; i++) {
            items.push(generateItem(category, globalIndex++, rng));
        }
    }

    return items;
}

// Get daily shop rotation
export function getDailyShopItems(date: Date = new Date()): ShopItem[] {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const seed = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const rng = seededRandom(seed);

    const allItems = generateAllItems();

    // Shuffle items using seeded RNG
    for (let i = allItems.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
    }

    // Return first 24 items (featured shop)
    return allItems.slice(0, 24);
}

// Get time until shop refresh
export function getTimeUntilShopRefresh(): { hours: number; minutes: number; seconds: number } {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
}

// Get rarity color
export function getRarityColor(rarity: ItemRarity): string {
    return RARITY_COLORS[rarity];
}

// Get rarity gradient class
export function getRarityGradient(rarity: ItemRarity): string {
    switch (rarity) {
        case 'common': return 'from-gray-600 to-gray-700';
        case 'rare': return 'from-blue-600 to-blue-700';
        case 'epic': return 'from-purple-600 to-purple-700';
        case 'legendary': return 'from-amber-500 to-orange-600';
    }
}

console.log(`Shop system loaded with ${generateAllItems().length} items`);
