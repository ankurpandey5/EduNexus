const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };
};

const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: getAuthHeaders(),
        ...options
    };

    try {
        console.log(`Making API request to: ${url}`, config); // Debug log
        const response = await fetch(url, config);
        const data = await response.json();

        console.log(`API response from: ${url}`, data); // Debug log

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Auth APIs
export const authAPI = {
    login: (credentials) => apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (userData) => apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),
    getProfile: () => apiRequest('/auth/profile')
};

// Course APIs
export const courseAPI = {
    createCourse: (courseData) => apiRequest('/courses', {
        method: 'POST',
        body: JSON.stringify(courseData)
    }),
    getCourses: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/courses${queryString ? `?${queryString}` : ''}`);
    },
    getCourseById: (id) => apiRequest(`/courses/${id}`),
    updateCourse: (id, courseData) => apiRequest(`/courses/${id}`, {
        method: 'PUT',
        body: JSON.stringify(courseData)
    }),
    deleteCourse: (id) => apiRequest(`/courses/${id}`, {
        method: 'DELETE'
    }),
    enrollInCourse: (id) => apiRequest(`/courses/${id}/enroll`, {
        method: 'POST'
    }),
    getTeacherCourses: () => apiRequest('/courses/teacher')
};

// Quiz APIs
export const quizAPI = {
    createQuiz: (quizData) => apiRequest('/quizzes', {
        method: 'POST',
        body: JSON.stringify(quizData)
    }),
    getQuizzes: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/quizzes${queryString ? `?${queryString}` : ''}`);
    },
    getQuizById: (id) => apiRequest(`/quizzes/${id}`),
    updateQuiz: (id, quizData) => apiRequest(`/quizzes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(quizData)
    }),
    deleteQuiz: (id) => apiRequest(`/quizzes/${id}`, {
        method: 'DELETE'
    }),
    submitQuiz: (id, answers) => apiRequest(`/quizzes/${id}/submit`, {
        method: 'POST',
        body: JSON.stringify({ answers })
    }),
    getTeacherQuizzes: () => apiRequest('/quizzes/teacher')
};

// Dashboard APIs
export const dashboardAPI = {
    getTeacherStats: () => apiRequest('/dashboard/stats'),
    getRecentActivity: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/dashboard/activity${queryString ? `?${queryString}` : ''}`);
    },
    getCourseAnalytics: (id) => apiRequest(`/dashboard/analytics/${id}`),
    getVideoLibrary: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/dashboard/videos${queryString ? `?${queryString}` : ''}`);
    }
};

// Video APIs
export const videoAPI = {
    uploadVideo: (videoData) => apiRequest('/videos', {
        method: 'POST',
        body: JSON.stringify(videoData)
    }),
    getVideos: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/videos${queryString ? `?${queryString}` : ''}`);
    },
    updateVideo: (id, videoData) => apiRequest(`/videos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(videoData)
    }),
    deleteVideo: (id) => apiRequest(`/videos/${id}`, {
        method: 'DELETE'
    })
};

export default {
    authAPI,
    courseAPI,
    quizAPI,
    dashboardAPI,
    videoAPI
};
