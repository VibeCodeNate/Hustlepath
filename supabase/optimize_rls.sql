-- OPTIMIZATION SCRIPT
-- Run this in Supabase SQL Editor to fix "Multiple Permissive Policies" and "Auth RLS Initialization Plan" warnings.

-- 1. Fix "Multiple Permissive Policies"
-- Consolidate overlapping policies for tables that are effectively public for SELECT.

-- Profiles: Public policy covers "view own", so we drop the specific "view own" SELECT policy.
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
-- Ensure the public policy exists (if not already)
-- CREATE POLICY "Public profiles are viewable" ON profiles FOR SELECT USING (true);

-- User Progress: Public policy covers "view own", so we drop the specific "view own" SELECT policy.
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;


-- 2. Fix "Auth RLS Initialization Plan" (Performance)
-- Add indexes to foreign keys used in RLS policies (auth.uid() = user_id).
-- Without these indexes, RLS forces a full table scan for every query checking user ownership.

-- Community Posts
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON community_posts(user_id);

-- Post Likes (Composite key exists but user_id is second, so we need a separate index for efficient RLS lookups by user)
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);

-- Post Comments
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON post_comments(user_id);

-- Roadmap Progress (Composite UNIQUE(user_id, hustle_id) exists, which covers user_id lookups, so no new index needed here strictly, but usually harmless)
