import { supabase } from './supabase';
import { calculateNewProgress } from './gamification';
import { getNicheRoadmap, type NicheType } from './nicheRoadmaps';

export interface Objective {
    id: string;
    title: string;
    xp: number;
    completed: boolean;
}

export interface Day {
    day: number;
    tasks: Objective[];
}

export interface Week {
    id: number;
    title: string;
    description: string;
    isLocked: boolean;
    isCompleted: boolean;
    unlockedAt?: string; // ISO timestamp when week was unlocked
    days: Day[];
}

export interface RoadmapData {
    weeks: Week[];
    nicheId?: NicheType;
}

// Time-gating configuration
const DAYS_BETWEEN_WEEKS = 7; // 7 days between week unlocks

// Check if a week should be unlocked based on time
export function isWeekUnlocked(weekIndex: number, weeks: Week[]): boolean {
    if (weekIndex === 0) return true; // Week 1 always unlocked

    const previousWeek = weeks[weekIndex - 1];
    if (!previousWeek || !previousWeek.unlockedAt) return false;

    // Check if previous week is completed
    const previousWeekCompleted = previousWeek.days.every(day =>
        day.tasks.every(task => task.completed)
    );
    if (!previousWeekCompleted) return false;

    // Check if enough time has passed
    const unlockedAt = new Date(previousWeek.unlockedAt);
    const unlockDate = new Date(unlockedAt.getTime() + DAYS_BETWEEN_WEEKS * 24 * 60 * 60 * 1000);

    return new Date() >= unlockDate;
}

// Get time remaining until next week unlocks
export function getTimeUntilUnlock(weekIndex: number, weeks: Week[]): { days: number; hours: number; minutes: number } | null {
    if (weekIndex === 0) return null;

    const previousWeek = weeks[weekIndex - 1];
    if (!previousWeek || !previousWeek.unlockedAt) return null;

    const unlockedAt = new Date(previousWeek.unlockedAt);
    const unlockDate = new Date(unlockedAt.getTime() + DAYS_BETWEEN_WEEKS * 24 * 60 * 60 * 1000);
    const now = new Date();

    if (now >= unlockDate) return null;

    const diff = unlockDate.getTime() - now.getTime();
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

    return { days, hours, minutes };
}

// Apply time-gating to weeks
export function applyTimeGating(weeks: Week[]): Week[] {
    return weeks.map((week, index) => {
        if (index === 0) {
            // Week 1 - always unlocked, set unlockedAt if not set
            return {
                ...week,
                isLocked: false,
                unlockedAt: week.unlockedAt || new Date().toISOString()
            };
        }

        const shouldUnlock = isWeekUnlocked(index, weeks);
        return {
            ...week,
            isLocked: !shouldUnlock,
            unlockedAt: shouldUnlock && !week.unlockedAt ? new Date().toISOString() : week.unlockedAt
        };
    });
}

export async function getRoadmap(userId: string) {
    const { data, error } = await supabase
        .from('roadmap_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
        console.error('Error fetching roadmap:', error);
        return { error };
    }

    // Apply time-gating to returned data
    if (data && data.roadmap_data?.weeks) {
        data.roadmap_data.weeks = applyTimeGating(data.roadmap_data.weeks);
    }

    return { data, error: null };
}

export async function createInitialRoadmap(userId: string, nicheId: NicheType = 'general') {
    // Get niche-specific roadmap
    const nicheWeeks = getNicheRoadmap(nicheId);

    // Set first week as unlocked with timestamp
    const weeks = nicheWeeks.map((week, index) => ({
        ...week,
        isLocked: index > 0,
        unlockedAt: index === 0 ? new Date().toISOString() : undefined
    }));

    const roadmapData: RoadmapData = {
        weeks,
        nicheId
    };

    const { data, error } = await supabase
        .from('roadmap_progress')
        .insert({
            user_id: userId,
            hustle_id: nicheId,
            roadmap_data: roadmapData,
            current_day: 1,
            current_week: 1,
            current_month: 1
        })
        .select()
        .single();

    return { data, error };
}

export async function updateRoadmapProgress(userId: string, updatedWeeks: Week[]) {
    // Apply time-gating before saving
    const gatedWeeks = applyTimeGating(updatedWeeks);

    const { error } = await supabase
        .from('roadmap_progress')
        .update({
            roadmap_data: { weeks: gatedWeeks },
            updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

    return { error };
}

export async function completeTaskInDb(userId: string, _taskId: string, xpReward: number) {
    // 1. Fetch current profile stats to update XP
    const { data: profileProgress, error: fetchError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

    if (fetchError) return { error: fetchError };

    // 2. Calculate new stats
    const { newXp, newLevel, leveledUp } = calculateNewProgress(
        profileProgress.xp,
        profileProgress.level,
        xpReward
    );

    // 3. Update Profile Progress
    const { error: updateError } = await supabase
        .from('user_progress')
        .update({
            xp: newXp,
            level: newLevel,
            last_activity: new Date().toISOString()
        })
        .eq('user_id', userId);

    return { error: updateError, newLevel, leveledUp };
}

// Check and unlock next week if conditions are met
export async function checkAndUnlockNextWeek(userId: string, weeks: Week[], currentWeekIndex: number): Promise<Week[] | null> {
    const currentWeek = weeks[currentWeekIndex];
    const nextWeekIndex = currentWeekIndex + 1;

    if (nextWeekIndex >= weeks.length) return null; // No more weeks

    // Check if current week is 100% complete
    const isCurrentWeekComplete = currentWeek.days.every(day =>
        day.tasks.every(task => task.completed)
    );

    if (!isCurrentWeekComplete) return null;

    // Apply time-gating
    const updatedWeeks = applyTimeGating(weeks);

    // Save if next week is now unlocked
    if (!updatedWeeks[nextWeekIndex].isLocked) {
        await updateRoadmapProgress(userId, updatedWeeks);
        return updatedWeeks;
    }

    return null;
}
