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
