/**
 * Music helper functions
 * Shared utilities for music-related components
 */

/**
 * Get relative time string in English
 * @param dateString - ISO date string (e.g., "2025-02-21T22:11:00Z")
 * @returns Relative time string (e.g., "just now", "5 min ago", "2 hours ago", "3 months ago", "1 year ago")
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) return '';

  try {
    const now = new Date();
    const then = new Date(dateString);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    }
    if (diffDays < 365) {
      return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    }
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  } catch (error) {
    return '';
  }
}
