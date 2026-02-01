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
  Character,
  Scene,
  ImageAsset,
  BatchJob,
  BatchJobItem,
  SceneCharacter,
  ArtStylePreset,
  LlmSettings,
  LlmProvider,
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
        orderIndex: 0,
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
        orderIndex: 1,
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
        orderIndex: 2,
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
      orderIndex: 0,
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
      orderIndex: 0,
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
      orderIndex: 0,
      title: "合并章节",
      content: "合并后的内容",
      paragraphIds: [],
      wordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
}

// ==================== NEW API MODULES FOR v0.1.1 ====================

// In-memory mock storage (using closures to simulate private state)
const createCharactersStore = () => {
  let mockCharacters: Character[] = []
  return {
    list: (projectId: string): Character[] => mockCharacters.filter((c) => c.projectId === projectId),
    get: (id: string): Character | null => mockCharacters.find((c) => c.id === id) || null,
    add: (character: Character) => { mockCharacters.push(character) },
    update: (id: string, data: Partial<Character>): Character | null => {
      const index = mockCharacters.findIndex((c) => c.id === id)
      if (index !== -1) { mockCharacters[index] = { ...mockCharacters[index], ...data, updatedAt: new Date() }; return mockCharacters[index] }
      return null
    },
    remove: (id: string) => { mockCharacters = mockCharacters.filter((c) => c.id !== id) },
    setAll: (characters: Character[]) => { mockCharacters = characters }
  }
}

const charactersStore = createCharactersStore()

// Characters API - Manage characters
export const charactersApi = {
  async list(projectId: string): Promise<Character[]> {
    await delay(300)
    return charactersStore.list(projectId)
  },

  async get(id: string): Promise<Character | null> {
    await delay(200)
    return charactersStore.get(id)
  },

  async create(
    projectId: string,
    data: Omit<Character, "id" | "projectId" | "createdAt" | "updatedAt">
  ): Promise<Character> {
    await delay(400)
    const character: Character = {
      ...data,
      id: `char-${Date.now()}`,
      projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    charactersStore.add(character)
    return character
  },

  async update(id: string, data: Partial<Character>): Promise<Character> {
    await delay(300)
    const updated = charactersStore.update(id, data)
    if (!updated) throw new Error("角色未找到")
    return updated
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    charactersStore.remove(id)
  },

  // Auto-generate characters from text using LLM
  async generateFromText(projectId: string, text: string): Promise<Character[]> {
    await delay(2000) // Simulate LLM processing
    // Mock generated characters
    const mockGenerated: Character[] = [
      {
        id: `char-${Date.now()}-1`,
        projectId,
        name: "主角",
        role: "protagonist",
        description: "勇敢的年轻人，有着善良的心和坚定的意志",
        appearancePrompt: "young protagonist, brave expression, heroic stance, clean clothes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `char-${Date.now()}-2`,
        projectId,
        name: "配角",
        role: "supporting",
        description: "智慧的导师角色",
        appearancePrompt: "wise mentor figure, glasses, old robes, kind eyes",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    mockGenerated.forEach(c => charactersStore.add(c))
    return mockGenerated
  },
}

const createScenesStore = () => {
  let mockScenes: Scene[] = []
  let mockSceneCharacters: SceneCharacter[] = []
  return {
    listByChapter: (chapterId: string): Scene[] => mockScenes.filter((s) => s.chapterId === chapterId).sort((a, b) => a.orderIndex - b.orderIndex),
    get: (id: string): Scene | null => mockScenes.find((s) => s.id === id) || null,
    add: (scene: Scene) => { mockScenes.push(scene) },
    update: (id: string, data: Partial<Scene>): Scene | null => {
      const index = mockScenes.findIndex((s) => s.id === id)
      if (index !== -1) { mockScenes[index] = { ...mockScenes[index], ...data, updatedAt: new Date() }; return mockScenes[index] }
      return null
    },
    remove: (id: string) => { mockScenes = mockScenes.filter((s) => s.id !== id) },
    getSceneCharacters: (sceneId: string): string[] => mockSceneCharacters.filter((sc) => sc.sceneId === sceneId).map((sc) => sc.characterId),
    setSceneCharacters: (sceneId: string, characterIds: string[]) => {
      mockSceneCharacters = mockSceneCharacters.filter((sc) => sc.sceneId !== sceneId)
      characterIds.forEach((charId) => { mockSceneCharacters.push({ sceneId, characterId: charId }) })
    },
    setAll: (scenes: Scene[]) => { mockScenes = scenes }
  }
}

const scenesStore = createScenesStore()

// Scenes API - Manage scenes
export const scenesApi = {
  async listByChapter(chapterId: string): Promise<Scene[]> {
    await delay(300)
    return scenesStore.listByChapter(chapterId)
  },

  async get(id: string): Promise<Scene | null> {
    await delay(200)
    return scenesStore.get(id)
  },

  async create(
    chapterId: string,
    projectId: string,
    data: Omit<Scene, "id" | "projectId" | "chapterId" | "createdAt" | "updatedAt">
  ): Promise<Scene> {
    await delay(400)
    const scenesInChapter = scenesStore.listByChapter(chapterId)
    const scene: Scene = {
      ...data,
      id: `scene-${Date.now()}`,
      projectId,
      chapterId,
      orderIndex: scenesInChapter.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    scenesStore.add(scene)
    return scene
  },

  async update(id: string, data: Partial<Scene>): Promise<Scene> {
    await delay(300)
    const updated = scenesStore.update(id, data)
    if (!updated) throw new Error("场景未找到")
    return updated
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    scenesStore.remove(id)
  },

  async reorder(chapterId: string, sceneIds: string[]): Promise<void> {
    await delay(400)
    sceneIds.forEach((sceneId, newOrder) => {
      const updated = scenesStore.update(sceneId, { orderIndex: newOrder })
    })
  },

  // Scene character management
  async getSceneCharacters(sceneId: string): Promise<string[]> {
    await delay(200)
    return scenesStore.getSceneCharacters(sceneId)
  },

  async updateSceneCharacters(sceneId: string, characterIds: string[]): Promise<void> {
    await delay(300)
    scenesStore.setSceneCharacters(sceneId, characterIds)
  },

  // Prompt generation
  async generatePrompt(sceneId: string, stylePreset: ArtStylePreset, characterIds: string[]): Promise<string> {
    await delay(1500) // Simulate LLM processing
    const scene = scenesStore.get(sceneId)
    if (!scene) throw new Error("场景未找到")

    // Mock generated prompt
    const stylePrompt = getStylePrompt(stylePreset)
    const scenePrompt = scene.excerpt.slice(0, 200)
    return `${stylePrompt}, ${scenePrompt}, high quality, detailed`
  },

  // Split chapter into scenes
  async splitFromChapter(chapterId: string, projectId: string): Promise<Scene[]> {
    await delay(2000) // Simulate LLM processing
    // Mock generated scenes
    const mockScenes: Scene[] = [
      {
        id: `scene-${Date.now()}-1`,
        projectId,
        chapterId,
        orderIndex: 0,
        title: "场景 1",
        excerpt: "故事的开端，主人公站在山丘上，望着远方的村庄...",
        promptDraft: "主人公站在山丘上，远方是宁静的村庄，日落时分...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `scene-${Date.now()}-2`,
        projectId,
        chapterId,
        orderIndex: 1,
        title: "场景 2",
        excerpt: "突然，一只巨大的阴影笼罩了村庄...",
        promptDraft: "巨大的阴影笼罩村庄，紧张的氛围...",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]
    mockScenes.forEach(s => scenesStore.add(s))
    return mockScenes
  },
}

const createImagesStore = () => {
  let mockImages: ImageAsset[] = []
  return {
    list: (projectId: string, kind?: "scene" | "character"): ImageAsset[] => {
      let images = mockImages.filter((i) => i.projectId === projectId)
      if (kind) images = images.filter((i) => i.kind === kind)
      return images
    },
    get: (id: string): ImageAsset | null => mockImages.find((i) => i.id === id) || null,
    add: (image: ImageAsset) => { mockImages.push(image) },
    remove: (id: string) => { mockImages = mockImages.filter((i) => i.id !== id) },
    setAll: (images: ImageAsset[]) => { mockImages = images }
  }
}

const imagesStore = createImagesStore()

// Images API - Manage generated images
export const imagesApi = {
  async list(projectId: string, kind?: "scene" | "character"): Promise<ImageAsset[]> {
    await delay(300)
    return imagesStore.list(projectId, kind)
  },

  async get(id: string): Promise<ImageAsset | null> {
    await delay(200)
    return imagesStore.get(id)
  },

  async create(data: Omit<ImageAsset, "id" | "createdAt">): Promise<ImageAsset> {
    await delay(500)
    const image: ImageAsset = {
      ...data,
      id: `img-${Date.now()}`,
      createdAt: new Date(),
    }
    imagesStore.add(image)
    return image
  },

  async delete(id: string): Promise<void> {
    await delay(300)
    imagesStore.remove(id)
  },

  // Generate images for a scene
  async generateForScene(
    sceneId: string,
    projectId: string,
    chapterId: string,
    prompt: string,
    stylePreset: ArtStylePreset,
    count: number = 1
  ): Promise<ImageAsset[]> {
    await delay(3000) // Simulate image generation
    const images: ImageAsset[] = []
    for (let i = 0; i < count; i++) {
      const image = await this.create({
        projectId,
        kind: "scene",
        sceneId,
        chapterId,
        promptUsed: prompt,
        stylePresetKey: stylePreset,
        provider: "replicate",
        providerMeta: { seed: Date.now() + i },
        url: `https://picsum.photos/seed/${Date.now() + i}/1024/1024`,
        width: 1024,
        height: 1024,
      })
      images.push(image)
    }
    return images
  },

  // Generate character image
  async generateForCharacter(
    characterId: string,
    projectId: string,
    prompt: string,
    stylePreset: ArtStylePreset
  ): Promise<ImageAsset> {
    await delay(3000)
    return this.create({
      projectId,
      kind: "character",
      characterId,
      promptUsed: prompt,
      stylePresetKey: stylePreset,
      provider: "replicate",
      url: `https://picsum.photos/seed/${Date.now()}/1024/1024`,
      width: 1024,
      height: 1024,
    })
  },
}

const createBatchJobsStore = () => {
  let mockJobs: BatchJob[] = []
  return {
    list: (projectId: string): BatchJob[] => mockJobs.filter((j) => j.projectId === projectId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
    get: (id: string): BatchJob | null => mockJobs.find((j) => j.id === id) || null,
    add: (job: BatchJob) => { mockJobs.push(job) },
    update: (id: string, data: Partial<BatchJob>): BatchJob | null => {
      const index = mockJobs.findIndex((j) => j.id === id)
      if (index !== -1) { mockJobs[index] = { ...mockJobs[index], ...data, updatedAt: new Date() }; return mockJobs[index] }
      return null
    },
    setAll: (jobs: BatchJob[]) => { mockJobs = jobs }
  }
}

const batchJobsStore = createBatchJobsStore()

// Batch Jobs API - Batch processing
export const batchJobsApi = {
  async create(
    projectId: string,
    userId: string,
    type: BatchJob["type"],
    params?: Record<string, any>
  ): Promise<BatchJob> {
    await delay(500)
    const job: BatchJob = {
      id: `batch-${Date.now()}`,
      projectId,
      userId,
      type,
      status: "queued",
      progress: 0,
      params,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    batchJobsStore.add(job)
    return job
  },

  async get(id: string): Promise<BatchJob | null> {
    await delay(200)
    return batchJobsStore.get(id)
  },

  async getByProject(projectId: string): Promise<BatchJob[]> {
    await delay(300)
    return batchJobsStore.list(projectId)
  },

  async update(id: string, data: Partial<BatchJob>): Promise<BatchJob> {
    await delay(200)
    const updated = batchJobsStore.update(id, data)
    if (!updated) throw new Error("批处理任务未找到")
    return updated
  },

  async cancel(id: string): Promise<void> {
    await delay(300)
    batchJobsStore.update(id, { status: "canceled" })
  },

  // Full book batch processing
  async startFullBookProcess(
    projectId: string,
    userId: string,
    options: { imagesPerScene?: number }
  ): Promise<BatchJob> {
    return this.create(projectId, userId, "full_book", options)
  },
}

// ==================== LLM SETTINGS API ====================

// In-memory mock storage for LLM settings
const createLlmSettingsStore = () => {
  let mockSettings: LlmSettings[] = []
  return {
    getByUser: (userId: string): LlmSettings | null =>
      mockSettings.find((s) => s.userId === userId) || null,
    get: (id: string): LlmSettings | null =>
      mockSettings.find((s) => s.id === id) || null,
    set: (settings: LlmSettings) => {
      const index = mockSettings.findIndex((s) => s.userId === settings.userId)
      if (index !== -1) {
        mockSettings[index] = settings
      } else {
        mockSettings.push(settings)
      }
    },
    delete: (userId: string) => {
      mockSettings = mockSettings.filter((s) => s.userId !== userId)
    },
  }
}

const llmSettingsStore = createLlmSettingsStore()

// LLM Settings API
export const llmSettingsApi = {
  // Get user's LLM settings
  async get(userId: string): Promise<LlmSettings | null> {
    await delay(200)
    return llmSettingsStore.getByUser(userId)
  },

  // Create or update LLM settings
  async save(
    userId: string,
    data: Omit<LlmSettings, "id" | "userId" | "createdAt" | "updatedAt" | "isValid" | "errorMessage" | "lastTestAt">
  ): Promise<LlmSettings> {
    await delay(400)
    const settings: LlmSettings = {
      ...data,
      id: `llm-${Date.now()}`,
      userId,
      isValid: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    llmSettingsStore.set(settings)
    return settings
  },

  // Test LLM connection
  async test(
    userId: string,
    provider: LlmProvider,
    apiUrl?: string,
    apiKey?: string,
    model?: string
  ): Promise<{ success: boolean; message: string }> {
    await delay(2000) // Simulate API test

    // Mock validation
    if (!apiKey) {
      return { success: false, message: "API Key 不能为空" }
    }

    if (apiKey.length < 10) {
      return { success: false, message: "API Key 格式不正确" }
    }

    // Simulate different provider responses
    if (provider === "custom" && !apiUrl) {
      return { success: false, message: "自定义 API 地址不能为空" }
    }

    return { success: true, message: "连接测试成功！" }
  },

  // Delete LLM settings
  async delete(userId: string): Promise<void> {
    await delay(300)
    llmSettingsStore.delete(userId)
  },
}

// Helper function to get style prompt
function getStylePrompt(style: ArtStylePreset): string {
  const stylePrompts: Record<ArtStylePreset, string> = {
    comic: "comic book style, bold lines, vibrant colors, panel composition",
    ink: "Chinese ink painting style, wash technique, traditional brushwork, minimalist",
    "black-white": "black and white photography, high contrast, monochrome",
    "color-pencil": "colored pencil drawing, textured paper, soft edges",
    oil: "oil painting style, impasto technique, rich colors, brushstrokes visible",
    watercolor: "watercolor painting, soft edges, delicate washes, light colors",
    gouache: "gouache painting, opaque paint, bold colors, flat areas",
    "3d": "3D render, Pixar style, smooth surfaces, studio lighting",
    realistic: "photorealistic, high detail, natural lighting, 8k quality",
    "children-story": "children's book illustration, whimsical, colorful, friendly",
    history: "historical illustration, vintage style, classic feel",
    education: "educational illustration, clear, instructional, clean",
    architecture: "architectural illustration, clean lines, blueprint style, precise perspective",
    government: "official government illustration, formal, dignified, authoritative",
    culture: "cultural illustration, traditional elements, heritage style, symbolic",
  }
  return stylePrompts[style] || stylePrompts["children-story"]
}
