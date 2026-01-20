// Mock data provider for development

import type {
  User,
  Project,
  Paragraph,
  GenerationTask,
  IllustrationAsset,
  CreditTransaction,
  IllustrationSettings,
} from "./types"

// Mock user data
export const mockUser: User = {
  id: "user-1",
  email: "demo@bookart.ai",
  name: "Demo User",
  role: "user",
  credits: 150,
  createdAt: new Date("2024-01-01"),
  language: "en",
}

export const mockAdminUser: User = {
  ...mockUser,
  id: "admin-1",
  email: "admin@bookart.ai",
  name: "Admin User",
  role: "admin",
  credits: 9999,
}

// Mock projects
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    userId: "user-1",
    title: "The Adventures of Little Fox",
    description: "A children's story about a curious fox exploring the forest",
    language: "en",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-28"),
    manuscriptStatus: "parsed",
    paragraphCount: 24,
  },
  {
    id: "proj-2",
    userId: "user-1",
    title: "Ancient Rome History",
    description: "Educational content about Roman Empire",
    language: "en",
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-15"),
    manuscriptStatus: "imported",
    paragraphCount: 0,
  },
  {
    id: "proj-3",
    userId: "user-1",
    title: "现代建筑艺术",
    description: "探索当代建筑设计的美学原则",
    language: "zh",
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-10"),
    manuscriptStatus: "empty",
    paragraphCount: 0,
  },
]

// Mock paragraphs
export const mockParagraphs: Paragraph[] = [
  {
    id: "para-1",
    projectId: "proj-1",
    index: 0,
    content:
      "Once upon a time, in a deep green forest, there lived a little fox named Ruby. She had the softest orange fur and the brightest curious eyes.",
    selected: false,
    markedForIllustration: true,
  },
  {
    id: "para-2",
    projectId: "proj-1",
    index: 1,
    content:
      "Every morning, Ruby would wake up early and venture out to explore the world around her. Today was special - she wanted to find the legendary Crystal Stream.",
    selected: false,
    markedForIllustration: true,
  },
  {
    id: "para-3",
    projectId: "proj-1",
    index: 2,
    content:
      "The forest was full of wonders. Tall oak trees reached toward the sky, their leaves whispering secrets in the gentle breeze.",
    selected: false,
    markedForIllustration: false,
  },
]

// Mock illustration settings
export const defaultIllustrationSettings: IllustrationSettings = {
  stylePreset: "children-story",
  colorMode: "colorful",
  brushStyle: "watercolor",
  aspectRatio: "4:3",
  sizePreset: 1536,
  noTextInImage: true,
  consistentStyle: true,
}

// Mock generation tasks
export const mockTasks: GenerationTask[] = [
  {
    id: "task-1",
    projectId: "proj-1",
    paragraphIds: ["para-1"],
    promptPreview: "A little fox with orange fur and bright eyes in a deep green forest, children's story style...",
    status: "succeeded",
    settings: defaultIllustrationSettings,
    createdAt: new Date("2024-12-28T10:30:00"),
    updatedAt: new Date("2024-12-28T10:32:00"),
  },
  {
    id: "task-2",
    projectId: "proj-1",
    paragraphIds: ["para-2"],
    promptPreview: "A fox exploring the forest looking for Crystal Stream, watercolor style...",
    status: "running",
    settings: defaultIllustrationSettings,
    createdAt: new Date("2024-12-28T11:00:00"),
    updatedAt: new Date("2024-12-28T11:00:00"),
  },
]

// Mock illustration assets
export const mockAssets: IllustrationAsset[] = [
  {
    id: "asset-1",
    taskId: "task-1",
    paragraphId: "para-1",
    url: "/little-fox-in-forest-watercolor.jpg",
    width: 800,
    height: 600,
    createdAt: new Date("2024-12-28T10:32:00"),
  },
]

// Mock credit transactions
export const mockTransactions: CreditTransaction[] = [
  {
    id: "txn-1",
    userId: "user-1",
    type: "purchase",
    amount: 100,
    reason: "Starter pack purchase",
    referenceId: "pay-1",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "txn-2",
    userId: "user-1",
    type: "earn",
    amount: 50,
    reason: "Welcome bonus",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "txn-3",
    userId: "user-1",
    type: "spend",
    amount: -10,
    reason: "Illustration generation",
    referenceId: "task-1",
    createdAt: new Date("2024-12-28"),
  },
]
