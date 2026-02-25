const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    ME: `${BASE_URL}/auth/me`,
  },
  ENROLLMENTS: {
    MY_COURSES: `${BASE_URL}/enrollments/my-courses`,
    BY_ID: (id) => `${BASE_URL}/enrollments/${id}`,
  },
}
