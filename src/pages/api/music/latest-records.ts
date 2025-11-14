import type { APIRoute } from 'astro';
import { getLatestRecords } from '../../../lib/discogs';

export const GET: APIRoute = async () => {
  try {
    // Try server-side env vars first, fallback to PUBLIC_ for local dev
    const discogsUsername = import.meta.env.DISCOGS_USERNAME || import.meta.env.PUBLIC_DISCOGS_USERNAME || '';
    const discogsToken = import.meta.env.DISCOGS_TOKEN || import.meta.env.PUBLIC_DISCOGS_TOKEN || '';

    if (!discogsUsername || !discogsToken) {
      console.error('Discogs credentials missing:', {
        hasUsername: !!discogsUsername,
        hasToken: !!discogsToken,
      });
      return new Response(
        JSON.stringify({ 
          error: 'Discogs credentials not configured',
          details: 'Please set DISCOGS_USERNAME and DISCOGS_TOKEN environment variables'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const records = await getLatestRecords(discogsUsername, discogsToken, 5);
    
    return new Response(JSON.stringify(records), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/music/latest-records:', error);
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

