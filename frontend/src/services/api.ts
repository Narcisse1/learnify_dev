import axios from 'axios'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  (config) => {
    // Add API key from environment variable or use test key
    const apiKey = import.meta.env.VITE_API_KEY || 'test-api-key-12345'
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error('Unauthorized access')
    }
    return Promise.reject(error)
  }
)

export default api
