/**
 * Utility functions for fetching weekly improvement data from the analytics API
 */

export interface ImprovementData {
  improvement_percentage?: number;
  improvement?: number;
  percentage?: number;
  weekly_improvement?: number;
}

/**
 * Formats improvement percentage into a display string (e.g., "+23%", "-5%", "0%")
 * @param percentage - Improvement percentage value
 * @returns Formatted improvement string
 */
export function formatImprovement(percentage: number | null | undefined): string {
  if (percentage === null || percentage === undefined) {
    return "0%";
  }

  // Round to nearest integer
  const rounded = Math.round(percentage);
  
  // Add + sign for positive values
  if (rounded > 0) {
    return `+${rounded}%`;
  } else if (rounded < 0) {
    return `${rounded}%`; // Negative sign is already included
  } else {
    return "0%";
  }
}

/**
 * Fetches the user's weekly improvement data from the analytics API
 * @param token - The authentication token
 * @returns Promise with improvement percentage or null if request fails
 */
export async function fetchImprovementData(token: string): Promise<number | null> {
  try {
    const response = await fetch('https://api.exeleratetechnology.com/api/users/improvement-weekly.php', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch improvement data:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    // Handle different response formats
    if (data.success && data.data) {
      // Check for various possible field names
      if (data.data.improvement_percentage !== undefined) {
        return data.data.improvement_percentage;
      } else if (data.data.improvement !== undefined) {
        return data.data.improvement;
      } else if (data.data.percentage !== undefined) {
        return data.data.percentage;
      } else if (data.data.weekly_improvement !== undefined) {
        return data.data.weekly_improvement;
      }
    } else if (data.improvement_percentage !== undefined) {
      // Direct response format
      return data.improvement_percentage;
    } else if (data.improvement !== undefined) {
      return data.improvement;
    } else if (data.percentage !== undefined) {
      return data.percentage;
    } else if (data.weekly_improvement !== undefined) {
      return data.weekly_improvement;
    }

    return null;
  } catch (error) {
    console.error('Error fetching improvement data:', error);
    return null;
  }
}

