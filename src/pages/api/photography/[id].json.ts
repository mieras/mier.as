import { loadQuery } from '../../../sanity/lib/load-query';
import { PHOTOGRAPHY_BY_ID_QUERY } from '../../../sanity/queries';
import { urlForImage } from '../../../sanity/lib/image';
import type { SanityPhotography } from '../../../sanity/types';

export async function GET({ params }: { params: { id: string } }) {
  try {
    const { data: photography } = await loadQuery<SanityPhotography>({
      query: PHOTOGRAPHY_BY_ID_QUERY,
      params: { id: params.id },
    });

    if (!photography) {
      return new Response(
        JSON.stringify({ error: 'Photography not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    // Process images and videos to include full URLs
    const processedPhotography = {
      ...photography,
      // Process project media (carousel slides)
      projectMedia: photography.projectMedia
        ? photography.projectMedia.map((slide: any) => {
            const processedSlide: any = {
              _key: slide._key,
            };

            // Process based on _type
            if (slide._type === 'imageSlide' && slide.image?.asset) {
              processedSlide.image = {
                ...slide.image,
                url: urlForImage(slide.image)?.width(1920).height(1080).url() || null,
                alt: slide.image.alt || '',
              };
              processedSlide.fitMode = slide.fitMode || 'fill'; // Include fitMode
            } else if (slide._type === 'videoSlide' && slide.video?.asset) {
              // Get video URL from Sanity asset
              const videoAsset = slide.video.asset;
              let videoUrl = null;
              
              if (videoAsset.url) {
                // Direct URL available
                videoUrl = videoAsset.url;
              } else if (videoAsset._ref) {
                // Construct URL from asset reference
                const assetId = videoAsset._ref.replace('file-', '').replace('-mp4', '');
                videoUrl = `https://cdn.sanity.io/files/${import.meta.env.PUBLIC_SANITY_PROJECT_ID}/${import.meta.env.PUBLIC_SANITY_DATASET}/${assetId}.mp4`;
              }
              
              processedSlide.video = {
                ...slide.video,
                url: videoUrl,
              };
              processedSlide.fitMode = slide.fitMode || 'fill'; // Include fitMode
            }

            return processedSlide;
          })
        : null,
    };

    return new Response(JSON.stringify(processedPhotography), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error(`Failed to load photography ${params.id}:`, error);
    return new Response(
      JSON.stringify({ error: 'Photography not found' }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}

