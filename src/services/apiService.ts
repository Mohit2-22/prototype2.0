import { API_BASE_URL, getAuthToken } from '../lib/api';

// Generic API request function
async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  // Build headers conditionally: if the body is FormData, do NOT set Content-Type
  const isFormData = options.body instanceof FormData;
  const baseHeaders: Record<string, string> = {};
  if (!isFormData) {
    baseHeaders['Content-Type'] = 'application/json';
  }
  if (token) {
    baseHeaders['Authorization'] = `Token ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...baseHeaders,
      ...options.headers,
    },
  };
  
  try {
    console.log('Making API request to:', url);
    console.log('Config:', config);
    
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API Error Response:', errorData);
      
      // Handle validation errors specifically
      if (response.status === 400 && errorData) {
        const errorMessages = [];
        
        // Extract field-specific errors
        if (typeof errorData === 'object') {
          for (const [field, errors] of Object.entries(errorData)) {
            if (Array.isArray(errors)) {
              errorMessages.push(`${field}: ${errors.join(', ')}`);
            } else if (typeof errors === 'string') {
              errorMessages.push(`${field}: ${errors}`);
            }
          }
        }
        
        if (errorMessages.length > 0) {
          throw new Error(`Validation errors: ${errorMessages.join('; ')}`);
        }
      }
      
      const errorMessage = errorData.message || errorData.detail || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    console.log('API Response data:', responseData);
    return responseData;
  } catch (error: any) {
    console.error('API Request Error:', error);
    // Preserve the original error message for better debugging
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check if the backend is running.');
    }
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
    console.log('Creating report with data:', reportData);
    
    const formData = new FormData();
    Object.keys(reportData).forEach(key => {
      if (reportData[key] !== null && reportData[key] !== undefined) {
        formData.append(key, reportData[key]);
      }
    });
    
    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    
    const response = await apiRequest('/reports/', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
    
    console.log('Create report response:', response);
    
    // Normalize response format - Django might return the object directly or wrapped
    if (response && typeof response === 'object') {
      // If response has an id, it's the report object
      if (response.id) {
        return { data: response };
      }
      // If response has a data property, use it
      if (response.data) {
        return response;
      }
      // Otherwise, assume the response is the report object
      return { data: response };
    }
    
    return response;
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
    const res = await apiRequest('/reports/categories/');
    // Support both paginated ({results: []}) and plain list ([] or {data: []}) formats
    if (Array.isArray(res)) return { data: res };
    if (res?.results) return { data: res.results };
    if (res?.data) return { data: res.data };
    return { data: [] };
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