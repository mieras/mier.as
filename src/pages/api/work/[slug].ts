import { loadProjectForCarousel } from '../../../lib/projectLoader';

export async function GET({ params }: { params: { slug: string } }) {
  try {
    if (import.meta.env.DEV) {
      console.log('📡 API: Loading project:', params.slug);
    }

    const processedProject = await loadProjectForCarousel(params.slug);

    if (import.meta.env.DEV) {
      console.log('✅ API: Project loaded:', {
        title: processedProject.title,
        mediaCount: processedProject.projectMedia?.length || 0,
      });
    }

    return new Response(JSON.stringify(processedProject), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error(`❌ API: Failed to load project ${params.slug}:`, error);
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
