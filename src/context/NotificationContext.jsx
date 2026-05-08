import React, { createContext, useContext, useCallback } from 'react'
import { toast } from 'react-toastify'

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const notify = useCallback((message, type = 'info', options = {}) => {
    const defaultOptions = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    }

    const finalOptions = { ...defaultOptions, ...options }

    switch (type) {
      case 'success':
        toast.success(message, finalOptions)
        break
      case 'error':
        toast.error(message, finalOptions)
        break
      case 'warning':
        toast.warning(message, finalOptions)
        break
      case 'info':
      default:
        toast.info(message, finalOptions)
        break
    }
  }, [])

  const success = useCallback((message, options = {}) => notify(message, 'success', options), [notify])
  const error = useCallback((message, options = {}) => notify(message, 'error', options), [notify])
  const warning = useCallback((message, options = {}) => notify(message, 'warning', options), [notify])
  const info = useCallback((message, options = {}) => notify(message, 'info', options), [notify])

  const value = {
    notify,
    showNotification: notify,
    success,
    error,
    warning,
    info,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
