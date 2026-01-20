"use client"

import type React from "react"
import { useRouter } from "next/router"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LanguageSelector } from "@/components/language-selector"
import { useI18n } from "@/lib/i18n"
import {
  Sparkles,
  BookOpen,
  Palette,
  Wand2,
  Check,
  Upload,
  Download,
  RotateCw,
  Trash2,
  Edit,
  Grid3x3,
  List,
  User,
} from "lucide-react"

type Paragraph = {
  id: string
  text: string
  selected: boolean
}

type IllustrationStyle = "realistic" | "cartoon" | "watercolor" | "sketch"
type ColorMode = "color" | "monochrome"

type GeneratedImage = {
  id: string
  paragraphId: string
  url: string
  selected: boolean
}

export default function HomePage() {
  const { t } = useI18n()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [step, setStep] = useState<"upload" | "select" | "settings" | "generate" | "results">("upload")
  const [text, setText] = useState("")
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
  const [style, setStyle] = useState<IllustrationStyle>("realistic")
  const [colorMode, setColorMode] = useState<ColorMode>("color")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [highlightedParagraph, setHighlightedParagraph] = useState<string | null>(null)

  const handleTextParse = async () => {
    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Smart paragraph detection: split by double newlines, chapter markers, or long pauses
    const parsed = text
      .split(/\n\n+|\n(?=第.{1,3}章)|\n(?=Chapter\s+\d+)/i)
      .filter((p) => p.trim().length > 20) // Filter out very short fragments
      .map((p, idx) => ({
        id: `para-${idx}`,
        text: p.trim().replace(/\s+/g, " "), // Normalize whitespace
        selected: false,
      }))

    setParagraphs(parsed)
    setStep("select")
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type === "text/plain") {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        setText(content)
      }
      reader.readAsText(file)
    }
  }

  const toggleParagraph = (id: string) => {
    setParagraphs((prev) => prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p)))
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    setStep("generate")

    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Generate mock images for selected paragraphs
    const images: GeneratedImage[] = paragraphs
      .filter((p) => p.selected)
      .map((p) => ({
        id: `img-${p.id}`,
        paragraphId: p.id,
        url: `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(p.text.substring(0, 50))}`,
        selected: false,
      }))

    setGeneratedImages(images)
    setIsGenerating(false)
    setStep("results")
  }

  const toggleImageSelection = (id: string) => {
    setGeneratedImages((prev) => prev.map((img) => (img.id === id ? { ...img, selected: !img.selected } : img)))
  }

  const handleRegenerateSelected = async () => {
    const selectedIds = generatedImages.filter((img) => img.selected).map((img) => img.id)
    if (selectedIds.length === 0) return

    // Simulate regeneration
    await new Promise((resolve) => setTimeout(resolve, 2000))
    // In real app, would regenerate selected images
  }

  const handleDownloadSelected = () => {
    const selected = generatedImages.filter((img) => img.selected)
    if (selected.length === 0) return
    // In real app, would zip and download selected images
    console.log("[v0] Downloading selected images:", selected)
  }

  const handleDownloadAll = () => {
    // In real app, would zip and download all images
    console.log("[v0] Downloading all images:", generatedImages)
  }

  const selectedCount = paragraphs.filter((p) => p.selected).length
  const selectedImagesCount = generatedImages.filter((img) => img.selected).length

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-accent/10 to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              {t("appName")}
            </span>
          </div>
          <nav className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{t("freeTrialNoLogin")}</span>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
              onClick={() => router.push("/auth/sign-in")}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t("signIn")}</span>
            </Button>
            <LanguageSelector />
          </nav>
        </div>
      </header>

      {/* Hero & Workflow */}
      <main className="flex-1">
        <section className="container py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            {/* Hero Text */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                {t("heroTitle")}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">{t("heroSubtitle")}</p>
            </div>

            {/* Workflow Steps */}
            <Card className="p-6 md:p-8 border-2 shadow-xl bg-card/80 backdrop-blur">
              {/* Step 1: Upload */}
              {step === "upload" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{t("step1Title")}</h2>
                      <p className="text-sm text-muted-foreground">{t("step1Subtitle")}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="manuscript">{t("manuscriptLabel")}</Label>

                    <div className="flex items-center gap-3 mb-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {t("uploadFile")}
                      </Button>
                      <span className="text-sm text-muted-foreground">{t("or")}</span>
                      <span className="text-sm text-muted-foreground">{t("pasteText")}</span>
                    </div>

                    <Textarea
                      id="manuscript"
                      placeholder={t("manuscriptPlaceholder")}
                      className="min-h-[300px] resize-none text-base leading-relaxed"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {text.length > 0 ? `${text.length} ${t("charactersCount")}` : t("waitingForInput")}
                      </span>
                      <Button onClick={handleTextParse} disabled={text.trim().length === 0} size="lg" className="gap-2">
                        <Check className="h-4 w-4" />
                        {t("parseParagraphs")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Select Paragraphs */}
              {step === "select" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{t("step2Title")}</h2>
                        <p className="text-sm text-muted-foreground">{t("step2Subtitle")}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setStep("upload")}>
                      {t("backToEdit")}
                    </Button>
                  </div>

                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium">
                        {t("selectedCount")} {selectedCount} {t("paragraphs")}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setParagraphs((prev) => prev.map((p) => ({ ...p, selected: true })))}
                      >
                        {t("selectAll")}
                      </Button>
                    </div>
                    <ScrollArea className="h-[320px]">
                      <div className="space-y-3 pr-4">
                        {paragraphs.map((para) => (
                          <div
                            key={para.id}
                            className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                              para.selected
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border bg-background hover:bg-accent/50"
                            }`}
                            onClick={() => toggleParagraph(para.id)}
                          >
                            <Checkbox checked={para.selected} className="mt-1" />
                            <p className="text-sm leading-relaxed flex-1">{para.text}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => setStep("settings")}
                      disabled={selectedCount === 0}
                      size="lg"
                      className="gap-2"
                    >
                      {t("nextStep")}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Settings */}
              {step === "settings" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Palette className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{t("step3Title")}</h2>
                        <p className="text-sm text-muted-foreground">{t("step3Subtitle")}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setStep("select")}>
                      {t("backToSelect")}
                    </Button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>{t("illustrationStyle")}</Label>
                      <RadioGroup value={style} onValueChange={(v) => setStyle(v as IllustrationStyle)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { value: "realistic", label: t("realistic"), desc: t("realisticDesc") },
                            { value: "cartoon", label: t("cartoon"), desc: t("cartoonDesc") },
                            { value: "watercolor", label: t("watercolor"), desc: t("watercolorDesc") },
                            { value: "sketch", label: t("sketch"), desc: t("sketchDesc") },
                          ].map((option) => (
                            <div
                              key={option.value}
                              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                                style === option.value
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border bg-background hover:bg-accent/50"
                              }`}
                              onClick={() => setStyle(option.value as IllustrationStyle)}
                            >
                              <RadioGroupItem value={option.value} id={option.value} className="mt-0.5" />
                              <div className="flex-1">
                                <Label htmlFor={option.value} className="cursor-pointer font-medium">
                                  {option.label}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-3">
                      <Label>{t("colorMode")}</Label>
                      <RadioGroup value={colorMode} onValueChange={(v) => setColorMode(v as ColorMode)}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { value: "color", label: t("color"), desc: t("colorDesc") },
                            { value: "monochrome", label: t("monochrome"), desc: t("monochromeDesc") },
                          ].map((option) => (
                            <div
                              key={option.value}
                              className={`flex items-start gap-3 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                                colorMode === option.value
                                  ? "border-primary bg-primary/5 shadow-md"
                                  : "border-border bg-background hover:bg-accent/50"
                              }`}
                              onClick={() => setColorMode(option.value as ColorMode)}
                            >
                              <RadioGroupItem value={option.value} id={`color-${option.value}`} className="mt-0.5" />
                              <div className="flex-1">
                                <Label htmlFor={`color-${option.value}`} className="cursor-pointer font-medium">
                                  {option.label}
                                </Label>
                                <p className="text-xs text-muted-foreground mt-1">{option.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleGenerate} size="lg" className="gap-2">
                      <Wand2 className="h-4 w-4" />
                      {t("startGenerate")} ({selectedCount} {t("illustrations")})
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Generate */}
              {step === "generate" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Wand2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{t("step4Title")}</h2>
                      <p className="text-sm text-muted-foreground">{t("step4Subtitle")}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
                    <p className="text-lg font-medium">{t("generating")}</p>
                    <p className="text-sm text-muted-foreground">
                      {t("generatingDesc", { count: selectedCount, time: selectedCount * 10 })}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 5: Results */}
              {step === "results" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold">{t("resultsTitle")}</h2>
                        <p className="text-sm text-muted-foreground">
                          {generatedImages.length} {t("illustrations")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                        className="gap-2"
                      >
                        {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
                        <span className="hidden sm:inline">{viewMode === "grid" ? t("listView") : t("gridView")}</span>
                      </Button>
                    </div>
                  </div>

                  {selectedImagesCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <span className="text-sm font-medium mr-2">
                        {selectedImagesCount} {t("selectedCount")}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRegenerateSelected}
                        className="gap-2 bg-transparent"
                      >
                        <RotateCw className="h-4 w-4" />
                        {t("regenerateSelected")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDownloadSelected}
                        className="gap-2 bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                        {t("downloadSelected")}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setGeneratedImages((prev) => prev.filter((img) => !img.selected))}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t("delete")}
                      </Button>
                    </div>
                  )}

                  <ScrollArea className="h-[500px]">
                    <div
                      className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4 pr-4" : "space-y-4 pr-4"}
                    >
                      {generatedImages.map((img) => {
                        const paragraph = paragraphs.find((p) => p.id === img.paragraphId)
                        const isHighlighted = highlightedParagraph === img.paragraphId

                        return (
                          <div
                            key={img.id}
                            className={`group relative rounded-lg border-2 p-3 transition-all ${
                              img.selected
                                ? "border-primary bg-primary/5"
                                : isHighlighted
                                  ? "border-primary/50 bg-primary/10"
                                  : "border-border bg-background hover:border-primary/30"
                            }`}
                          >
                            {/* Image */}
                            <div
                              className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer"
                              onClick={() => toggleImageSelection(img.id)}
                              onMouseEnter={() => setHighlightedParagraph(img.paragraphId)}
                              onMouseLeave={() => setHighlightedParagraph(null)}
                            >
                              <img
                                src={img.url || "/placeholder.svg"}
                                alt="Generated illustration"
                                className="w-full h-full object-cover"
                              />
                              {/* Selection overlay */}
                              <div
                                className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                                  img.selected ? "bg-primary/20" : "bg-black/0 group-hover:bg-black/10"
                                }`}
                              >
                                {img.selected && (
                                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                                    <Check className="h-5 w-5 text-primary-foreground" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {paragraph && (
                              <div className="mt-3 space-y-2">
                                <p
                                  className={`text-sm leading-relaxed line-clamp-3 transition-colors ${
                                    isHighlighted ? "text-primary font-medium" : "text-muted-foreground"
                                  }`}
                                >
                                  {paragraph.text}
                                </p>

                                <div className="flex items-center gap-2 pt-2">
                                  <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                                    <RotateCw className="h-3 w-3" />
                                    {t("regenerate")}
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                                    <Edit className="h-3 w-3" />
                                    {t("editStyle")}
                                  </Button>
                                  <Button size="sm" variant="ghost" className="h-8 gap-1.5 text-xs">
                                    <Download className="h-3 w-3" />
                                    {t("download")}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>

                  {/* Bottom actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
                    <Button
                      onClick={() => {
                        setText("")
                        setParagraphs([])
                        setGeneratedImages([])
                        setStep("upload")
                      }}
                      variant="outline"
                    >
                      {t("createAgain")}
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button onClick={handleDownloadAll} variant="outline" className="gap-2 bg-transparent">
                        <Download className="h-4 w-4" />
                        {t("downloadAll")}
                      </Button>
                      <Button className="gap-2">{t("registerAndSave")}</Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border/50 bg-gradient-to-br from-accent/20 to-primary/10 py-16">
          <div className="container">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-center text-3xl font-bold mb-12">{t("whyChoose")}</h2>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{t("easyToUse")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("easyToUseDesc")}</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                    <Palette className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{t("multipleStyles")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("multipleStylesDesc")}</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg">
                    <Sparkles className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-semibold text-lg">{t("aiPowered")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t("aiPoweredDesc")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 bg-card/50">
        <div className="container text-center text-sm text-muted-foreground">
          <p>{t("footerText")}</p>
        </div>
      </footer>
    </div>
  )
}
