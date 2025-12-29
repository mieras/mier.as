import type { SanitySEO, SanitySiteSettings } from '../sanity/types';
import { urlForImage } from '../sanity/lib/image';

/**
 * Helper om Portable Text array om te zetten naar plain text string
 */
function portableTextToString(portableText: any): string {
  if (!portableText) return '';
  if (typeof portableText === 'string') return portableText;
  if (!Array.isArray(portableText)) return '';

  return portableText
    .map((block: any) => {
      if (block._type === 'block' && block.children) {
        return block.children
          .map((child: any) => {
            if (typeof child === 'string') return child;
            if (child.text) return child.text;
            if (child.children) {
              return child.children
                .map((grandchild: any) => grandchild.text || '')
                .join('');
            }
            return '';
          })
          .join('');
      }
      return '';
    })
    .join(' ')
    .trim();
}

/**
 * Helper functie om SEO data op te halen met fallback logica:
 * 1. Page/Project SEO velden
 * 2. Default SEO van SiteSettings
 * 3. Hardcoded fallbacks
 */
export function getSeoData(
  pageSeo?: SanitySEO,
  siteSettings?: SanitySiteSettings,
  fallbackTitle?: string | any,
  fallbackDescription?: string | any,
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

  // Convert fallbackTitle and fallbackDescription to strings if they're Portable Text
  const fallbackTitleStr =
    typeof fallbackTitle === 'string'
      ? fallbackTitle
      : portableTextToString(fallbackTitle);
  const fallbackDescriptionStr =
    typeof fallbackDescription === 'string'
      ? fallbackDescription
      : portableTextToString(fallbackDescription);

  // Build final SEO object with fallbacks
  const finalSeo = {
    title: seo.title || fallbackTitleStr || siteSettings?.title || 'Page',
    description:
      seo.description ||
      fallbackDescriptionStr ||
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
        fallbackTitleStr ||
        siteSettings?.title,
      description:
        seo.openGraph?.description ||
        seo.description ||
        fallbackDescriptionStr ||
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
        fallbackTitleStr ||
        siteSettings?.title,
      description:
        seo.twitter?.description ||
        seo.description ||
        fallbackDescriptionStr ||
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
    const titleStr = typeof finalSeo.title === 'string' ? finalSeo.title : '';
    const descStr = typeof finalSeo.description === 'string' ? finalSeo.description : '';
    console.log('✅ SEO:', {
      title: titleStr?.substring(0, 40) + (titleStr?.length > 40 ? '...' : ''),
      desc: descStr?.substring(0, 40) + (descStr?.length > 40 ? '...' : ''),
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

