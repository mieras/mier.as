# Music Data API Migration

De music componenten (RecentlyPlayed, Mixtapes, LatestRecords) zijn nu aangepast om realtime data op te halen via API endpoints in plaats van statisch te renderen bij build time.

## Wat is er veranderd?

1. **API Endpoints**: Drie nieuwe API endpoints zijn toegevoegd in `src/pages/api/music/`:
   - `/api/music/recently-played` - Last.fm data
   - `/api/music/mixtapes` - Mixcloud data
   - `/api/music/latest-records` - Discogs data

2. **Client-side rendering**: Componenten laden nu data client-side wanneer een tab wordt geopend
3. **SessionStorage caching**: Data wordt gecached in sessionStorage (5 minuten) om dubbele requests te voorkomen
4. **Lazy loading**: Data wordt alleen opgehaald wanneer een tab actief wordt

## Environment Variables

⚠️ **BELANGRIJK**: De environment variables moeten worden aangepast in Netlify:

### Verwijder (oude PUBLIC_ variabelen):
- `PUBLIC_LASTFM_USERNAME`
- `PUBLIC_LASTFM_API_KEY`
- `PUBLIC_MIXCLOUD_USERNAME`
- `PUBLIC_DISCOGS_USERNAME`
- `PUBLIC_DISCOGS_TOKEN`

### Voeg toe (nieuwe server-side variabelen):
- `LASTFM_USERNAME` - Je Last.fm gebruikersnaam
- `LASTFM_API_KEY` - Je Last.fm API key
- `MIXCLOUD_USERNAME` - Je Mixcloud gebruikersnaam (default: 'mieras')
- `DISCOGS_USERNAME` - Je Discogs gebruikersnaam
- `DISCOGS_TOKEN` - Je Discogs API token

## Hoe het werkt

1. **Eerste bezoek**: Wanneer een gebruiker de site opent en een tab opent, wordt de data opgehaald via de API endpoint
2. **Tab switching**: Als je tijdens dezelfde sessie van tab wisselt, wordt de gecachte data gebruikt (geen nieuwe request)
3. **Refresh/nieuw bezoek**: Bij een refresh of nieuw bezoek wordt de cache gewist en wordt nieuwe data opgehaald

## Caching

- **Cache duur**: 5 minuten per data type
- **Cache locatie**: `sessionStorage` (wordt gewist bij sluiten van tab/browser)
- **Cache keys**:
  - `recently-played-data` / `recently-played-timestamp`
  - `mixtapes-data` / `mixtapes-timestamp`
  - `latest-records-data` / `latest-records-timestamp`

## Voordelen

✅ **Realtime data**: Data wordt per bezoek opgehaald, niet bij build time
✅ **Veiligheid**: API keys blijven server-side (niet zichtbaar in client)
✅ **Performance**: Lazy loading - data wordt alleen opgehaald wanneer nodig
✅ **Efficiëntie**: SessionStorage voorkomt onnodige requests tijdens dezelfde sessie
✅ **Netlify compatibel**: Werkt perfect met Astro SSR en Netlify adapter

## Troubleshooting

Als de data niet laadt:
1. Controleer of de environment variables correct zijn ingesteld in Netlify
2. Check de browser console voor errors
3. Controleer de Netlify function logs voor API errors
4. Verifieer dat de API endpoints bereikbaar zijn: `/api/music/recently-played`, etc.

