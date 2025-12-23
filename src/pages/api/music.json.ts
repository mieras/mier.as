import { getDiscogs } from '../../lib/discogs';
import { getLastFm } from '../../lib/lastfm';
import { getMixcloud } from '../../lib/mixcloud';
import { getMinCacheTime } from '../../lib/music-config';

export const prerender = false;

export async function GET() {
  try {
    // Use Promise.allSettled to ensure one failing service doesn't break the entire endpoint
    const [discogsResult, lastfmResult, mixcloudResult] =
      await Promise.allSettled([
        getDiscogs(),
        getLastFm(),
        getMixcloud(),
      ]);

    // Extract successful results, default to empty array on failure
    const discogs =
      discogsResult.status === 'fulfilled' ? discogsResult.value : [];
    const lastfm =
      lastfmResult.status === 'fulfilled' ? lastfmResult.value : [];
    const mixcloud =
      mixcloudResult.status === 'fulfilled' ? mixcloudResult.value : [];

    // Log any failures for debugging
    if (discogsResult.status === 'rejected') {
      console.error('❌ Discogs fetch failed:', discogsResult.reason);
    }
    if (lastfmResult.status === 'rejected') {
      console.error('❌ Last.fm fetch failed:', lastfmResult.reason);
    }
    if (mixcloudResult.status === 'rejected') {
      console.error('❌ Mixcloud fetch failed:', mixcloudResult.reason);
    }

    const combined = [...discogs, ...lastfm, ...mixcloud].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    // Use minimum cache time to ensure all sources refresh appropriately
    // RecentlyPlayed (lastfm) needs 30s, so we use that as minimum
    const cacheTime = getMinCacheTime();

    return new Response(JSON.stringify({ items: combined }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': `public, max-age=${cacheTime}`,
      },
    });
  } catch (_err) {
    console.error('❌ Music API endpoint error:', _err);
    return new Response(JSON.stringify({ items: [], error: true }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
