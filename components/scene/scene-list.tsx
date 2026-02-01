"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  GripVertical,
  Edit3,
  Trash2,
  Plus,
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Users,
  ChevronDown,
  ChevronRight,
  Loader2
} from "lucide-react"
import type { Scene, Character } from "@/lib/types"

interface SortableSceneItemProps {
  scene: Scene
  characters: Character[]
  selectedCharacterIds: string[]
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDelete: () => void
  onGenerateImage: () => void
  onToggleCharacter: (characterId: string) => void
  generatingImage: boolean
}

function SortableSceneItem({
  scene,
  characters,
  selectedCharacterIds,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onGenerateImage,
  onToggleCharacter,
  generatingImage
}: SortableSceneItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: scene.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`transition-all ${isDragging ? "opacity-50 z-50" : ""}`}
    >
      <Card className={`overflow-hidden ${isDragging ? "shadow-lg ring-2 ring-primary" : ""}`}>
        <div className="flex items-center gap-2 p-3 bg-slate-50 border-b">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-slate-200 rounded"
          >
            <GripVertical className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={onToggleExpand}
            className="p-1 hover:bg-slate-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{scene.title || `场景 ${scene.orderIndex + 1}`}</h4>
            <p className="text-xs text-muted-foreground">
              {scene.excerpt.length} 字符
            </p>
          </div>

          <Badge variant="secondary" className="hidden sm:inline-flex">
            #{scene.orderIndex + 1}
          </Badge>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGenerateImage}
              disabled={generatingImage}
              className="h-8"
            >
              {generatingImage ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              className="h-8 w-8 p-0"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {isExpanded && (
          <CardContent className="p-4 space-y-4">
            {/* Scene excerpt */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm">{scene.excerpt}</p>
            </div>

            {/* Character selection */}
            {characters.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  参与角色
                </Label>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char) => (
                    <label
                      key={char.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                        selectedCharacterIds.includes(char.id)
                          ? "bg-primary/10 border-primary"
                          : "bg-background hover:bg-slate-50"
                      }`}
                    >
                      <Checkbox
                        checked={selectedCharacterIds.includes(char.id)}
                        onCheckedChange={() => onToggleCharacter(char.id)}
                      />
                      <span className="text-sm">{char.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Prompt */}
            {(scene.promptDraft || scene.promptFinal) && (
              <div className="space-y-2">
                <Label className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  生成 Prompt
                </Label>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <p className="text-sm text-amber-900">
                    {scene.promptFinal || scene.promptDraft}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}

interface SceneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  scene?: Scene | null
  characters: Character[]
  onSave: (data: {
    title: string
    excerpt: string
    promptDraft?: string
    promptFinal?: string
  }) => void
}

export function SceneDialog({
  open,
  onOpenChange,
  scene,
  characters,
  onSave
}: SceneDialogProps) {
  const [title, setTitle] = useState(scene?.title || "")
  const [excerpt, setExcerpt] = useState(scene?.excerpt || "")
  const [promptFinal, setPromptFinal] = useState(scene?.promptFinal || scene?.promptDraft || "")

  const isEditing = !!scene

  const handleSave = () => {
    if (!title.trim() || !excerpt.trim()) return
    onSave({
      title: title.trim(),
      excerpt: excerpt.trim(),
      promptFinal: promptFinal.trim() || undefined
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "编辑场景" : "创建新场景"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "修改场景信息" : "添加一个新的场景"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">场景标题 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：场景 1 - 故事的开端"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="excerpt">场景内容 *</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="输入场景的原文内容..."
              rows={6}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="prompt">生成 Prompt</Label>
            <Textarea
              id="prompt"
              value={promptFinal}
              onChange={(e) => setPromptFinal(e.target.value)}
              placeholder="用于图像生成的 prompt，可以手动编辑..."
              rows={3}
            />
          </div>

          {characters.length > 0 && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">
                提示：在场景页面可以选择参与的角色
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !excerpt.trim()}
          >
            {isEditing ? "保存" : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SceneListProps {
  scenes: Scene[]
  characters: Character[]
  loading: boolean
  generatingSceneId: string | null
  onAddScene: () => void
  onEditScene: (scene: Scene) => void
  onDeleteScene: (id: string) => void
  onReorderScenes: (sceneIds: string[]) => void
  onGenerateImage: (scene: Scene) => void
  onToggleCharacter: (sceneId: string, characterId: string) => void
  onGeneratePrompt: (sceneId: string) => void
  selectedCharacterIds: Record<string, string[]>
}

export function SceneList({
  scenes,
  characters,
  loading,
  generatingSceneId,
  onAddScene,
  onEditScene,
  onDeleteScene,
  onReorderScenes,
  onGenerateImage,
  onToggleCharacter,
  onGeneratePrompt,
  selectedCharacterIds
}: SceneListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingScene, setEditingScene] = useState<Scene | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = scenes.findIndex(s => s.id === active.id)
      const newIndex = scenes.findIndex(s => s.id === over.id)
      const newScenes = arrayMove(scenes, oldIndex, newIndex)
      onReorderScenes(newScenes.map(s => s.id))
    }
  }

  const handleEdit = (scene: Scene) => {
    setEditingScene(scene)
    setDialogOpen(true)
  }

  const handleSave = (data: {
    title: string
    excerpt: string
    promptDraft?: string
    promptFinal?: string
  }) => {
    if (editingScene) {
      onEditScene({ ...editingScene, ...data })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">场景列表</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <div className="p-4 flex items-center gap-3">
                <div className="w-5 h-5 bg-slate-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (scenes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <ImageIcon className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">暂无场景</h3>
        <p className="text-muted-foreground mb-4">
          开始创建场景，组织您的故事内容
        </p>
        <Button onClick={onAddScene}>
          <Plus className="w-4 h-4 mr-2" />
          添加第一个场景
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          场景列表 ({scenes.length})
        </h3>
        <Button onClick={onAddScene}>
          <Plus className="w-4 h-4 mr-2" />
          添加场景
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={scenes.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {scenes.map((scene) => (
              <SortableSceneItem
                key={scene.id}
                scene={scene}
                characters={characters}
                selectedCharacterIds={selectedCharacterIds[scene.id] || []}
                isExpanded={expandedIds.has(scene.id)}
                onToggleExpand={() => toggleExpand(scene.id)}
                onEdit={() => handleEdit(scene)}
                onDelete={() => onDeleteScene(scene.id)}
                onGenerateImage={() => onGenerateImage(scene)}
                onToggleCharacter={(charId) => onToggleCharacter(scene.id, charId)}
                generatingImage={generatingSceneId === scene.id}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <SceneDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        scene={editingScene}
        characters={characters}
        onSave={handleSave}
      />
    </div>
  )
}
