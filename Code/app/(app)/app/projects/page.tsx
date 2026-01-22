"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, FolderOpen } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function ProjectsPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("myProjects")}
          </h1>
          <p className="text-muted-foreground mt-2">
            {t("manageYourProjects")}
          </p>
        </div>
        <Button asChild>
          <Link href="/app/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("createProject")}
          </Link>
        </Button>
      </div>

      {/* Empty State / Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-primary/10 p-6 mb-4">
            <FolderOpen className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="mb-2">{t("noProjectsYet")}</CardTitle>
          <CardDescription className="text-center max-w-md mb-6">
            {t("noProjectsDesc")}
          </CardDescription>
          <Button asChild>
            <Link href="/app/projects/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("createProject")}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
