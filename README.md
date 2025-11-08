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
3. **Vul je Sanity credentials in** in `.env`:
   - `PUBLIC_SANITY_PROJECT_ID`: Je Sanity Project ID (vind je in [Sanity Manage](https://www.sanity.io/manage))
   - `PUBLIC_SANITY_DATASET`: Meestal `"production"` of `"development"`
   - `PUBLIC_SANITY_API_VERSION`: API versie (standaard: `"2025-01-28"`)
   - `SANITY_API_READ_TOKEN`: Alleen nodig voor Visual Editing (optioneel)

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

**BELANGRIJK**:

- ⚠️ Commit **NOOIT** je `.env` bestanden
- 📝 `.env.example` is een template - kopieer en vul in met je eigen credentials
- 🔄 Rotate tokens regelmatig, vooral na repository migraties
- 🔒 Alle gevoelige data is uit git history verwijderd

## 📁 Project Structuur

```
project/
├── src/
│   ├── components/
│   │   ├── blocks/          # Content block components
│   │   ├── templates/        # Page templates
│   │   └── ...               # Overige components
│   ├── layouts/              # Astro layouts
│   ├── pages/                # Route pages
│   ├── sanity/               # Sanity configuratie
│   └── assets/               # Styles en assets
├── studio/                   # Sanity Studio
│   ├── schemas/              # Sanity schemas
│   └── sanity.config.ts
└── public/                   # Static assets
```

## 🚢 Deployment

### Netlify

Het project is geconfigureerd voor Netlify deployment:

1. **Environment Variables** instellen in Netlify dashboard:
   - `PUBLIC_SANITY_PROJECT_ID`
   - `PUBLIC_SANITY_DATASET`
   - `PUBLIC_SANITY_API_VERSION`

2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Andere platforms

Het project kan ook gedeployed worden naar andere static hosting providers zoals Vercel, Cloudflare Pages, of GitHub Pages.

## 📚 Resources

- [Astro Documentation](https://docs.astro.build)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Sanity Studio Guide](https://www.sanity.io/docs/structure-builder-introduction)
