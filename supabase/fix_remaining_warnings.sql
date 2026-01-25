-- FIX REMAINING WARNINGS
-- Run this in Supabase SQL Editor.

-- 1. Fix "Unindexed foreign keys"
-- We indexed user_id, but missed post_id which is also a foreign key and frequently queried.
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);


-- 2. Fix "Auth RLS Initialization Plan" (Suboptimal query performance)
-- The linter suggests wrapping auth.uid() in (select auth.uid()) to prevent re-evaluation for every row.
-- We will replace the existing policies with this optimized version.

-- === PROFILES ===
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK ((select auth.uid()) = id);

-- === USER PROGRESS ===
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own progress" ON user_progress;
CREATE POLICY "Users can insert own progress" ON user_progress
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- === ROADMAP PROGRESS ===
DROP POLICY IF EXISTS "Users can view own roadmap" ON roadmap_progress;
CREATE POLICY "Users can view own roadmap" ON roadmap_progress
    FOR SELECT USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own roadmap" ON roadmap_progress;
CREATE POLICY "Users can update own roadmap" ON roadmap_progress
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own roadmap" ON roadmap_progress;
CREATE POLICY "Users can insert own roadmap" ON roadmap_progress
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- === COMMUNITY POSTS ===
DROP POLICY IF EXISTS "Users can create posts" ON community_posts;
CREATE POLICY "Users can create posts" ON community_posts
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own posts" ON community_posts;
CREATE POLICY "Users can update own posts" ON community_posts
    FOR UPDATE USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own posts" ON community_posts;
CREATE POLICY "Users can delete own posts" ON community_posts
    FOR DELETE USING ((select auth.uid()) = user_id);

-- === POST LIKES ===
DROP POLICY IF EXISTS "Users can like posts" ON post_likes;
CREATE POLICY "Users can like posts" ON post_likes
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can unlike posts" ON post_likes;
CREATE POLICY "Users can unlike posts" ON post_likes
    FOR DELETE USING ((select auth.uid()) = user_id);

-- === POST COMMENTS ===
DROP POLICY IF EXISTS "Users can create comments" ON post_comments;
CREATE POLICY "Users can create comments" ON post_comments
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON post_comments;
CREATE POLICY "Users can delete own comments" ON post_comments
    FOR DELETE USING ((select auth.uid()) = user_id);
