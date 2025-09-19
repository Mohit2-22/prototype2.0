import { API_BASE_URL, getAuthToken } from '../lib/api';

// Generic API request function
async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Token ${token}` }),
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Authentication Services
export const authService = {
  register: async (userData: any) => {
    const formData = new FormData();
    Object.keys(userData).forEach(key => {
      if (userData[key] !== null && userData[key] !== undefined) {
        formData.append(key, userData[key]);
      }
    });
    
    return apiRequest('/auth/register/', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  },
  
  login: async (identifier: string, password: string) => {
    return apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },
  
  logout: async () => {
    return apiRequest('/auth/logout/', { method: 'POST' });
  },
  
  getProfile: async () => {
    return apiRequest('/auth/profile/');
  },
  
  updateProfile: async (profileData: any) => {
    return apiRequest('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
  
  getUserStats: async () => {
    return apiRequest('/auth/stats/');
  },
  
  getCommunityStats: async () => {
    return apiRequest('/auth/community-stats/');
  },
};

// Report Services
export const reportService = {
  getReports: async (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/reports/${params ? `?${params}` : ''}`;
    return apiRequest(endpoint);
  },
  
  createReport: async (reportData: any) => {
    const formData = new FormData();
    Object.keys(reportData).forEach(key => {
      if (reportData[key] !== null && reportData[key] !== undefined) {
        formData.append(key, reportData[key]);
      }
    });
    
    return apiRequest('/reports/', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  },
  
  getReportDetail: async (id: number) => {
    return apiRequest(`/reports/${id}/`);
  },
  
  updateReport: async (id: number, reportData: any) => {
    return apiRequest(`/reports/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(reportData),
    });
  },
  
  deleteReport: async (id: number) => {
    return apiRequest(`/reports/${id}/`, { method: 'DELETE' });
  },
  
  getCategories: async () => {
    return apiRequest('/reports/categories/');
  },
  
  getReportStats: async () => {
    return apiRequest('/reports/stats/');
  },
  
  getPublicReportStats: async () => {
    return apiRequest('/reports/public-stats/');
  },
};

// Activity Services
export const activityService = {
  getActivities: async (filters?: any) => {
    const params = new URLSearchParams(filters).toString();
    const endpoint = `/activities/${params ? `?${params}` : ''}`;
    return apiRequest(endpoint);
  },
  
  getActivityDetail: async (id: number) => {
    return apiRequest(`/activities/${id}/`);
  },
  
  participateInActivity: async (activityId: number) => {
    return apiRequest('/activities/participate/', {
      method: 'POST',
      body: JSON.stringify({ activity: activityId }),
    });
  },
  
  getMyParticipations: async () => {
    return apiRequest('/activities/my-participations/');
  },
  
  submitFeedback: async (participationId: number, feedback: string, rating: number) => {
    return apiRequest(`/activities/participations/${participationId}/feedback/`, {
      method: 'POST',
      body: JSON.stringify({ feedback, rating }),
    });
  },
  
  getActivityStats: async () => {
    return apiRequest('/activities/stats/');
  },
  
  getPublicActivityStats: async () => {
    return apiRequest('/activities/public-stats/');
  },
  
  getActivityCategories: async () => {
    return apiRequest('/activities/categories/');
  },
};

// Leaderboard Services
export const leaderboardService = {
  getLeaderboard: async () => {
    return apiRequest('/leaderboard/');
  },
  
  getBadges: async () => {
    return apiRequest('/leaderboard/badges/');
  },
  
  getMyBadges: async () => {
    return apiRequest('/leaderboard/my-badges/');
  },
  
  getMyRanking: async () => {
    return apiRequest('/leaderboard/my-ranking/');
  },
  
  getPointHistory: async () => {
    return apiRequest('/leaderboard/point-history/');
  },
  
  checkForNewBadges: async () => {
    return apiRequest('/leaderboard/check-badges/', { method: 'POST' });
  },
  
  getLeaderboardStats: async () => {
    return apiRequest('/leaderboard/stats/');
  },
  
  getPublicLeaderboardStats: async () => {
    return apiRequest('/leaderboard/public-stats/');
  },
};

export default {
  auth: authService,
  reports: reportService,
  activities: activityService,
  leaderboard: leaderboardService,
};