export interface Tag {
  name: string
  count: number
  url: string
}

export interface Artist {
  name: string
  playcount: string
  url: string
  imageUrl: string | null
}

export interface Track {
  name: string
  artist: string
  album: string
  timestamp: string | null
  nowPlaying: boolean
}

export interface SimilarArtist {
  name: string
  match: number
  url: string
  imageUrl: string | null
}

const BASE_URL = 'http://localhost:8080'

export async function getTopGenres(): Promise<Tag[]> {
  const response = await fetch(`${BASE_URL}/api/genres/top`)
  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.statusText}`)
  }
  return response.json() as Promise<Tag[]>
}

export async function getTopArtists(period = '7day', limit = 10): Promise<Artist[]> {
  const response = await fetch(`${BASE_URL}/api/artists/top?period=${period}&limit=${limit}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch top artists: ${response.statusText}`)
  }
  return response.json() as Promise<Artist[]>
}

export async function getRecentTracks(limit = 20): Promise<Track[]> {
  const response = await fetch(`${BASE_URL}/api/tracks/recent?limit=${limit}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch recent tracks: ${response.statusText}`)
  }
  return response.json() as Promise<Track[]>
}

export async function getSuggestedArtists(): Promise<SimilarArtist[]> {
  const response = await fetch(`${BASE_URL}/api/discovery/suggested`)
  if (!response.ok) {
    throw new Error(`Failed to fetch suggested artists: ${response.statusText}`)
  }
  return response.json() as Promise<SimilarArtist[]>
}
