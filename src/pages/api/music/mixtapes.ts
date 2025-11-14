import type { APIRoute } from 'astro';
import { getRecentCloudcasts } from '../../../lib/mixcloud';

export const GET: APIRoute = async () => {
  try {
    // Try server-side env vars first, fallback to PUBLIC_ for local dev
    const mixcloudUsername = import.meta.env.MIXCLOUD_USERNAME || import.meta.env.PUBLIC_MIXCLOUD_USERNAME || 'mieras';

    const mixtapes = await getRecentCloudcasts(mixcloudUsername, 5);
    
    return new Response(JSON.stringify(mixtapes), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/music/mixtapes:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch data',
        message: errorMessage,
        ...(import.meta.env.DEV && { stack: errorStack })
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

