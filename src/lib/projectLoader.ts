import { getProjectData } from './sanity';
import { urlForImage } from '../sanity/lib/image';
import { parseSanityFileAsset } from './utils';

/**
 * Loader functie om project data op te halen en te verwerken voor carousel
 */
export async function loadProjectForCarousel(slug: string) {
  try {
    const project = await getProjectData(slug);

    // Process project media (carousel slides)
    const processedProjectMedia = project.projectMedia
      ? project.projectMedia.map((slide: any) => {
          const processedSlide: any = {
            _key: slide._key,
            _type: slide._type,
            fitMode: slide.fitMode || 'fill', // Include fitMode for photography
          };

          // Process based on _type
          if (slide._type === 'imageSlide' && slide.image?.asset) {
            processedSlide.image = {
              ...slide.image,
              url:
                urlForImage(slide.image)?.width(1920).fit('max').auto('format').url() ||
                null,
              alt: slide.image.alt || '',
            };
          } else if (slide._type === 'videoSlide' && slide.video?.asset) {
            // Get video URL from Sanity asset
            const videoAsset = slide.video.asset;
            let videoUrl = null;

            if (videoAsset.url) {
              // Direct URL available
              videoUrl = videoAsset.url;
            } else if (videoAsset._ref) {
              // Construct URL from asset reference with dynamic extension
              const { assetId, extension } = parseSanityFileAsset(videoAsset._ref);
              videoUrl = `https://cdn.sanity.io/files/${import.meta.env.PUBLIC_SANITY_PROJECT_ID}/${import.meta.env.PUBLIC_SANITY_DATASET}/${assetId}.${extension}`;
            }

            processedSlide.video = {
              ...slide.video,
              url: videoUrl,
            };
          }

          return processedSlide;
        })
      : [];

    // Return processed project data with new structure
    return {
      _id: project._id,
      _type: project._type,
      title: project.title, // Internal title (for Studio)
      projectTitle: project.projectTitle || project.title, // Frontend title
      subtitle: project.subtitle,
      year: project.year,
      client: project.client,
      preview: project.preview,
      projectMedia: processedProjectMedia,
      description: project.description,
      seo: project.seo,
    };
  } catch (error) {
    console.error(`❌ Failed to load project "${slug}":`, error);
    throw error;
  }
}
