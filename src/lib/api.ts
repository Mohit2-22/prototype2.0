// API Configuration and Base URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  REGISTER: '/auth/register/',
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  PROFILE: '/auth/profile/',
  USER_STATS: '/auth/stats/',
  COMMUNITY_STATS: '/auth/community-stats/',
  
  // Reports
  REPORTS: '/reports/',
  REPORT_DETAIL: (id: number) => `/reports/${id}/`,
  REPORT_CATEGORIES: '/reports/categories/',
  REPORT_STATS: '/reports/stats/',
  PUBLIC_REPORT_STATS: '/reports/public-stats/',
  UPDATE_REPORT_STATUS: (id: number) => `/reports/${id}/update-status/`,
  
  // Activities
  ACTIVITIES: '/activities/',
  ACTIVITY_DETAIL: (id: number) => `/activities/${id}/`,
  PARTICIPATE_ACTIVITY: '/activities/participate/',
  MY_PARTICIPATIONS: '/activities/my-participations/',
  ACTIVITY_STATS: '/activities/stats/',
  PUBLIC_ACTIVITY_STATS: '/activities/public-stats/',
  ACTIVITY_CATEGORIES: '/activities/categories/',
  SUBMIT_FEEDBACK: (id: number) => `/activities/participations/${id}/feedback/`,
  
  // Leaderboard
  LEADERBOARD: '/leaderboard/',
  BADGES: '/leaderboard/badges/',
  MY_BADGES: '/leaderboard/my-badges/',
  MY_RANKING: '/leaderboard/my-ranking/',
  POINT_HISTORY: '/leaderboard/point-history/',
  LEADERBOARD_STATS: '/leaderboard/stats/',
  CHECK_BADGES: '/leaderboard/check-badges/',
  PUBLIC_LEADERBOARD_STATS: '/leaderboard/public-stats/',
};

// Get token from localStorage
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  console.log('getAuthToken called, token exists:', !!token);
  if (token) {
    console.log('Token preview:', token.substring(0, 20) + '...');
  }
  return token;
};

// Set token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Remove token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};