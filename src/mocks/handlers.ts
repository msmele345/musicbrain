import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('http://localhost:8080/api/genres/top', () => {
        return HttpResponse.json([{
            name: 'Techno',
            count: '5',
            url: 'www.google.com',
        }])
    }),
    http.get('http://localhost:8080/api/artists/top?period=7d&limit=10', () => {
        return HttpResponse.json(
            [
                {
                    name: 'Techno',
                    playcount: '7',
                    imageUrl: 'https://www.freepik.com/free-photos-vectors/concert-crowd',
                    url: 'www.google.com',
                }
            ])
    }),
    http.get('http://localhost:8080/api/tracks/recent?limit=20', () => {
        return HttpResponse.json(
            [
                {
                    name: 'Solomun',
                    artist: 'DJ',
                    album: 'Dance',
                    timestamp: '2024-06-01T12:00:00Z',
                    nowPlaying: false,
                }
            ])
    }),
    http.get('http://localhost:8080/api/discovery/suggested', () => {
        return HttpResponse.json(
            [
                {
                    name: 'Beltran',
                    match: 'DJ',
                    url: 'www.google.com',
                    imageUrl: 'https://www.freepik.com/free-photos-vectors/concert-crowd',
                }
            ])
    }),
]

export default handlers;