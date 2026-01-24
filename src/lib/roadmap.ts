import { supabase } from './supabase';
import { calculateNewProgress } from './gamification';

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
    days: Day[];
}

export interface RoadmapData {
    weeks: Week[];
}

// Static template for now (MVP) - can be replaced by AI later
export const TEMPLATE_ROADMAP: Week[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Week ${i + 1}`,
    description: i === 0 ? "Foundation & Research" : i < 4 ? "Building the Base" : "Scaling & Growth",
    isLocked: i > 0, // In real app, unlock based on time or previous week completion
    isCompleted: false,
    days: Array.from({ length: 7 }, (_, d) => ({
        day: d + 1,
        tasks: [
            { id: `w${i + 1}d${d + 1}t1`, title: "Research & Planning Task", xp: 50, completed: false },
            { id: `w${i + 1}d${d + 1}t2`, title: "Execution Objective", xp: 75, completed: false },
            { id: `w${i + 1}d${d + 1}t3`, title: "Review & Optimize", xp: 25, completed: false },
        ]
    }))
}));

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

    return { data, error: null };
}

export async function createInitialRoadmap(userId: string, hustleId: string = 'general') {
    const roadmapData: RoadmapData = {
        weeks: TEMPLATE_ROADMAP
    };

    const { data, error } = await supabase
        .from('roadmap_progress')
        .insert({
            user_id: userId,
            hustle_id: hustleId,
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
    // We update the huge JSON blob for now. In a strictly relational DB we'd have tables for tasks,
    // but JSONB allows flexibility for AI generated structures.
    const { error } = await supabase
        .from('roadmap_progress')
        .update({
            roadmap_data: { weeks: updatedWeeks },
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
