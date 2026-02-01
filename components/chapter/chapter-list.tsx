"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  FileText,
  Loader2,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import type { Chapter } from "@/lib/types"

interface SortableChapterItemProps {
  chapter: Chapter
  isExpanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onDelete: () => void
  onSplitScenes: () => void
}

function SortableChapterItem({
  chapter,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onSplitScenes
}: SortableChapterItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const roleColors = {
    protagonist: "bg-blue-100 text-blue-700",
    supporting: "bg-green-100 text-green-700",
    antagonist: "bg-red-100 text-red-700",
    narrator: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
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
            <h4 className="font-medium truncate">{chapter.title}</h4>
            <p className="text-xs text-muted-foreground">
              {chapter.content.length} 字符 · {chapter.wordCount} 字
            </p>
          </div>

          <Badge variant="secondary" className="hidden sm:inline-flex">
            #{chapter.orderIndex + 1}
          </Badge>

          <div className="flex gap-1">
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
          <CardContent className="p-4">
            <div className="space-y-3">
              {chapter.summary && (
                <p className="text-sm text-muted-foreground">{chapter.summary}</p>
              )}

              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm line-clamp-3">{chapter.content}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={onSplitScenes}
                className="w-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                切分为场景
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

interface ChapterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chapter?: Chapter | null
  onSave: (data: { title: string; content: string; summary?: string }) => void
}

export function ChapterDialog({
  open,
  onOpenChange,
  chapter,
  onSave
}: ChapterDialogProps) {
  const [title, setTitle] = useState(chapter?.title || "")
  const [content, setContent] = useState(chapter?.content || "")
  const [summary, setSummary] = useState(chapter?.summary || "")

  const isEditing = !!chapter

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return
    onSave({
      title: title.trim(),
      content: content.trim(),
      summary: summary.trim() || undefined
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "编辑章节" : "创建新章节"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "修改章节信息" : "添加一个新的章节"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">章节标题 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：第一章 - 故事的开始"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="summary">章节摘要</Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="简要描述本章内容..."
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="content">章节内容 *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="输入章节的完整内容..."
              rows={8}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !content.trim()}
          >
            {isEditing ? "保存" : "创建"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface ChapterListProps {
  chapters: Chapter[]
  loading: boolean
  onAddChapter: () => void
  onEditChapter: (chapter: Chapter) => void
  onDeleteChapter: (id: string) => void
  onReorderChapters: (chapterIds: string[]) => void
  onSplitScenes: (chapter: Chapter) => void
}

export function ChapterList({
  chapters,
  loading,
  onAddChapter,
  onEditChapter,
  onDeleteChapter,
  onReorderChapters,
  onSplitScenes
}: ChapterListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)

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
      const oldIndex = chapters.findIndex(c => c.id === active.id)
      const newIndex = chapters.findIndex(c => c.id === over.id)
      const newChapters = arrayMove(chapters, oldIndex, newIndex)
      onReorderChapters(newChapters.map(c => c.id))
    }
  }

  const handleEdit = (chapter: Chapter) => {
    setEditingChapter(chapter)
    setDialogOpen(true)
  }

  const handleSave = (data: { title: string; content: string; summary?: string }) => {
    if (editingChapter) {
      onEditChapter({ ...editingChapter, ...data })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">章节列表</h3>
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

  if (chapters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">暂无章节</h3>
        <p className="text-muted-foreground mb-4">
          开始创建章节，组织您的故事内容
        </p>
        <Button onClick={onAddChapter}>
          <Plus className="w-4 h-4 mr-2" />
          添加第一个章节
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          章节列表 ({chapters.length})
        </h3>
        <Button onClick={onAddChapter}>
          <Plus className="w-4 h-4 mr-2" />
          添加章节
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={chapters.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <SortableChapterItem
                key={chapter.id}
                chapter={chapter}
                isExpanded={expandedIds.has(chapter.id)}
                onToggleExpand={() => toggleExpand(chapter.id)}
                onEdit={() => handleEdit(chapter)}
                onDelete={() => onDeleteChapter(chapter.id)}
                onSplitScenes={() => onSplitScenes(chapter)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <ChapterDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        chapter={editingChapter}
        onSave={handleSave}
      />
    </div>
  )
}
