"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { useAuthStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { Button } from "@/components/ui/button"
import { FolderOpen, Coins, User, Settings, LogOut, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuthStore()
  const { t } = useI18n()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isProjectsPage, setIsProjectsPage] = useState(false)

  // 检查是否是 projects 页面（未登录时不显示侧边栏）
  useEffect(() => {
    setIsProjectsPage(pathname === "/projects" || pathname.startsWith("/projects/"))
  }, [pathname])

  // 未登录访问 projects 页面时不显示侧边栏
  const showSidebar = !(isProjectsPage && !isAuthenticated)

  const navigation = [
    { name: t("projects"), href: "/projects", icon: FolderOpen },
    { name: t("credits"), href: "/credits", icon: Coins },
    { name: t("account"), href: "/account", icon: User },
  ]

  const adminNavigation = [{ name: t("admin"), href: "/admin", icon: Settings }]
  const isAdmin = user?.role === "admin"

  const handleSignOut = () => {
    localStorage.removeItem("bookart-user")
    localStorage.removeItem("tempProject")
    window.location.href = "/auth/sign-in"
  }

  return (
    <AuthGuard>
      <div className={cn(
        "min-h-screen bg-gray-50",
        !showSidebar && "bg-white"
      )}>
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && showSidebar && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar - 只在需要时显示 */}
        {showSidebar && (
          <aside
            className={cn(
              "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <Link href="/projects" className="text-xl font-bold text-purple-600">
                  BookArt
                </Link>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                  const isActive = pathname.startsWith(item.href)
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-purple-100 text-purple-700"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  )
                })}

                {isAdmin && (
                  <>
                    <div className="pt-4 pb-2">
                      <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t("admin")}</p>
                    </div>
                    {adminNavigation.map((item) => {
                      const isActive = pathname.startsWith(item.href)
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                            isActive ? "bg-purple-100 text-purple-700" : "text-gray-700 hover:bg-gray-100"
                          )}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.name}
                        </Link>
                      )
                    })}
                  </>
                )}
              </nav>

              {/* User section */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name || t("account")}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 rounded-lg mb-3">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{user?.credits || 0}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t("signOut")}
                </Button>
              </div>
            </div>
          </aside>
        )}

        {/* Main content */}
        <div className={cn(
          "transition-all duration-200",
          showSidebar ? "lg:pl-64" : ""
        )}>
          {/* Mobile header - 只在显示侧边栏时显示 */}
          {showSidebar && (
            <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <Link href="/projects" className="text-lg font-bold text-purple-600">
                BookArt
              </Link>
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">{user?.credits || 0}</span>
              </div>
            </header>
          )}

          {/* Page content */}
          <main className={cn(
            "p-4 lg:p-8",
            !showSidebar && "p-0"
          )}>
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
