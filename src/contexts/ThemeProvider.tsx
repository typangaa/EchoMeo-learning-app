import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'default' | 'forest' | 'warm' | 'purple' | 'rose'
export type Mode = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  mode: Mode
  setTheme: (theme: Theme) => void
  setMode: (mode: Mode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  defaultMode?: Mode
}

export function ThemeProvider({ 
  children, 
  defaultTheme = 'default',
  defaultMode = 'system'
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Load theme from localStorage or use default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('echomeo-theme')
      if (stored && ['default', 'forest', 'warm', 'purple', 'rose'].includes(stored)) {
        return stored as Theme
      }
    }
    return defaultTheme
  })

  const [mode, setModeState] = useState<Mode>(() => {
    // Load mode from localStorage or use default
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('echomeo-mode')
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        return stored as Mode
      }
    }
    return defaultMode
  })

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (typeof window !== 'undefined') {
      localStorage.setItem('echomeo-theme', newTheme)
    }
  }

  const setMode = (newMode: Mode) => {
    setModeState(newMode)
    if (typeof window !== 'undefined') {
      localStorage.setItem('echomeo-mode', newMode)
    }
  }

  useEffect(() => {
    const root = window.document.documentElement
    
    // Apply theme data attribute
    root.setAttribute('data-theme', theme)
    
    // Apply mode class
    root.classList.remove('light', 'dark')
    
    if (mode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(mode)
    }
  }, [theme, mode])

  // Listen for system theme changes when mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mode])

  const value: ThemeContextType = {
    theme,
    mode,
    setTheme,
    setMode,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}