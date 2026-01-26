"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { authApi } from "@/lib/api"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading, setUser } = useAuthStore()
  const [initialized, setInitialized] = useState(false)

  // /projects 页面允许未登录访问
  const isProjectsPage = pathname === "/projects" || pathname.startsWith("/projects/")

  useEffect(() => {
    // Initialize user on first mount
    if (!initialized) {
      // 尝试从 localStorage 恢复用户状态
      const savedUser = localStorage.getItem("bookart-user")
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          setUser(user)
        } catch (e) {
          console.error("Failed to restore user:", e)
        }
      }
      setInitialized(true)
    }
  }, [initialized, setUser])

  useEffect(() => {
    // /projects 页面允许未登录访问
    if (isProjectsPage) {
      return
    }

    // Redirect to login if not authenticated and initialization is complete
    if (initialized && !isLoading && !isAuthenticated) {
      router.push("/auth/sign-in")
    }
  }, [isAuthenticated, isLoading, router, initialized, isProjectsPage])

  // 加载状态
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

  // /projects 页面始终显示内容（无论是否登录）
  if (isProjectsPage) {
    return <>{children}</>
  }

  // 其他页面需要登录
  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
