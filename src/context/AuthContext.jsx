import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('vp_user')
    return saved ? JSON.parse(saved) : null
  })

  function login(userData) {
    setUser(userData)
    localStorage.setItem('vp_user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('vp_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
