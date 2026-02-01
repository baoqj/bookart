"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  Plus,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Edit3,
  User,
  Wand2,
  Loader2
} from "lucide-react"
import type { Character, CharacterRole } from "@/lib/types"
import { charactersApi, imagesApi } from "@/lib/api"

interface CharacterCardProps {
  character: Character
  onEdit: (character: Character) => void
  onDelete: (id: string) => void
  onGenerateImage: (character: Character) => void
  generatingImage: boolean
}

export function CharacterCard({
  character,
  onEdit,
  onDelete,
  onGenerateImage,
  generatingImage
}: CharacterCardProps) {
  const roleColors: Record<CharacterRole, string> = {
    protagonist: "bg-blue-100 text-blue-700",
    supporting: "bg-green-100 text-green-700",
    antagonist: "bg-red-100 text-red-700",
    narrator: "bg-purple-100 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* 角色图片 */}
      <div className="aspect-square relative bg-gradient-to-br from-slate-100 to-slate-200">
        {character.referenceImageId ? (
          <div className="relative w-full h-full">
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-12 h-12" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-16 h-16 text-slate-300" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={roleColors[character.role]}>
            {character.role === "protagonist" && "主角"}
            {character.role === "supporting" && "配角"}
            {character.role === "antagonist" && "反派"}
            {character.role === "narrator" && "旁白"}
            {character.role === "other" && "其他"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{character.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {character.description}
        </p>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(character)}
          >
            <Edit3 className="w-4 h-4 mr-1" />
            编辑
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onGenerateImage(character)}
            disabled={generatingImage}
          >
            {generatingImage ? (
              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-1" />
            )}
            生图
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(character.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface CharacterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  character?: Character | null
  onSave: (data: {
    name: string
    role: CharacterRole
    description: string
    appearancePrompt: string
  }) => void
}

export function CharacterDialog({
  open,
  onOpenChange,
  character,
  onSave
}: CharacterDialogProps) {
  const [name, setName] = useState(character?.name || "")
  const [role, setRole] = useState<CharacterRole>(character?.role || "protagonist")
  const [description, setDescription] = useState(character?.description || "")
  const [appearancePrompt, setAppearancePrompt] = useState(character?.appearancePrompt || "")

  const isEditing = !!character

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      name: name.trim(),
      role,
      description: description.trim(),
      appearancePrompt: appearancePrompt.trim()
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "编辑角色" : "添加新角色"}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? "修改角色信息" : "创建一个新角色用于故事插图"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">角色名称 *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：小红、小明"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">角色类型</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as CharacterRole)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="protagonist">主角</option>
              <option value="supporting">配角</option>
              <option value="antagonist">反派</option>
              <option value="narrator">旁白</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">角色描述</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述角色的外观、年龄、发型、服装、气质、关键特征..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="appearancePrompt">外观 Prompt</Label>
            <Textarea
              id="appearancePrompt"
              value={appearancePrompt}
              onChange={(e) => setAppearancePrompt(e.target.value)}
              placeholder="用于图像生成的外观描述，例如：young girl with red hair, blue eyes, wearing a yellow dress..."
              rows={2}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            {isEditing ? "保存" : "添加"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CharacterListProps {
  projectId: string
  characters: Character[]
  loading: boolean
  onAddCharacter: () => void
  onEditCharacter: (character: Character) => void
  onDeleteCharacter: (id: string) => void
  onGenerateImage: (character: Character) => void
  generatingCharacterId: string | null
}

export function CharacterList({
  projectId,
  characters,
  loading,
  onAddCharacter,
  onEditCharacter,
  onDeleteCharacter,
  onGenerateImage,
  generatingCharacterId
}: CharacterListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="aspect-square bg-slate-200" />
            <CardContent className="p-4 space-y-2">
              <div className="h-5 bg-slate-200 rounded w-1/2" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (characters.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">暂无角色</h3>
        <p className="text-muted-foreground mb-4">
          开始创建角色，用于故事插图中保持角色一致性
        </p>
        <Button onClick={onAddCharacter}>
          <Plus className="w-4 h-4 mr-2" />
          添加第一个角色
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          已创建 {characters.length} 个角色
        </p>
        <Button onClick={onAddCharacter}>
          <Plus className="w-4 h-4 mr-2" />
          添加角色
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <CharacterCard
            key={character.id}
            character={character}
            onEdit={onEditCharacter}
            onDelete={onDeleteCharacter}
            onGenerateImage={onGenerateImage}
            generatingImage={generatingCharacterId === character.id}
          />
        ))}
      </div>
    </div>
  )
}
