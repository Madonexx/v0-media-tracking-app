-- Migration to add new status options to enums

-- Add 'esperando_temporada' to media_status enum
-- Note: ALTER TYPE ... ADD VALUE cannot be executed inside a transaction block in some Postgres versions.
-- But Supabase handles this well in their migration system.
ALTER TYPE media_status ADD VALUE IF NOT EXISTS 'esperando_temporada';

-- Add 'al_dia' to user_progress enum
ALTER TYPE user_progress ADD VALUE IF NOT EXISTS 'al_dia';
