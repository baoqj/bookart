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
  name: "演示用户",
  role: "user",
  credits: 150,
  createdAt: new Date("2024-01-01"),
  language: "zh",
}

export const mockAdminUser: User = {
  ...mockUser,
  id: "admin-1",
  email: "admin@bookart.ai",
  name: "管理员",
  role: "admin",
  credits: 9999,
}

// Mock projects
export const mockProjects: Project[] = [
  {
    id: "proj-1",
    userId: "user-1",
    title: "小狐狸的冒险",
    description: "一个关于好奇的小狐狸探索森林的儿童故事",
    language: "zh",
    stylePresetKey: "children-story",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-28"),
    manuscriptStatus: "parsed",
    paragraphCount: 24,
  },
  {
    id: "proj-2",
    userId: "user-1",
    title: "古罗马历史",
    description: "关于罗马帝国的教育内容",
    language: "zh",
    stylePresetKey: "history",
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
    stylePresetKey: "architecture",
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
      "从前，在一片郁郁葱葱的森林里，住着一只名叫小红的小狐狸。她有着最柔软的橙色皮毛和最明亮好奇的眼睛。",
    selected: false,
    markedForIllustration: true,
  },
  {
    id: "para-2",
    projectId: "proj-1",
    index: 1,
    content:
      "每天清晨，小红都会早早醒来，出门探索周围的世界。今天很特别——她想要找到传说中的水晶溪。",
    selected: false,
    markedForIllustration: true,
  },
  {
    id: "para-3",
    projectId: "proj-1",
    index: 2,
    content:
      "森林里到处都是奇迹。高大的橡树伸向天空，树叶在微风中低语着秘密。",
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
    promptPreview: "一只橙色皮毛、明亮眼睛的小狐狸在郁郁葱葱的森林里，儿童故事风格...",
    status: "succeeded",
    settings: defaultIllustrationSettings,
    createdAt: new Date("2024-12-28T10:30:00"),
    updatedAt: new Date("2024-12-28T10:32:00"),
  },
  {
    id: "task-2",
    projectId: "proj-1",
    paragraphIds: ["para-2"],
    promptPreview: "小狐狸在森林里探索寻找水晶溪，水彩风格...",
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
    url: "/placeholder-fox-forest.jpg",
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
    reason: "入门套餐购买",
    referenceId: "pay-1",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "txn-2",
    userId: "user-1",
    type: "earn",
    amount: 50,
    reason: "欢迎奖励",
    createdAt: new Date("2024-12-01"),
  },
  {
    id: "txn-3",
    userId: "user-1",
    type: "spend",
    amount: -10,
    reason: "插图生成",
    referenceId: "task-1",
    createdAt: new Date("2024-12-28"),
  },
]
