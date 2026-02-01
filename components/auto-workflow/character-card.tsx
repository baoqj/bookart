"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Edit2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calendar,
  Briefcase,
  Heart,
  Eye,
  Shirt,
  MessageCircle,
  Activity,
  Zap,
  History,
  User,
} from "lucide-react"
import type { CharacterDetail } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CharacterCardProps {
  character: CharacterDetail
  onEdit?: (updates: Partial<CharacterDetail>) => void
  onRegeneratePrompt?: () => void
}

const attributeIcons: Record<string, any> = {
  gender: User,
  age: Calendar,
  identity: Briefcase,
  personality: Heart,
  appearance: Eye,
  clothing: Shirt,
  language: MessageCircle,
  habits: Activity,
  abilities: Zap,
  background: History,
}

const roleLabels: Record<string, string> = {
  protagonist: "主角",
  supporting: "配角",
  antagonist: "反派",
  narrator: "叙述者",
  mentor: "导师",
  other: "其他",
}

export function CharacterCard({ character, onEdit, onRegeneratePrompt }: CharacterCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)

  const RoleIcon = attributeIcons[character.role] || Users

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
          {character.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{character.name}</h3>
            <span className={cn(
              "text-xs px-2 py-1 rounded-full font-medium",
              character.role === "protagonist" ? "bg-purple-100 text-purple-600" :
              character.role === "antagonist" ? "bg-red-100 text-red-600" :
              character.role === "mentor" ? "bg-blue-100 text-blue-600" :
              "bg-gray-100 text-gray-600"
            )}>
              {roleLabels[character.role] || character.role}
            </span>
            {character.confidence > 0.9 && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full font-medium">
                高置信度
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{character.attributes.identity}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>
      </div>

      {/* Appearance Prompt */}
      <div className="px-4 pb-4">
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">外观描述</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{character.appearancePrompt}</p>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100"
          >
            {/* Attributes Grid */}
            <div className="p-4 grid grid-cols-2 gap-3">
              {Object.entries(character.attributes).map(([key, value]) => {
                if (!value) return null
                const Icon = attributeIcons[key]
                return (
                  <div key={key} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    {Icon && <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />}
                    <div className="min-w-0">
                      <span className="text-xs text-gray-500 uppercase tracking-wider block">
                        {key === "gender" ? "性别" :
                         key === "age" ? "年龄" :
                         key === "identity" ? "身份" :
                         key === "personality" ? "个性" :
                         key === "appearance" ? "外貌" :
                         key === "clothing" ? "服装" :
                         key === "language" ? "语言" :
                         key === "habits" ? "习惯" :
                         key === "abilities" ? "能力" :
                         key === "background" ? "背景" : key}
                      </span>
                      <p className="text-sm text-gray-900 truncate">{value}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Source Excerpts */}
            {character.sourceExcerpts.length > 0 && (
              <div className="px-4 pb-4">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2 ml-1">原文引用</div>
                <div className="space-y-2">
                  {character.sourceExcerpts.map((excerpt, idx) => (
                    <div key={idx} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-sm text-gray-700 italic">"{excerpt}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="px-4 pb-4 flex gap-3">
              {onEdit && (
                <button className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                  <Edit2 className="w-4 h-4" />
                  编辑角色
                </button>
              )}
              {onRegeneratePrompt && (
                <button className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                  <Sparkles className="w-4 h-4" />
                  重新生成
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
