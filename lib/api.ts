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
        userId: "user-1",
        name: "主角",
        role: "protagonist",
        description: "勇敢的年轻人，有着善良的心和坚定的意志",
        appearancePrompt: "young protagonist, brave expression, heroic stance, clean clothes",
        isMain: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `char-${Date.now()}-2`,
        projectId,
        userId: "user-1",
        name: "配角",
        role: "supporting",
        description: "智慧的导师角色",
        appearancePrompt: "wise mentor figure, glasses, old robes, kind eyes",
        isMain: false,
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

// ==================== AUTO-WORKFLOW API ====================

import type {
  CharacterExtractionResult,
  ChapterSplitResult,
  SceneSplitResult,
  SceneCharacterMapping,
  AutoWorkflowStatus,
  CharacterDetail,
  CharacterAttributes,
} from "./types"

// Auto-workflow state store (in-memory for demo)
const autoWorkflowStore = new Map<string, AutoWorkflowStatus>()
const characterStore = new Map<string, CharacterDetail[]>()
const chapterStore = new Map<string, Chapter[]>()
const sceneStore = new Map<string, Scene[]>()
const sceneCharacterStore = new Map<string, SceneCharacterMapping[]>()

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Mock LLM character extraction
async function mockExtractCharacters(text: string, style: ArtStylePreset): Promise<CharacterExtractionResult[]> {
  await delay(3000) // Simulate LLM processing

  // Mock extracted characters based on text analysis
  const mockCharacters: CharacterExtractionResult[] = [
    {
      name: "小明",
      role: "protagonist",
      confidence: 0.95,
      attributes: {
        gender: "男",
        age: "10岁",
        identity: "小学生",
        personality: "勇敢、好奇、善良",
        appearance: "圆脸，大眼睛，黑短发，瘦瘦高高",
        clothing: "蓝色校服，红领巾",
        language: "活泼天真，喜欢问问题",
        habits: "喜欢探索新事物，经常走神",
        abilities: "想象力丰富",
        background: "住在山脚下的村庄，是家中最小的孩子",
      },
      appearancePrompt: "A 10-year-old Chinese boy with round face, big eyes, short black hair, slim and tall stature, wearing blue school uniform with red scarf, innocent and curious expression, children's book illustration style",
      stylePrompt: getStylePrompt(style),
      sourceExcerpts: ["小明走在山间小路上，好奇地四处张望。", "小明决定踏上冒险之旅。"],
    },
    {
      name: "老爷爷",
      role: "mentor",
      confidence: 0.88,
      attributes: {
        gender: "男",
        age: "70岁",
        identity: "隐居的山中老人",
        personality: "智慧、慈祥、神秘",
        appearance: "白发苍苍，长眉毛，戴斗笠，穿灰色长袍",
        clothing: "灰色布衣，草鞋",
        language: "缓慢低沉，善用比喻",
        habits: "喜欢下棋，喝茶",
        abilities: "了解山中所有的秘密",
        background: "曾是村中的老师傅，年轻时游历四方",
      },
      appearancePrompt: "An elderly Chinese man with white hair, long eyebrows, wearing a straw hat and gray robe, kind wise expression, mountain hermit appearance, children's book illustration style",
      stylePrompt: getStylePrompt(style),
      sourceExcerpts: ["老爷爷住在山上的小屋里。", "老爷爷告诉小明山的那边有一片魔法森林。"],
    },
    {
      name: "小精灵",
      role: "supporting",
      confidence: 0.82,
      attributes: {
        gender: "无",
        age: "不详",
        identity: "森林守护者",
        personality: "调皮、友好、害羞",
        appearance: "透明发光的身体，戴着花环，背上有小翅膀",
        clothing: "用树叶做的小裙子",
        language: "声音像银铃，喜欢用歌声代替说话",
        habits: "在花丛中跳舞",
        abilities: "能让植物发光",
        background: "诞生于第一缕晨光，是森林的守护灵",
      },
      appearancePrompt: "A tiny forest spirit with translucent glowing body, wearing a flower crown, small wings on back, sparkling with magical light, children's book illustration style",
      stylePrompt: getStylePrompt(style),
      sourceExcerpts: ["小精灵从花丛中飞了出来。", "小精灵带小明找到了回家的路。"],
    },
  ]

  return mockCharacters
}

// Mock LLM chapter splitting
async function mockSplitChapters(text: string): Promise<ChapterSplitResult[]> {
  await delay(2000)

  // Simple mock: split by double newlines for demo
  const chapters: ChapterSplitResult[] = [
    {
      title: "第一章：神秘的邀请",
      content: text.substring(0, 500),
      summary: "小明收到了一封神秘的信，邀请他踏上冒险之旅。",
      wordCount: 120,
    },
    {
      title: "第二章：遇见老爷爷",
      content: text.substring(500, 1000),
      summary: "在山脚下，小明遇到了一位神秘的老爷爷。",
      wordCount: 150,
    },
    {
      title: "第三章：森林中的小精灵",
      content: text.substring(1000, 1500),
      summary: "小明在魔法森林里遇到了善良的小精灵。",
      wordCount: 130,
    },
    {
      title: "第四章：勇敢的抉择",
      content: text.substring(1500, 2000),
      summary: "面对困难的选择，小明展现出了勇气。",
      wordCount: 140,
    },
    {
      title: "第五章：回到家乡",
      content: text.substring(2000, 2500),
      summary: "冒险结束，小明带着成长回到了家乡。",
      wordCount: 160,
    },
  ]

  return chapters
}

// Mock LLM scene splitting
async function mockSplitScenes(chapterContent: string, chapterIndex: number): Promise<SceneSplitResult[]> {
  await delay(1500)

  // Mock scenes based on chapter
  const scenesPerChapter = 3
  const scenes: SceneSplitResult[] = []

  for (let i = 0; i < scenesPerChapter; i++) {
    const sceneIndex = chapterIndex * 3 + i
    const charactersInScene = []

    if (sceneIndex === 0 || sceneIndex === 3 || sceneIndex === 6 || sceneIndex === 9 || sceneIndex === 12) {
      charactersInScene.push("小明")
    }
    if (sceneIndex === 3 || sceneIndex === 4) {
      charactersInScene.push("老爷爷")
    }
    if (sceneIndex === 6 || sceneIndex === 7 || sceneIndex === 8) {
      charactersInScene.push("小精灵")
    }

    scenes.push({
      title: `场景 ${i + 1}`,
      excerpt: chapterContent.substring(i * 150, (i + 1) * 150),
      characters: charactersInScene,
      promptDraft: `A children's book illustration showing ${charactersInScene.join(" and ") || "a mystical scene"} in a magical forest setting, ${getStylePrompt("children-story")}`,
    })
  }

  return scenes
}

export const autoWorkflowApi = {
  // Start auto-workflow for a project
  async start(
    projectId: string,
    userId: string,
    text: string,
    stylePreset: ArtStylePreset = "children-story"
  ): Promise<AutoWorkflowStatus> {
    await delay(500)

    const status: AutoWorkflowStatus = {
      id: generateId(),
      projectId,
      currentStep: "extracting_characters",
      progress: 0,
      stepProgress: 0,
      totalCharacters: 0,
      processedCharacters: 0,
      totalChapters: 0,
      processedChapters: 0,
      totalScenes: 0,
      processedScenes: 0,
      characterLinksCreated: 0,
      startedAt: new Date(),
      updatedAt: new Date(),
    }

    autoWorkflowStore.set(projectId, status)

    // Simulate async workflow execution
    this.executeWorkflow(projectId, userId, text, stylePreset)

    return status
  },

  // Execute the full workflow (simulated)
  async executeWorkflow(
    projectId: string,
    userId: string,
    text: string,
    stylePreset: ArtStylePreset
  ): Promise<void> {
    const status = autoWorkflowStore.get(projectId)
    if (!status) return

    try {
      // Step 1: Extract characters
      status.currentStep = "extracting_characters"
      status.stepProgress = 0
      status.updatedAt = new Date()

      const characters = await mockExtractCharacters(text, stylePreset)
      status.totalCharacters = characters.length
      status.processedCharacters = characters.length
      status.stepProgress = 100
      status.progress = 15
      status.updatedAt = new Date()

      // Store character details
      const characterDetails: CharacterDetail[] = characters.map((c) => ({
        id: generateId(),
        projectId,
        userId,
        name: c.name,
        role: c.role,
        description: `${c.attributes.identity || ""} - ${c.attributes.personality || ""}`,
        avatar: "",
        isMain: c.role === "protagonist",
        attributes: c.attributes,
        appearancePrompt: c.appearancePrompt,
        stylePrompt: c.stylePrompt,
        sceneIds: [],
        confidence: c.confidence,
        sourceExcerpts: c.sourceExcerpts,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      characterStore.set(projectId, characterDetails)

      await delay(1000)

      // Step 2: Split chapters
      status.currentStep = "splitting_chapters"
      status.stepProgress = 0
      status.updatedAt = new Date()

      const chapterResults = await mockSplitChapters(text)
      status.totalChapters = chapterResults.length
      status.processedChapters = 0
      status.stepProgress = 50
      status.progress = 35
      status.updatedAt = new Date()

      // Store chapters
      const chapters: Chapter[] = chapterResults.map((r, idx) => ({
        id: generateId(),
        projectId,
        index: idx,
        orderIndex: idx,
        title: r.title,
        content: r.content,
        summary: r.summary,
        paragraphIds: [],
        wordCount: r.wordCount,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
      chapterStore.set(projectId, chapters)

      status.processedChapters = chapterResults.length
      status.stepProgress = 100
      status.progress = 50
      status.updatedAt = new Date()

      await delay(1000)

      // Step 3: Split scenes
      status.currentStep = "splitting_scenes"
      status.stepProgress = 0
      status.totalScenes = chapters.length * 3
      status.processedScenes = 0
      status.updatedAt = new Date()

      const allScenes: Scene[] = []
      const allMappings: SceneCharacterMapping[] = []

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i]
        const sceneResults = await mockSplitScenes(chapter.content, i)

        for (let j = 0; j < sceneResults.length; j++) {
          const sceneResult = sceneResults[j]
          const sceneId = generateId()

          allScenes.push({
            id: sceneId,
            projectId,
            chapterId: chapter.id,
            orderIndex: j,
            title: sceneResult.title,
            excerpt: sceneResult.excerpt,
            promptDraft: sceneResult.promptDraft,
            promptFinal: sceneResult.promptDraft,
            createdAt: new Date(),
            updatedAt: new Date(),
          })

          // Create character mappings
          const characterDetails = characterStore.get(projectId) || []
          const sceneCharacterIds = characterDetails
            .filter((c) => sceneResult.characters.includes(c.name))
            .map((c) => c.id)

          if (sceneCharacterIds.length > 0) {
            allMappings.push({
              sceneId,
              sceneTitle: sceneResult.title,
              characterIds: sceneCharacterIds,
              confidence: 0.85,
              reason: `角色 ${sceneResult.characters.join(", ")} 在场景中被提及`,
            })
          }

          status.processedScenes++
          status.stepProgress = Math.round((status.processedScenes / status.totalScenes) * 100)
          status.progress = 50 + Math.round((status.processedScenes / status.totalScenes) * 25)
          status.updatedAt = new Date()

          await delay(200) // Stagger to show progress
        }
      }

      sceneStore.set(projectId, allScenes)
      sceneCharacterStore.set(projectId, allMappings)
      status.characterLinksCreated = allMappings.length
      status.stepProgress = 100
      status.progress = 85
      status.updatedAt = new Date()

      await delay(1000)

      // Step 4: Generate prompts
      status.currentStep = "generating_prompts"
      status.stepProgress = 0
      status.updatedAt = new Date()

      // Update scenes with final prompts
      const finalScenes = sceneStore.get(projectId) || []
      for (const scene of finalScenes) {
        scene.promptFinal = scene.promptDraft
        scene.updatedAt = new Date()
      }
      sceneStore.set(projectId, finalScenes)

      status.stepProgress = 100
      status.progress = 100
      status.updatedAt = new Date()

      // Complete
      status.currentStep = "completed"
      status.completedAt = new Date()
      status.updatedAt = new Date()

    } catch (error) {
      console.error("Auto-workflow error:", error)
      status.currentStep = "failed"
      status.errorMessage = error instanceof Error ? error.message : "未知错误"
      status.updatedAt = new Date()
    }
  },

  // Get workflow status
  async getStatus(projectId: string): Promise<AutoWorkflowStatus | null> {
    await delay(300)
    return autoWorkflowStore.get(projectId) || null
  },

  // Get extracted characters
  async getCharacters(projectId: string): Promise<CharacterDetail[]> {
    await delay(300)
    return characterStore.get(projectId) || []
  },

  // Get chapters
  async getChapters(projectId: string): Promise<Chapter[]> {
    await delay(300)
    return chapterStore.get(projectId) || []
  },

  // Get scenes
  async getScenes(projectId: string): Promise<Scene[]> {
    await delay(300)
    return sceneStore.get(projectId) || []
  },

  // Get scene-character mappings
  async getSceneCharacterMappings(projectId: string): Promise<SceneCharacterMapping[]> {
    await delay(300)
    return sceneCharacterStore.get(projectId) || []
  },

  // Update character
  async updateCharacter(
    projectId: string,
    characterId: string,
    updates: Partial<CharacterDetail>
  ): Promise<CharacterDetail | null> {
    await delay(300)
    const characters = characterStore.get(projectId) || []
    const index = characters.findIndex((c) => c.id === characterId)
    if (index === -1) return null

    characters[index] = { ...characters[index], ...updates, updatedAt: new Date() }
    characterStore.set(projectId, characters)
    return characters[index]
  },

  // Update scene
  async updateScene(projectId: string, sceneId: string, updates: Partial<Scene>): Promise<Scene | null> {
    await delay(300)
    const scenes = sceneStore.get(projectId) || []
    const index = scenes.findIndex((s) => s.id === sceneId)
    if (index === -1) return null

    scenes[index] = { ...scenes[index], ...updates, updatedAt: new Date() }
    sceneStore.set(projectId, scenes)
    return scenes[index]
  },

  // Re-extract characters with custom prompt
  async reExtractCharacters(
    projectId: string,
    text: string,
    stylePreset: ArtStylePreset,
    customPrompt?: string
  ): Promise<CharacterExtractionResult[]> {
    await delay(3000)

    // Use custom prompt if provided
    if (customPrompt) {
      // In real implementation, this would use the custom prompt
      console.log("Using custom prompt:", customPrompt)
    }

    return mockExtractCharacters(text, stylePreset)
  },

  // Cancel workflow
  async cancel(projectId: string): Promise<void> {
    await delay(500)
    const status = autoWorkflowStore.get(projectId)
    if (status && status.currentStep !== "completed" && status.currentStep !== "failed") {
      status.currentStep = "failed"
      status.errorMessage = "用户取消"
      status.updatedAt = new Date()
    }
  },

  // Reset workflow
  async reset(projectId: string): Promise<void> {
    await delay(300)
    characterStore.delete(projectId)
    chapterStore.delete(projectId)
    sceneStore.delete(projectId)
    sceneCharacterStore.delete(projectId)
    autoWorkflowStore.delete(projectId)
  },
}
