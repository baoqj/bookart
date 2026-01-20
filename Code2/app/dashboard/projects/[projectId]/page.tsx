"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { useI18n } from "@/lib/i18n"
import { Edit, Trash2, BookOpen, ImageIcon, Settings } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"
import type { Project } from "@/lib/types"

export default function ProjectDetailPage() {
  const { t } = useI18n()
  const params = useParams()
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    const found = mockProjects.find((p) => p.id === params.projectId)
    if (found) setProject(found)
  }, [params.projectId])

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title={project.title}
        description={project.description}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Edit className="h-4 w-4" />
              {t("edit")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive hover:bg-destructive/10 bg-transparent"
            >
              <Trash2 className="h-4 w-4" />
              {t("delete")}
            </Button>
          </div>
        }
      />

      <div className="flex-1 p-8">
        <Tabs defaultValue="info" className="space-y-6">
          <TabsList>
            <TabsTrigger value="info" className="gap-2">
              <BookOpen className="h-4 w-4" />
              {t("projectInfo")}
            </TabsTrigger>
            <TabsTrigger value="chapters" className="gap-2">
              <ImageIcon className="h-4 w-4" />
              {t("chaptersIllustrations")}
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              {t("settings")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="p-6 border-2 shadow-lg bg-card/80 backdrop-blur space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("projectName")}</label>
                <p className="text-lg font-semibold mt-1">{project.title}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">{t("description")}</label>
                <p className="mt-1">{project.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("language")}</label>
                  <p className="mt-1 uppercase">{project.language}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("paragraphs")}</label>
                  <p className="mt-1">{project.paragraphCount}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("created")}</label>
                  <p className="mt-1">{project.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("updated")}</label>
                  <p className="mt-1">{project.updatedAt.toLocaleDateString()}</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="chapters">
            <Card className="p-6 border-2 shadow-lg bg-card/80 backdrop-blur">
              <p className="text-muted-foreground text-center py-12">{t("chaptersComingSoon")}</p>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6 border-2 shadow-lg bg-card/80 backdrop-blur">
              <p className="text-muted-foreground text-center py-12">{t("settingsComingSoon")}</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
