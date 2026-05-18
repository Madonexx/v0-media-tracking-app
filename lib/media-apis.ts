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
    { id: 'm1', title: 'The Dark Knight', year: '2008', score: 10, image_url: 'https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_FMjpg_UX1000_.jpg', status: 'terminado', genres: ['Acción', 'Crimen'], synopsis: 'Batman faces the Joker in Gotham City.' },
    { id: 'm2', title: 'Inception', year: '2010', score: 9, image_url: 'https://upload.wikimedia.org/wikipedia/en/2/2e/Inception_%282010%29_theatrical_poster.jpg', status: 'terminado', genres: ['Sci-Fi', 'Acción'], synopsis: 'A thief who steals corporate secrets through dream-sharing technology.' },
    { id: 'm_marvel1', title: 'The Avengers', year: '2012', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/RYMX2wcG4ArJs6qozrPeyLXzhS.jpg', status: 'terminado', genres: ['Acción', 'Marvel'], synopsis: 'Earth''s mightiest heroes must come together and learn to fight as a team.' },
    { id: 'm_sw1', title: 'Star Wars: A New Hope', year: '1977', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/6FfCtAuVAWn7v97797g9TM5S2fl.jpg', status: 'terminado', genres: ['Sci-Fi', 'Star Wars'], synopsis: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids.' },
    { id: 'm_ghibli1', title: 'Spirited Away', year: '2001', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/39wmItSslvfw1GvViI9GE967vwE.jpg', status: 'terminado', genres: ['Animación', 'Ghibli'], synopsis: 'A young girl wanders into a world ruled by gods, witches, and spirits.' },
    { id: 'm4', title: 'Pulp Fiction', year: '1994', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/d5iIl9h9btztm9kzccuTh7ogYvA.jpg', status: 'terminado', genres: ['Crimen', 'Drama'], synopsis: 'The lives of two mob hitmen, a boxer, a gangster and his wife.' },
    { id: 'm5', title: 'Interstellar', year: '2014', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlSaba7.jpg', status: 'terminado', genres: ['Sci-Fi', 'Drama'], synopsis: 'A team of explorers travel through a wormhole in space.' },
    { id: 'm_hp1', title: 'Harry Potter and the Philosopher''s Stone', year: '2001', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/wuMc08IPN797j9Bdua9lgYgSTyo.jpg', status: 'terminado', genres: ['Fantasía', 'Harry Potter'], synopsis: 'An orphaned boy enrolls in a school of wizardry.' },
  ],
  series: [
    { id: 's_p1', title: 'The Penguin', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/v9Q9Y7O5uN3oJbH4v2vO1Y3uI6.jpg', status: 'saliendo', genres: ['Crimen', 'Drama'], synopsis: 'Following the events of The Batman (2022), Oswald Cobblepot begins his rise in the underworld of Gotham City.' },
    { id: 's_bb', title: 'Breaking Bad', year: '2008', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/ggm8bbub6o97vUZY7CjhqnPaTFl.jpg', status: 'terminado', genres: ['Drama', 'Crimen'], synopsis: 'A high school chemistry teacher turned meth kingpin.' },
    { id: 's_got', title: 'Game of Thrones', year: '2011', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/1XS1oqLmxnySUTsX7uBvIHardS1.jpg', status: 'terminado', genres: ['Drama', 'Fantasía'], synopsis: 'Nine noble families fight for control over the lands of Westeros.' },
    { id: 's_tlou', title: 'The Last of Us', year: '2023', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/uKvH56B29db70Y1pDqsds6A77p2.jpg', status: 'terminado', genres: ['Drama', 'Acción'], synopsis: 'After a global pandemic destroys civilization, a hardened survivor takes charge of a 14-year-old girl.' },
    { id: 's3', title: 'Stranger Things', year: '2016', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/49WpIv1r32qfkU5q4kaOJuLsQH.jpg', status: 'saliendo', genres: ['Sci-Fi', 'Misterio'], synopsis: 'When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.' },
    { id: 's5', title: 'Arcane', year: '2021', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/fqld92u4asJhp99v3sTMBu0vTSZ.jpg', status: 'terminado', genres: ['Animación', 'Acción'], synopsis: 'Set in utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions.' },
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
  ],
  anime: [
    { id: 'a1', title: 'Death Note', year: '2006', score: 9, image_url: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg', status: 'terminado', genres: ['Misterio', 'Sobrenatural'], synopsis: 'Un estudiante encuentra un cuaderno que mata a quienes tienen su nombre escrito.' },
    { id: 'a2', title: 'Attack on Titan', year: '2013', score: 9, image_url: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg', status: 'terminado', genres: ['Acción', 'Drama'], synopsis: 'La humanidad lucha por sobrevivir contra gigantes caníbales.' },
    { id: 'a3', title: 'Fullmetal Alchemist: Brotherhood', year: '2009', score: 10, image_url: 'https://cdn.myanimelist.net/images/anime/1223/96541.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'Dos hermanos buscan la piedra filosofal para recuperar sus cuerpos.' },
    { id: 'a4', title: 'One Piece', year: '1999', score: 9, image_url: 'https://cdn.myanimelist.net/images/anime/6/73245.jpg', status: 'saliendo', genres: ['Acción', 'Aventura'], synopsis: 'Monkey D. Luffy busca convertirse en el Rey de los Piratas.' },
    { id: 'a5', title: 'Jujutsu Kaisen', year: '2020', score: 9, image_url: 'https://cdn.myanimelist.net/images/anime/1127/113977.jpg', status: 'terminado', genres: ['Acción', 'Sobrenatural'], synopsis: 'Un estudiante se une a una organización de hechiceros para combatir maldiciones.' },
    { id: 'a6', title: 'Demon Slayer', year: '2019', score: 9, image_url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg', status: 'terminado', genres: ['Acción', 'Fantasía'], synopsis: 'Tanjiro busca una cura para su hermana convertida en demonio.' },
    { id: 'a7', title: 'Frieren: Beyond Journey\'s End', year: '2023', score: 10, image_url: 'https://cdn.myanimelist.net/images/anime/1015/138062.jpg', status: 'terminado', genres: ['Aventura', 'Fantasía'], synopsis: 'Una elfa inmortal reflexiona sobre la vida después de su gran aventura.' },
    { id: 'a8', title: 'Naruto Shippuden', year: '2007', score: 8, image_url: 'https://cdn.myanimelist.net/images/anime/5/17407.jpg', status: 'terminado', genres: ['Acción', 'Aventura'], synopsis: 'Naruto continúa su camino para convertirse en Hokage.' },
  ],
  book: [
    { id: 'b1', title: 'The Great Gatsby', year: '1925', score: 8, image_url: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', status: 'terminado', genres: ['Clásico', 'Ficción'], synopsis: 'A story of wealth, love, and the American Dream in the 1920s.' },
    { id: 'b2', title: '1984', year: '1949', score: 9, image_url: 'https://covers.openlibrary.org/b/id/12643818-L.jpg', status: 'terminado', genres: ['Distopía', 'Sci-Fi'], synopsis: 'A chilling look at a totalitarian future where Big Brother is always watching.' },
    { id: 'b3', title: 'Harry Potter and the Philosopher\'s Stone', year: '1997', score: 9, image_url: 'https://covers.openlibrary.org/b/id/10521270-L.jpg', status: 'terminado', genres: ['Fantasía', 'Aventura'], synopsis: 'A young boy discovers he is a wizard and begins his education at Hogwarts.' },
    { id: 'b4', title: 'The Hobbit', year: '1937', score: 9, image_url: 'https://covers.openlibrary.org/b/id/8406786-L.jpg', status: 'terminado', genres: ['Fantasía', 'Aventura'], synopsis: 'Bilbo Baggins is swept into an epic quest to reclaim the Lonely Mountain.' },
    { id: 'b5', title: 'To Kill a Mockingbird', year: '1960', score: 9, image_url: 'https://covers.openlibrary.org/b/id/8225266-L.jpg', status: 'terminado', genres: ['Clásico', 'Drama'], synopsis: 'A story of racial injustice and the loss of innocence in the American South.' },
    { id: 'b6', title: 'The Catcher in the Rye', year: '1951', score: 7, image_url: 'https://covers.openlibrary.org/b/id/8231991-L.jpg', status: 'terminado', genres: ['Clásico', 'Ficción'], synopsis: 'Holden Caulfield navigates the complexities of teenage angst and alienation.' },
    { id: 'b7', title: 'Pride and Prejudice', year: '1813', score: 9, image_url: 'https://covers.openlibrary.org/b/id/12711617-L.jpg', status: 'terminado', genres: ['Clásico', 'Romance'], synopsis: 'The sparkling story of Elizabeth Bennet and Mr. Darcy.' },
    { id: 'b8', title: 'The Lord of the Rings', year: '1954', score: 10, image_url: 'https://covers.openlibrary.org/b/id/8233362-L.jpg', status: 'terminado', genres: ['Fantasía', 'Aventura'], synopsis: 'An epic quest to destroy the One Ring and defeat the Dark Lord Sauron.' },
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
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&fields=key,title,author_name,author_names,first_publish_year,cover_i,subject,number_of_pages_median`
    )
    
    if (!response.ok) throw new Error('Open Library API error')
    
    const data = await response.json()
    
    return data.docs?.map((item: any) => ({
      id: `ol-${item.key.replace('/works/', '')}`,
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
      author: item.author_name?.join(', ') || item.author_names?.join(', ') || null
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
      const response = await fetch('https://api.jikan.moe/v4/top/anime?limit=20')
      if (!response.ok) throw new Error('Jikan API error')
      const data = await response.json()
      return data.data?.map((item: any) => ({
        id: `mal-${item.mal_id}`,
        title: item.title,
        image_url: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null,
        year: item.year?.toString() || (item.aired?.from ? item.aired.from.slice(0, 4) : null),
        genres: item.genres?.map((g: any) => g.name) || [],
        synopsis: item.synopsis?.slice(0, 200) || null,
        score: item.score ? Math.round(item.score) : null,
        status: mapAnimeStatus(item.status),
        episodes: item.episodes || null
      })) || []
    }

    if (type === 'book') {
      const response = await fetch('https://openlibrary.org/trending/daily.json?limit=20')
      if (!response.ok) throw new Error('Open Library API error')
      const data = await response.json()
      return data.works?.map((item: any) => ({
        id: `ol-${item.key.replace('/works/', '')}`,
        title: item.title,
        image_url: item.cover_i 
          ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg`
          : null,
        year: item.first_publish_year?.toString() || null,
        genres: [],
        synopsis: null,
        score: null,
        status: 'terminado',
        author: item.author_name?.join(', ') || item.author_names?.join(', ') || null
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
