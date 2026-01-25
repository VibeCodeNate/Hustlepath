-- Add persistence columns to user_progress
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS generated_hustles jsonb,
ADD COLUMN IF NOT EXISTS rerolls_remaining integer DEFAULT 1;

-- Update existing rows to have default rerolls if null
UPDATE user_progress 
SET rerolls_remaining = 1 
WHERE rerolls_remaining IS NULL;
