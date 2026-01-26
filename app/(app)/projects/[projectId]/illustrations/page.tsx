"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Image } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function IllustrationsPage({ params }: { params: { projectId: string } }) {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          {t("projects")}
        </Link>
        <span>/</span>
        <Link href={`/projects/${params.projectId}`} className="hover:text-foreground">
          {t("projectDetails")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{t("illustrationSettings")}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/projects/${params.projectId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("illustrationSettings")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("generateIllustrations")}
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-6 mb-4">
            <Image className="h-12 w-12 text-pink-600 dark:text-pink-400" />
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
