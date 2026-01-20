// Mock API client for development

import type {
  User,
  Project,
  Paragraph,
  GenerationTask,
  IllustrationAsset,
  CreditTransaction,
  IllustrationSettings,
} from "./types"

import { mockUser, mockProjects, mockParagraphs, mockTasks, mockAssets, mockTransactions } from "./mock-data"

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Auth API
export const authApi = {
  async signIn(email: string, password: string): Promise<User> {
    await delay(800)
    if (email.includes("admin")) {
      return { ...mockUser, role: "admin", email }
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
    if (!project) throw new Error("Project not found")
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
    if (!paragraph) throw new Error("Paragraph not found")
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
      promptPreview: "AI-generated prompt based on settings...",
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
      reason: `Purchase ${amount} credits`,
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
