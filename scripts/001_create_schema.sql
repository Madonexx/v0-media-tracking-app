-- Media Tracker Schema
-- Supports: Anime, Series, Movies, Books, Games

-- Create enum for media types
CREATE TYPE media_type AS ENUM ('anime', 'series', 'movie', 'book', 'game');

-- Create enum for status
CREATE TYPE media_status AS ENUM ('terminado', 'saliendo', 'en_espera', 'cancelado', 'no_empezado');

-- Main media items table
CREATE TABLE IF NOT EXISTS media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type media_type NOT NULL,
  score INTEGER CHECK (score >= 1 AND score <= 10),
  status media_status NOT NULL DEFAULT 'no_empezado',
  is_watching BOOLEAN DEFAULT false,
  is_up_to_date BOOLEAN DEFAULT false,
  dropped_at TEXT,
  last_episode TEXT,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL,
  condition_value JSONB NOT NULL,
  points INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements (unlocked)
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_items_type ON media_items(type);
CREATE INDEX IF NOT EXISTS idx_media_items_status ON media_items(status);

-- Disable RLS since this is a single-user app
ALTER TABLE media_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements DISABLE ROW LEVEL SECURITY;
