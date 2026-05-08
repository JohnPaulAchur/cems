import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set token in axios headers when it changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('token', token)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
    }
  }, [token])

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/me`)
          setUser(response.data)
          // const response = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`)
          // setUser(response.data.user)
          setError(null)
        } catch (err) {
          console.error('Auth check failed:', err)
          setToken(null)
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [token])

const login = async (email, password) => {
  setLoading(true)
  setError(null)

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/login`,
      { email, password }
    )

    const newToken = response.data?.token
    const userData = response.data?.user

    if (!newToken) throw new Error('Token missing from backend')

    setToken(newToken)
    setUser(userData)

    return { success: true }
  } catch (err) {
    console.log('LOGIN ERROR:', err)

    const errorMsg =
      err.response?.data?.message ||
      err.response?.data?.errors?.email?.[0] ||
      err.message ||
      'Login failed'

    setError(errorMsg)

    return { success: false, error: errorMsg }
  } finally {
    setLoading(false)
  }
}

  const register = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData)
      const { token: newToken, user: userData } = response.data
      setToken(newToken)
      setUser(userData)
      return { success: true }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setError(null)
  }

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
    userRole: user?.role || null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
