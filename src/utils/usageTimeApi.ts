/**
 * Utility functions for fetching app usage time from the analytics API
 */

export interface UsageTimeData {
  total_seconds: number;
  total_minutes: number;
  total_hours: number;
  formatted_time?: string;
}

/**
 * Formats seconds into a human-readable time string (e.g., "2h 45m", "45m", "1h")
 * @param totalSeconds - Total seconds to format
 * @returns Formatted time string
 */
export function formatUsageTime(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return '< 1m';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0 && minutes > 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Fetches the user's total app usage time from the analytics API
 * @param token - The authentication token
 * @returns Promise with usage time in seconds or null if request fails
 */
export async function fetchUsageTime(token: string): Promise<number | null> {
  try {
    const response = await fetch('https://api.exeleratetechnology.com/api/analytics/usage-time.php', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch usage time:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    // Handle different response formats
    if (data.success && data.data) {
      // Could be in seconds, minutes, or hours
      if (data.data.total_seconds !== undefined) {
        return data.data.total_seconds;
      } else if (data.data.total_minutes !== undefined) {
        return data.data.total_minutes * 60;
      } else if (data.data.total_hours !== undefined) {
        return data.data.total_hours * 3600;
      } else if (data.data.usage_time_seconds !== undefined) {
        return data.data.usage_time_seconds;
      }
    } else if (data.total_seconds !== undefined) {
      // Direct response format
      return data.total_seconds;
    } else if (data.usage_time_seconds !== undefined) {
      return data.usage_time_seconds;
    }

    return null;
  } catch (error) {
    console.error('Error fetching usage time:', error);
    return null;
  }
}

