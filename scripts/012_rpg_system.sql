-- Add RPG attributes and XP to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS title TEXT DEFAULT 'Novato',
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Function to calculate level based on XP
-- Formula: level = floor(sqrt(xp / 100)) + 1
-- Level 1: 0 XP
-- Level 2: 100 XP
-- Level 3: 400 XP
-- Level 4: 900 XP
-- Level 5: 1600 XP
CREATE OR REPLACE FUNCTION calculate_level(xp_value INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN floor(sqrt(xp_value / 100)) + 1;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update level and title based on XP
CREATE OR REPLACE FUNCTION update_profile_level()
RETURNS TRIGGER AS $$
DECLARE
    new_level INTEGER;
BEGIN
    new_level := calculate_level(NEW.xp);
    IF new_level <> OLD.level THEN
        NEW.level := new_level;
        
        -- Update title based on level
        NEW.title := CASE 
            WHEN new_level >= 50 THEN 'Leyenda de MediaQuest'
            WHEN new_level >= 40 THEN 'Maestro de Historias'
            WHEN new_level >= 30 THEN 'Coleccionista de Élite'
            WHEN new_level >= 20 THEN 'Explorador Experto'
            WHEN new_level >= 10 THEN 'Entusiasta'
            ELSE 'Novato'
        END;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_update_profile_level ON profiles;
CREATE TRIGGER tr_update_profile_level
BEFORE UPDATE OF xp ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_level();

-- Function to add XP for different activities
CREATE OR REPLACE FUNCTION add_xp(user_uuid UUID, xp_to_add INTEGER)
RETURNS VOID AS $$
BEGIN
    UPDATE profiles 
    SET xp = xp + xp_to_add,
        updated_at = NOW()
    WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql;
