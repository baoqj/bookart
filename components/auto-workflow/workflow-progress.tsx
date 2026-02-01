"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles,
  Users,
  BookOpen,
  Scissors,
  Link2,
  Wand2,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
} from "lucide-react"
import { autoWorkflowApi } from "@/lib/api"
import type { AutoWorkflowStatus, CharacterDetail, Chapter, Scene, SceneCharacterMapping } from "@/lib/types"
import { cn } from "@/lib/utils"

interface WorkflowProgressProps {
  projectId: string
  text: string
  stylePreset?: string
  onComplete?: (data: {
    characters: CharacterDetail[]
    chapters: Chapter[]
    scenes: Scene[]
    mappings: SceneCharacterMapping[]
  }) => void
  onError?: (error: string) => void
}

const stepConfig = {
  extracting_characters: {
    icon: Users,
    label: "提取角色",
    description: "分析文本，识别并提取角色信息",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  splitting_chapters: {
    icon: BookOpen,
    label: "章节切分",
    description: "将书稿智能切分为章节",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  splitting_scenes: {
    icon: Scissors,
    label: "场景切分",
    description: "将每个章节切分为场景",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  linking_characters: {
    icon: Link2,
    label: "角色关联",
    description: "自动关联角色与场景",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  generating_prompts: {
    icon: Wand2,
    label: "生成提示词",
    description: "为每个场景生成图像提示词",
    color: "text-pink-500",
    bgColor: "bg-pink-50",
  },
  completed: {
    icon: CheckCircle2,
    label: "完成",
    description: "自动工作流已完成",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  failed: {
    icon: XCircle,
    label: "失败",
    description: "处理过程中出现错误",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  idle: {
    icon: Sparkles,
    label: "准备开始",
    description: "点击开始自动分析",
    color: "text-gray-500",
    bgColor: "bg-gray-50",
  },
}

export function WorkflowProgress({ projectId, text, stylePreset = "children-story", onComplete, onError }: WorkflowProgressProps) {
  const [status, setStatus] = useState<AutoWorkflowStatus | null>(null)
  const [characters, setCharacters] = useState<CharacterDetail[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])
  const [mappings, setMappings] = useState<SceneCharacterMapping[]>([])
  const [expanded, setExpanded] = useState(true)
  const [starting, setStarting] = useState(false)

  // Poll status updates
  useEffect(() => {
    if (!status || status.currentStep === "completed" || status.currentStep === "failed") {
      return
    }

    const pollInterval = setInterval(async () => {
      const newStatus = await autoWorkflowApi.getStatus(projectId)
      if (newStatus) {
        setStatus(newStatus)

        // Load data based on step
        if (newStatus.processedCharacters > 0) {
          const chars = await autoWorkflowApi.getCharacters(projectId)
          setCharacters(chars)
        }
        if (newStatus.processedChapters > 0) {
          const chaps = await autoWorkflowApi.getChapters(projectId)
          setChapters(chaps)
        }
        if (newStatus.processedScenes > 0) {
          const scns = await autoWorkflowApi.getScenes(projectId)
          setScenes(scns)
          const maps = await autoWorkflowApi.getSceneCharacterMappings(projectId)
          setMappings(maps)
        }

        // Check completion
        if (newStatus.currentStep === "completed" && onComplete) {
          const finalChars = await autoWorkflowApi.getCharacters(projectId)
          const finalChaps = await autoWorkflowApi.getChapters(projectId)
          const finalScns = await autoWorkflowApi.getScenes(projectId)
          const finalMaps = await autoWorkflowApi.getSceneCharacterMappings(projectId)
          onComplete({
            characters: finalChars,
            chapters: finalChaps,
            scenes: finalScns,
            mappings: finalMaps,
          })
        }

        if (newStatus.currentStep === "failed" && onError && newStatus.errorMessage) {
          onError(newStatus.errorMessage)
        }
      }
    }, 500)

    return () => clearInterval(pollInterval)
  }, [status, projectId, onComplete, onError])

  const handleStart = async () => {
    setStarting(true)
    try {
      const result = await autoWorkflowApi.start(projectId, "user-1", text, stylePreset as any)
      setStatus(result)
    } catch (error) {
      console.error("Failed to start workflow:", error)
      onError?.(error instanceof Error ? error.message : "启动失败")
    } finally {
      setStarting(false)
    }
  }

  const handleRetry = async () => {
    await autoWorkflowApi.reset(projectId)
    handleStart()
  }

  const currentStepInfo = status ? stepConfig[status.currentStep] : stepConfig.idle
  const CurrentIcon = currentStepInfo.icon
  const isRunning = status && !["completed", "failed", "idle"].includes(status.currentStep)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-xl", currentStepInfo.bgColor)}>
            <CurrentIcon className={cn("w-5 h-5", currentStepInfo.color)} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI 自动分析工作流</h3>
            <p className="text-sm text-gray-500">{currentStepInfo.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isRunning && (
            <div className="flex items-center gap-2 text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
              <span className="text-purple-600 font-medium">{status?.progress}%</span>
            </div>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress Bar */}
            <div className="px-6 pb-4">
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${status?.progress || 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Steps Timeline */}
            <div className="px-6 pb-6">
              <div className="relative">
                {/* Connection Line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-100" />

                {/* Step Items */}
                {Object.entries(stepConfig)
                  .filter(([key]) => !["idle", "completed", "failed"].includes(key))
                  .map(([key, config], index) => {
                    const stepKey = key as keyof typeof stepConfig
                    const Icon = config.icon
                    const isActive = status?.currentStep === stepKey
                    const isPast =
                      status?.progress !== undefined &&
                      ((status.currentStep === "completed" && index < 5) ||
                        (status.currentStep === "failed" && index < 5) ||
                        (isRunning && index < Object.keys(stepConfig).indexOf(status.currentStep)))

                    return (
                      <div key={key} className="relative pl-14 pb-6 last:pb-0">
                        <div
                          className={cn(
                            "absolute left-4 top-1 w-5 h-5 rounded-full flex items-center justify-center border-2 bg-white",
                            isActive
                              ? "border-purple-500 text-purple-500"
                              : isPast
                              ? "border-green-500 text-green-500"
                              : "border-gray-300 text-gray-300"
                          )}
                        >
                          {isActive ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : isPast ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-current" />
                          )}
                        </div>
                        <div className={cn("flex items-center gap-2", isActive || isPast ? "text-gray-900" : "text-gray-400")}>
                          <Icon className={cn("w-4 h-4", config.color)} />
                          <span className={cn("font-medium", isActive ? "text-gray-900" : "")}>{config.label}</span>
                        </div>
                        {isActive && status && (
                          <div className="mt-2 ml-6 text-sm text-gray-500">
                            {stepKey === "extracting_characters" && `已识别 ${status.processedCharacters}/${status.totalCharacters} 个角色`}
                            {stepKey === "splitting_chapters" && `已切分 ${status.processedChapters}/${status.totalChapters} 个章节`}
                            {stepKey === "splitting_scenes" && `已切分 ${status.processedScenes}/${status.totalScenes} 个场景`}
                            {stepKey === "linking_characters" && `已建立 ${status.characterLinksCreated} 个角色关联`}
                            {stepKey === "generating_prompts" && "正在生成图像提示词..."}
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Results Preview */}
            {status?.currentStep === "completed" && (
              <div className="px-6 pb-6">
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700">分析完成！</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>{characters.length} 个角色</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-purple-500" />
                      <span>{chapters.length} 个章节</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-orange-500" />
                      <span>{scenes.length} 个场景</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {status?.currentStep === "failed" && (
              <div className="px-6 pb-6">
                <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-red-700">处理失败</span>
                  </div>
                  <p className="text-sm text-red-600 mb-4">{status.errorMessage || "发生未知错误"}</p>
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    重新尝试
                  </button>
                </div>
              </div>
            )}

            {/* Start Button */}
            {status === null && (
              <div className="px-6 pb-6">
                <button
                  onClick={handleStart}
                  disabled={starting}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  {starting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      正在启动分析...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      一键开始 AI 自动分析
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Character Preview */}
            {characters.length > 0 && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  已识别的角色
                </h4>
                <div className="grid gap-3">
                  {characters.slice(0, 5).map((char) => (
                    <div key={char.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                        {char.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 truncate">{char.name}</span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full",
                            char.role === "protagonist" ? "bg-purple-100 text-purple-600" :
                            char.role === "antagonist" ? "bg-red-100 text-red-600" :
                            "bg-gray-100 text-gray-600"
                          )}>
                            {char.role === "protagonist" ? "主角" :
                             char.role === "antagonist" ? "反派" :
                             char.role === "supporting" ? "配角" :
                             char.role === "mentor" ? "导师" : "其他"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">{char.attributes.identity}</p>
                      </div>
                      <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                  {characters.length > 5 && (
                    <p className="text-sm text-gray-500 text-center">还有 {characters.length - 5} 个角色...</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
