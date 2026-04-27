-- Seed anime data from user's spreadsheet

INSERT INTO media_items (title, type, score, status, is_watching, is_up_to_date, dropped_at, last_episode, image_url) VALUES
('Your Lie in April', 'anime', 10, 'terminado', false, true, NULL, 'S1E22', 'https://cdn.myanimelist.net/images/anime/3/67177.jpg'),
('The Dangers in my heart', 'anime', 10, 'terminado', false, true, NULL, 'S2E24', 'https://cdn.myanimelist.net/images/anime/1015/138052.jpg'),
('Shikimori''s Not Just a Cutie', 'anime', 9, 'terminado', false, true, NULL, 'Manga 178', 'https://cdn.myanimelist.net/images/anime/1315/122044.jpg'),
('She and her cat everything flows', 'anime', 9, 'terminado', false, true, NULL, 'S1E4', 'https://cdn.myanimelist.net/images/anime/4/78501.jpg'),
('Naruto', 'anime', 6, 'terminado', false, false, 'S17E475', 'E500', 'https://cdn.myanimelist.net/images/anime/13/17405.jpg'),
('My Dress up Darling', 'anime', 10, 'terminado', false, true, NULL, 'S2E24', 'https://cdn.myanimelist.net/images/anime/1179/119045.jpg'),
('Death Note', 'anime', 8, 'terminado', false, true, NULL, '37', 'https://cdn.myanimelist.net/images/anime/9/9453.jpg'),
('One Piece', 'anime', 10, 'saliendo', true, true, NULL, NULL, 'https://cdn.myanimelist.net/images/anime/1244/138851.jpg'),
('Solo Leveling', 'anime', 8, 'en_espera', true, true, NULL, 'S2E25', 'https://cdn.myanimelist.net/images/anime/1337/138683.jpg'),
('Jujutsu Kaisen', 'anime', 9, 'en_espera', true, true, '-', NULL, 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg'),
('Frieren', 'anime', 9, 'en_espera', true, true, 'Season 2', 'S2E10', 'https://cdn.myanimelist.net/images/anime/1015/138052.jpg'),
('Demon Slayer', 'anime', 10, 'en_espera', true, true, NULL, 'Infinity Castle', 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg'),
('Attack on Titan', 'anime', 10, 'terminado', false, true, NULL, NULL, 'https://cdn.myanimelist.net/images/anime/10/47347.jpg');

-- Seed some initial achievements
INSERT INTO achievements (name, description, icon, condition_type, condition_value, points) VALUES
('Primer Paso', 'Agrega tu primer contenido a la biblioteca', '🎯', 'total_items', '{"count": 1}', 10),
('Coleccionista Novato', 'Alcanza 10 items en tu biblioteca', '📚', 'total_items', '{"count": 10}', 25),
('Coleccionista Experto', 'Alcanza 50 items en tu biblioteca', '🏆', 'total_items', '{"count": 50}', 100),
('Maratonista', 'Termina 5 animes', '🏃', 'completed_by_type', '{"type": "anime", "count": 5}', 50),
('Cinéfilo', 'Termina 10 películas', '🎬', 'completed_by_type', '{"type": "movie", "count": 10}', 50),
('Ratón de Biblioteca', 'Termina 5 libros', '📖', 'completed_by_type', '{"type": "book", "count": 5}', 50),
('Gamer', 'Termina 5 juegos', '🎮', 'completed_by_type', '{"type": "game", "count": 5}', 50),
('Crítico Exigente', 'Da una puntuación de 10 a algún contenido', '⭐', 'perfect_score', '{"count": 1}', 30),
('Muggle Experto', 'Completa todo el contenido de Harry Potter', '⚡', 'franchise', '{"name": "Harry Potter"}', 200),
('Otaku Dedicado', 'Alcanza 25 animes terminados', '🎌', 'completed_by_type', '{"type": "anime", "count": 25}', 150);
