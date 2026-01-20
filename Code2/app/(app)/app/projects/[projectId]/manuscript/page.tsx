"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, FileText, CheckSquare, Square, ArrowRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { projectsApi, manuscriptApi } from "@/lib/api"
import type { Project, Paragraph } from "@/lib/types"
import { cn } from "@/lib/utils"

export default function ManuscriptPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([])
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set())
  const [textInput, setTextInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [view, setView] = useState<"import" | "paragraphs">("import")

  useEffect(() => {
    loadProject()
    loadParagraphs()
  }, [resolvedParams.projectId])

  const loadProject = async () => {
    const data = await projectsApi.get(resolvedParams.projectId)
    setProject(data)
    if (data && data.manuscriptStatus !== "empty") {
      setView("paragraphs")
    }
  }

  const loadParagraphs = async () => {
    const data = await manuscriptApi.listParagraphs(resolvedParams.projectId)
    setParagraphs(data)
    const marked = new Set(data.filter((p) => p.markedForIllustration).map((p) => p.id))
    setMarkedIds(marked)
  }

  const handleParseText = async () => {
    if (!textInput.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter some text to parse",
      })
      return
    }

    setLoading(true)
    try {
      const parsed = await manuscriptApi.importText(resolvedParams.projectId, textInput)
      setParagraphs(parsed)
      setView("paragraphs")
      toast({
        title: "Success",
        description: `Parsed ${parsed.length} paragraphs`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to parse manuscript",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedIds(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === paragraphs.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paragraphs.map((p) => p.id)))
    }
  }

  const handleMarkForIllustration = () => {
    const newMarked = new Set([...markedIds, ...selectedIds])
    setMarkedIds(newMarked)
    setSelectedIds(new Set())
    toast({
      title: "Success",
      description: `Marked ${selectedIds.size} paragraphs for illustration`,
    })
  }

  const removeFromMarked = (id: string) => {
    const newMarked = new Set(markedIds)
    newMarked.delete(id)
    setMarkedIds(newMarked)
  }

  const selectedParagraphs = paragraphs.filter((p) => selectedIds.has(p.id))
  const markedParagraphs = paragraphs.filter((p) => markedIds.has(p.id))

  if (!project) {
    return (
      <div className="container max-w-6xl py-8">
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
        <span className="text-foreground">Manuscript</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manuscript</h1>
          <p className="text-muted-foreground mt-1">Import and select paragraphs for illustration</p>
        </div>
        <Link href={`/app/projects/${project.id}`}>
          <Button variant="outline" className="gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Project
          </Button>
        </Link>
      </div>

      {view === "import" ? (
        <Card>
          <CardHeader>
            <CardTitle>Import Manuscript</CardTitle>
            <CardDescription>Paste your text or upload a file to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="paste">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="paste">Paste Text</TabsTrigger>
                <TabsTrigger value="upload">Upload File</TabsTrigger>
              </TabsList>
              <TabsContent value="paste" className="space-y-4">
                <Textarea
                  placeholder="Paste your manuscript here... Separate paragraphs with blank lines."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={12}
                  className="font-mono text-sm leading-relaxed"
                />
                <Button onClick={handleParseText} disabled={loading} className="w-full md:w-auto">
                  {loading ? "Parsing..." : "Parse Text"}
                </Button>
              </TabsContent>
              <TabsContent value="upload" className="space-y-4">
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">Upload .txt file (coming soon)</p>
                    <Button variant="outline" disabled className="bg-transparent">
                      Select File
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Left: Paragraph List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Paragraphs ({paragraphs.length})</CardTitle>
                  <CardDescription>Select paragraphs to preview or mark for illustration</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={toggleSelectAll} className="gap-2 bg-transparent">
                  {selectedIds.size === paragraphs.length ? (
                    <CheckSquare className="h-4 w-4" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                  {selectedIds.size === paragraphs.length ? "Deselect All" : "Select All"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {paragraphs.map((para, idx) => (
                    <div
                      key={para.id}
                      className={cn(
                        "flex gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                        selectedIds.has(para.id) ? "border-primary bg-primary/5" : "hover:border-primary/50",
                        markedIds.has(para.id) && "bg-muted",
                      )}
                      onClick={() => toggleSelect(para.id)}
                    >
                      <Checkbox checked={selectedIds.has(para.id)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            #{idx + 1}
                          </Badge>
                          {markedIds.has(para.id) && (
                            <Badge variant="secondary" className="text-xs">
                              Marked
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm leading-relaxed line-clamp-3">{para.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Right: Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selection Preview</CardTitle>
                <CardDescription>
                  {selectedParagraphs.length === 0 ? "No paragraphs selected" : `${selectedParagraphs.length} selected`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {selectedParagraphs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Select paragraphs to preview</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedParagraphs.map((para, idx) => (
                        <div key={para.id}>
                          <Badge variant="outline" className="mb-2">
                            Paragraph {para.index + 1}
                          </Badge>
                          <p className="text-sm leading-relaxed">{para.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
                {selectedParagraphs.length > 0 && (
                  <Button onClick={handleMarkForIllustration} className="w-full mt-4">
                    Mark for Illustration
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Marked Tray */}
            {markedParagraphs.length > 0 && (
              <Card className="border-primary/50">
                <CardHeader>
                  <CardTitle className="text-base">Marked for Illustration</CardTitle>
                  <CardDescription>{markedParagraphs.length} paragraphs ready</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[200px] mb-4">
                    <div className="space-y-2">
                      {markedParagraphs.map((para) => (
                        <div
                          key={para.id}
                          className="flex items-center justify-between gap-2 p-2 rounded bg-muted text-sm"
                        >
                          <span className="truncate">Paragraph {para.index + 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0"
                            onClick={() => removeFromMarked(para.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <Link href={`/app/projects/${project.id}/illustrations`}>
                    <Button className="w-full gap-2">
                      Continue to Illustrations
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
