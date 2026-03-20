import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (userName, password) => {
    try {
      const response = await authAPI.login({ userName, password })
      const { token, userName: authUserName, role } = response.data.data
      const normalizedUser = {
        userName: authUserName,
        role,
        profilePicture: `https://ui-avatars.com/api/?name=${encodeURIComponent(authUserName)}`
      }
      
      setToken(token)
      setUser(normalizedUser)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(normalizedUser))
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      const { token, userName: authUserName, role } = response.data.data
      const normalizedUser = {
        userName: authUserName,
        role,
        profilePicture: userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(authUserName)}`
      }
      
      setToken(token)
      setUser(normalizedUser)
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(normalizedUser))
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    isController: user?.role === 'CONTROLLER',
    isDriver: user?.role === 'DRIVER'
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
