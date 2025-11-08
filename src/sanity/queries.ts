// Types worden gebruikt in de query definities maar niet direct geïmporteerd

// Homepage query - zoek specifiek naar pageType "homepage"
export const HOME_QUERY = `*[_type == "page" && pageType == "homepage"][0] {
  _id,
  _type,
  title,
  pageType,
  intro,
  statement,
  introCols[] {
    _key,
    _type,
    content
  },
  slides[] {
    _key,
    _type,
    title,
    subtitle,
    image {
      ...,
      asset->,
      crop,
      hotspot
    },
    videoUrl,
    link {
      linkType,
      url,
      internalLink-> {
        _type,
        "slug": slug.current
      }
    }
  },
  featuredProjects[]-> {
    _id,
    _type,
    title,
    "slug": slug.current,
    subtitle,
    client-> {
      _id,
      title
    },
    services[]-> {
      _id,
      title
    },
    thumbnail {
      image {
        ...,
        asset->,
        crop,
        hotspot
      },
      size,
      alt,
      video,
      aspectRatio
    }
  },
  seo {
    _type,
    title,
    description,
    keywords,
    canonicalUrl,
    metaImage {
      ...,
      asset->,
      crop,
      hotspot
    },
    openGraph {
      _type,
      title,
      description,
      siteName,
      type,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    twitter {
      _type,
      card,
      site,
      title,
      description,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    robots {
      noIndex,
      noFollow
    }
  }
}`;

// Fallback query voor als pageType niet is ingesteld
export const HOME_FALLBACK_QUERY = `*[_type == "page" && title == "Homepage"][0] {
  _id,
  _type,
  title,
  pageType,
  intro,
  statement,
  introCols[] {
    _key,
    _type,
    content
  },
  slides[] {
    _key,
    _type,
    title,
    subtitle,
    image {
      ...,
      asset->,
      crop,
      hotspot
    },
    videoUrl,
    link {
      linkType,
      url,
      internalLink-> {
        _type,
        "slug": slug.current
      }
    }
  },
  featuredProjects[]-> {
    _id,
    _type,
    title,
    "slug": slug.current,
    subtitle,
    client-> {
      _id,
      title
    },
    services[]-> {
      _id,
      title
    },
    thumbnail {
      image {
        ...,
        asset->,
        crop,
        hotspot
      },
      size,
      alt,
      video,
      aspectRatio
    }
  },
  seo {
    _type,
    title,
    description,
    keywords,
    canonicalUrl,
    metaImage {
      ...,
      asset->,
      crop,
      hotspot
    },
    openGraph {
      _type,
      title,
      description,
      siteName,
      type,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    twitter {
      _type,
      card,
      site,
      title,
      description,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    robots {
      noIndex,
      noFollow
    }
  }
}`;

// All projects query
export const ALL_PROJECTS_QUERY = `*[_type == "work"] | order(_createdAt desc) {
  _id,
  _type,
  title,
  "slug": slug.current,
  subtitle,
  thumbnail {
    image {
      ...,
      asset->,
      crop,
      hotspot
    },
    size,
    aspectRatio
  },
  "client": client-> {
    _id,
    title
  },
  "services": services[]-> {
    _id,
    title
  }
}`;

// Project by slug query
export const PROJECT_BY_SLUG_QUERY = `*[_type == "work" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  "slug": slug.current,
  subtitle,
  intro,
  hero {
    title,
    subtitle,
    intro,
    coverMedia {
      ...,
      asset->,
      crop,
      hotspot
    },
    color
  },
  thumbnail {
    image {
      ...,
      asset->,
      crop,
      hotspot
    },
    size,
    aspectRatio
  },
  vimeoUrl,
  "client": client-> {
    _id,
    title
  },
  "services": services[]-> {
    _id,
    title
  },
  credits,
  "relatedProjects": relatedProjects[]-> {
    _id,
    _type,
    title,
    "slug": slug.current,
    thumbnail {
      image {
        ...,
        asset->,
        crop,
        hotspot
      },
      size
    },
    "client": client-> {
      _id,
      title
    }
  },
  content[] {
    _type,
    _key,
    ...,
    image {
      ...,
      asset->,
      crop,
      hotspot
    },
    images[] {
      ...,
      asset->,
      crop,
      hotspot
    },
    items[] {
      _key,
      title,
      text
    },
    media {
      image {
        ...,
        asset->,
        crop,
        hotspot
      },
      imgposition
    },
    gallery[] {
      ...,
      asset->,
      crop,
      hotspot
    },
    quote,
    name,
    role,
    photo {
      ...,
      asset->,
      crop,
      hotspot
    },
    layout,
    columns,
    showCaptions,
    showTitle,
    showTitle,
    size,
    slidesPerView,
    slidesPerViewAuto,
    "members": members[]-> {
      _id,
      title,
      featuredImage {
        ...,
        asset->,
        crop,
        hotspot
      },
      roles[] {
        name,
        description
      }
    },
    "team": team[]-> {
      _id,
      title,
      roles,
      featuredImage {
        ...,
        asset->
      }
    },
    "services": services[]-> {
      _id,
      title,
      content
    },
    "clients": clients[]-> {
      _id,
      title,
      logo {
        ...,
        asset->,
        crop,
        hotspot
      }
    }
  },
  seo {
    _type,
    title,
    description,
    keywords,
    canonicalUrl,
    metaImage {
      ...,
      asset->,
      crop,
      hotspot
    },
    openGraph {
      _type,
      title,
      description,
      siteName,
      type,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    twitter {
      _type,
      card,
      site,
      title,
      description,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    robots {
      noIndex,
      noFollow
    }
  }
}`;

// Page by slug query
export const PAGE_BY_SLUG_QUERY = `*[_type == "page" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  "slug": slug.current,
  pageType,
  hero {
    title,
    col1,
    col2
  },
  introCols[] {
    _key,
    content
  },
  content[] {
    _type,
    _key,
    ...,
    image {
      ...,
      asset->,
      crop,
      hotspot
    },
    images[] {
      ...,
      asset->,
      crop,
      hotspot
    },
    items[] {
      _key,
      title,
      text
    },
    media {
      image {
        ...,
        asset->,
        crop,
        hotspot
      },
      imgposition
    },
    gallery[] {
      ...,
      asset->,
      crop,
      hotspot
    },
    quote,
    name,
    role,
    photo {
      ...,
      asset->,
      crop,
      hotspot
    },
    layout,
    columns,
    showCaptions,
    showTitle,
    showTitle,
    size,
    slidesPerView,
    slidesPerViewAuto,
    "members": members[]-> {
      _id,
      title,
      featuredImage {
        ...,
        asset->,
        crop,
        hotspot
      },
      roles[] {
        name,
        description
      }
    },
    "team": team[]-> {
      _id,
      title,
      roles,
      featuredImage {
        ...,
        asset->
      }
    },
    "services": services[]-> {
      _id,
      title,
      content
    },
    "clients": clients[]-> {
      _id,
      title,
      logo {
        ...,
        asset->,
        crop,
        hotspot
      }
    }
  },
  seo {
    _type,
    title,
    description,
    keywords,
    canonicalUrl,
    metaImage {
      ...,
      asset->,
      crop,
      hotspot
    },
    openGraph {
      _type,
      title,
      description,
      siteName,
      type,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    twitter {
      _type,
      card,
      site,
      title,
      description,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    robots {
      noIndex,
      noFollow
    }
  }
}`;

// Site settings query
export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  _id,
  _type,
  title,
  description,
  url,
  logo {
    ...,
    asset->
  },
  navigation {
    menuItems[] {
      label,
      link {
        linkType,
        url,
        internalLink-> {
          _type,
          "slug": slug.current,
          pageType
        }
      },
      order
    }
  },
  footer {
    address {
      company,
      street,
      city,
      country
    },
    contact {
      phone,
      email
    },
    social {
      instagram,
      behance,
      linkedin
    }
  },
  openGraphSiteName,
  twitterSite,
  defaultSeo {
    _type,
    title,
    description,
    keywords,
    canonicalUrl,
    metaImage {
      ...,
      asset->,
      crop,
      hotspot
    },
    openGraph {
      _type,
      title,
      description,
      siteName,
      type,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    twitter {
      _type,
      card,
      site,
      title,
      description,
      imageType,
      image {
        ...,
        asset->,
        crop,
        hotspot,
        alt
      },
      imageUrl
    },
    robots {
      noIndex,
      noFollow
    }
  }
}`;

// Debug query to see all pages
export const DEBUG_PAGES_QUERY = `*[_type == "page"] {
  _id,
  _type,
  title,
  "slug": slug.current,
  pageType
}`;

// All slugs query for static paths
export const ALL_SLUGS_QUERY = `{
  "pages": *[_type == "page" && defined(slug.current)].slug.current,
  "projects": *[_type == "work" && defined(slug.current)].slug.current,
  "homepage": *[_type == "page" && pageType == "homepage"][0].slug.current
}`;
