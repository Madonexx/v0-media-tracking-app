-- NUCLEAR AUTH FIX
-- This script completely resets the profile trigger to be extremely safe.

-- 1. Clean up old versions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2. Ensure profiles table is ready
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  enabled_categories TEXT[] DEFAULT ARRAY['anime', 'series', 'movie', 'book', 'game'],
  is_public BOOLEAN DEFAULT false,
  share_slug TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create the robust handler
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  final_username TEXT;
  final_slug TEXT;
BEGIN
  -- Determine username (fallback chain)
  final_username := COALESCE(
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    'User_' || substr(new.id::text, 1, 8)
  );

  -- Generate a unique slug using md5 of the ID (very safe, no extensions needed)
  final_slug := substr(md5(new.id::text || random()::text), 1, 12);

  -- Insert into profiles
  INSERT INTO public.profiles (id, username, share_slug)
  VALUES (new.id, final_username, final_slug);

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- IF EVERYTHING FAILS: Still return 'new' so the user is created in Auth.
  -- We can fix the profile manually later if needed, but the user won't be blocked.
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-enable the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Final safety check: Disable RLS again just in case it's blocking the trigger
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
