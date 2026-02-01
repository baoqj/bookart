// Core data models for Bookart AI

export type UserRole = "user" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  credits: number
  createdAt: Date
  language?: string
}

export interface Project {
  id: string
  userId: string
  title: string
  description: string
  language: string
  createdAt: Date
  updatedAt: Date
  manuscriptStatus: ManuscriptStatus
  paragraphCount: number
  chapterCount?: number
}

// Manuscript related types
export type ManuscriptStatus = "empty" | "imported" | "analyzing" | "chapters" | "parsed"

export type AnalysisStatus = "idle" | "analyzing" | "succeeded" | "failed"

export type FileType = "txt" | "md" | "pdf"

export interface ManuscriptMetadata {
  id: string
  projectId: string
  originalText: string
  fileType?: FileType
  fileName?: string
  totalCharacters: number
  analysisStatus: AnalysisStatus
  language: string
  createdAt: Date
  updatedAt: Date
}

export interface Chapter {
  id: string
  projectId: string
  index: number
  title: string
  content: string
  summary?: string
  paragraphIds: string[]
  wordCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Paragraph {
  id: string
  projectId: string
  chapterId?: string
  index: number
  content: string
  selected: boolean
  markedForIllustration: boolean
}

export type StylePreset = "children-story" | "history" | "education" | "architecture" | "government" | "culture"

export type ColorMode = "colorful" | "monochrome" | "soft-pastel" | "high-contrast"

export type BrushStyle = "watercolor" | "flat-illustration" | "pencil-sketch" | "realistic"

export type AspectRatio = "1:1" | "4:3" | "16:9" | "2:3"

export type ImageSize = 1024 | 1536 | 2048

export interface IllustrationSettings {
  stylePreset: StylePreset
  colorMode: ColorMode
  brushStyle: BrushStyle
  aspectRatio: AspectRatio
  sizePreset: ImageSize
  noTextInImage: boolean
  consistentStyle: boolean
}

export type TaskStatus = "queued" | "running" | "succeeded" | "failed"

export interface GenerationTask {
  id: string
  projectId: string
  paragraphIds: string[]
  promptPreview: string
  status: TaskStatus
  settings: IllustrationSettings
  createdAt: Date
  updatedAt: Date
  errorMessage?: string
}

export interface IllustrationAsset {
  id: string
  taskId: string
  paragraphId: string
  url: string
  width: number
  height: number
  createdAt: Date
}

export type CreditTransactionType = "earn" | "spend" | "refund" | "purchase"

export interface CreditTransaction {
  id: string
  userId: string
  type: CreditTransactionType
  amount: number
  reason: string
  referenceId?: string
  createdAt: Date
}

// ==================== NEW MODELS FOR v0.1.1 ====================

// Art Style Presets - Extended for v0.1.1
export type ArtStylePreset =
  | "comic"        // 漫画
  | "ink"          // 水墨画
  | "black-white"  // 黑白灰
  | "color-pencil" // 彩色铅笔
  | "oil"          // 油画
  | "watercolor"   // 水彩
  | "gouache"      // 水粉画
  | "3d"           // 3D
  | "realistic"    // 真实照片
  | "children-story" // 儿童故事（原有）
  | "history"      // 历史（原有）
  | "education"    // 教育（原有）
  | "architecture" // 建筑（原有 PRD）
  | "government"   // 政府（原有 PRD）
  | "culture"      // 文化（原有 PRD）

// Project - Extended with style preset and raw text
export interface Project {
  id: string
  userId: string
  title: string
  description: string
  language: string
  createdAt: Date
  updatedAt: Date
  manuscriptStatus: ManuscriptStatus
  paragraphCount: number
  chapterCount?: number
  // v0.1.1 new fields
  rawText?: string           // 原始书稿全文
  stylePresetKey: ArtStylePreset
  styleParams?: Record<string, any> // 风格参数（可选）
}

// Character - New model for character management
export type CharacterRole = "protagonist" | "supporting" | "antagonist" | "narrator" | "other"

export interface Character {
  id: string
  projectId: string
  name: string
  role: CharacterRole
  description: string        // 外观、年龄、发型、服装、气质、关键特征
  appearancePrompt: string   // 用于图像生成的 appearance prompt
  referenceImageId?: string  // 关联生成的角色图
  createdAt: Date
  updatedAt: Date
}

// Chapter - Extended with orderIndex for reordering
export interface Chapter {
  id: string
  projectId: string
  index: number              // 保留原有 index 作为兼容
  orderIndex: number         // v0.1.1 新增：用于拖拽排序
  title: string
  content: string
  summary?: string
  paragraphIds: string[]
  wordCount: number
  createdAt: Date
  updatedAt: Date
}

// Scene - New model for scene management
export interface Scene {
  id: string
  projectId: string
  chapterId: string
  orderIndex: number         // 用于章节内拖拽排序
  title?: string
  excerpt: string            // 该场景原文/切分片段
  promptDraft?: string       // 自动生成的 prompt 草稿
  promptFinal?: string       // 用户确认后的 prompt
  createdAt: Date
  updatedAt: Date
}

// Scene-Character Junction Table
export interface SceneCharacter {
  sceneId: string
  characterId: string
}

// Image Asset - Extended for scene/character generation
export type ImageKind = "scene" | "character"

export interface ImageAsset {
  id: string
  projectId: string
  kind: ImageKind
  // Entity references
  sceneId?: string           // 场景图必填
  characterId?: string       // 角色图可选
  chapterId?: string
  // Generation info
  promptUsed: string         // 实际使用的 prompt
  stylePresetKey: ArtStylePreset // 记录当时的风格
  provider: string           // e.g., "replicate", "openai"
  providerMeta?: Record<string, any> // seed, model, steps 等
  // Storage
  url: string
  storageKey?: string
  width: number
  height: number
  createdAt: Date
}

// Batch Job - For batch processing
export type BatchJobType =
  | "split_chapters"   // 切分章节
  | "split_scenes"     // 切分场景
  | "gen_prompts"      // 生成 prompts
  | "gen_images"       // 生成图片
  | "full_book"        // 全书批处理

export type BatchJobStatus = "queued" | "running" | "succeeded" | "failed" | "canceled"

export interface BatchJob {
  id: string
  projectId: string
  userId: string
  type: BatchJobType
  status: BatchJobStatus
  progress: number           // 0-100
  currentStep?: string       // 当前处理步骤描述
  errorMessage?: string
  params?: Record<string, any> // 批处理参数
  createdAt: Date
  updatedAt: Date
}

// Batch Job Item - Individual task items (optional but recommended)
export interface BatchJobItem {
  id: string
  batchJobId: string
  entityType: "chapter" | "scene"
  entityId: string
  status: BatchJobStatus
  attempts: number
  lastError?: string
  createdAt: Date
  updatedAt: Date
}
