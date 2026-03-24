import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Global 401/403 handler — but NOT for the login/register endpoints
// (those 401s should be handled by the calling code to show error messages)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register')

    if (!isAuthEndpoint && (error.response?.status === 401 || error.response?.status === 403)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
}

export const userAPI = {
  getAllUsers:  ()         => api.get('/users'),
  getUserById: (id)       => api.get(`/users/${id}`),
  createUser:  (data)     => api.post('/users', data),
  updateUser:  (id, data) => api.put(`/users/${id}`, data),
  deleteUser:  (id)       => api.delete(`/users/${id}`),
}

export const employeeAPI = {
  getAllEmployees:  ()         => api.get('/employees'),
  getEmployeeById: (id)       => api.get(`/employees/${id}`),
  createEmployee:  (data)     => api.post('/employees', data),
  updateEmployee:  (id, data) => api.put(`/employees/${id}`, data),
  deleteEmployee:  (id)       => api.delete(`/employees/${id}`),
}

export const vehicleAPI = {
  getAllVehicles: () => api.get('/vehicles'),
}

export const fuelAPI = {
  addFuelLog:           (data)           => api.post('/fuel/add', data),
  getFuelLogById:       (id)             => api.get(`/fuel/${id}`),
  getLogsByVehicle:     (vehicleRegNumber) => api.get(`/fuel/vehicle/${vehicleRegNumber}`),
  getSummary:           ()               => api.get('/fuel/summary'),
  getChartData:         ()               => api.get('/fuel/chart'),
  getVehicleStats:      ()               => api.get('/fuel/stats'),
}

export const serviceAPI = {
  getAllServices:       ()               => api.get('/services'),
  getServiceById:       (id)             => api.get(`/services/${id}`),
  createService:        (data)           => api.post('/services', data),
  updateService:        (id, data)       => api.put(`/services/${id}`, data),
  deleteService:        (id)             => api.delete(`/services/${id}`),
  getServiceStats:      ()               => api.get('/services/stats'),
  getUpcomingServices:  ()               => api.get('/services/upcoming'),
  getRecentServices:    ()               => api.get('/services/recent'),
}

export default api
