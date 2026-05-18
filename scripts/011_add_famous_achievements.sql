-- Expanding Achievements with Famous Media and General Knowledge

INSERT INTO achievements (name, description, icon, condition_type, condition_value, points) VALUES
-- Franchises
('Vengador Reunido', 'Completa 10 películas de Marvel/MCU', '🛡️', 'franchise', '{"name": "Marvel", "count": 10}', 100),
('Maestro Jedi', 'Completa 6 películas de Star Wars', '⚔️', 'franchise', '{"name": "Star Wars", "count": 6}', 100),
('Super Saiyajin', 'Completa 3 series de Dragon Ball', '🐉', 'franchise', '{"name": "Dragon Ball", "count": 3}', 120),
('Espíritu del Bosque', 'Completa 5 películas de Studio Ghibli', '🌳', 'franchise', '{"name": "Ghibli", "count": 5}', 80),
('Portador del Anillo', 'Completa El Hobbit y El Señor de los Anillos', '💍', 'franchise', '{"name": "Lord of the Rings", "count": 3}', 150),
('Cazador de Sombras', 'Completa 3 juegos de FromSoftware (Souls/Elden/Bloodborne)', '🔥', 'franchise', '{"name": "Souls", "count": 3}', 200),
('Hechicero de Hogwarts', 'Completa 5 películas o libros de Harry Potter', '🪄', 'franchise', '{"name": "Harry Potter", "count": 5}', 100),

-- Genres
('Amante del Terror', 'Completa 10 contenidos de Terror', '👻', 'genre', '{"name": "Terror", "count": 10}', 70),
('Explorador de Mundos', 'Completa 10 contenidos de Ciencia Ficción', '🚀', 'genre', '{"name": "Sci-Fi", "count": 10}', 70),
('Corazón de Oro', 'Completa 5 contenidos de Romance', '💖', 'genre', '{"name": "Romance", "count": 5}', 50),
('Erudito Clásico', 'Completa 5 libros marcados como Clásicos', '📜', 'genre', '{"name": "Clásico", "count": 5}', 100),

-- Specific Famous Titles (General Knowledge)
('Química Peligrosa', 'Completa Breaking Bad', '⚗️', 'franchise', '{"name": "Breaking Bad", "count": 1}', 50),
('El Trono es Mío', 'Completa Game of Thrones', '👑', 'franchise', '{"name": "Game of Thrones", "count": 1}', 50),
('Cazador de Misterios', 'Completa Death Note', '📓', 'franchise', '{"name": "Death Note", "count": 1}', 40),
('Sobreviviente de Cordyceps', 'Completa The Last of Us', '🍄', 'franchise', '{"name": "Last of Us", "count": 1}', 60),

-- Performance
('Cazador de Platinos', 'Consigue 5 Trofeos de Platino en juegos', '💎', 'platinum_count', '{"count": 5}', 150),
('Perfeccionista', 'Puntúa 10 contenidos con nota máxima (10)', '🌟', 'perfect_score', '{"count": 10}', 120),
('Biblioteca Viviente', 'Alcanza 100 items en tu biblioteca', '🏛️', 'total_items', '{"count": 100}', 250);
