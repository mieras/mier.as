/**
 * Last.fm API helper
 * Fetches recently played tracks for a user
 */

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
 * Fetch recently played tracks from Last.fm
 */
export async function getRecentlyPlayed(
  username: string,
  apiKey: string,
  limit: number = 5,
): Promise<LastFmTrack[]> {
  try {
    if (!username || !apiKey) {
      console.warn('⚠️ Last.fm: Missing username or API key');
      return [];
    }

    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(username)}&api_key=${apiKey}&format=json&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Last.fm API error (${response.status}):`, errorText);
      throw new Error(`Last.fm API error: ${response.status}`);
    }

    const data: LastFmResponse = await response.json();

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
  } catch (error) {
    console.error('❌ Failed to fetch Last.fm data:', error);
    return [];
  }
}
