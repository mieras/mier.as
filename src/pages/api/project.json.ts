import { getProjectData } from '../../lib/sanity';

export const prerender = false;

export async function GET({ url }: { url: URL }) {
  try {
    const slug = url.searchParams.get('slug');

    if (!slug) {
      return new Response(
        JSON.stringify({
          error: 'Missing slug parameter',
          message: 'Please provide a slug query parameter',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (import.meta.env.DEV) {
      console.log('📡 API: Loading project:', slug);
    }

    const project = await getProjectData(slug);

    if (import.meta.env.DEV) {
      console.log('✅ API: Project loaded:', {
        title: project.title,
        slug: project.slug,
        hasHero: !!project.hero,
        contentBlocks: project.content?.length || 0,
      });
    }

    return new Response(JSON.stringify(project), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error(`❌ API: Failed to load project:`, error);
    return new Response(
      JSON.stringify({
        error: 'Project not found',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
