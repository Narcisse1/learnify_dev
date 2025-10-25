import React, { createContext, useContext, useState, useEffect } from 'react'

type DarkModeContextType = {
  darkMode: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    try {
      // Apply dark class to html element
      if (darkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      // Save to localStorage
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
      }
    } catch (error) {
      console.warn('Dark mode localStorage error:', error)
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = () => {
  const context = useContext(DarkModeContext)
  if (context === undefined) {
    throw new Error('useDarkMode must be used within a DarkModeProvider')
  }
  return context
}

export default DarkModeProvider