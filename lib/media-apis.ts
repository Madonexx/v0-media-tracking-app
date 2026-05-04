// Media Search APIs - No API keys required for Jikan and Open Library

export interface SearchResult {
  id: string
  title: string
  image_url: string | null
  year: string | null
  genres: string[]
  synopsis: string | null
  score: number | null
  status: string | null
  episodes?: number | null
  chapters?: number | null
  author?: string | null
}

// Amplified Catalog Data (Fallback when no API is available)
export const CATALOG_DATA: Record<string, SearchResult[]> = {
  movie: [
    { id: 'm1', title: 'The Dark Knight', year: '2008', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9EXm7FbmZkG9v96A.jpg', status: 'terminado', genres: ['Acción', 'Crimen'], synopsis: 'Batman faces the Joker in Gotham City.' },
    { id: 'm2', title: 'Inception', year: '2010', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/edv5CZvfkjSnsOefv9YCc7Yojha.jpg', status: 'terminado', genres: ['Sci-Fi', 'Acción'], synopsis: 'A thief who steals corporate secrets through dream-sharing technology.' },
    { id: 'm3', title: 'Spiderman: Into the Spiderverse', year: '2018', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/iiZZmzguMTvH2adTL4bS7qYtUfS.jpg', status: 'terminado', genres: ['Animación', 'Aventura'], synopsis: 'Teen Miles Morales becomes the Spider-Man of his universe.' },
    { id: 'm4', title: 'Pulp Fiction', year: '1994', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/d5iIl9h9btztm9kzccuTh7ogYvA.jpg', status: 'terminado', genres: ['Crimen', 'Drama'], synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife.' },
    { id: 'm5', title: 'Interstellar', year: '2014', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlSaba7.jpg', status: 'terminado', genres: ['Sci-Fi', 'Drama'], synopsis: 'A team of explorers travel through a wormhole in space.' },
    { id: 'm6', title: 'The Godfather', year: '1972', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/3bhkrj9brv4FvBSv9pST99WpYQ7.jpg', status: 'terminado', genres: ['Crimen', 'Drama'], synopsis: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.' },
    { id: 'm7', title: 'Fight Club', year: '1999', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdv9ovvyhS9677qrq6vWv.jpg', status: 'terminado', genres: ['Drama'], synopsis: 'An insomniac office worker and a devil-may-care soap maker form an underground fight club.' },
    { id: 'm8', title: 'The Matrix', year: '1999', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/f89U3Y9L92MDmwsXoWCcEbYqY9G.jpg', status: 'terminado', genres: ['Acción', 'Sci-Fi'], synopsis: 'A computer hacker learns about the true nature of his reality.' },
    { id: 'm9', title: 'Gladiator', year: '2000', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuBMv3Ohy1o2tDzXgOqbiM.jpg', status: 'terminado', genres: ['Acción', 'Drama'], synopsis: 'A former Roman General sets out to exact vengeance against the corrupt emperor.' },
    { id: 'm10', title: 'The Shawshank Redemption', year: '1994', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/95S6sXG07Yp6MJsSKHTv9Y9D0sx.jpg', status: 'terminado', genres: ['Drama'], synopsis: 'Two imprisoned men bond over a number of years.' },
    { id: 'm11', title: 'Dune: Part Two', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/8bBihcbzqS5akAdLv99YICZth9n.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'Paul Atreides unites with Chani and the Fremen while on a path of revenge.' },
    { id: 'm12', title: 'Everything Everywhere All at Once', year: '2022', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/rKvCysSko4Yp3Z6wn7hs6p6YtPc.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'A Chinese-American immigrant is swept up in an insane adventure.' },
    { id: 'm13', title: 'The Prestige', year: '2006', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/bdN3g8E5p0rkL99S67UMm89Uo9B.jpg', status: 'terminado', genres: ['Drama', 'Misterio'], synopsis: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.' },
    { id: 'm14', title: 'Parasite', year: '2019', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/7IiTTjSFeSbbX7ST9ExW0YpS72n.jpg', status: 'terminado', genres: ['Comedia', 'Drama', 'Thriller'], synopsis: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.' },
    { id: 'm15', title: 'Whiplash', year: '2014', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Drama', 'Música'], synopsis: 'A promising young drummer enrolls at a cut-throat music conservatory.' },
    { id: 'm16', title: 'Inglourious Basterds', year: '2009', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Acción', 'Guerra'], synopsis: 'In Nazi-occupied France during WWII, a plan to assassinate Nazi leaders by a group of Jewish U.S. soldiers coincides with a theatre owner\'s vengeful plans.' },
    { id: 'm17', title: 'Mad Max: Fury Road', year: '2015', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/h6rsS6Y3fUvC93AK9JaEV9967S7.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.' },
    { id: 'm18', title: 'The Wolf of Wall Street', year: '2013', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/p7S6S0UQ49SSTpXN9C9P9P9P9P9.jpg', status: 'terminado', genres: ['Biografía', 'Comedia'], synopsis: 'Based on the true story of Jordan Belfort.' },
    { id: 'm19', title: 'Joker', year: '2019', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/udDclKVXv9qOXCtWg8krS9mFJtq.jpg', status: 'terminado', genres: ['Crimen', 'Drama'], synopsis: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society.' },
    { id: 'm20', title: 'Arrival', year: '2016', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/x89U3Y9L92MDmwsXoWCcEbYqY9G.jpg', status: 'terminado', genres: ['Sci-Fi', 'Drama'], synopsis: 'A linguist works with the military to communicate with alien lifeforms.' },
    { id: 'm21', title: 'The Truman Show', year: '1998', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia', 'Drama'], synopsis: 'An insurance salesman discovers his whole life is actually a reality TV show.' },
    { id: 'm22', title: 'Goodfellas', year: '1990', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Drama'], synopsis: 'The story of Henry Hill and his life in the mob.' },
    { id: 'm23', title: 'Se7en', year: '1995', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Misterio'], synopsis: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.' },
    { id: 'm24', title: 'Blade Runner 2049', year: '2017', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Sci-Fi', 'Drama'], synopsis: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.' },
  ],
  series: [
    { id: 's_p1', title: 'The Penguin', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/v9Q9Y7O5uN3oJbH4v2vO1Y3uI6.jpg', status: 'saliendo', genres: ['Crimen', 'Drama'], synopsis: 'Following the events of The Batman (2022), Oswald Cobblepot begins his rise in the underworld of Gotham City.' },
    { id: 's_f1', title: 'Fallout', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/299696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Sci-Fi', 'Acción'], synopsis: 'In a future, post-apocalyptic Los Angeles, people live in underground bunkers to protect themselves from radiation, mutants, and bandits.' },
    { id: 's_sn1', title: 'Shogun', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Drama', 'Historia'], synopsis: 'When a mysterious European ship is found abandoned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets.' },
    { id: 's1', title: 'Breaking Bad', year: '2008', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/ggm8bbub6o97vUZY7CjhqnPaTFl.jpg', status: 'terminado', genres: ['Drama', 'Crimen'], synopsis: 'A high school chemistry teacher turned meth kingpin.' },
    { id: 's2', title: 'The Last of Us', year: '2023', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/uKvH56B29db70Y1pDqsds6A77p2.jpg', status: 'terminado', genres: ['Drama', 'Acción'], synopsis: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.' },
    { id: 's3', title: 'Stranger Things', year: '2016', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/49WpIv1r32qfkU5q4kaOJuLsQH.jpg', status: 'saliendo', genres: ['Sci-Fi', 'Misterio'], synopsis: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.' },
    { id: 's4', title: 'Better Call Saul', year: '2015', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/fC2SzyUBkyj9vS79tYnWoU7v9Xy.jpg', status: 'terminado', genres: ['Drama', 'Crimen'], synopsis: 'The trials and tribulations of criminal lawyer Jimmy McGill.' },
    { id: 's5', title: 'Succession', year: '2018', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/7Yis9S9O06u9L8v6Ovy9Yf9M8yY.jpg', status: 'terminado', genres: ['Drama'], synopsis: 'The Roy family is known for controlling the biggest media and entertainment company in the world.' },
    { id: 's6', title: 'Dark', year: '2017', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/apbr08kOTmdf9G66p2H2p9p66V1.jpg', status: 'terminado', genres: ['Sci-Fi', 'Misterio'], synopsis: 'A family saga with a supernatural twist, set in a German town.' },
    { id: 's7', title: 'The Bear', year: '2022', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/pVr690pCAs08zT96S97m44q6fU7.jpg', status: 'saliendo', genres: ['Drama'], synopsis: 'A young chef from the fine dining world comes home to Chicago to run his family sandwich shop.' },
    { id: 's8', title: 'Arcane', year: '2021', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/fqld92u4asJhp99v3sTMBu0vTSZ.jpg', status: 'terminado', genres: ['Animación', 'Acción'], synopsis: 'Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions.' },
    { id: 's9', title: 'The Boys', year: '2019', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/7Ns94Y67u9X3AnmN2pU6Y0W6K3z.jpg', status: 'saliendo', genres: ['Acción', 'Sci-Fi'], synopsis: 'A group of vigilantes set out to take down corrupt superheroes.' },
    { id: 's10', title: 'House of the Dragon', year: '2022', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/7reM6U3Y6251fW2S9P6VlM7D3vS.jpg', status: 'saliendo', genres: ['Sci-Fi', 'Aventura'], synopsis: 'The story of the Targaryen civil war.' },
    { id: 's11', title: 'Sherlock', year: '2010', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Drama'], synopsis: 'A modern update finds the famous sleuth and his doctor partner solving crime in 21st century London.' },
    { id: 's12', title: 'The Crown', year: '2016', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/r07O0S3N5X4jD4U1A4R4kR8Y4Y4.jpg', status: 'terminado', genres: ['Drama', 'Historia'], synopsis: 'Follows the political rivalries and romance of Queen Elizabeth II\'s reign.' },
    { id: 's13', title: 'Game of Thrones', year: '2011', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Fantasía', 'Drama'], synopsis: 'Nine noble families fight for control over the lands of Westeros.' },
    { id: 's14', title: 'The Office', year: '2005', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia'], synopsis: 'A mockumentary on a group of typical office workers.' },
    { id: 's15', title: 'Peaky Blinders', year: '2013', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Drama', 'Crimen'], synopsis: 'A gangster family epic set in 1900s England.' },
    { id: 's16', title: 'Black Mirror', year: '2011', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Sci-Fi', 'Antología'], synopsis: 'An anthology series exploring a twisted, high-tech multiverse.' },
    { id: 's17', title: 'The Mandalorian', year: '2019', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Acción', 'Sci-Fi'], synopsis: 'The travels of a lone bounty hunter in the outer reaches of the galaxy.' },
    { id: 's18', title: 'Ted Lasso', year: '2020', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia', 'Deportes'], synopsis: 'American football coach Ted Lasso is hired to manage a British soccer team.' },
    { id: 's19', title: 'Fleabag', year: '2016', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia', 'Drama'], synopsis: 'A comedy-series adapted from Phoebe Waller-Bridge\'s award-winning play.' },
    { id: 's20', title: 'Mindhunter', year: '2017', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'cancelado', genres: ['Crimen', 'Drama'], synopsis: 'Set in the late 1970s, two FBI agents expand criminal science by delving into the psychology of murder.' },
    { id: 's21', title: 'Severance', year: '2022', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Thriller', 'Sci-Fi'], synopsis: 'Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.' },
    { id: 's22', title: 'The White Lotus', year: '2021', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Comedia', 'Drama'], synopsis: 'Follows the exploits of various guests and employees at an exclusive tropical resort.' },
    { id: 's23', title: 'Shogun', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Drama', 'Historia'], synopsis: 'When a mysterious European ship is found abandoned in a nearby fishing village, Lord Yoshii Toranaga discovers secrets.' },
    { id: 's24', title: 'The Sopranos', year: '1999', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Drama'], synopsis: 'New Jersey mob boss Tony Soprano deals with personal and professional issues.' },
  ],
  game: [
    { id: 'g1', title: 'Elden Ring', year: '2022', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4ksi.jpg', status: 'terminado', genres: ['RPG', 'Acción'], synopsis: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring.' },
    { id: 'g2', title: 'The Legend of Zelda: Tears of the Kingdom', year: '2023', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5v6v.jpg', status: 'terminado', genres: ['Aventura', 'Acción'], synopsis: 'An epic adventure across the land and skies of Hyrule.' },
    { id: 'g3', title: 'Baldur\'s Gate 3', year: '2023', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg', status: 'terminado', genres: ['RPG', 'Estrategia'], synopsis: 'Gather your party, and return to the Forgotten Realms.' },
    { id: 'g4', title: 'God of War Ragnarök', year: '2022', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'Kratos and Atreus must journey to each of the Nine Realms in search of answers.' },
    { id: 'g5', title: 'Cyberpunk 2077', year: '2020', score: 8, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg', status: 'terminado', genres: ['RPG', 'Acción'], synopsis: 'An open-world, action-adventure story set in Night City.' },
    { id: 'g6', title: 'Hades', year: '2020', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Acción', 'Indie'], synopsis: 'Defy the god of the dead as you hack and slash out of the Underworld.' },
    { id: 'g7', title: 'Red Dead Redemption 2', year: '2018', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'Arthur Morgan and the Van der Linde gang are outlaws on the run.' },
    { id: 'g8', title: 'The Witcher 3: Wild Hunt', year: '2015', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg', status: 'terminado', genres: ['RPG', 'Acción'], synopsis: 'Geralt of Rivia, a monster hunter, searches for his missing adopted daughter.' },
    { id: 'g9', title: 'Persona 5 Royal', year: '2019', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcp.jpg', status: 'terminado', genres: ['RPG', 'Simulación'], synopsis: 'The Phantom Thieves of Hearts are back for a new adventure.' },
    { id: 'g10', title: 'Ghost of Tsushima', year: '2020', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'A samurai must go beyond his traditions to protect his island.' },
    { id: 'g11', title: 'Sekiro: Shadows Die Twice', year: '2019', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcp.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'Explore late 1500s Sengoku Japan as you come face to face with larger than life foes.' },
    { id: 'g12', title: 'Final Fantasy VII Rebirth', year: '2024', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7idk.jpg', status: 'terminado', genres: ['RPG', 'Acción'], synopsis: 'Cloud and his comrades journey across the planet.' },
    { id: 'g13', title: 'Grand Theft Auto V', year: '2013', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción'], synopsis: 'Three very different criminals plot a series of daring heists.' },
    { id: 'g14', title: 'Mass Effect Legendary Edition', year: '2021', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg', status: 'terminado', genres: ['RPG', 'Sci-Fi'], synopsis: 'The epic sci-fi trilogy is back, remastered.' },
    { id: 'g15', title: 'Dark Souls III', year: '2016', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg', status: 'terminado', genres: ['RPG', 'Acción'], synopsis: 'As fires fade and the world falls into ruin, journey into a universe filled with more colossal enemies and environments.' },
    { id: 'g16', title: 'Resident Evil 4 Remake', year: '2023', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co64nd.jpg', status: 'terminado', genres: ['Horror', 'Acción'], synopsis: 'Survival is just the beginning.' },
    { id: 'g17', title: 'Outer Wilds', year: '2019', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Exploración', 'Indie'], synopsis: 'An open world mystery about a solar system trapped in an endless time loop.' },
    { id: 'g18', title: 'Hollow Knight', year: '2017', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Metroidvania', 'Indie'], synopsis: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom.' },
    { id: 'g19', title: 'Bloodborne', year: '2015', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción', 'RPG'], synopsis: 'Face your fears as you search for answers in the ancient city of Yharnam.' },
    { id: 'g20', title: 'Disco Elysium', year: '2019', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['RPG'], synopsis: 'A groundbreaking role playing game.' },
    { id: 'g21', title: 'Minecraft', year: '2011', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Sandbox'], synopsis: 'Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.' },
    { id: 'g22', title: 'Stardew Valley', year: '2016', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Simulación', 'Indie'], synopsis: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley.' },
    { id: 'g23', title: 'Helldivers 2', year: '2024', score: 8, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7idk.jpg', status: 'saliendo', genres: ['Acción', 'Shooter'], synopsis: 'Join the Helldivers and fight for freedom across a hostile galaxy.' },
    { id: 'g24', title: 'God of War (2018)', year: '2018', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'Living as a man outside the shadow of the gods.' },
  ]
}

// Jikan API for Anime/Manga (MyAnimeList data)
export async function searchAnime(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []
  
  try {
    const response = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10&sfw=true`
    )
    
    if (!response.ok) throw new Error('Jikan API error')
    
    const data = await response.json()
    
    return data.data?.map((item: any) => ({
      id: `mal-${item.mal_id}`,
      title: item.title,
      image_url: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
      year: item.year?.toString() || item.aired?.from?.slice(0, 4) || null,
      genres: item.genres?.map((g: any) => g.name) || [],
      synopsis: item.synopsis?.slice(0, 300) || null,
      score: item.score ? Math.round(item.score) : null,
      status: mapAnimeStatus(item.status),
      episodes: item.episodes || null
    })) || []
  } catch (error) {
    console.error('Error searching anime:', error)
    return []
  }
}

function mapAnimeStatus(status: string | null): string {
  if (!status) return 'no_empezado'
  const statusMap: Record<string, string> = {
    'Finished Airing': 'terminado',
    'Currently Airing': 'saliendo',
    'Not yet aired': 'no_empezado',
    'Cancelled': 'cancelado'
  }
  return statusMap[status] || 'no_empezado'
}

// TVMaze API for Series
export async function searchSeries(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []
  
  try {
    const response = await fetch(
      `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`
    )
    
    if (!response.ok) throw new Error('TVMaze API error')
    
    const data = await response.json()
    
    return data?.map((result: any) => {
      const item = result.show
      return {
        id: `tvmaze-${item.id}`,
        title: item.name,
        image_url: item.image?.original || item.image?.medium || null,
        year: item.premiered?.slice(0, 4) || null,
        genres: item.genres || [],
        synopsis: item.summary?.replace(/<[^>]*>?/gm, '').slice(0, 300) || null,
        score: item.rating?.average ? Math.round(item.rating.average) : null,
        status: mapSeriesStatus(item.status)
      }
    }) || []
  } catch (error) {
    console.error('Error searching series:', error)
    return []
  }
}

function mapSeriesStatus(status: string | null): string {
  if (!status) return 'no_empezado'
  const statusMap: Record<string, string> = {
    'Ended': 'terminado',
    'Running': 'saliendo',
    'To Be Determined': 'en_espera',
    'In Development': 'no_empezado'
  }
  return statusMap[status] || 'no_empezado'
}

// Open Library API for Books
export async function searchBooks(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []
  
  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,first_publish_year,cover_i,subject,number_of_pages_median`
    )
    
    if (!response.ok) throw new Error('Open Library API error')
    
    const data = await response.json()
    
    return data.docs?.map((item: any) => ({
      id: `ol-${item.key}`,
      title: item.title,
      image_url: item.cover_i 
        ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
        : null,
      year: item.first_publish_year?.toString() || null,
      genres: item.subject?.slice(0, 3) || [],
      synopsis: null,
      score: null,
      status: 'terminado',
      chapters: item.number_of_pages_median || null,
      author: item.author_name?.join(', ') || null
    })) || []
  } catch (error) {
    console.error('Error searching books:', error)
    return []
  }
}

// OMDb API for Movies
export async function searchMovies(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return []
  
  const apiKey = process.env.NEXT_PUBLIC_OMDB_API_KEY
  if (!apiKey) {
    console.warn('OMDb API Key not found. Please set NEXT_PUBLIC_OMDB_API_KEY')
    return []
  }
  
  try {
    const response = await fetch(
      `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=${apiKey}`
    )
    
    if (!response.ok) throw new Error('OMDb API error')
    
    const data = await response.json()
    
    if (data.Response === 'False') return []
    
    return data.Search?.map((item: any) => ({
      id: `omdb-${item.imdbID}`,
      title: item.Title,
      image_url: item.Poster !== 'N/A' ? item.Poster : null,
      year: item.Year || null,
      genres: [],
      synopsis: null,
      score: null,
      status: 'terminado'
    })) || []
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

// Generic search that routes to the right API
export async function searchMedia(query: string, type: string): Promise<SearchResult[]> {
  const normalizedQuery = query.toLowerCase()
  
  // Try local search first for all types
  const localResults = CATALOG_DATA[type]?.filter(item => 
    item.title.toLowerCase().includes(normalizedQuery) || 
    item.genres.some(g => g.toLowerCase().includes(normalizedQuery))
  ) || []

  let apiResults: SearchResult[] = []

  if (type === 'anime') {
    apiResults = await searchAnime(query)
  } else if (type === 'book') {
    apiResults = await searchBooks(query)
  } else if (type === 'series') {
    apiResults = await searchSeries(query)
  } else if (type === 'movie') {
    apiResults = await searchMovies(query)
  }

  // Combine and deduplicate by title
  const combined = [...localResults, ...apiResults]
  const seen = new Set()
  return combined.filter(item => {
    const titleLower = item.title.toLowerCase()
    const duplicate = seen.has(titleLower)
    seen.add(titleLower)
    return !duplicate
  })
}

// Fetch trending/top items for the catalog
export async function getTrendingMedia(type: string): Promise<SearchResult[]> {
  try {
    if (type === 'anime') {
      const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=100')
      if (!response.ok) throw new Error('Jikan API error')
      const data = await response.json()
      return data.data?.map((item: any) => ({
        id: `mal-${item.mal_id}`,
        title: item.title,
        image_url: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
        year: item.year?.toString() || item.aired?.from?.slice(0, 4) || null,
        genres: item.genres?.map((g: any) => g.name) || [],
        synopsis: item.synopsis?.slice(0, 200) || null,
        score: item.score ? Math.round(item.score) : null,
        status: mapAnimeStatus(item.status),
        episodes: item.episodes || null
      })) || []
    }

    if (type === 'book') {
      const response = await fetch('https://openlibrary.org/trending/daily.json?limit=100')
      if (!response.ok) throw new Error('Open Library API error')
      const data = await response.json()
      return data.works?.map((item: any) => ({
        id: `ol-${item.key.split('/').pop()}`,
        title: item.title,
        image_url: item.cover_i 
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
          : null,
        year: item.first_publish_year?.toString() || null,
        genres: [],
        synopsis: null,
        score: null,
        status: 'terminado',
        author: item.author_name?.join(', ') || null
      })) || []
    }

    if (type === 'series') {
      // Reverting to high-quality hardcoded popular series as requested
      return CATALOG_DATA[type] || []
    }

    // Return hardcoded amplified catalog data
    return CATALOG_DATA[type] || []
  } catch (error) {
    console.error(`Error getting trending ${type}:`, error)
    return CATALOG_DATA[type] || [] // Fallback to local data on error
  }
}

// Check if a media type supports API search
export function supportsApiSearch(type: string): boolean {
  if (type === 'movie') return !!process.env.NEXT_PUBLIC_OMDB_API_KEY
  return ['anime', 'book', 'series'].includes(type)
}

export function getApiSearchMessage(type: string): string {
  const messages: Record<string, string> = {
    anime: 'Busca anime con datos de MyAnimeList',
    book: 'Busca libros con datos de Open Library',
    series: 'Busca series con datos de TVMaze',
    movie: process.env.NEXT_PUBLIC_OMDB_API_KEY 
      ? 'Busca películas con datos de OMDb' 
      : 'Configura OMDb API Key para buscar películas',
    game: 'Agrega manualmente (API requiere key)'
  }
  return messages[type] || ''
}
