/**
 * Discogs API helper
 * Fetches recent releases/records from user's collection
 */

export interface DiscogsRelease {
  id: number;
  date_added?: string;
  basic_information: {
    id: number;
    title: string;
    year?: number;
    artists?: Array<{
      name: string;
    }>;
    thumb?: string;
    cover_image?: string;
    formats?: Array<{
      name: string;
      qty: string;
    }>;
    resource_url: string;
  };
}

export interface DiscogsResponse {
  pagination: {
    page: number;
    pages: number;
    per_page: number;
    items: number;
  };
  releases: DiscogsRelease[];
}

export interface ProcessedDiscogsRelease {
  id: number;
  title: string;
  year?: number;
  artist?: string;
  thumb?: string;
  format?: string;
  dateAdded?: string;
  resourceUrl: string;
}

/**
 * Normalized music item interface for API endpoint
 */
export interface NormalizedMusicItem {
  source: 'discogs' | 'lastfm' | 'mixcloud';
  date: string; // ISO format: "2025-02-21T22:11:00Z"
  artist?: string;
  title?: string;
  thumb?: string;
  // Discogs-specific fields
  id?: number;
  year?: number;
  format?: string;
  resourceUrl?: string;
  // Last.fm specific fields
  track?: string;
  album?: string;
  // Mixcloud specific fields
  mixcloudId?: string;
  genres?: string[];
  url?: string;
  slug?: string;
}

/**
 * Fetch recent releases from Discogs collection
 */
export async function getLatestRecords(
  username: string,
  token: string,
  limit: number = 5,
): Promise<ProcessedDiscogsRelease[]> {
  try {
    if (!username || !token) {
      console.warn('⚠️ Discogs: Missing username or token');
      return [];
    }

    // Discogs API endpoint for user's collection recent additions
    // sort=added&order=desc = newest first (most recently added)
    // https://api.discogs.com/users/mieras/collection/folders/0/releases?sort=added&sort_order=desc
    const url = `https://api.discogs.com/users/${encodeURIComponent(username)}/collection/folders/0/releases?sort=added&sort_order=desc&per_page=${limit}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'mier.as/1.0 +https://mier.as',
        Authorization: `Discogs token=${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Discogs API error (${response.status}):`, errorText);
      throw new Error(`Discogs API error: ${response.status}`);
    }

    const data: DiscogsResponse = await response.json();

    if (!data.releases || !Array.isArray(data.releases)) {
      console.warn('⚠️ Discogs: No releases found');
      return [];
    }

    // Process releases to extract and format data
    let processedReleases: ProcessedDiscogsRelease[] = data.releases.map(
      (release) => {
        const info = release.basic_information;
        const artist =
          info.artists && info.artists.length > 0
            ? info.artists[0].name
            : undefined;
        const format =
          info.formats && info.formats.length > 0
            ? info.formats.map((f) => f.name).join(', ')
            : undefined;

        return {
          id: info.id,
          title: info.title,
          year: info.year,
          artist: artist,
          thumb: info.cover_image || info.thumb,
          format: format,
          dateAdded: release.date_added,
          resourceUrl: info.resource_url,
        };
      },
    );

    // Sort by date_added descending (newest first) as backup
    // This ensures we always show the latest added records first, even if API doesn't sort correctly
    processedReleases.sort((a, b) => {
      if (!a.dateAdded && !b.dateAdded) return 0;
      if (!a.dateAdded) return 1; // Put items without date at end
      if (!b.dateAdded) return -1;
      // Sort descending: newest (larger timestamp) first
      return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
    });

    return processedReleases;
  } catch (error) {
    console.error('❌ Failed to fetch Discogs data:', error);
    return [];
  }
}

/**
 * Wrapper function that reads environment variables and returns normalized data
 * For use in API endpoint
 */
export async function getDiscogs(): Promise<NormalizedMusicItem[]> {
  const username = import.meta.env.PUBLIC_DISCOGS_USERNAME || '';
  const token = import.meta.env.PUBLIC_DISCOGS_TOKEN || '';
  const limit = 5;

  if (!username || !token) {
    return [];
  }

  try {
    const records = await getLatestRecords(username, token, limit);
    
    // Normalize to common format with source and ISO date
    return records.map((record) => {
      // Convert date_added to ISO format if it exists
      let isoDate = '';
      if (record.dateAdded) {
        try {
          const date = new Date(record.dateAdded);
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
        source: 'discogs' as const,
        date: isoDate,
        artist: record.artist,
        title: record.title,
        thumb: record.thumb,
        id: record.id,
        year: record.year,
        format: record.format,
        resourceUrl: record.resourceUrl,
      };
    });
  } catch (error) {
    console.error('❌ Failed to fetch Discogs data:', error);
    return [];
  }
}
