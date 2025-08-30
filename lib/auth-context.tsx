"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { type User, signInWithEmailAndPassword, signOut, onAuthStateChanged, type AuthError } from "firebase/auth"
import { auth } from "./firebase-client"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      setError(null)
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      const authError = error as AuthError
      setError(getErrorMessage(authError.code))
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setError(null)
      await signOut(auth)
    } catch (error) {
      const authError = error as AuthError
      setError(getErrorMessage(authError.code))
      throw error
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    logout,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function getErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "No se encontró una cuenta con este correo electrónico."
    case "auth/wrong-password":
      return "Contraseña incorrecta."
    case "auth/invalid-email":
      return "El correo electrónico no es válido."
    case "auth/user-disabled":
      return "Esta cuenta ha sido deshabilitada."
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intenta de nuevo más tarde."
    case "auth/invalid-credential":
      return "Credenciales inválidas. Verifica tu correo y contraseña."
    default:
      return "Error de autenticación. Intenta de nuevo."
  }
}
