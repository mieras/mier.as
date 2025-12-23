import { getProjectData } from '../../../lib/sanity';
import { urlForImage } from '../../../sanity/lib/image';

export async function GET({ params }: { params: { slug: string } }) {
  try {
    const project = await getProjectData(params.slug);

    // Process images to include full URLs
    const processedProject = {
      ...project,
      hero: project.hero
        ? {
            ...project.hero,
            coverMedia: project.hero.coverMedia
              ? {
                  ...project.hero.coverMedia,
                  url:
                    urlForImage(project.hero.coverMedia)
                      ?.width(1920)
                      .height(1080)
                      .url() || null,
                }
              : null,
          }
        : null,
      // Process project media (carousel slides)
      projectMedia: project.projectMedia
        ? project.projectMedia.map((slide: any) => {
            const processedSlide: any = {
              _key: slide._key,
            };

            // Process based on _type
            if (slide._type === 'imageSlide' && slide.image?.asset) {
              processedSlide.image = {
                ...slide.image,
                url:
                  urlForImage(slide.image)?.width(1920).height(1080).url() ||
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
                // Construct URL from asset reference
                const assetId = videoAsset._ref
                  .replace('file-', '')
                  .replace('-mp4', '');
                videoUrl = `https://cdn.sanity.io/files/${import.meta.env.PUBLIC_SANITY_PROJECT_ID}/${import.meta.env.PUBLIC_SANITY_DATASET}/${assetId}.mp4`;
              }

              processedSlide.video = {
                ...slide.video,
                url: videoUrl,
              };
            }

            return processedSlide;
          })
        : null,
    };

    return new Response(JSON.stringify(processedProject), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error(`Failed to load project ${params.slug}:`, error);
    return new Response(JSON.stringify({ error: 'Project not found' }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
