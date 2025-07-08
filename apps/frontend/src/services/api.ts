import axios from 'axios'
import { logger } from './logger'
import { errorHandler } from './errorHandler'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1'
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Log API requests in development
  if (import.meta.env.DEV) {
    logger.debug('API Request', { 
      method: config.method?.toUpperCase(), 
      url: config.url, 
      baseURL: config.baseURL 
    })
  }
  
  return config
})

// Retry configuration
const MAX_RETRIES = 3
const RETRY_DELAY = 1000

// Handle auth errors, logging, and retries
api.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      logger.debug('API Response', { 
        status: response.status, 
        url: response.config.url,
        method: response.config.method?.toUpperCase()
      })
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log API errors
    logger.error('API Error', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      message: error.message,
      response: error.response?.data
    })
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    
    // Retry logic for network errors and 5xx errors
    if (
      (!error.response || error.response.status >= 500) &&
      originalRequest &&
      !originalRequest._retry &&
      (originalRequest._retryCount || 0) < MAX_RETRIES
    ) {
      originalRequest._retry = true
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1
      
      const delay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1)
      
      logger.info(`Retrying request (attempt ${originalRequest._retryCount}/${MAX_RETRIES})`, {
        url: originalRequest.url,
        delay
      })
      
      await new Promise(resolve => setTimeout(resolve, delay))
      
      try {
        const response = await api(originalRequest)
        toast.success('Connection restored', { duration: 2000 })
        return response
      } catch (retryError) {
        if (originalRequest._retryCount >= MAX_RETRIES) {
          toast.error('Connection failed after multiple attempts', { duration: 5000 })
        }
        return Promise.reject(retryError)
      }
    }
    
    // Show user-friendly error messages
    if (error.response?.status >= 400 && error.response?.status < 500) {
      const message = error.response?.data?.message || 'An error occurred'
      toast.error(message, { duration: 4000 })
    } else if (!error.response) {
      toast.error('Network error - please check your connection', { duration: 5000 })
    }
    
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
  register: (data: any) =>
    api.post('/auth/register', data),
  validateToken: () =>
    api.get('/auth/validate'),
  getProfile: () =>
    api.get('/auth/profile'),
}

// Users API
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.patch(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
}

// Matters API
export const mattersApi = {
  getAll: () => api.get('/matters'),
  getById: (id: string) => api.get(`/matters/${id}`),
  create: (data: any) => api.post('/matters', data),
  update: (id: string, data: any) => api.patch(`/matters/${id}`, data),
  delete: (id: string) => api.delete(`/matters/${id}`),
  getStatistics: () => api.get('/matters/statistics'),
  getByClient: (clientName: string) => api.get(`/matters/client/${clientName}`),
  getByStatus: (status: string) => api.get(`/matters/status/${status}`),
}

// Contracts API
export const contractsApi = {
  getAll: () => api.get('/contracts'),
  getById: (id: string) => api.get(`/contracts/${id}`),
  create: (data: any) => api.post('/contracts', data),
  update: (id: string, data: any) => api.patch(`/contracts/${id}`, data),
  delete: (id: string) => api.delete(`/contracts/${id}`),
}

// Cases API
export const casesApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string; status?: string; type?: string }) =>
    api.get('/cases', { params }),
  getById: (id: string) => api.get(`/cases/${id}`),
  create: (data: any) => api.post('/cases', data),
  update: (id: string, data: any) => api.put(`/cases/${id}`, data),
  delete: (id: string) => api.delete(`/cases/${id}`),
  uploadDocument: (caseId: string, formData: FormData) =>
    api.post(`/cases/${caseId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  getDocuments: (caseId: string) => api.get(`/cases/${caseId}/documents`),
  deleteDocument: (caseId: string, documentId: string) =>
    api.delete(`/cases/${caseId}/documents/${documentId}`),
  analyzeCase: (caseId: string, analysisType: string, data?: any) =>
    api.post(`/cases/${caseId}/analyze`, { analysisType, ...data }),
  getAnalyses: (caseId: string) => api.get(`/cases/${caseId}/analyses`),
  getAnalysis: (caseId: string, analysisId: string) =>
    api.get(`/cases/${caseId}/analyses/${analysisId}`),
  bulkAnalyze: (caseIds: string[], analysisType: string) =>
    api.post('/cases/bulk/analyze', { caseIds, analysisType }),
  getStatsSummary: () => api.get('/cases/stats/summary'),
  exportCase: (caseId: string, format?: string) =>
    api.get(`/cases/${caseId}/export`, { params: { format } }),
}

// AI API
export const aiApi = {
  chat: (message: string, context?: string) =>
    api.post('/ai/chat', { message, context }),
  legalResearch: (query: string, jurisdiction?: string, keywords?: string[]) =>
    api.post('/ai/research', { query, jurisdiction, keywords }),
  analyzeContract: (contractText: string, contractType?: string) =>
    api.post('/ai/analyze-contract', { contractText, contractType }),
  generateDocument: (documentType: string, parameters: any) =>
    api.post('/ai/generate-document', { documentType, parameters }),
  summarizeText: (text: string) =>
    api.post('/ai/summarize', { text }),
  extractKeyTerms: (text: string) =>
    api.post('/ai/extract-terms', { text }),
  assessRisk: (content: string, type: 'contract' | 'matter' | 'general') =>
    api.post('/ai/assess-risk', { content, type }),
}

export default api