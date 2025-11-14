/**
 * Mixcloud API helper
 * Fetches recent cloudcasts (shows/uploads) for a user
 */

import type { NormalizedMusicItem } from './discogs';

export interface MixcloudCloudcast {
  key: string;
  name: string;
  url: string;
  created_time: string;
  updated_time: string;
  pictures: {
    thumbnail?: string;
    medium_mobile?: string;
    extra_large?: string;
  };
  slug: string;
  user: {
    username: string;
    name: string;
  };
  description?: string;
  play_count?: number;
  favorite_count?: number;
  repost_count?: number;
  listener_count?: number;
  tags?: Array<{
    key: string;
    name: string;
    url: string;
  }>;
}

export interface MixcloudResponse {
  data: MixcloudCloudcast[];
  paging?: {
    next?: string;
    previous?: string;
  };
}

export interface ProcessedMixcloudCloudcast {
  key: string;
  name: string;
  url: string;
  slug: string;
  createdTime: string;
  thumbnail?: string;
  genres?: string[];
  mixcloudId: string;
}

/**
 * Fetch recent cloudcasts from Mixcloud
 */
export async function getRecentCloudcasts(
  username: string,
  limit: number = 5,
): Promise<ProcessedMixcloudCloudcast[]> {
  try {
    if (!username) {
      console.warn('⚠️ Mixcloud: Missing username');
      return [];
    }

    // Mixcloud API endpoint for user's cloudcasts
    const url = `https://api.mixcloud.com/${encodeURIComponent(username)}/cloudcasts/?limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Mixcloud API error (${response.status}):`, errorText);
      throw new Error(`Mixcloud API error: ${response.status}`);
    }

    const data: MixcloudResponse = await response.json();

    if (!data.data || !Array.isArray(data.data)) {
      console.warn('⚠️ Mixcloud: No cloudcasts found');
      return [];
    }

    // Process cloudcasts to extract and format data
    const processedCloudcasts: ProcessedMixcloudCloudcast[] = data.data.map(
      (cloudcast) => {
        // Extract mixcloud ID from URL (format: username/show-slug)
        const mixcloudId = cloudcast.url
          .replace('https://www.mixcloud.com/', '')
          .replace(/\/$/, '');

        // Extract genres from tags
        const genres =
          cloudcast.tags && cloudcast.tags.length > 0
            ? cloudcast.tags.map((tag) => tag.name)
            : undefined;

        return {
          key: cloudcast.key,
          name: cloudcast.name,
          url: cloudcast.url,
          slug: cloudcast.slug,
          createdTime: cloudcast.created_time,
          thumbnail:
            cloudcast.pictures?.extra_large ||
            cloudcast.pictures?.medium_mobile ||
            cloudcast.pictures?.thumbnail,
          genres: genres,
          mixcloudId: mixcloudId,
        };
      },
    );

    return processedCloudcasts;
  } catch (error) {
    console.error('❌ Failed to fetch Mixcloud data:', error);
    return [];
  }
}

/**
 * Wrapper function that reads environment variables and returns normalized data
 * For use in API endpoint
 */
export async function getMixcloud(): Promise<NormalizedMusicItem[]> {
  const username = import.meta.env.PUBLIC_MIXCLOUD_USERNAME || 'mieras';
  const limit = 5;

  if (!username) {
    return [];
  }

  try {
    const cloudcasts = await getRecentCloudcasts(username, limit);
    
    // Normalize to common format with source and ISO date
    return cloudcasts.map((cloudcast) => {
      // Convert created_time to ISO format
      let isoDate = '';
      if (cloudcast.createdTime) {
        try {
          const date = new Date(cloudcast.createdTime);
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
        source: 'mixcloud' as const,
        date: isoDate,
        title: cloudcast.name,
        thumb: cloudcast.thumbnail,
        mixcloudId: cloudcast.mixcloudId,
        genres: cloudcast.genres,
        url: cloudcast.url,
        slug: cloudcast.slug,
      };
    });
  } catch (error) {
    console.error('❌ Failed to fetch Mixcloud data:', error);
    return [];
  }
}

