/**
 * Music API cache configuration
 * Cache times in seconds
 */
export const MUSIC_CACHE_CONFIG = {
  lastfm: parseInt(import.meta.env.MUSIC_CACHE_LASTFM || '30', 10), // 30 seconden (RecentlyPlayed)
  discogs: parseInt(import.meta.env.MUSIC_CACHE_DISCOGS || '259200', 10), // 3 dagen (LatestRecords)
  mixcloud: parseInt(import.meta.env.MUSIC_CACHE_MIXCLOUD || '604800', 10), // 1 week (Mixtapes)
  default: parseInt(import.meta.env.MUSIC_CACHE_DEFAULT || '60', 10), // 60 seconden default
} as const;

/**
 * Get cache time for a specific source
 */
export function getCacheTime(source: 'lastfm' | 'discogs' | 'mixcloud'): number {
  return MUSIC_CACHE_CONFIG[source] || MUSIC_CACHE_CONFIG.default;
}

/**
 * Get minimum cache time from all sources (for combined endpoint)
 * This ensures the most frequently updated source (lastfm) always refreshes correctly
 */
export function getMinCacheTime(): number {
  return Math.min(
    MUSIC_CACHE_CONFIG.lastfm,
    MUSIC_CACHE_CONFIG.discogs,
    MUSIC_CACHE_CONFIG.mixcloud,
  );
}

