// Nieuwe Sanity imports
import { getHomeData, getPageData } from './sanity';

// templates
// import Single from '../components/templates/_Single.astro'; // Unused template
import WorkOverview from '../components/templates/WorkOverview.astro';
import Page from '../components/templates/Page.astro';
import Home from '../components/templates/Home.astro';

export async function getNodeData(slug: string) {
  // Homepage - alleen Sanity
  if (slug === '/' || slug === '') {
    try {
      const sanityHome = await getHomeData();
      return {
        ...sanityHome,
        dataSource: 'sanity',
      };
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('❌ Sanity homepage query failed:', error);
      }
      throw error;
    }
  }

  // Andere pages - alleen Sanity
  // Note: Project routing is now handled via /work/[slug].astro and index.astro
  try {
    const cleanSlug = slug.replace(/^\//, '').replace(/\/$/, '');
    const sanityPage = await getPageData(cleanSlug);
    return {
      ...sanityPage,
      dataSource: 'sanity',
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('❌ Sanity page query failed:', error);
    }
    throw error;
  }
}

export function getTemplateByRoute(node: any) {
  // DEBUG: Log template selection
  if (import.meta.env.DEV) {
    console.log('🎯 Template selection:', {
      dataSource: node.dataSource,
      _type: node._type,
      pageType: node.pageType,
      title: node.title,
      hasSlides: !!(node.slides && node.slides.length > 0),
      slidesCount: node.slides?.length || 0,
    });
  }

  // Check for Sanity data first
  if (node.dataSource === 'sanity') {
    switch (node._type) {
      case 'page':
        // Check if this is homepage by pageType OR by having slides (fallback)
        if (
          node.pageType === 'homepage' ||
          (node.slides && node.slides.length > 0) ||
          (node.title === 'Homepage' && node._type === 'page')
        ) {
          if (import.meta.env.DEV)
            console.log('🏠 Selected Home template (homepage detected)', {
              pageType: node.pageType,
              hasSlides: !!(node.slides && node.slides.length > 0),
              title: node.title,
              _type: node._type,
            });
          return Home;
        }
        if (node.pageType === 'work') {
          if (import.meta.env.DEV)
            console.log('📁 Selected WorkOverview template');
          return WorkOverview;
        }
        if (import.meta.env.DEV) console.log('📄 Selected Page template');
        return Page;
      // Note: 'work' type projects are now handled via /work/[slug].astro route
      default:
        if (import.meta.env.DEV)
          console.log('📄 Selected Page template (default fallback)');
        return Page;
    }
  }

  // No WordPress fallback - only Sanity supported
  if (import.meta.env.DEV) {
    console.warn('⚠️ Unknown data source or node type:', node);
  }
  return Page;
}
