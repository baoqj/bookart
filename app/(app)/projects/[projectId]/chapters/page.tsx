"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChapterList } from "@/components/chapter/chapter-list"
import { useI18n } from "@/lib/i18n"
import { chaptersApi, analysisApi, projectsApi } from "@/lib/api"
import type { Chapter, Project } from "@/lib/types"
import { toast } from "sonner"

export default function ChaptersPage() {
  const { t } = useI18n()
  const params = useParams()
  const router = useRouter()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  // Load project and chapters
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [projectData, chaptersData] = await Promise.all([
          projectsApi.get(projectId),
          chaptersApi.list(projectId)
        ])
        setProject(projectData)
        setChapters(chaptersData)
      } catch (error) {
        console.error("Failed to load data:", error)
        toast.error("加载数据失败")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [projectId])

  // Auto-split into chapters using LLM
  const handleAutoSplit = useCallback(async () => {
    if (!project?.rawText) {
      toast.error("请先在书稿页面导入文本内容")
      return
    }

    try {
      setAnalyzing(true)
      toast.info("正在分析文本切分章节...")

      const result = await analysisApi.analyze(projectId, project.rawText, project.language)
      setChapters(result.chapters)

      toast.success(`成功切分为 ${result.chapters.length} 个章节`)
    } catch (error) {
      console.error("Failed to split chapters:", error)
      toast.error("章节切分失败")
    } finally {
      setAnalyzing(false)
    }
  }, [projectId, project?.rawText])

  // Add new chapter
  const handleAddChapter = async () => {
    try {
      const newChapter = await chaptersApi.create(projectId, {
        title: "新章节",
        content: ""
      })
      setChapters(prev => [...prev, newChapter])
      toast.success("章节已创建")
    } catch (error) {
      console.error("Failed to add chapter:", error)
      toast.error("创建失败")
    }
  }

  // Edit chapter
  const handleEditChapter = async (chapter: Chapter) => {
    try {
      const updated = await chaptersApi.update(chapter.id, {
        title: chapter.title,
        content: chapter.content,
        summary: chapter.summary
      })
      setChapters(prev => prev.map(c => c.id === updated.id ? updated : c))
      toast.success("章节已更新")
    } catch (error) {
      console.error("Failed to update chapter:", error)
      toast.error("更新失败")
    }
  }

  // Delete chapter
  const handleDeleteChapter = async (id: string) => {
    if (!confirm("确定要删除这个章节吗？")) return

    try {
      await chaptersApi.delete(id)
      setChapters(prev => prev.filter(c => c.id !== id))
      toast.success("章节已删除")
    } catch (error) {
      console.error("Failed to delete chapter:", error)
      toast.error("删除失败")
    }
  }

  // Reorder chapters
  const handleReorderChapters = async (chapterIds: string[]) => {
    try {
      await chaptersApi.reorder(projectId, chapterIds)
      // Update local state to reflect new order
      const reordered = chapterIds.map((id, index) => {
        const chapter = chapters.find(c => c.id === id)
        return chapter ? { ...chapter, orderIndex: index } : null
      }).filter(Boolean) as Chapter[]
      setChapters(reordered)
    } catch (error) {
      console.error("Failed to reorder chapters:", error)
      toast.error("排序失败")
    }
  }

  // Navigate to scenes page
  const handleSplitScenes = (chapter: Chapter) => {
    router.push(`/projects/${projectId}/scenes?chapterId=${chapter.id}`)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">加载中...</h1>
          </div>
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-slate-200 rounded" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            {project?.title || "章节管理"}
          </h1>
          <p className="text-muted-foreground mt-1">
            组织故事章节，支持拖拽排序和场景切分
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleAutoSplit}
          disabled={analyzing || !project?.rawText}
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              AI 自动切分
            </>
          )}
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="chapters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chapters">
            章节列表 ({chapters.length})
          </TabsTrigger>
          <TabsTrigger value="guide">
            使用指南
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chapters">
          <ChapterList
            chapters={chapters}
            loading={loading}
            onAddChapter={handleAddChapter}
            onEditChapter={handleEditChapter}
            onDeleteChapter={handleDeleteChapter}
            onReorderChapters={handleReorderChapters}
            onSplitScenes={handleSplitScenes}
          />
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>章节管理使用指南</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI 自动切分
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    如果项目已有书稿内容，点击"AI 自动切分"按钮，系统将分析文本并智能切分为章节。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    手动创建
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    点击"添加章节"按钮，手动输入章节标题和内容。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    拖拽排序
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    拖拽章节左侧的图标可以调整章节顺序。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    场景切分
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    点击章节展开后，点击"切分为场景"按钮，可进一步将章节切分为多个场景。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
