-- Migration to add platform and season tracking

-- Add platform column (for streaming services)
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS platform TEXT;

-- Add season tracking for series
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS current_season INTEGER;
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS total_seasons INTEGER;
