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

// Generic search that routes to the right API
export async function searchMedia(query: string, type: string): Promise<SearchResult[]> {
  switch (type) {
    case 'anime':
      return searchAnime(query)
    case 'book':
      return searchBooks(query)
    // Movies, series, and games don't have free APIs without keys
    // Return empty for now - user can add manually
    case 'movie':
    case 'series':
    case 'game':
    default:
      return []
  }
}

// Fetch trending/top items for the catalog
export async function getTrendingMedia(type: string): Promise<SearchResult[]> {
  try {
    if (type === 'anime') {
      // Pedimos 100 para tener un margen de filtrado muy amplio
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

    // Listas ampliadas para tipos sin APIs gratuitas
    if (type === 'movie') {
      return [
        { id: 'm1', title: 'The Dark Knight', year: '2008', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDp9EXm7FbmZkG9v96A.jpg', status: 'terminado', genres: ['Acción', 'Crimen'] },
        { id: 'm2', title: 'Inception', year: '2010', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/edv5CZvfkjSnsOefv9YCc7Yojha.jpg', status: 'terminado', genres: ['Sci-Fi', 'Acción'] },
        { id: 'm3', title: 'Spiderman: Into the Spiderverse', year: '2018', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/iiZZmzguMTvH2adTL4bS7qYtUfS.jpg', status: 'terminado', genres: ['Animación', 'Aventura'] },
        { id: 'm4', title: 'Pulp Fiction', year: '1994', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/d5iIl9h9btztm9kzccuTh7ogYvA.jpg', status: 'terminado', genres: ['Crimen', 'Drama'] },
        { id: 'm5', title: 'Interstellar', year: '2014', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlSaba7.jpg', status: 'terminado', genres: ['Sci-Fi', 'Drama'] },
        { id: 'm6', title: 'The Godfather', year: '1972', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/3bhkrj9brv4FvBSv9pST99WpYQ7.jpg', status: 'terminado', genres: ['Crimen', 'Drama'] },
        { id: 'm7', title: 'Fight Club', year: '1999', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/pB8BM7pdv9ovvyhS9677qrq6vWv.jpg', status: 'terminado', genres: ['Drama'] },
        { id: 'm8', title: 'The Matrix', year: '1999', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/f89U3Y9L92MDmwsXoWCcEbYqY9G.jpg', status: 'terminado', genres: ['Acción', 'Sci-Fi'] },
        { id: 'm9', title: 'Gladiator', year: '2000', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/ty8TGRuBMv3Ohy1o2tDzXgOqbiM.jpg', status: 'terminado', genres: ['Acción', 'Drama'] },
        { id: 'm10', title: 'The Shawshank Redemption', year: '1994', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/95S6sXG07Yp6MJsSKHTv9Y9D0sx.jpg', status: 'terminado', genres: ['Drama'] },
        { id: 'm11', title: 'Dune: Part Two', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/8bBihcbzqS5akAdLv99YICZth9n.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
        { id: 'm12', title: 'Everything Everywhere All at Once', year: '2022', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/rKvCysSko4Yp3Z6wn7hs6p6YtPc.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
        { id: 'm13', title: 'The Prestige', year: '2006', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/bdN3g8E5p0rkL99S67UMm89Uo9B.jpg', status: 'terminado', genres: ['Drama', 'Misterio'] },
        { id: 'm14', title: 'Parasite', year: '2019', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/7IiTTjSFeSbbX7ST9ExW0YpS72n.jpg', status: 'terminado', genres: ['Comedia', 'Drama', 'Thriller'] },
        { id: 'm15', title: 'Whiplash', year: '2014', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Drama', 'Música'] },
        { id: 'm16', title: 'Inglourious Basterds', year: '2009', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Acción', 'Guerra'] },
        { id: 'm17', title: 'Mad Max: Fury Road', year: '2015', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/h6rsS6Y3fUvC93AK9JaEV9967S7.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
        { id: 'm18', title: 'The Wolf of Wall Street', year: '2013', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/p7S6S0UQ49SSTpXN9C9P9P9P9P9.jpg', status: 'terminado', genres: ['Biografía', 'Comedia'] },
        { id: 'm19', title: 'Joker', year: '2019', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/udDclKVXv9qOXCtWg8krS9mFJtq.jpg', status: 'terminado', genres: ['Crimen', 'Drama'] },
        { id: 'm20', title: 'Arrival', year: '2016', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/x89U3Y9L92MDmwsXoWCcEbYqY9G.jpg', status: 'terminado', genres: ['Sci-Fi', 'Drama'] },
        { id: 'm21', title: 'The Truman Show', year: '1998', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia', 'Drama'] },
        { id: 'm22', title: 'Goodfellas', year: '1990', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Drama'] },
        { id: 'm23', title: 'Se7en', year: '1995', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Misterio'] },
        { id: 'm24', title: 'Blade Runner 2049', year: '2017', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Sci-Fi', 'Drama'] },
      ]
    }

    if (type === 'series') {
      return [
        { id: 's1', title: 'Breaking Bad', year: '2008', score: 10, image_url: 'https://image.tmdb.org/t/p/w500/ggm8bbub6o97vUZY7CjhqnPaTFl.jpg', status: 'terminado', genres: ['Drama', 'Crimen'] },
        { id: 's2', title: 'The Last of Us', year: '2023', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/uKvH56B29db70Y1pDqsds6A77p2.jpg', status: 'terminado', genres: ['Drama', 'Acción'] },
        { id: 's3', title: 'Stranger Things', year: '2016', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/49WpIv1r32qfkU5q4kaOJuLsQH.jpg', status: 'saliendo', genres: ['Sci-Fi', 'Misterio'] },
        { id: 's4', title: 'Better Call Saul', year: '2015', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/fC2SzyUBkyj9vS79tYnWoU7v9Xy.jpg', status: 'terminado', genres: ['Drama', 'Crimen'] },
        { id: 's5', title: 'Succession', year: '2018', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/7Yis9S9O06u9L8v6Ovy9Yf9M8yY.jpg', status: 'terminado', genres: ['Drama'] },
        { id: 's6', title: 'Dark', year: '2017', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/apbr08kOTmdf9G66p2H2p9p66V1.jpg', status: 'terminado', genres: ['Sci-Fi', 'Misterio'] },
        { id: 's7', title: 'The Bear', year: '2022', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/pVr690pCAs08zT96S97m44q6fU7.jpg', status: 'saliendo', genres: ['Drama'] },
        { id: 's8', title: 'Arcane', year: '2021', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/fqld92u4asJhp99v3sTMBu0vTSZ.jpg', status: 'terminado', genres: ['Animación', 'Acción'] },
        { id: 's9', title: 'The Boys', year: '2019', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/7Ns94Y67u9X3AnmN2pU6Y0W6K3z.jpg', status: 'saliendo', genres: ['Acción', 'Sci-Fi'] },
        { id: 's10', title: 'House of the Dragon', year: '2022', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/7reM6U3Y6251fW2S9P6VlM7D3vS.jpg', status: 'saliendo', genres: ['Sci-Fi', 'Aventura'] },
        { id: 's11', title: 'Sherlock', year: '2010', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Drama'] },
        { id: 's12', title: 'The Crown', year: '2016', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/r07O0S3N5X4jD4U1A4R4kR8Y4Y4.jpg', status: 'terminado', genres: ['Drama', 'Historia'] },
        { id: 's13', title: 'Game of Thrones', year: '2011', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Fantasía', 'Drama'] },
        { id: 's14', title: 'The Office', year: '2005', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia'] },
        { id: 's15', title: 'Peaky Blinders', year: '2013', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Drama', 'Crimen'] },
        { id: 's16', title: 'Black Mirror', year: '2011', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Sci-Fi', 'Antología'] },
        { id: 's17', title: 'The Mandalorian', year: '2019', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Acción', 'Sci-Fi'] },
        { id: 's18', title: 'Ted Lasso', year: '2020', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia', 'Deportes'] },
        { id: 's19', title: 'Fleabag', year: '2016', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Comedia', 'Drama'] },
        { id: 's20', title: 'Mindhunter', year: '2017', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'cancelado', genres: ['Crimen', 'Drama'] },
        { id: 's21', title: 'Severance', year: '2022', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Thriller', 'Sci-Fi'] },
        { id: 's22', title: 'The White Lotus', year: '2021', score: 8, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'saliendo', genres: ['Comedia', 'Drama'] },
        { id: 's23', title: 'Shogun', year: '2024', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Drama', 'Historia'] },
        { id: 's24', title: 'The Sopranos', year: '1999', score: 9, image_url: 'https://image.tmdb.org/t/p/w500/799696o82Y0p9kR0i9S6WlZ0p9k.jpg', status: 'terminado', genres: ['Crimen', 'Drama'] },
      ]
    }

    if (type === 'game') {
      return [
        { id: 'g1', title: 'Elden Ring', year: '2022', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4ksi.jpg', status: 'terminado', genres: ['RPG', 'Acción'] },
        { id: 'g2', title: 'The Legend of Zelda: Tears of the Kingdom', year: '2023', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5v6v.jpg', status: 'terminado', genres: ['Aventura', 'Acción'] },
        { id: 'g3', title: 'Baldur\'s Gate 3', year: '2023', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co670h.jpg', status: 'terminado', genres: ['RPG', 'Estrategia'] },
        { id: 'g4', title: 'God of War Ragnarök', year: '2022', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5s5v.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
        { id: 'g5', title: 'Cyberpunk 2077', year: '2020', score: 8, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg', status: 'terminado', genres: ['RPG', 'Acción'] },
        { id: 'g6', title: 'Hades', year: '2020', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Acción', 'Indie'] },
        { id: 'g7', title: 'Red Dead Redemption 2', year: '2018', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
        { id: 'g8', title: 'The Witcher 3: Wild Hunt', year: '2015', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg', status: 'terminado', genres: ['RPG', 'Acción'] },
        { id: 'g9', title: 'Persona 5 Royal', year: '2019', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcp.jpg', status: 'terminado', genres: ['RPG', 'Simulación'] },
        { id: 'g10', title: 'Ghost of Tsushima', year: '2020', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
        { id: 'g11', title: 'Sekiro: Shadows Die Twice', year: '2019', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1vcp.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
        { id: 'g12', title: 'Final Fantasy VII Rebirth', year: '2024', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7idk.jpg', status: 'terminado', genres: ['RPG', 'Acción'] },
        { id: 'g13', title: 'Grand Theft Auto V', year: '2013', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción'] },
        { id: 'g14', title: 'Mass Effect Legendary Edition', year: '2021', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg', status: 'terminado', genres: ['RPG', 'Sci-Fi'] },
        { id: 'g15', title: 'Dark Souls III', year: '2016', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2mdf.jpg', status: 'terminado', genres: ['RPG', 'Acción'] },
        { id: 'g16', title: 'Resident Evil 4 Remake', year: '2023', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co64nd.jpg', status: 'terminado', genres: ['Horror', 'Acción'] },
        { id: 'g17', title: 'Outer Wilds', year: '2019', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Exploración', 'Indie'] },
        { id: 'g18', title: 'Hollow Knight', year: '2017', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Metroidvania', 'Indie'] },
        { id: 'g19', title: 'Bloodborne', year: '2015', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción', 'RPG'] },
        { id: 'g20', title: 'Disco Elysium', year: '2019', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['RPG'] },
        { id: 'g21', title: 'Minecraft', year: '2011', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Sandbox'] },
        { id: 'g22', title: 'Stardew Valley', year: '2016', score: 9, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co29rx.jpg', status: 'terminado', genres: ['Simulación', 'Indie'] },
        { id: 'g23', title: 'Helldivers 2', year: '2024', score: 8, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co7idk.jpg', status: 'saliendo', genres: ['Acción', 'Shooter'] },
        { id: 'g24', title: 'God of War (2018)', year: '2018', score: 10, image_url: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7h.jpg', status: 'terminado', genres: ['Acción', 'Aventura'] },
      ]
    }

    return []
  } catch (error) {
    console.error(`Error getting trending ${type}:`, error)
    return []
  }
}

    return []
  } catch (error) {
    console.error(`Error getting trending ${type}:`, error)
    return []
  }
}

// Check if a media type supports API search
export function supportsApiSearch(type: string): boolean {
  return ['anime', 'book'].includes(type)
}

export function getApiSearchMessage(type: string): string {
  const messages: Record<string, string> = {
    anime: 'Busca anime con datos de MyAnimeList',
    book: 'Busca libros con datos de Open Library',
    movie: 'Agrega manualmente (API requiere key)',
    series: 'Agrega manualmente (API requiere key)',
    game: 'Agrega manualmente (API requiere key)'
  }
  return messages[type] || ''
}
