"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function AccountPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("accountSettings")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("profile")}
        </p>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-6 mb-4">
            <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
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
