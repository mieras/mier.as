/**
 * Client-side helper functions for music components
 */

// Helper function to format relative time for Last.fm tracks
export function getRelativeTimeLastFm(dateText: string, uts?: string): string {
  if (!dateText) return '';

  try {
    const now = new Date();
    let trackDate: Date;

    if (uts) {
      // Use unix timestamp if available (more accurate)
      trackDate = new Date(parseInt(uts) * 1000);
    } else {
      // Parse the date text (format: "08 Nov 2025, 11:12")
      trackDate = new Date(dateText);
    }

    const diffMs = now.getTime() - trackDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'zojuist';
    if (diffMins < 60) return `${diffMins} min geleden`;
    if (diffHours < 24) return `${diffHours} uur geleden`;
    if (diffDays === 1) return 'gisteren';
    if (diffDays < 7) return `${diffDays} dagen geleden`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'maand' : 'maanden'} geleden`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'jaar' : 'jaren'} geleden`;
  } catch (error) {
    return dateText; // Fallback to original text
  }
}

// Helper function to format relative time for Mixcloud
export function getRelativeTimeMixcloud(dateString: string): string {
  if (!dateString) return '';

  try {
    const now = new Date();
    const uploadDate = new Date(dateString);
    const diffMs = now.getTime() - uploadDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'zojuist geüpload';
    if (diffMins < 60) return `${diffMins} min geleden geüpload`;
    if (diffHours < 24) return `${diffHours} uur geleden geüpload`;
    if (diffDays === 1) return 'gisteren geüpload';
    if (diffDays < 7) return `${diffDays} dagen geleden geüpload`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden geüpload`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'maand' : 'maanden'} geleden geüpload`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'jaar' : 'jaren'} geleden geüpload`;
  } catch (error) {
    return '';
  }
}

// Helper function to format relative time for Discogs
export function getRelativeTimeDiscogs(dateString?: string): string {
  if (!dateString) return '';

  try {
    const now = new Date();
    const addedDate = new Date(dateString);
    const diffMs = now.getTime() - addedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'zojuist toegevoegd';
    if (diffMins < 60) return `${diffMins} min geleden toegevoegd`;
    if (diffHours < 24) return `${diffHours} uur geleden toegevoegd`;
    if (diffDays === 1) return 'gisteren toegevoegd';
    if (diffDays < 7) return `${diffDays} dagen geleden toegevoegd`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weken'} geleden toegevoegd`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'maand' : 'maanden'} geleden toegevoegd`;
    }
    const years = Math.floor(diffDays / 365);
    return `${years} ${years === 1 ? 'jaar' : 'jaren'} geleden toegevoegd`;
  } catch (error) {
    return '';
  }
}

