export const XP_PER_LEVEL_BASE = 100;
export const XP_MULTIPLIER = 1.15;
export const MAX_LEVEL = 60;

/**
 * Calculates the total XP required to reach a specific level
 */
export function getXpRequiredForLevel(level: number): number {
    if (level <= 1) return 0;
    // Geometric series sum: a * (1 - r^n) / (1 - r)
    // But for simplicity and direct control, we can just sum it or use the formula for checking next level
    let total = 0;
    for (let i = 1; i < level; i++) {
        total += Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_MULTIPLIER, i - 1));
    }
    return total;
}

/**
 * Calculates XP needed to go from current level to next level
 */
export function getXpForNextLevel(level: number): number {
    if (level >= MAX_LEVEL) return Infinity;
    return Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_MULTIPLIER, level - 1));
}

/**
 * Calculates progress percentage to next level
 */
export function getLevelProgress(currentXp: number, currentLevel: number): number {
    if (currentLevel >= MAX_LEVEL) return 100;

    const currentLevelBaseXp = getXpRequiredForLevel(currentLevel);
    const nextLevelXp = getXpForNextLevel(currentLevel);
    const xpInCurrentLevel = currentXp - currentLevelBaseXp;

    // Ensure we don't return negative or > 100 if data is slightly out of sync
    const progress = (xpInCurrentLevel / nextLevelXp) * 100;
    return Math.min(Math.max(progress, 0), 100);
}

/**
 * Simulates adding XP and returns new state
 */
export function calculateNewProgress(
    currentXp: number,
    currentLevel: number,
    xpToAdd: number
): { newXp: number; newLevel: number; leveledUp: boolean } {
    let newXp = currentXp + xpToAdd;
    let newLevel = currentLevel;
    let leveledUp = false;

    // Check for level ups
    while (newLevel < MAX_LEVEL) {
        const xpNeeded = getXpRequiredForLevel(newLevel + 1);
        if (newXp >= xpNeeded) {
            newLevel++;
            leveledUp = true;
        } else {
            break;
        }
    }

    return { newXp, newLevel, leveledUp };
}
