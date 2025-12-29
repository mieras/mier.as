# Astro + Sanity CMS

Modern, toegankelijke website gebouwd met [Astro](https://astro.build) en [Sanity CMS](https://www.sanity.io). Dit project combineert de kracht van static site generation met een flexibel headless CMS voor optimale performance en content management.

## ✨ Features

### 🎨 Content Management

- **Sanity CMS** integratie voor headless content management
- **11 verschillende content blocks**: Text, Image, Video, Columns, Services, Team, Testimonials, Clients, Color blocks, Embed en Text Grid
- **Dynamische pagina types**: Homepage, Work Overview, Project Detail, en reguliere pagina's
- **Portable Text** rendering voor rijke content formatting
- **Sanity Studio** voor content editors

### 🎬 Media & Embedding

- **GDPR-compliant video embeds** (YouTube/Vimeo) met cookie consent
- **MP4 upload** ondersteuning voor directe video hosting
- **Custom poster images** voor alle video types
- **Responsive image handling** met Sanity CDN optimalisatie

### 🎯 Design & Layout

- **Breakout Grid System** met 5 niveau's (full, page, feature, popout, content)
- **Dark Mode** met localStorage persistentie
- **View Transitions** voor smooth page navigatie
- **Responsive typography** met Utopia type scale
- **SCSS modules** voor gestructureerde styling

### 🚀 Performance

- Static site generation met Astro
- Optimized image delivery via Sanity CDN
- Code splitting en lazy loading
- Netlify deployment ready

## ♿ (Accessibility) Features

- Astro 4.0
- Tailwind CSS support
- Prettier integration with `prettier-plugin-astro` and `prettier-plugin-tailwind`
- ESLint integration with strict accessibility settings for `eslint-plugin-jsx-a11y`
- Markdown and MDX support with examples included in the theme
- Uses the awesome `astro-icon` package for the icons
- Excellent Lighthouse/PageSpeed scores
- Accessible landmarks such as `header`, `main`, `footer`, `section` and `nav`
- Outline focus indicator which works on dark and light backgrounds
- Several `aria` attributes which provide a better experience for screen reader users
- `[...page].astro` and `[post].astro` demonstrate the use of dynamic routes and provide a basic blog with breadcrumbs and pagination
- `404.astro` provides a custom 404 error page which you can adjust to your needs
- `Header.astro` component included in the `DefaultLayout.astro` layout
- `Footer.astro` component included in the `DefaultLayout.astro` layout
- `SkipLinks.astro` component to skip to either the main menu or the main content
- `Navigation.astro` component with keyboard accessible (dropdown) navigation (arrow keys, escape key)
- `ResponsiveToggle.astro` component with an accessible responsive toggle button for the mobile navigation
- `DarkMode.astro` component toggle with accessible button and a user system preferred color scheme setting
- `SiteMeta.astro` SEO component for setting custom meta data on different pages
- `.sr-only` utility class for screen reader only text content (hides text visually)
- `prefers-reduced-motion` disables animations for users that have this preference turned on
- Ships with many components such as Accordions, Breadcrumbs, Modals, Pagination [and many more](https://accessible-astro.dev/accessible-components)
- A collection of utility classes such as breakpoints, button classes, font settings, resets and outlines in `src/assets/scss/base`
- View Transitions (⚠️ see [astro-docs](https://docs.astro.build/en/guides/view-transitions/#accessibility) for accessibility considerations)

## 🚀 Getting started

### 1. Installeer dependencies

```bash
npm install
```

### 2. Sanity CMS Setup

1. **Maak een Sanity project aan** op [sanity.io](https://www.sanity.io)
2. **Kopieer `.env.example` naar `.env`** en vul de waarden in:
   ```bash
   cp .env.example .env
   ```
3. **Vul je credentials in** in `.env`:
   - **Sanity:**
     - `PUBLIC_SANITY_PROJECT_ID`: Je Sanity Project ID (vind je in [Sanity Manage](https://www.sanity.io/manage))
     - `PUBLIC_SANITY_DATASET`: Meestal `"production"` of `"development"`
     - `PUBLIC_SANITY_API_VERSION`: API versie (standaard: `"2025-01-28"`)
     - `SANITY_API_READ_TOKEN`: Alleen nodig voor Visual Editing (optioneel)
   - **Last.fm** (optioneel, voor Recently Played):
     - `PUBLIC_LASTFM_USERNAME`: Je Last.fm username
     - `PUBLIC_LASTFM_API_KEY`: Je Last.fm API key (krijg je op [last.fm/api](https://www.last.fm/api))
   - **Discogs** (optioneel, voor Latest Records):
     - `PUBLIC_DISCOGS_USERNAME`: Je Discogs username
     - `PUBLIC_DISCOGS_TOKEN`: Je Discogs API token (krijg je op [discogs.com/settings/developers](https://www.discogs.com/settings/developers))
   - **WeatherAPI** (optioneel, voor temperatuur in navigatie):
     - `PUBLIC_WEATHER_API_KEY`: Je WeatherAPI key (krijg je op [weatherapi.com](https://www.weatherapi.com))

4. **Voor Sanity Studio**, kopieer `studio/.env.example` naar `studio/.env.local`:
   ```bash
   cp studio/.env.example studio/.env.local
   ```
   Vul `SANITY_STUDIO_PROJECT_ID` en `SANITY_STUDIO_DATASET` in (moeten overeenkomen met root `.env`)

### 3. Start de development server

```bash
npm run dev
```

De website draait nu op `http://localhost:4321`

### 4. Start Sanity Studio (optioneel)

In een aparte terminal:

```bash
cd studio
npm run dev
```

Sanity Studio draait nu op `http://localhost:3333`

## 📦 Beschikbare commando's

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Installeert dependencies                    |
| `npm run dev`     | Start lokale dev server op `localhost:4321` |
| `npm run build`   | Bouwt productie site naar `./dist/`         |
| `npm run preview` | Preview je build lokaal, voor deployen      |
| `npm run format`  | Format alle bestanden met Prettier          |

## 📐 Content Blocks

Het project bevat 11 verschillende content blocks die je in Sanity Studio kunt gebruiken:

| Block                | Beschrijving                                         |
| -------------------- | ---------------------------------------------------- |
| **TextBlock**        | Rijke tekst content met Portable Text                |
| **ImageBlock**       | Afbeeldingen met optionele captions en sizing        |
| **VideoBlock**       | YouTube/Vimeo embeds (GDPR-compliant) of MP4 uploads |
| **ColumnsBlock**     | 2-4 kolommen met geneste content blocks              |
| **ServicesBlock**    | Service overzicht met optionele beschrijvingen       |
| **TeamBlock**        | Team member presentatie                              |
| **TestimonialBlock** | Klant testimonials met foto's                        |
| **ClientsBlock**     | Client logos overzicht                               |
| **ColorBlock**       | Volledige breedte kleur blokken                      |
| **EmbedBlock**       | Custom embed code                                    |
| **TextGridBlock**    | Grid layout voor tekst content                       |

Alle blocks ondersteunen verschillende size opties (content, popout, feature, page, full) voor flexibele layout controle.

## 🎨 Layout System

Het project gebruikt een **Breakout Grid System** met 5 niveau's:

- **full**: Volledige viewport breedte
- **page**: Max breedte met consistente padding
- **feature**: Breed content gebied
- **popout**: Medium content gebied
- **content**: Standaard leesbare breedte

Blocks kunnen deze sizes gebruiken voor responsieve, flexibele layouts.

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) 5.15.1
- **CMS**: [Sanity](https://www.sanity.io) 4.11.0
- **Styling**: SCSS + Tailwind CSS
- **Type Safety**: TypeScript
- **Image Optimization**: @sanity/image-url
- **Video Embeds**: @orestbida/iframemanager + vanilla-cookieconsent
- **Deployment**: Netlify

## 🔐 Security

### Belangrijke Waarschuwingen

- ⚠️ Commit **NOOIT** je `.env` bestanden
- 📝 `.env.example` is een template - kopieer en vul in met je eigen credentials
- 🔄 Rotate tokens regelmatig, vooral na repository migraties
- 🔒 Alle gevoelige data is uit git history verwijderd
- 🚫 **NOOIT** hardcode API keys of tokens in source code

### Environment Variables Overzicht

#### Public Variables (Client-side) - Veilig om te delen

Deze variabelen hebben het `PUBLIC_` prefix en zijn beschikbaar in de browser. Ze zijn **veilig om te delen** omdat ze alleen read-only toegang geven:

- `PUBLIC_SANITY_PROJECT_ID` - Sanity project identifier (read-only)
- `PUBLIC_SANITY_DATASET` - Sanity dataset naam (read-only)
- `PUBLIC_SANITY_API_VERSION` - Sanity API versie (standaard: `"2025-01-28"`)
- `PUBLIC_LASTFM_USERNAME` - Last.fm username (niet gevoelig)
- `PUBLIC_DISCOGS_USERNAME` - Discogs username (niet gevoelig)
- `PUBLIC_MIXCLOUD_USERNAME` - Mixcloud username (niet gevoelig)
- `PUBLIC_WEATHER_API_KEY` - WeatherAPI key voor temperatuur in navigatie

#### Private Variables (Server-side) - NOOIT committen

Deze variabelen zijn **gevoelig** en moeten **NOOIT** gecommit worden:

- `SANITY_API_READ_TOKEN` - Sanity read token (alleen voor Visual Editing, server-side)
- `PUBLIC_LASTFM_API_KEY` - Last.fm API key (gebruikt in server-side API endpoints)
- `PUBLIC_DISCOGS_TOKEN` - Discogs API token (gebruikt in server-side API endpoints)

**Opmerking**: Hoewel `PUBLIC_LASTFM_API_KEY` en `PUBLIC_DISCOGS_TOKEN` het `PUBLIC_` prefix hebben, worden ze alleen gebruikt in server-side API endpoints (`src/pages/api/`) en zijn niet direct zichtbaar in de browser.

### Security Best Practices

1. **API Key Management**
   - Gebruik altijd environment variables, nooit hardcoded keys
   - Rotate API keys regelmatig
   - Gebruik verschillende keys voor development en production
   - Monitor API usage voor ongebruikelijke activiteit

2. **Sanity Security**
   - Sanity queries gebruiken parameterized queries (veilig tegen injection)
   - `SANITY_API_READ_TOKEN` alleen gebruiken voor Visual Editing
   - Gebruik CDN voor published content (standaard)
   - Gebruik `useCdn: false` alleen voor draft preview

3. **API Endpoints**
   - Alle API endpoints hebben error handling
   - Input validation via Sanity queries (parameterized)
   - Cache headers voor performance en rate limiting
   - Geen gevoelige data in error messages

4. **Git Security**
   - `.gitignore` is correct geconfigureerd voor `.env` bestanden
   - Nooit credentials in commit messages
   - Gebruik git-secrets of pre-commit hooks voor extra beveiliging

## 📁 Project Structuur

```
mier.as/
├── public/                   # Static assets (fonts, images, favicon)
│   ├── fonts/                # Web fonts
│   ├── images/               # Static images en icons
│   └── css/                   # Third-party CSS (cookieconsent, iframemanager)
│
├── src/
│   ├── assets/               # Source assets en styles
│   │   ├── scss/             # SCSS modules
│   │   │   ├── base/         # Base styles (reset, typography, colors, tokens)
│   │   │   └── globals.scss  # Global styles import
│   │   ├── global.css        # Global CSS
│   │   └── img/               # Source images
│   │
│   ├── components/           # Astro components
│   │   ├── blocks/           # Content block components (11 types)
│   │   │   ├── TextBlock.astro
│   │   │   ├── ImageBlock.astro
│   │   │   ├── VideoBlock.astro
│   │   │   ├── ColumnsBlock.astro
│   │   │   ├── CarouselBlock.astro
│   │   │   ├── GalleryBlock.astro
│   │   │   ├── TestimonialBlock.astro
│   │   │   ├── ClientsBlock.astro
│   │   │   ├── ColorBlock.astro
│   │   │   ├── EmbedBlock.astro
│   │   │   └── TextGridBlock.astro
│   │   │
│   │   ├── sections/         # Page sections
│   │   │   ├── HeroSection.astro
│   │   │   ├── HeroMediaThree.astro
│   │   │   ├── WorkSection.astro
│   │   │   ├── WorkMarquee.astro
│   │   │   ├── MusicSection.astro
│   │   │   ├── MusicMarquee.astro
│   │   │   ├── work/          # Work-related components
│   │   │   │   ├── WorkCarousel.astro
│   │   │   │   ├── WorkDetail.astro
│   │   │   │   ├── WorkList.astro
│   │   │   │   ├── WorkPanel.astro
│   │   │   │   └── ...
│   │   │   └── music/         # Music-related components
│   │   │       ├── RecentlyPlayed.astro
│   │   │       ├── LatestRecords.astro
│   │   │       ├── Mixtapes.astro
│   │   │       └── ui/
│   │   │
│   │   ├── templates/        # Page templates
│   │   │   ├── Home.astro
│   │   │   ├── Page.astro
│   │   │   ├── WorkDetail.astro
│   │   │   └── WorkOverview.astro
│   │   │
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── TabGroup.astro
│   │   │   ├── Marquee.astro
│   │   │   └── ScrollMarquee.astro
│   │   │
│   │   ├── BlockRenderer.astro  # Renders content blocks
│   │   ├── SiteNavigation.astro  # Main navigation
│   │   ├── SiteFooter.astro     # Footer component
│   │   ├── SiteMeta.astro       # SEO meta tags
│   │   ├── DarkMode.astro       # Dark mode toggle
│   │   ├── CookieConsent.astro  # GDPR cookie consent
│   │   └── Weather.astro        # Weather widget
│   │
│   ├── layouts/              # Astro layouts
│   │   └── DefaultLayout.astro
│   │
│   ├── pages/                # File-based routing
│   │   ├── index.astro       # Homepage
│   │   ├── [...uri].astro    # Dynamic page routing
│   │   ├── 404.astro         # 404 error page
│   │   ├── work/              # Work routes
│   │   │   └── [slug].astro
│   │   ├── photography/       # Photography routes
│   │   │   └── [slug].astro
│   │   └── api/               # API endpoints
│   │       ├── music.json.ts  # Music API (combines Last.fm, Discogs, Mixcloud)
│   │       ├── project.json.ts # Project data API
│   │       ├── work/           # Work API endpoints
│   │       │   ├── [slug].ts
│   │       │   └── [slug].json.ts
│   │       └── photography/    # Photography API endpoints
│   │           ├── [id].json.ts
│   │           └── [slug].json.ts
│   │
│   ├── lib/                  # Utility functions
│   │   ├── sanity.ts         # Sanity data fetching
│   │   ├── routes.ts         # Route helpers
│   │   ├── seo-helpers.ts    # SEO utilities
│   │   ├── projectLoader.ts  # Project data loader
│   │   ├── workController.ts # Work section controller
│   │   ├── lastfm.ts         # Last.fm API helper
│   │   ├── discogs.ts        # Discogs API helper
│   │   ├── mixcloud.ts       # Mixcloud API helper
│   │   ├── music-config.ts   # Music cache config
│   │   └── utils.js          # General utilities
│   │
│   ├── sanity/               # Sanity integration
│   │   ├── lib/
│   │   │   ├── load-query.ts  # Sanity query loader
│   │   │   ├── sanity-client.ts # Sanity client config
│   │   │   └── image.ts      # Image URL builder
│   │   ├── queries.ts        # GROQ queries
│   │   └── types.ts          # TypeScript types
│   │
│   ├── queries/              # GraphQL queries (legacy)
│   │   └── *.gql
│   │
│   └── types/                # TypeScript type definitions
│       ├── contentblocks.ts
│       └── projectdetails.ts
│
├── studio/                   # Sanity Studio
│   ├── schemas/              # Sanity schema definitions
│   │   ├── index.ts          # Schema exports
│   │   ├── page.ts           # Page schema
│   │   ├── work.ts           # Work/Project schema
│   │   ├── photography.ts    # Photography schema
│   │   ├── siteSettings.ts   # Site settings schema
│   │   └── ...               # Other schemas
│   ├── sanity.config.ts      # Studio config
│   ├── sanity.cli.ts         # CLI config
│   └── package.json          # Studio dependencies
│
├── netlify/                  # Netlify functions
│   └── functions/
│       └── discogs.ts        # Discogs serverless function
│
├── astro.config.mjs          # Astro configuration
├── tailwind.config.js        # Tailwind CSS config
├── tsconfig.json             # TypeScript config
├── package.json              # Dependencies
└── README.md                 # Deze documentatie
```

### Routing Structuur

Het project gebruikt Astro's file-based routing:

- **`/`** → `src/pages/index.astro` (Homepage)
- **`/[...uri]`** → `src/pages/[...uri].astro` (Dynamische pagina's van Sanity)
- **`/work/[slug]`** → `src/pages/work/[slug].astro` (Project detail pagina)
- **`/photography/[slug]`** → `src/pages/photography/[slug].astro` (Photography detail)
- **`/api/*`** → `src/pages/api/*.ts` (API endpoints)

### Component Hiërarchie

```
DefaultLayout
├── SiteNavigation
│   └── Weather
├── Template (Home/Page/WorkDetail/WorkOverview)
│   ├── HeroSection / HeroMediaThree
│   ├── WorkSection
│   │   ├── WorkMarquee
│   │   └── WorkPanel / WorkCarousel
│   ├── MusicSection
│   │   ├── MusicMarquee
│   │   ├── RecentlyPlayed
│   │   ├── LatestRecords
│   │   └── Mixtapes
│   └── BlockRenderer
│       └── [Content Blocks]
└── SiteFooter
```

## 🔌 API Endpoints

Het project bevat verschillende API endpoints voor data fetching:

### Music API

**Endpoint**: `/api/music.json`

Combineert data van Last.fm, Discogs en Mixcloud in één response.

- **Method**: `GET`
- **Response**: `{ items: NormalizedMusicItem[] }`
- **Cache**: Dynamisch (minimaal 30 seconden voor Last.fm)
- **Error Handling**: Gebruikt `Promise.allSettled` - één falende service breekt niet de hele endpoint

**Voorbeeld**:
```json
{
  "items": [
    {
      "source": "lastfm",
      "date": "2025-02-21T22:11:00Z",
      "artist": "Artist Name",
      "track": "Track Name",
      "album": "Album Name",
      "thumb": "https://..."
    }
  ]
}
```

### Project API

**Endpoint**: `/api/project.json?slug=project-slug`

Haalt project data op via slug parameter.

- **Method**: `GET`
- **Query Parameters**: `slug` (required)
- **Response**: `SanityProject` object
- **Cache**: `public, max-age=3600` (1 uur)
- **Error Handling**: Retourneert 404 met error message als project niet gevonden

### Work API

**Endpoints**:
- `/api/work/[slug]` - Project data voor carousel
- `/api/work/[slug].json` - Project data als JSON

Haalt project data op en verwerkt media voor carousel weergave.

- **Method**: `GET`
- **Response**: Verwerkt project object met `projectMedia` array
- **Cache**: `public, max-age=3600` (1 uur)
- **Error Handling**: Retourneert 404 met error message

### Photography API

**Endpoints**:
- `/api/photography/[id].json` - Photography data via ID
- `/api/photography/[slug].json` - Photography data via slug

Haalt photography data op met video URL's.

- **Method**: `GET`
- **Response**: Photography object met media URLs
- **Cache**: `public, max-age=3600` (1 uur)

### Security Overwegingen

1. **Input Validation**
   - Slug parameters worden gevalideerd via Sanity queries
   - Sanity queries gebruiken parameterized queries (veilig tegen injection)
   - Geen directe database queries

2. **Error Handling**
   - Geen gevoelige data in error messages
   - Generieke error responses voor productie
   - Gedetailleerde logging alleen in development mode

3. **Rate Limiting**
   - Geen expliciete rate limiting (acceptabel voor portfolio site)
   - Cache headers helpen met performance
   - Netlify heeft standaard rate limiting

4. **CORS**
   - CORS headers worden automatisch gezet door Astro/Netlify
   - API endpoints zijn publiek toegankelijk (read-only)

5. **API Keys**
   - API keys worden alleen gebruikt in server-side endpoints
   - Nooit direct in browser code
   - Environment variables voor alle gevoelige data

## 🚢 Deployment

### Netlify

Het project is geconfigureerd voor Netlify deployment:

1. **Environment Variables** instellen in Netlify dashboard:
   - `PUBLIC_SANITY_PROJECT_ID` (required)
   - `PUBLIC_SANITY_DATASET` (required)
   - `PUBLIC_SANITY_API_VERSION` (optional, default: `"2025-01-28"`)
   - `SANITY_API_READ_TOKEN` (optional, alleen voor Visual Editing)
   - `PUBLIC_LASTFM_USERNAME` (optional)
   - `PUBLIC_LASTFM_API_KEY` (optional)
   - `PUBLIC_DISCOGS_USERNAME` (optional)
   - `PUBLIC_DISCOGS_TOKEN` (optional)
   - `PUBLIC_MIXCLOUD_USERNAME` (optional)
   - `PUBLIC_WEATHER_API_KEY` (optional)

2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Andere platforms

Het project kan ook gedeployed worden naar andere static hosting providers zoals Vercel, Cloudflare Pages, of GitHub Pages.

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Studio Guide](https://www.sanity.io/docs/structure-builder-introduction)
