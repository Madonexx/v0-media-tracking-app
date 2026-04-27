-- 1. Ensure the encryption extension is active (needed for the share link)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Update the profile creator to handle Google/Social logins correctly
-- This version uses COALESCE to try different name fields from Google
-- so the database doesn't crash when 'username' is missing.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, share_slug)
  VALUES (
    new.id, 
    COALESCE(
      new.raw_user_meta_data->>'username', 
      new.raw_user_meta_data->>'full_name', 
      new.raw_user_meta_data->>'name',
      'User_' || substr(new.id::text, 1, 5)
    ), 
    encode(gen_random_bytes(6), 'hex')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
