import type { APIRoute } from 'astro';
import { getRecentlyPlayed } from '../../../lib/lastfm';

export const GET: APIRoute = async () => {
  try {
    // Try server-side env vars first, fallback to PUBLIC_ for local dev
    const lastfmUsername = import.meta.env.LASTFM_USERNAME || import.meta.env.PUBLIC_LASTFM_USERNAME || '';
    const lastfmApiKey = import.meta.env.LASTFM_API_KEY || import.meta.env.PUBLIC_LASTFM_API_KEY || '';

    if (!lastfmUsername || !lastfmApiKey) {
      console.error('Last.fm credentials missing:', {
        hasUsername: !!lastfmUsername,
        hasApiKey: !!lastfmApiKey,
      });
      return new Response(
        JSON.stringify({ 
          error: 'Last.fm credentials not configured',
          details: 'Please set LASTFM_USERNAME and LASTFM_API_KEY environment variables'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    const tracks = await getRecentlyPlayed(lastfmUsername, lastfmApiKey, 5);
    
    return new Response(JSON.stringify(tracks), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in /api/music/recently-played:', error);
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

