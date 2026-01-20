"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { ArrowLeft, Download, ChevronDown, Sparkles, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useToast } from "@/hooks/use-toast"
import { projectsApi, illustrationsApi, manuscriptApi } from "@/lib/api"
import type { Project, Paragraph, GenerationTask, IllustrationAsset, IllustrationSettings } from "@/lib/types"
import { defaultIllustrationSettings } from "@/lib/mock-data"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const stylePresets = [
  { value: "children-story", label: "Children Story", description: "Playful and colorful" },
  { value: "history", label: "History", description: "Classic and authentic" },
  { value: "education", label: "Education", description: "Clear and informative" },
  { value: "architecture", label: "Architecture", description: "Technical and precise" },
  { value: "government", label: "Government", description: "Professional and formal" },
  { value: "culture", label: "Culture", description: "Artistic and expressive" },
]

export default function IllustrationsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params)
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
  const [tasks, setTasks] = useState<GenerationTask[]>([])
  const [assets, setAssets] = useState<IllustrationAsset[]>([])
  const [settings, setSettings] = useState<IllustrationSettings>(defaultIllustrationSettings)
  const [loading, setLoading] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [resolvedParams.projectId])

  const loadData = async () => {
    const [projectData, parasData, tasksData, assetsData] = await Promise.all([
      projectsApi.get(resolvedParams.projectId),
      manuscriptApi.listParagraphs(resolvedParams.projectId),
      illustrationsApi.listTasks(resolvedParams.projectId),
      illustrationsApi.listAssets(resolvedParams.projectId),
    ])
    setProject(projectData)
    setParagraphs(parasData)
    setTasks(tasksData)
    setAssets(assetsData)
  }

  const selectedParagraphs = paragraphs.filter((p) => p.markedForIllustration)

  const handleGenerate = async () => {
    if (selectedParagraphs.length === 0) {
      toast({
        variant: "destructive",
        title: "No paragraphs selected",
        description: "Please select paragraphs from the Manuscript page first",
      })
      return
    }

    setLoading(true)
    try {
      const task = await illustrationsApi.createTask(
        resolvedParams.projectId,
        selectedParagraphs.map((p) => p.id),
        settings,
      )
      setTasks([task, ...tasks])
      toast({
        title: "Generation started",
        description: `Creating illustrations for ${selectedParagraphs.length} paragraph(s)`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start generation",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4" />
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "succeeded":
        return <CheckCircle2 className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "queued":
        return "secondary"
      case "running":
        return "default"
      case "succeeded":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (!project) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/app/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <span>/</span>
        <Link href={`/app/projects/${project.id}`} className="hover:text-foreground transition-colors">
          {project.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">Illustrations</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Illustrations</h1>
          <p className="text-muted-foreground mt-1">Configure settings and generate AI illustrations</p>
        </div>
        <Link href={`/app/projects/${project.id}`}>
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
        {/* Left: Settings Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generation Settings</CardTitle>
              <CardDescription>Customize your illustration style</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Style Preset */}
              <div className="space-y-3">
                <Label>Style Preset</Label>
                <RadioGroup
                  value={settings.stylePreset}
                  onValueChange={(value: any) => setSettings({ ...settings, stylePreset: value })}
                >
                  <div className="grid grid-cols-2 gap-3">
                    {stylePresets.map((preset) => (
                      <Label
                        key={preset.value}
                        htmlFor={preset.value}
                        className={cn(
                          "flex flex-col items-start gap-1 rounded-lg border-2 p-3 cursor-pointer transition-colors",
                          settings.stylePreset === preset.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <RadioGroupItem value={preset.value} id={preset.value} className="sr-only" />
                        <span className="font-medium text-sm">{preset.label}</span>
                        <span className="text-xs text-muted-foreground">{preset.description}</span>
                      </Label>
                    ))}
                  </div>
                </RadioGroup>
              </div>

              {/* Color Mode */}
              <div className="space-y-2">
                <Label>Color Mode</Label>
                <Select
                  value={settings.colorMode}
                  onValueChange={(value: any) => setSettings({ ...settings, colorMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colorful">Colorful</SelectItem>
                    <SelectItem value="monochrome">Monochrome</SelectItem>
                    <SelectItem value="soft-pastel">Soft Pastel</SelectItem>
                    <SelectItem value="high-contrast">High Contrast</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Brush Style */}
              <div className="space-y-2">
                <Label>Brush Style</Label>
                <Select
                  value={settings.brushStyle}
                  onValueChange={(value: any) => setSettings({ ...settings, brushStyle: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="watercolor">Watercolor</SelectItem>
                    <SelectItem value="flat-illustration">Flat Illustration</SelectItem>
                    <SelectItem value="pencil-sketch">Pencil Sketch</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <Label>Aspect Ratio</Label>
                <Select
                  value={settings.aspectRatio}
                  onValueChange={(value: any) => setSettings({ ...settings, aspectRatio: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">1:1 (Square)</SelectItem>
                    <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                    <SelectItem value="16:9">16:9 (Wide)</SelectItem>
                    <SelectItem value="2:3">2:3 (Portrait)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Image Size */}
              <div className="space-y-2">
                <Label>Image Size</Label>
                <Select
                  value={settings.sizePreset.toString()}
                  onValueChange={(value) => setSettings({ ...settings, sizePreset: Number.parseInt(value) as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024">1024px (Small)</SelectItem>
                    <SelectItem value="1536">1536px (Medium)</SelectItem>
                    <SelectItem value="2048">2048px (Large)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Switches */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="no-text" className="cursor-pointer">
                    No text in image
                  </Label>
                  <Switch
                    id="no-text"
                    checked={settings.noTextInImage}
                    onCheckedChange={(checked) => setSettings({ ...settings, noTextInImage: checked })}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="consistent" className="cursor-pointer">
                    Consistent style
                  </Label>
                  <Switch
                    id="consistent"
                    checked={settings.consistentStyle}
                    onCheckedChange={(checked) => setSettings({ ...settings, consistentStyle: checked })}
                  />
                </div>
              </div>

              {/* Prompt Preview */}
              <Collapsible open={promptOpen} onOpenChange={setPromptOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Prompt Preview
                    <ChevronDown className={cn("h-4 w-4 transition-transform", promptOpen && "rotate-180")} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="rounded-lg bg-muted p-3 text-xs font-mono leading-relaxed">
                    {settings.stylePreset} style, {settings.colorMode} colors, {settings.brushStyle} technique,{" "}
                    {settings.aspectRatio} ratio, {settings.sizePreset}px
                    {settings.noTextInImage && ", no text"}
                    {settings.consistentStyle && ", consistent style"}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>

        {/* Right: Generation Area */}
        <div className="space-y-6">
          {/* Selected Paragraphs */}
          <Card>
            <CardHeader>
              <CardTitle>Selected Paragraphs</CardTitle>
              <CardDescription>
                {selectedParagraphs.length === 0
                  ? "No paragraphs selected"
                  : `${selectedParagraphs.length} paragraph(s) ready for illustration`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedParagraphs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    Select paragraphs from the Manuscript page to generate illustrations
                  </p>
                  <Link href={`/app/projects/${project.id}/manuscript`}>
                    <Button variant="outline" className="bg-transparent">
                      Go to Manuscript
                    </Button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedParagraphs.map((para) => (
                      <Badge key={para.id} variant="secondary">
                        Paragraph {para.index + 1}
                      </Badge>
                    ))}
                  </div>
                  <Button onClick={handleGenerate} disabled={loading} className="w-full gap-2">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Illustrations
                      </>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Tasks List */}
          {tasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generation Tasks</CardTitle>
                <CardDescription>{tasks.length} task(s) in history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-4 rounded-lg border transition-colors hover:border-primary/50"
                    >
                      <div className="mt-0.5">{getStatusIcon(task.status)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={getStatusColor(task.status) as any} className="capitalize">
                            {task.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(task.createdAt), "MMM d, HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.promptPreview}</p>
                        <p className="text-xs text-muted-foreground mt-1">{task.paragraphIds.length} paragraph(s)</p>
                      </div>
                      {task.status === "succeeded" && (
                        <Button variant="outline" size="sm" className="shrink-0 bg-transparent">
                          View
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Gallery */}
          {assets.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Illustrations</CardTitle>
                <CardDescription>{assets.length} image(s) generated</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="group relative overflow-hidden rounded-lg border">
                      <img
                        src={asset.url || "/placeholder.svg"}
                        alt={`Illustration ${asset.id}`}
                        className="w-full aspect-[4/3] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
