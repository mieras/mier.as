import { getDiscogs } from '../../lib/discogs';
import { getLastFm } from '../../lib/lastfm';
import { getMixcloud } from '../../lib/mixcloud';
import { getMinCacheTime } from '../../lib/music-config';

export const prerender = false;

export async function GET() {
  try {
    const [discogs, lastfm, mixcloud] = await Promise.all([
      getDiscogs(),
      getLastFm(),
      getMixcloud(),
    ]);

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
    return new Response(JSON.stringify({ items: [], error: true }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
