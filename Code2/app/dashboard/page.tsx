"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DashboardHeader } from "@/components/dashboard-header"
import { useI18n } from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import { Plus, FolderOpen, ImageIcon, Zap, TrendingUp } from "lucide-react"
import { mockProjects, mockAssets } from "@/lib/mock-data"

export default function OverviewPage() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalIllustrations: 0,
    creditsRemaining: 0,
    thisMonthGenerated: 0,
  })
  const [recentProjects, setRecentProjects] = useState(mockProjects.slice(0, 3))

  useEffect(() => {
    // Mock stats calculation
    setStats({
      totalProjects: mockProjects.length,
      totalIllustrations: mockAssets.length,
      creditsRemaining: user?.credits || 0,
      thisMonthGenerated: 24,
    })
  }, [user])

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title={t("overview")}
        description={t("dashboardWelcome")}
        action={
          <Button asChild className="gap-2">
            <Link href="/">
              <Plus className="h-4 w-4" />
              {t("newProject")}
            </Link>
          </Button>
        }
      />

      <div className="flex-1 p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 border-2 shadow-lg bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("totalProjects")}</p>
                <p className="text-3xl font-bold">{stats.totalProjects}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 shadow-lg bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("generatedImages")}</p>
                <p className="text-3xl font-bold">{stats.totalIllustrations}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 shadow-lg bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("remainingCredits")}</p>
                <p className="text-3xl font-bold">{stats.creditsRemaining}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-2 shadow-lg bg-card/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{t("thisMonth")}</p>
                <p className="text-3xl font-bold">{stats.thisMonthGenerated}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-2 shadow-lg bg-card/80 backdrop-blur">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">{t("quickActions")}</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-20 text-left justify-start gap-3 bg-transparent">
              <Link href="/">
                <Plus className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{t("newProject")}</p>
                  <p className="text-xs text-muted-foreground">{t("startNewProject")}</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 text-left justify-start gap-3 bg-transparent">
              <Link href="/">
                <ImageIcon className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{t("generateIllustrations")}</p>
                  <p className="text-xs text-muted-foreground">{t("createNewImages")}</p>
                </div>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-20 text-left justify-start gap-3 bg-transparent">
              <Link href="/dashboard/subscription">
                <Zap className="h-6 w-6" />
                <div>
                  <p className="font-semibold">{t("upgradeSubscription")}</p>
                  <p className="text-xs text-muted-foreground">{t("getMoreCredits")}</p>
                </div>
              </Link>
            </Button>
          </div>
        </Card>

        {/* Recent Projects */}
        <Card className="border-2 shadow-lg bg-card/80 backdrop-blur">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t("recentProjects")}</h2>
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard/projects">{t("viewAll")}</Link>
            </Button>
          </div>
          <div className="divide-y">
            {recentProjects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-accent/50 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ImageIcon className="h-3 w-3" />
                        {project.paragraphCount} {t("paragraphs")}
                      </span>
                      <span>
                        {t("updated")} {project.updatedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/dashboard/projects/${project.id}`}>{t("open")}</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
