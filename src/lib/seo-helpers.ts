import type { SanitySEO, SanitySiteSettings } from '../sanity/types';
import { urlForImage } from '../sanity/lib/image';

/**
 * Helper functie om SEO data op te halen met fallback logica:
 * 1. Page/Project SEO velden
 * 2. Default SEO van SiteSettings
 * 3. Hardcoded fallbacks
 */
export function getSeoData(
  pageSeo?: SanitySEO,
  siteSettings?: SanitySiteSettings,
  fallbackTitle?: string,
  fallbackDescription?: string,
  fallbackUrl?: string
) {
  // Debug logging in development (uitgecomment om console te verminderen)
  // if (import.meta.env.DEV) {
  //   console.log('🔍 SEO Helper - Input:', {
  //     hasPageSeo: !!pageSeo,
  //     hasSiteSettings: !!siteSettings,
  //   });
  // }

  // Priority 1: Page/Project specific SEO
  const seo = pageSeo || siteSettings?.defaultSeo || {};

  // Build final SEO object with fallbacks
  const finalSeo = {
    title: seo.title || fallbackTitle || siteSettings?.title || 'Page',
    description:
      seo.description ||
      fallbackDescription ||
      siteSettings?.description ||
      '',
    keywords: seo.keywords || siteSettings?.defaultSeo?.keywords || [],
    canonicalUrl: seo.canonicalUrl || fallbackUrl || '',
    // Meta Image: use page image, then default, then fallback
    metaImage:
      seo.metaImage ||
      seo.openGraph?.image ||
      seo.twitter?.image ||
      siteSettings?.defaultSeo?.metaImage ||
      siteSettings?.defaultSeo?.openGraph?.image ||
      null,
    // Open Graph
    openGraph: {
      title:
        seo.openGraph?.title ||
        seo.title ||
        fallbackTitle ||
        siteSettings?.title,
      description:
        seo.openGraph?.description ||
        seo.description ||
        fallbackDescription ||
        siteSettings?.description,
      siteName:
        seo.openGraph?.siteName || siteSettings?.openGraphSiteName || '',
      type: seo.openGraph?.type || 'website',
      url: fallbackUrl || siteSettings?.url || '',
      image:
        seo.openGraph?.image ||
        seo.openGraph?.imageUrl ||
        seo.metaImage ||
        siteSettings?.defaultSeo?.openGraph?.image ||
        siteSettings?.defaultSeo?.metaImage ||
        null,
      imageUrl: seo.openGraph?.imageUrl || null,
    },
    // Twitter
    twitter: {
      card: seo.twitter?.card || 'summary_large_image',
      site: seo.twitter?.site || siteSettings?.twitterSite || '',
      title:
        seo.twitter?.title ||
        seo.title ||
        fallbackTitle ||
        siteSettings?.title,
      description:
        seo.twitter?.description ||
        seo.description ||
        fallbackDescription ||
        siteSettings?.description,
      image:
        seo.twitter?.image ||
        seo.twitter?.imageUrl ||
        seo.metaImage ||
        siteSettings?.defaultSeo?.twitter?.image ||
        siteSettings?.defaultSeo?.metaImage ||
        null,
      imageUrl: seo.twitter?.imageUrl || null,
    },
    // Robots
    robots: {
      noIndex: seo.robots?.noIndex || false,
      noFollow: seo.robots?.noFollow || false,
    },
  };

  // Compact debug logging (alleen belangrijkste info)
  if (import.meta.env.DEV) {
    console.log('✅ SEO:', {
      title: finalSeo.title?.substring(0, 40) + (finalSeo.title?.length > 40 ? '...' : ''),
      desc: finalSeo.description?.substring(0, 40) + (finalSeo.description?.length > 40 ? '...' : ''),
      og: !!finalSeo.openGraph.title,
      twitter: !!finalSeo.twitter.title,
      robots: finalSeo.robots.noIndex ? 'noindex' : finalSeo.robots.noFollow ? 'nofollow' : 'index,follow',
    });
  }

  return finalSeo;
}

/**
 * Helper om image URL te genereren van Sanity image
 */
export function getImageUrl(image: any): string {
  // Als imageUrl beschikbaar is (van URL type)
  if (image?.imageUrl) {
    return image.imageUrl;
  }

  // Gebruik de bestaande urlForImage helper voor Sanity images
  if (image?.asset) {
    const url = urlForImage(image)?.width(1200).height(630).fit('max').auto('format').url();
    if (url) {
      return url;
    }
    
    // Fallback naar direct asset URL als beschikbaar
    if (image.asset.url) {
      return image.asset.url;
    }
  }

  return '';
}

