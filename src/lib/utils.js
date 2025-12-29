// @ts-nocheck
export function numberWithZero(num) {
  return num < 10 ? "0" + num : num;
}

export function getCount(parent, getChildrensChildren){
  var relevantChildren = 0;
  var children = parent.childNodes.length;
  for(var i=0; i < children; i++){
      if(parent.childNodes[i].nodeType != 3){
          if(getChildrensChildren)
              relevantChildren += getCount(parent.childNodes[i],true);
          relevantChildren++;
      }
  }
  return relevantChildren;
}

// DEPRECATED: WordPress URL replacement - niet meer nodig na migratie naar Sanity
// export function replaceUrls(content, replacementUrl){
//   return content.replaceAll(`${import.meta.env.PUBLIC_WP_URL}`, replacementUrl);
// };

export function slugify(input) {
  if (!input)
      return '';
  // make lower case and trim
  var slug = input.toLowerCase().trim();
  // remove accents from charaters
  slug = slug.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  // replace invalid chars with spaces
  slug = slug.replace(/[^a-z0-9\s-]/g, ' ').trim();
  // replace multiple spaces or hyphens with a single hyphen
  slug = slug.replace(/[\s-]+/g, '-');
  return slug;
}


export function getAspectRatioFromEmbedString(embedString) {
  // Use regular expressions to extract width and height
  const widthMatch = embedString.match(/width="(\d+)"/);
  const heightMatch = embedString.match(/height="(\d+)"/);

  if (!widthMatch || !heightMatch) {
    throw new Error('Width and/or height attributes not found in the provided embed string');
  }

  const width = parseInt(widthMatch[1]);
  const height = parseInt(heightMatch[1]);

  // Function to calculate the GCD of two numbers
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  const gcdValue = gcd(width, height);

  // Simplify the aspect ratio
  const simplifiedWidth = width / gcdValue;
  const simplifiedHeight = height / gcdValue;

  return `${simplifiedWidth} / ${simplifiedHeight}`;
}

/**
 * Extract file extension and asset ID from Sanity file asset reference
 * Sanity asset references have format: file-{assetId}-{extension}
 * @param {string} assetRef - Sanity asset reference (e.g., "file-abc123-mp4" or "file-abc123-mov")
 * @returns {{assetId: string, extension: string}} - Object with assetId and extension
 */
export function parseSanityFileAsset(assetRef) {
  if (!assetRef || typeof assetRef !== 'string') {
    return { assetId: '', extension: 'mp4' }; // Default to mp4 for backwards compatibility
  }

  // Remove 'file-' prefix
  const withoutPrefix = assetRef.replace(/^file-/, '');
  
  // Find the last hyphen to separate assetId from extension
  const lastHyphenIndex = withoutPrefix.lastIndexOf('-');
  
  if (lastHyphenIndex === -1) {
    // No extension found, return as-is with default extension
    return { assetId: withoutPrefix, extension: 'mp4' };
  }

  const assetId = withoutPrefix.substring(0, lastHyphenIndex);
  const extension = withoutPrefix.substring(lastHyphenIndex + 1);

  return { assetId, extension: extension || 'mp4' };
}

/**
 * Process navigation link from Sanity siteSettings
 * Handles both internal and external links
 * @param {Object} link - Link object from Sanity navigation menuItem
 * @returns {{href: string, target?: string, rel?: string}} - Processed link properties
 */
export function processNavigationLink(link) {
  if (!link) {
    return { href: '#' };
  }

  if (link.linkType === 'external' && link.url) {
    return {
      href: link.url,
      target: '_blank',
      rel: 'noopener noreferrer',
    };
  }

  if (link.linkType === 'internal' && link.internalLink) {
    const slug = typeof link.internalLink.slug === 'string'
      ? link.internalLink.slug
      : link.internalLink.slug?.current || '';
    
    return {
      href: slug ? `/${slug}` : '#',
    };
  }

  return { href: '#' };
}