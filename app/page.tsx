"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Palette, Zap } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function Home() {
  const { t } = useI18n()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            {t("heroTitle")}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto">
            {t("heroSubtitle")}
          </p>
          <Button asChild size="lg" className="text-xl px-12 py-8 bg-purple-600 hover:bg-purple-700">
            <Link href="/projects">{t("startUsing")}</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
          {t("coreFeatures")}
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-2 hover:border-blue-500 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>{t("featureAIPowerTitle")}</CardTitle>
              <CardDescription>
                {t("featureAIPowerDesc")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-purple-500 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>{t("featureStylesTitle")}</CardTitle>
              <CardDescription>
                {t("featureStylesDesc")}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-green-500 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>{t("featureFastTitle")}</CardTitle>
              <CardDescription>
                {t("featureFastDesc")}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-20 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>{t("footerText")}</p>
        </div>
      </footer>
    </div>
  )
}
