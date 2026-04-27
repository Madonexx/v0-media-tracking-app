-- Add Progress Tracking Columns

ALTER TABLE media_items 
ADD COLUMN IF NOT EXISTS current_progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_progress INTEGER;

-- Try to migrate some data from 'last_episode' to 'current_progress'
-- This is a best effort for strings like 'S1E10' or '10'
UPDATE media_items 
SET current_progress = (substring(last_episode from '([0-9]+)$'))::integer 
WHERE last_episode ~ '([0-9]+)$' AND current_progress = 0;
