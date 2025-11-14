import { type QueryParams } from 'sanity';
import { sanityClient } from 'sanity:client';

const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';
const token = import.meta.env.SANITY_API_READ_TOKEN;

export async function loadQuery<QueryResponse>({
  query,
  params,
}: {
  query: string;
  params?: QueryParams;
}) {
  try {
    // Log tijdens request om te zien wat er gebeurt
    console.log('🔍 Sanity query:', {
      hasProjectId: !!import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      hasDataset: !!import.meta.env.PUBLIC_SANITY_DATASET,
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    });

    if (visualEditingEnabled && !token) {
      throw new Error(
        'The `SANITY_API_READ_TOKEN` environment variable is required during Visual Editing.',
      );
    }

    const perspective = visualEditingEnabled ? 'previewDrafts' : 'published';

    // Use the official sanity:client from @sanity/astro integration
    const { result, resultSourceMap } = await sanityClient.fetch<QueryResponse>(
      query,
      params ?? {},
      {
        filterResponse: false,
        perspective,
        resultSourceMap: visualEditingEnabled ? 'withKeyArraySelector' : false,
        stega: visualEditingEnabled,
        ...(visualEditingEnabled ? { token } : {}),
      },
    );

    console.log('✅ Sanity query succeeded, result:', {
      hasData: !!result,
      dataType: typeof result,
      isArray: Array.isArray(result),
      length: Array.isArray(result) ? result.length : 'N/A',
    });

    return {
      data: result,
      sourceMap: resultSourceMap,
      perspective,
    };
  } catch (error) {
    // Log error ALTIJD (ook tijdens build)
    console.error(`❌ Sanity query failed:`, error);
    console.error(`Query:`, query);
    console.error(`Params:`, params);
    console.error(`Environment:`, {
      hasProjectId: !!import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      hasDataset: !!import.meta.env.PUBLIC_SANITY_DATASET,
      projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
      dataset: import.meta.env.PUBLIC_SANITY_DATASET,
    });

    // Throw error instead of returning null - laat de frontend crashen
    throw new Error(
      `Sanity query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
