// Shop Items Generator - Custom Catalog
// Characters from 32rogues, Monsters, and Dinos

export type ItemCategory = 'character' | 'monster' | 'item' | 'dino';
export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
    id: string;
    name: string;
    category: ItemCategory;
    rarity: ItemRarity;
    price: number;
    description: string;
    src: string; // Path relative to /assets/
    spriteIndex: number; // For sheets
    isSheet: boolean;
    preview?: string; // Optional emoji fallback
}



export const SHOP_CATALOG: ShopItem[] = [
    // --- ROGUES (Characters) ---
    {
        id: 'rogue_knight',
        name: 'Iron Knight',
        category: 'character',
        rarity: 'common',
        price: 100,
        description: 'A sturdy warrior ready for battle.',
        src: 'shop/rogues.png',
        spriteIndex: 0,
        isSheet: true
    },
    {
        id: 'rogue_mage',
        name: 'Apprentice Mage',
        category: 'character',
        rarity: 'rare',
        price: 300,
        description: 'Wields the power of the arcane.',
        src: 'shop/rogues.png',
        spriteIndex: 1,
        isSheet: true
    },
    {
        id: 'rogue_ranger',
        name: 'Forest Ranger',
        category: 'character',
        rarity: 'common',
        price: 100,
        description: 'Expert tracker and marksman.',
        src: 'shop/rogues.png',
        spriteIndex: 2,
        isSheet: true
    },
    {
        id: 'rogue_thief',
        name: 'Shadow Thief',
        category: 'character',
        rarity: 'rare',
        price: 300,
        description: 'Silent and deadly.',
        src: 'shop/rogues.png',
        spriteIndex: 3,
        isSheet: true
    },
    {
        id: 'rogue_cleric',
        name: 'Holy Cleric',
        category: 'character',
        rarity: 'common',
        price: 100,
        description: 'Healer of wounds and spirit.',
        src: 'shop/rogues.png',
        spriteIndex: 4,
        isSheet: true
    },
    {
        id: 'rogue_paladin',
        name: 'Golden Paladin',
        category: 'character',
        rarity: 'epic',
        price: 750,
        description: 'A champion of light and justice.',
        src: 'shop/rogues.png',
        spriteIndex: 6,
        isSheet: true
    },
    {
        id: 'rogue_dark_knight',
        name: 'Dark Knight',
        category: 'character',
        rarity: 'epic',
        price: 750,
        description: 'Embraced the darkness to find power.',
        src: 'shop/rogues.png',
        spriteIndex: 9,
        isSheet: true
    },

    // --- MONSTERS ---
    {
        id: 'monster_slime',
        name: 'Green Slime',
        category: 'monster',
        rarity: 'common',
        price: 50,
        description: 'A sticky little nuisance.',
        src: 'shop/monsters.png',
        spriteIndex: 0,
        isSheet: true
    },
    {
        id: 'monster_bat',
        name: 'Cave Bat',
        category: 'monster',
        rarity: 'common',
        price: 50,
        description: 'Screeches in the dark.',
        src: 'shop/monsters.png',
        spriteIndex: 1,
        isSheet: true
    },
    {
        id: 'monster_skeleton',
        name: 'Skeleton Warrior',
        category: 'monster',
        rarity: 'common',
        price: 100,
        description: 'Rattled but ready to fight.',
        src: 'shop/monsters.png',
        spriteIndex: 2,
        isSheet: true
    },
    {
        id: 'monster_goblin',
        name: 'Goblin Scout',
        category: 'monster',
        rarity: 'common',
        price: 100,
        description: 'Watch your pockets!',
        src: 'shop/monsters.png',
        spriteIndex: 3,
        isSheet: true
    },
    {
        id: 'monster_orc',
        name: 'Orc Brute',
        category: 'monster',
        rarity: 'rare',
        price: 300,
        description: 'Big, strong, and angry.',
        src: 'shop/monsters.png',
        spriteIndex: 5,
        isSheet: true
    },

    // --- ITEMS ---
    {
        id: 'item_potion_red',
        name: 'Health Potion',
        category: 'item',
        rarity: 'common',
        price: 50,
        description: 'Restores vitality.',
        src: 'shop/items.png',
        spriteIndex: 0,
        isSheet: true
    },
    {
        id: 'item_sword',
        name: 'Iron Sword',
        category: 'item',
        rarity: 'common',
        price: 150,
        description: 'A reliable blade.',
        src: 'shop/items.png',
        spriteIndex: 1,
        isSheet: true
    },
    {
        id: 'item_shield',
        name: 'Wooden Shield',
        category: 'item',
        rarity: 'common',
        price: 100,
        description: 'Better than nothing.',
        src: 'shop/items.png',
        spriteIndex: 16, // Guessing index for next row
        isSheet: true
    },
    {
        id: 'item_gem_blue',
        name: 'Sapphire',
        category: 'item',
        rarity: 'rare',
        price: 500,
        description: 'A precious blue gem.',
        src: 'shop/items.png',
        spriteIndex: 35,
        isSheet: true
    },

    // --- DINOS ---
    {
        id: 'dino_vita',
        name: 'Vita The Dino',
        category: 'dino',
        rarity: 'legendary',
        price: 1500,
        description: 'A friendly green dinosaur.',
        src: 'shop/dino_vita.png',
        spriteIndex: 0,
        isSheet: true
    },
    {
        id: 'dino_mort',
        name: 'Mort The Dino',
        category: 'dino',
        rarity: 'legendary',
        price: 1500,
        description: 'A feisty red dinosaur.',
        src: 'shop/dino_mort.png',
        spriteIndex: 0,
        isSheet: true
    }
];

// Seeded random number generator
function seededRandom(seed: number): () => number {
    return function () {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
}

// Get daily shop rotation
export function getDailyShopItems(date: Date = new Date()): ShopItem[] {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    const seed = dateString.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const rng = seededRandom(seed);

    const dailyItems = [...SHOP_CATALOG];

    // Shuffle items using seeded RNG
    for (let i = dailyItems.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [dailyItems[i], dailyItems[j]] = [dailyItems[j], dailyItems[i]];
    }

    // Return exactly 5 items as requested
    return dailyItems.slice(0, 5);
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

export function getRarityGradient(rarity: ItemRarity): string {
    switch (rarity) {
        case 'common': return 'from-gray-600 to-gray-700';
        case 'rare': return 'from-blue-600 to-blue-700';
        case 'epic': return 'from-purple-600 to-purple-700';
        case 'legendary': return 'from-amber-500 to-orange-600';
    }
}
