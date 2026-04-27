-- Multi-User Setup & RLS Policies

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  enabled_categories TEXT[] DEFAULT ARRAY['anime', 'series', 'movie', 'book', 'game'],
  is_public BOOLEAN DEFAULT false,
  share_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add user_id to existing tables if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='media_items' AND COLUMN_NAME='user_id') THEN
        ALTER TABLE media_items ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='user_achievements' AND COLUMN_NAME='user_id') THEN
        ALTER TABLE user_achievements ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Enable RLS on all tables
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies

-- MEDIA ITEMS
CREATE POLICY "Users can manage their own media items" 
ON media_items FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view public profiles' media items" 
ON media_items FOR SELECT 
TO anon, authenticated
USING (
  user_id IN (SELECT id FROM profiles WHERE is_public = true)
);

-- USER ACHIEVEMENTS
CREATE POLICY "Users can manage their own achievements" 
ON user_achievements FOR ALL 
TO authenticated 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Public can view public profiles' achievements" 
ON user_achievements FOR SELECT 
TO anon, authenticated
USING (
  user_id IN (SELECT id FROM profiles WHERE is_public = true)
);

-- PROFILES
CREATE POLICY "Users can manage their own profile" 
ON profiles FOR ALL 
TO authenticated 
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

CREATE POLICY "Public can view public profiles" 
ON profiles FOR SELECT 
TO anon, authenticated
USING (is_public = true OR id = auth.uid());

-- ACHIEVEMENTS (Read-only for everyone)
CREATE POLICY "Achievements are viewable by everyone" 
ON achievements FOR SELECT 
TO anon, authenticated
USING (true);

-- 5. Trigger to automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, share_slug)
  VALUES (new.id, new.raw_user_meta_data->>'username', encode(gen_random_bytes(6), 'hex'));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
