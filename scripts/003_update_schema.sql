-- Migration to fix the discrepancy between code and database schema

-- 1. Create UserProgress enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE user_progress AS ENUM ('completado', 'viendo', 'en_pausa', 'abandonado', 'pendiente');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add content_status and user_progress columns to media_items
-- We'll use the existing 'status' column data to populate 'content_status'
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS content_status media_status;
ALTER TABLE media_items ADD COLUMN IF NOT EXISTS user_progress user_progress DEFAULT 'pendiente';

-- 3. Copy data from 'status' to 'content_status'
UPDATE media_items SET content_status = status WHERE content_status IS NULL;

-- 4. Set some reasonable defaults for user_progress based on is_watching
UPDATE media_items SET user_progress = 'viendo' WHERE is_watching = true AND user_progress = 'pendiente';
UPDATE media_items SET user_progress = 'completado' WHERE status = 'terminado' AND is_watching = false AND user_progress = 'pendiente';

-- 5. Make content_status NOT NULL after population
ALTER TABLE media_items ALTER COLUMN content_status SET NOT NULL;
ALTER TABLE media_items ALTER COLUMN content_status SET DEFAULT 'no_empezado';

-- 6. (Optional) Remove the old status column if you want to be fully clean
-- ALTER TABLE media_items DROP COLUMN status;

-- 7. Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_media_items_content_status ON media_items(content_status);
CREATE INDEX IF NOT EXISTS idx_media_items_user_progress ON media_items(user_progress);
