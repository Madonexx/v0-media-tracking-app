-- Seed anime data from user's spreadsheet

INSERT INTO media_items (title, type, score, status, is_watching, is_up_to_date, dropped_at, last_episode) VALUES
('Your Lie in April', 'anime', 10, 'terminado', false, true, NULL, 'S1E22'),
('The Dangers in my heart', 'anime', 10, 'terminado', false, true, NULL, 'S2E24'),
('Shikimori''s Not Just a Cutie', 'anime', 9, 'terminado', false, true, NULL, 'Manga 178'),
('She and her cat everything flows', 'anime', 9, 'terminado', false, true, NULL, 'S1E4'),
('Naruto', 'anime', 6, 'terminado', false, false, 'S17E475', 'E500'),
('My Dress up Darling', 'anime', 10, 'terminado', false, true, NULL, 'S2E24'),
('Fullmetal Alchemist Brotherhood', 'anime', 5, 'terminado', false, false, 'E2', 'E64'),
('Fruit Baskets', 'anime', NULL, 'terminado', true, false, NULL, NULL),
('Death Note', 'anime', 8, 'terminado', false, true, NULL, '37'),
('The Angel next door spoils me rotten', 'anime', 8, 'saliendo', true, true, 'S2 E1', 'S2E3'),
('One Piece', 'anime', 10, 'saliendo', true, true, NULL, NULL),
('I made friends with the second prettiest girl in my class', 'anime', 9, 'saliendo', true, true, NULL, 'S1E3'),
('Grand Blue Dreaming', 'anime', 5, 'no_empezado', true, false, 'S1 E4', 'S2 E24'),
('You and I are polar opposites', 'anime', 8, 'en_espera', true, true, NULL, 'S1E12'),
('Solo Leveling', 'anime', 8, 'en_espera', true, true, NULL, 'S2E25'),
('Jujutsu Kaisen', 'anime', 9, 'en_espera', true, true, '-', NULL),
('Haikyu', 'anime', 9, 'en_espera', true, true, NULL, 'La batalla del basurero'),
('Frieren', 'anime', 9, 'en_espera', true, true, 'Season 2', 'S2E10'),
('Demon Slayer', 'anime', 10, 'en_espera', true, true, NULL, 'Infinity Castle'),
('More than a married couple but no lovers', 'anime', 9, 'cancelado', false, true, NULL, 'Manga 79'),
('I''m Getting married to a girl i hate in my class', 'anime', 7, 'cancelado', false, true, NULL, NULL),
('Kaguyama-Sama Love is War', 'anime', NULL, 'en_espera', false, false, NULL, NULL),
('Attack on Titan', 'anime', 10, 'terminado', false, true, NULL, NULL);

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
