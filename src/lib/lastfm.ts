/**
 * Last.fm API helper
 * Fetches recently played tracks for a user
 */

import type { NormalizedMusicItem } from './discogs';

export interface LastFmTrack {
  name: string;
  artist: {
    '#text': string;
  };
  album?: {
    '#text': string;
  };
  image?: Array<{
    '#text': string;
    size: string;
  }>;
  date?: {
    '#text': string;
    uts?: string;
  };
  imageUrl?: string; // Added by getRecentlyPlayed processing
}

export interface LastFmResponse {
  recenttracks?: {
    track: LastFmTrack[] | LastFmTrack;
    '@attr': {
      user: string;
      totalPages: string;
      page: string;
      perPage: string;
      total: string;
    };
  };
  error?: number;
  message?: string;
}

/**
 * Fetch recently played tracks from Last.fm with retry logic
 */
export async function getRecentlyPlayed(
  username: string,
  apiKey: string,
  limit: number = 5,
  retries: number = 3,
  retryDelay: number = 1000,
): Promise<LastFmTrack[]> {
  try {
    if (!username || !apiKey) {
      console.warn('⚠️ Last.fm: Missing username or API key');
      return [];
    }

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${apiKey}&format=json&limit=${limit}`;

    // Retry logic for temporary server errors (5xx)
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(url, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // If it's a temporary server error (5xx), retry
        if (!response.ok && response.status >= 500 && response.status < 600) {
          console.warn(
            `⚠️ Last.fm API temporary error (${response.status}), attempt ${attempt}/${retries}`,
          );

          // If this is not the last attempt, wait and retry
          if (attempt < retries) {
            await new Promise((resolve) =>
              setTimeout(resolve, retryDelay * attempt),
            );
            continue;
          }

          // Last attempt failed, throw error
          throw new Error(`Last.fm API error: ${response.status}`);
        }

        // For non-5xx errors, don't retry
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`❌ Last.fm API error (${response.status}):`, errorText);
          throw new Error(`Last.fm API error: ${response.status}`);
        }

        // Success! Break out of retry loop
        const data: LastFmResponse = await response.json();
        return processLastFmResponse(data, limit);
      } catch (error) {
        // Handle abort (timeout) or network errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            console.warn(
              `⚠️ Last.fm API timeout, attempt ${attempt}/${retries}`,
            );
            if (attempt < retries) {
              await new Promise((resolve) =>
                setTimeout(resolve, retryDelay * attempt),
              );
              continue;
            }
          }
          lastError = error;
        }

        // If this is the last attempt, break and throw
        if (attempt === retries) {
          break;
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt),
        );
      }
    }

    // If we get here, all retries failed
    if (lastError) {
      throw lastError;
    }

    throw new Error('Last.fm API: All retry attempts failed');
  } catch (error) {
    console.error('❌ Failed to fetch Last.fm data:', error);
    return [];
  }
}

/**
 * Process Last.fm API response
 */
function processLastFmResponse(
  data: LastFmResponse,
  limit: number,
): LastFmTrack[] {
  // Check if API returned an error
  if (data.error) {
    console.error('❌ Last.fm API error:', data.message || 'Unknown error');
    return [];
  }

  // Handle both single track and array of tracks
  if (!data.recenttracks || !data.recenttracks.track) {
    console.warn('⚠️ Last.fm: No tracks found');
    return [];
  }

  const tracks = Array.isArray(data.recenttracks.track)
    ? data.recenttracks.track
    : [data.recenttracks.track].filter(Boolean);

  // Filter out currently playing track (has no date)
  const filteredTracks = tracks.filter(
    (track) => track.date && track.date['#text'],
  );

  // Helper function to get image URL by size preference
  const getImageUrl = (
    track: LastFmTrack,
    preferredSize: string = 'medium',
  ): string => {
    if (!track.image || !Array.isArray(track.image)) return '';

    // Find preferred size, fallback to medium, then large, then first available
    const preferred = track.image.find((img) => img.size === preferredSize);
    if (preferred && preferred['#text']) return preferred['#text'];

    const medium = track.image.find((img) => img.size === 'medium');
    if (medium && medium['#text']) return medium['#text'];

    const large = track.image.find((img) => img.size === 'large');
    if (large && large['#text']) return large['#text'];

    // Return first available image
    const first = track.image.find((img) => img['#text']);
    return first ? first['#text'] : '';
  };

  // Add processed image URL to each track
  const processedTracks = filteredTracks.map((track) => ({
    ...track,
    imageUrl: getImageUrl(track, 'medium'),
  }));

  return processedTracks.slice(0, limit);
}


/**
 * Wrapper function that reads environment variables and returns normalized data
 * For use in API endpoint
 */
export async function getLastFm(): Promise<NormalizedMusicItem[]> {
  const username = import.meta.env.PUBLIC_LASTFM_USERNAME || '';
  const apiKey = import.meta.env.PUBLIC_LASTFM_API_KEY || '';
  const limit = 15;

  if (!username || !apiKey) {
    return [];
  }

  try {
    const tracks = await getRecentlyPlayed(username, apiKey, limit);

    // Normalize to common format with source and ISO date
    return tracks.map((track) => {
      // Convert Last.fm date to ISO format
      let isoDate = '';
      if (track.date && track.date.uts) {
        // Use Unix timestamp if available (more accurate)
        const date = new Date(parseInt(track.date.uts) * 1000);
        isoDate = date.toISOString();
      } else if (track.date && track.date['#text']) {
        // Parse the date text (format: "08 Nov 2025, 11:12")
        try {
          const date = new Date(track.date['#text']);
          isoDate = date.toISOString();
        } catch {
          // If date parsing fails, use current date as fallback
          isoDate = new Date().toISOString();
        }
      } else {
        // If no date, use current date
        isoDate = new Date().toISOString();
      }

      return {
        source: 'lastfm' as const,
        date: isoDate,
        artist: track.artist?.['#text'],
        track: track.name,
        album: track.album?.['#text'],
        thumb: track.imageUrl,
      };
    });
  } catch (error) {
    console.error('❌ Failed to fetch Last.fm data:', error);
    return [];
  }
}
