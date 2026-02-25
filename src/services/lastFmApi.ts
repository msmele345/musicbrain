export interface Tag {
  name: string
  count: number
  url: string
}

const BASE_URL = 'http://localhost:8080'

export async function getTopGenres(): Promise<Tag[]> {
  const response = await fetch(`${BASE_URL}/api/genres/top`)
  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.statusText}`)
  }
  return response.json() as Promise<Tag[]>
}
