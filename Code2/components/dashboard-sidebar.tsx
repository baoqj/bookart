"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useI18n } from "@/lib/i18n"
import { LayoutDashboard, BookOpen, CreditCard, Crown, Settings, Sparkles } from "lucide-react"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { t } = useI18n()

  const navigation = [
    {
      name: t("overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
      current: pathname === "/dashboard",
    },
    {
      name: t("bookProjects"),
      href: "/dashboard/projects",
      icon: BookOpen,
      current: pathname?.startsWith("/dashboard/projects"),
    },
    {
      name: t("creditsUsage"),
      href: "/dashboard/credits",
      icon: CreditCard,
      current: pathname === "/dashboard/credits",
    },
    {
      name: t("subscription"),
      href: "/dashboard/subscription",
      icon: Crown,
      current: pathname === "/dashboard/subscription",
    },
    {
      name: t("settings"),
      href: "/dashboard/settings",
      icon: Settings,
      current: pathname === "/dashboard/settings",
    },
  ]

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border/50 bg-card/80 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-border/50 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          {t("appName")}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                item.current
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
