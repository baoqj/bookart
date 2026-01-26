"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Coins } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function CreditsPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t("creditsUsage")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {t("creditsHistory")}
        </p>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-6 mb-4">
            <Coins className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="mb-2">{t("chaptersComingSoon")}</CardTitle>
          <CardDescription className="text-center max-w-md mb-6">
            {t("settingsComingSoon")}
          </CardDescription>
          <Button disabled>{t("buyCredits")}</Button>
        </CardContent>
      </Card>
    </div>
  )
}
