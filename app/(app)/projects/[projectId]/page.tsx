"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen, ImageIcon, Users, Settings } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  const { t } = useI18n()

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          {t("projects")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{t("projectDetails")}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("projectDetails")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("projectInfo")}: {params.projectId}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href={`/projects/${params.projectId}/manuscript`}>
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t("manuscriptManagement")}
              </CardTitle>
              <CardDescription>
                {t("uploadOrPaste")}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/projects/${params.projectId}/characters`}>
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                角色管理
              </CardTitle>
              <CardDescription>
                创建和管理故事角色
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/projects/${params.projectId}/illustrations`}>
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                {t("illustrationSettings")}
              </CardTitle>
              <CardDescription>
                {t("generateIllustrations")}
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-6 mb-4">
            <Settings className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="mb-2">{t("chaptersComingSoon")}</CardTitle>
          <CardDescription className="text-center max-w-md">
            {t("settingsComingSoon")}
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
