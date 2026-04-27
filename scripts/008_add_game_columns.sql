-- Add Game Specific Columns
ALTER TABLE media_items 
ADD COLUMN IF NOT EXISTS is_platinum BOOLEAN DEFAULT false;
