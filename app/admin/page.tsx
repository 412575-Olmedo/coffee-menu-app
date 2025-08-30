"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { LoginForm } from "@/components/auth/login-form"

export default function AdminLoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push("/admin/dashboard")
    }
  }, [user, loading, router])

  if (loading) {
    return null
  }

  if (user) {
    return null
  }

  return <LoginForm />
}
