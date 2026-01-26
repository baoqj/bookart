// Mock API client for development

import type {
  User,
  Project,
  Paragraph,
  GenerationTask,
  IllustrationAsset,
  CreditTransaction,
  IllustrationSettings,
  Chapter,
  ManuscriptMetadata,
  AnalysisStatus,
} from "./types"

import { mockUser, mockProjects, mockParagraphs, mockTasks, mockAssets, mockTransactions } from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Auth API
export const authApi = {
  async signIn(email: string, password: string): Promise<User> {
    await delay(800)
    if (email.includes("admin")) {
      return { ...mockUser, role: "admin", email, name: "管理员" }
    }
    return { ...mockUser, email }
  },

  async signUp(email: string, password: string, name: string): Promise<User> {
    await delay(1000)
    return { ...mockUser, email, name }
  },

  async signOut(): Promise<void> {
    await delay(300)
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(200)
    return mockUser
  },

  async forgotPassword(email: string): Promise<void> {
    await delay(800)
  },
}

// Projects API
export const projectsApi = {
  async list(): Promise<Project[]> {
    await delay(400)
    return mockProjects
  },

  async get(id: string): Promise<Project | null> {
    await delay(300)
    return mockProjects.find((p) => p.id === id) || null
  },

  async create(
    data: Omit<Project, "id" | "userId" | "createdAt" | "updatedAt" | "manuscriptStatus" | "paragraphCount">,
  ): Promise<Project> {
    await delay(500)
    return {
      ...data,
      id: `proj-${Date.now()}`,
      userId: mockUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      manuscriptStatus: "empty",
      paragraphCount: 0,
    }
  },

  async update(id: string, data: Partial<Project>): Promise<Project> {
    await delay(400)
    const project = mockProjects.find((p) => p.id === id)
    if (!project) throw new Error("项目未找到")
    return { ...project, ...data, updatedAt: new Date() }
  },

  async delete(id: string): Promise<void> {
    await delay(400)
  },
}

// Manuscript API
export const manuscriptApi = {
  async importText(projectId: string, text: string): Promise<Paragraph[]> {
    await delay(1200)
    // Simple paragraph parsing simulation
    const paragraphs = text.split("\n\n").filter((p) => p.trim().length > 0)
    return paragraphs.map((content, index) => ({
      id: `para-${projectId}-${index}`,
      projectId,
      index,
      content: content.trim(),
      selected: false,
      markedForIllustration: false,
    }))
  },

  async listParagraphs(projectId: string): Promise<Paragraph[]> {
    await delay(300)
    return mockParagraphs.filter((p) => p.projectId === projectId)
  },

  async updateParagraph(id: string, data: Partial<Paragraph>): Promise<Paragraph> {
    await delay(200)
    const paragraph = mockParagraphs.find((p) => p.id === id)
    if (!paragraph) throw new Error("段落未找到")
    return { ...paragraph, ...data }
  },
}

// Illustrations API
export const illustrationsApi = {
  async createTask(projectId: string, paragraphIds: string[], settings: IllustrationSettings): Promise<GenerationTask> {
    await delay(600)
    return {
      id: `task-${Date.now()}`,
      projectId,
      paragraphIds,
      promptPreview: "基于设置生成的 AI 提示词...",
      status: "queued",
      settings,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },

  async listTasks(projectId: string): Promise<GenerationTask[]> {
    await delay(300)
    return mockTasks.filter((t) => t.projectId === projectId)
  },

  async getTask(id: string): Promise<GenerationTask | null> {
    await delay(200)
    return mockTasks.find((t) => t.id === id) || null
  },

  async cancelTask(id: string): Promise<void> {
    await delay(400)
  },

  async listAssets(projectId: string): Promise<IllustrationAsset[]> {
    await delay(300)
    const projectTasks = mockTasks.filter((t) => t.projectId === projectId)
    const taskIds = projectTasks.map((t) => t.id)
    return mockAssets.filter((a) => taskIds.includes(a.taskId))
  },
}

// Credits API
export const creditsApi = {
  async getBalance(): Promise<number> {
    await delay(200)
    return mockUser.credits
  },

  async getTransactions(): Promise<CreditTransaction[]> {
    await delay(300)
    return mockTransactions
  },

  async purchase(amount: number): Promise<CreditTransaction> {
    await delay(1000)
    return {
      id: `txn-${Date.now()}`,
      userId: mockUser.id,
      type: "purchase",
      amount,
      reason: `购买 ${amount} 积分`,
      createdAt: new Date(),
    }
  },
}

// Admin API
export const adminApi = {
  async searchUsers(query: string): Promise<User[]> {
    await delay(500)
    return [mockUser]
  },

  async getUser(id: string): Promise<User | null> {
    await delay(300)
    return mockUser
  },

  async adjustCredits(userId: string, amount: number, reason: string): Promise<void> {
    await delay(400)
  },
}

// File API - Handle file uploads and text extraction
export const fileApi = {
  async upload(file: File): Promise<{ text: string; fileType: string; fileName: string }> {
    await delay(800)
    // This is a mock - actual file parsing is done client-side in lib/pdf.ts
    return {
      text: "File content would be extracted here",
      fileType: file.name.split(".").pop() || "txt",
      fileName: file.name,
    }
  },
}

// Analysis API - Groq LLM text analysis
export const analysisApi = {
  async analyze(
    projectId: string,
    text: string,
    language: string
  ): Promise<{ chapters: Chapter[]; metadata: ManuscriptMetadata }> {
    await delay(3000) // Simulate LLM processing time

    // Mock chapter analysis result
    // In production, this would call lib/groq.ts
    const mockChapters: Chapter[] = [
      {
        id: `chapter-${projectId}-1`,
        projectId,
        index: 0,
        title: "第一章：故事的开始",
        content: text.slice(0, 1000),
        summary: "介绍故事的主要背景和角色",
        paragraphIds: [],
        wordCount: Math.floor(text.slice(0, 1000).length / 2),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `chapter-${projectId}-2`,
        projectId,
        index: 1,
        title: "第二章：冲突发展",
        content: text.slice(1000, 2000),
        summary: "故事冲突逐渐升级",
        paragraphIds: [],
        wordCount: Math.floor(text.slice(1000, 2000).length / 2),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `chapter-${projectId}-3`,
        projectId,
        index: 2,
        title: "第三章：高潮与结局",
        content: text.slice(2000),
        summary: "故事达到高潮并圆满结束",
        paragraphIds: [],
        wordCount: Math.floor(text.slice(2000).length / 2),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    const metadata: ManuscriptMetadata = {
      id: `metadata-${projectId}`,
      projectId,
      originalText: text,
      totalCharacters: text.length,
      analysisStatus: "succeeded",
      language,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    return { chapters: mockChapters, metadata }
  },

  async getAnalysisStatus(projectId: string): Promise<AnalysisStatus> {
    await delay(300)
    return "succeeded"
  },
}

// Chapters API - Manage chapters
export const chaptersApi = {
  async list(projectId: string): Promise<Chapter[]> {
    await delay(400)
    return []
  },

  async create(projectId: string, data: { title: string; content: string }): Promise<Chapter> {
    await delay(500)
    return {
      id: `chapter-${Date.now()}`,
      projectId,
      index: 0,
      title: data.title,
      content: data.content,
      paragraphIds: [],
      wordCount: data.content.split(/\s+/).length,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },

  async update(id: string, data: Partial<Chapter>): Promise<Chapter> {
    await delay(400)
    return {
      id,
      projectId: "",
      index: 0,
      title: data.title || "",
      content: data.content || "",
      paragraphIds: [],
      wordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    }
  },

  async delete(id: string): Promise<void> {
    await delay(300)
  },

  async reorder(projectId: string, chapterIds: string[]): Promise<void> {
    await delay(400)
  },

  async merge(projectId: string, chapterIds: string[]): Promise<Chapter> {
    await delay(600)
    return {
      id: `chapter-${Date.now()}`,
      projectId,
      index: 0,
      title: "合并章节",
      content: "合并后的内容",
      paragraphIds: [],
      wordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
}
