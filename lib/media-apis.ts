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
