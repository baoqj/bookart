"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { ArrowLeft, Sparkles, Image as ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SceneList } from "@/components/scene/scene-list"
import { useI18n } from "@/lib/i18n"
import { scenesApi, charactersApi, projectsApi, imagesApi } from "@/lib/api"
import type { Scene, Chapter, Character, Project } from "@/lib/types"
import { toast } from "sonner"

export default function ScenesPage() {
  const { t } = useI18n()
  const params = useParams()
  const searchParams = useSearchParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [chapter, setChapter] = useState<Chapter | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [generatingSceneId, setGeneratingSceneId] = useState<string | null>(null)

  const chapterId = searchParams.get("chapterId") || chapter?.id

  // Load project, chapter, scenes and characters
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [projectData, charactersData] = await Promise.all([
          projectsApi.get(projectId),
          charactersApi.list(projectId)
        ])
        setProject(projectData)
        setCharacters(charactersData)

        // If chapterId is provided, load that chapter
        if (chapterId) {
          // For now, create a mock chapter from the scenes
          setChapter({
            id: chapterId,
            projectId,
            index: 0,
            orderIndex: 0,
            title: "当前章节",
            content: "",
            paragraphIds: [],
            wordCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          })

          // Load scenes for this chapter
          const scenesData = await scenesApi.listByChapter(chapterId)
          setScenes(scenesData)

          // Load selected characters for each scene
          const characterMap: Record<string, string[]> = {}
          for (const scene of scenesData) {
            const sceneChars = await scenesApi.getSceneCharacters(scene.id)
            characterMap[scene.id] = sceneChars
          }
          setSelectedCharacterIds(characterMap)
        }
      } catch (error) {
        console.error("Failed to load data:", error)
        toast.error("加载数据失败")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [projectId, chapterId])

  // Auto-split into scenes using LLM
  const handleAutoSplit = useCallback(async () => {
    if (!chapter) return

    try {
      setLoading(true)
      toast.info("正在分析文本切分场景...")

      const newScenes = await scenesApi.splitFromChapter(chapter.id, projectId)
      setScenes(newScenes)

      toast.success(`成功切分为 ${newScenes.length} 个场景`)
    } catch (error) {
      console.error("Failed to split scenes:", error)
      toast.error("场景切分失败")
    } finally {
      setLoading(false)
    }
  }, [projectId, chapter])

  // Add new scene
  const handleAddScene = async () => {
    if (!chapter) return

    try {
      const newScene = await scenesApi.create(chapter.id, projectId, {
        title: "新场景",
        excerpt: "",
        orderIndex: scenes.length
      })
      setScenes(prev => [...prev, newScene])
      toast.success("场景已创建")
    } catch (error) {
      console.error("Failed to add scene:", error)
      toast.error("创建失败")
    }
  }

  // Edit scene
  const handleEditScene = async (scene: Scene) => {
    try {
      const updated = await scenesApi.update(scene.id, {
        title: scene.title,
        excerpt: scene.excerpt,
        promptFinal: scene.promptFinal
      })
      setScenes(prev => prev.map(s => s.id === updated.id ? updated : s))
      toast.success("场景已更新")
    } catch (error) {
      console.error("Failed to update scene:", error)
      toast.error("更新失败")
    }
  }

  // Delete scene
  const handleDeleteScene = async (id: string) => {
    if (!confirm("确定要删除这个场景吗？")) return

    try {
      await scenesApi.delete(id)
      setScenes(prev => prev.filter(s => s.id !== id))
      toast.success("场景已删除")
    } catch (error) {
      console.error("Failed to delete scene:", error)
      toast.error("删除失败")
    }
  }

  // Reorder scenes
  const handleReorderScenes = async (sceneIds: string[]) => {
    if (!chapter) return

    try {
      await scenesApi.reorder(chapter.id, sceneIds)
      const reordered = sceneIds.map((id, index) => {
        const scene = scenes.find(s => s.id === id)
        return scene ? { ...scene, orderIndex: index } : null
      }).filter(Boolean) as Scene[]
      setScenes(reordered)
    } catch (error) {
      console.error("Failed to reorder scenes:", error)
      toast.error("排序失败")
    }
  }

  // Toggle character for scene
  const handleToggleCharacter = async (sceneId: string, characterId: string) => {
    try {
      const current = selectedCharacterIds[sceneId] || []
      const updated = current.includes(characterId)
        ? current.filter(id => id !== characterId)
        : [...current, characterId]

      await scenesApi.updateSceneCharacters(sceneId, updated)
      setSelectedCharacterIds(prev => ({
        ...prev,
        [sceneId]: updated
      }))
    } catch (error) {
      console.error("Failed to update scene characters:", error)
      toast.error("更新角色选择失败")
    }
  }

  // Generate image for scene
  const handleGenerateImage = async (scene: Scene) => {
    if (!project) return

    try {
      setGeneratingSceneId(scene.id)
      toast.info("正在生成场景图片...")

      const prompt = scene.promptFinal || scene.promptDraft || scene.excerpt
      const images = await imagesApi.generateForScene(
        scene.id,
        projectId,
        chapter?.id || "",
        prompt,
        project.stylePresetKey,
        1
      )

      // Update scene with promptFinal
      await scenesApi.update(scene.id, { promptFinal: prompt })

      toast.success("场景图片生成成功")
    } catch (error) {
      console.error("Failed to generate image:", error)
      toast.error("图片生成失败")
    } finally {
      setGeneratingSceneId(null)
    }
  }

  // Generate prompt for scene
  const handleGeneratePrompt = async (sceneId: string) => {
    if (!project) return

    try {
      const sceneChars = selectedCharacterIds[sceneId] || []
      const prompt = await scenesApi.generatePrompt(sceneId, project.stylePresetKey, sceneChars)

      await scenesApi.update(sceneId, { promptDraft: prompt })
      setScenes(prev => prev.map(s => s.id === sceneId ? { ...s, promptDraft: prompt } : s))
      toast.success("Prompt 已生成")
    } catch (error) {
      console.error("Failed to generate prompt:", error)
      toast.error("Prompt 生成失败")
    }
  }

  if (loading && !scenes.length) {
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
            <ImageIcon className="h-8 w-8" />
            {chapter?.title || "场景管理"}
          </h1>
          <p className="text-muted-foreground mt-1">
            管理场景，支持拖拽排序和角色选择
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleAutoSplit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              处理中...
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
      <Tabs defaultValue="scenes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scenes">
            场景列表 ({scenes.length})
          </TabsTrigger>
          <TabsTrigger value="guide">
            使用指南
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scenes">
          <SceneList
            scenes={scenes}
            characters={characters}
            loading={loading}
            generatingSceneId={generatingSceneId}
            onAddScene={handleAddScene}
            onEditScene={handleEditScene}
            onDeleteScene={handleDeleteScene}
            onReorderScenes={handleReorderScenes}
            onGenerateImage={handleGenerateImage}
            onToggleCharacter={handleToggleCharacter}
            onGeneratePrompt={handleGeneratePrompt}
            selectedCharacterIds={selectedCharacterIds}
          />
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>场景管理使用指南</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI 自动切分
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    点击"AI 自动切分"按钮，系统将分析章节内容并智能切分为多个场景。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    手动创建
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    点击"添加场景"按钮，手动输入场景标题和内容。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    选择角色
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    展开场景卡片，可以选择参与该场景的角色，生成的图片将包含角色特征。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    生成图片
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    点击场景卡片上的图片图标，可以为该场景生成插图。
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
