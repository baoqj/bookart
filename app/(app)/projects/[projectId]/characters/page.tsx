"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Sparkles, Users, Wand2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CharacterList, CharacterDialog } from "@/components/character/character-list"
import { useI18n } from "@/lib/i18n"
import { charactersApi, imagesApi, projectsApi } from "@/lib/api"
import type { Character, CharacterRole, Project } from "@/lib/types"
import { toast } from "sonner"

export default function CharactersPage() {
  const { t } = useI18n()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [generatingCharacterId, setGeneratingCharacterId] = useState<string | null>(null)

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(null)

  // Load project and characters
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
      } catch (error) {
        console.error("Failed to load data:", error)
        toast.error("加载数据失败")
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [projectId])

  // Auto-generate characters from text
  const handleAutoGenerate = useCallback(async () => {
    if (!project?.rawText) {
      toast.error("请先在书稿页面导入文本内容")
      return
    }

    try {
      toast.info("正在分析文本生成角色...")
      const generated = await charactersApi.generateFromText(projectId, project.rawText)
      setCharacters(prev => [...prev, ...generated])
      toast.success(`成功生成 ${generated.length} 个角色`)
    } catch (error) {
      console.error("Failed to generate characters:", error)
      toast.error("角色生成失败")
    }
  }, [projectId, project?.rawText])

  // Add character
  const handleAddCharacter = () => {
    setEditingCharacter(null)
    setDialogOpen(true)
  }

  // Edit character
  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character)
    setDialogOpen(true)
  }

  // Save character (create or update)
  const handleSaveCharacter = async (data: {
    name: string
    role: CharacterRole
    description: string
    appearancePrompt: string
  }) => {
    try {
      if (editingCharacter) {
        // Update existing
        const updated = await charactersApi.update(editingCharacter.id, data)
        setCharacters(prev => prev.map(c => c.id === updated.id ? updated : c))
        toast.success("角色已更新")
      } else {
        // Create new
        const newCharacter = await charactersApi.create(projectId, data)
        setCharacters(prev => [...prev, newCharacter])
        toast.success("角色已创建")
      }
    } catch (error) {
      console.error("Failed to save character:", error)
      toast.error("保存失败")
    }
  }

  // Delete character
  const handleDeleteCharacter = async (id: string) => {
    if (!confirm("确定要删除这个角色吗？")) return

    try {
      await charactersApi.delete(id)
      setCharacters(prev => prev.filter(c => c.id !== id))
      toast.success("角色已删除")
    } catch (error) {
      console.error("Failed to delete character:", error)
      toast.error("删除失败")
    }
  }

  // Generate character image
  const handleGenerateImage = async (character: Character) => {
    if (!project) return

    try {
      setGeneratingCharacterId(character.id)
      toast.info("正在生成角色图片...")

      const prompt = character.appearancePrompt || `${character.description}, ${character.name} character illustration`

      const image = await imagesApi.generateForCharacter(
        character.id,
        projectId,
        prompt,
        project.stylePresetKey
      )

      // Update character with reference image
      await charactersApi.update(character.id, { referenceImageId: image.id })
      setCharacters(prev => prev.map(c =>
        c.id === character.id ? { ...c, referenceImageId: image.id } : c
      ))

      toast.success("角色图片生成成功")
    } catch (error) {
      console.error("Failed to generate image:", error)
      toast.error("图片生成失败")
    } finally {
      setGeneratingCharacterId(null)
    }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-slate-200" />
              <CardContent className="p-4 space-y-2">
                <div className="h-5 bg-slate-200 rounded w-1/2" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
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
            <Users className="h-8 w-8" />
            {project?.title || "角色管理"}
          </h1>
          <p className="text-muted-foreground mt-1">
            管理故事角色，保持角色形象一致性
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleAutoGenerate}
          disabled={!project?.rawText}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          AI 自动识别
        </Button>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="characters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="characters">
            角色列表 ({characters.length})
          </TabsTrigger>
          <TabsTrigger value="guide">
            使用指南
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters">
          <CharacterList
            projectId={projectId}
            characters={characters}
            loading={loading}
            onAddCharacter={handleAddCharacter}
            onEditCharacter={handleEditCharacter}
            onDeleteCharacter={handleDeleteCharacter}
            onGenerateImage={handleGenerateImage}
            generatingCharacterId={generatingCharacterId}
          />
        </TabsContent>

        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>角色管理使用指南</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Wand2 className="w-4 h-4" />
                    AI 自动识别
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    如果项目已有书稿内容，点击"AI 自动识别"按钮，系统将分析文本并自动提取角色信息。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    手动创建
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    点击"添加角色"按钮，手动输入角色名称、描述和外观 Prompt。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    生成角色图片
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    为每个角色生成标准形象图，用于后续场景插图中保持角色一致性。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-50">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    场景中使用
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    在场景管理页面，可以为每个场景选择参与的角色，生成的插图将自动包含角色特征。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Character Dialog */}
      <CharacterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        character={editingCharacter}
        onSave={handleSaveCharacter}
      />
    </div>
  )
}
