"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { authApi } from "@/lib/api"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, isLoading, setUser } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    // Initialize user on first mount
    if (!initialized) {
      authApi.getCurrentUser().then((user) => {
        setUser(user)
        setInitialized(true)
      })
    }
  }, [initialized, setUser])

  useEffect(() => {
    // Redirect to login if not authenticated and initialization is complete
    if (initialized && !isLoading && !isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, isLoading, router, initialized])

  if (!initialized || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
