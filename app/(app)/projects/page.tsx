"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Share2,
  BookOpen,
  Clock,
  Globe,
  CheckCircle,
  Image,
  ChevronRight
} from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useAuthStore } from "@/lib/store"

// 固定标签
const labels = {
  authorDashboard: "Author Dashboard",
  projects: "Projects",
  myBookProjects: "My Book Projects",
  manageBookProjects: "Manage your children's book series and individual titles from one central creative hub.",
  searchProjects: "Search projects...",
  chaptersIllustrated: "Chapters Illustrated",
  newStoryboard: "New Storyboard",
  startNextBestseller: "Start your next bestseller with AI-assisted art.",
  projectDetails: "Project Details",
  status: "Status",
  chapterStructure: "Chapter Structure",
  addChapter: "Add Chapter",
  illustrationsComplete: "4 Illustrations complete",
  noArtYet: "No art yet",
  wordCount: "Word Count",
  avgArtStyle: "Avg Art Style",
  watercolor: "Watercolor",
  generateStoryboard: "Generate Storyboard",
  exportPDF: "Export PDF",
  settings: "Settings"
}

// 模拟项目数据
const mockProjects = [
  {
    id: "1",
    title: "The Little Fox's Journey",
    category: "Children's Fiction",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=533&fit=crop",
    status: "In Progress",
    chaptersIllustrated: 12,
    totalChapters: 15,
    updatedAt: "2h ago",
    language: "ENG",
    contributors: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
    ]
  },
  {
    id: "2",
    title: "Neon Chronicles: District 9",
    category: "Graphic Novel",
    cover: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&h=533&fit=crop",
    status: "Drafting",
    chaptersIllustrated: 24,
    totalChapters: 40,
    updatedAt: "2h ago",
    language: null,
    contributors: []
  },
  {
    id: "3",
    title: "Shadows of Aetheria",
    category: "Fantasy",
    cover: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=533&fit=crop",
    status: "Outline",
    chaptersIllustrated: 5,
    totalChapters: 30,
    updatedAt: "1 day ago",
    language: "ENG",
    contributors: []
  }
]

const statusColors: Record<string, string> = {
  "In Progress": "bg-emerald-100 text-emerald-700",
  "Drafting": "bg-amber-100 text-amber-700",
  "Outline": "bg-slate-100 text-slate-700"
}

export default function ProjectsPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedProject, setSelectedProject] = useState(mockProjects[0])

  const handleCreateProject = () => {
    router.push("/projects/new")
  }

  const filteredProjects = mockProjects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题区域 */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          {/* 面包屑导航 */}
          <nav className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            <span>{labels.authorDashboard}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900">{labels.projects}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl">
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                {labels.myBookProjects}
              </h1>
              <p className="mt-2 text-gray-500 text-lg">
                {labels.manageBookProjects}
              </p>
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={labels.searchProjects}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 border-gray-200 rounded-xl focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-xl border-gray-200">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* 项目卡片网格 */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 项目卡片 */}
              {filteredProjects.map((project) => (
                <Card
                  key={project.id}
                  className="group overflow-hidden rounded-2xl border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    {/* 封面图片 */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${project.cover})` }}
                    />
                    {/* 书脊效果 */}
                    <div className="absolute left-0 top-0 bottom-0 w-4 bg-black/10 shadow-inner" />
                    {/* 渐变叠加 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                    {/* 状态标签 */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className={`size-2 rounded-full ${project.status === "In Progress" ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                      <span className="text-[10px] font-bold text-gray-800 uppercase tracking-tight">{project.status}</span>
                    </div>
                    {/* 底部标题 */}
                    <div className="absolute bottom-4 left-6 right-4 text-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-200 mb-1">{project.category}</p>
                      <h3 className="text-xl font-bold leading-tight">{project.title}</h3>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="space-y-4">
                      {/* 进度条 */}
                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-xs font-semibold text-gray-500 uppercase">{labels.chaptersIllustrated}</span>
                          <span className="text-xs font-bold text-purple-600">{project.chaptersIllustrated} / {project.totalChapters}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all duration-1000"
                            style={{ width: `${(project.chaptersIllustrated / project.totalChapters) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                        {/* 贡献者头像 */}
                        <div className="flex -space-x-2">
                          {project.contributors.length > 0 ? (
                            <>
                              <div className="size-7 rounded-full border-2 border-white overflow-hidden">
                                <img src={project.contributors[0]} alt="contributor" className="w-full h-full object-cover" />
                              </div>
                              {project.contributors[1] && (
                                <div className="size-7 rounded-full border-2 border-white overflow-hidden">
                                  <img src={project.contributors[1]} alt="contributor" className="w-full h-full object-cover" />
                                </div>
                              )}
                              {project.contributors.length > 2 && (
                                <div className="size-7 rounded-full border-2 border-white bg-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                                  +{project.contributors.length - 2}
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span className="text-[11px] text-gray-500">{project.updatedAt}</span>
                            </div>
                          )}
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-purple-600">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-purple-600">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* 创建新项目卡片 */}
              <Card
                className="flex flex-col items-center justify-center rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer min-h-[400px]"
                onClick={handleCreateProject}
              >
                <div className="size-20 rounded-full bg-white flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  <Plus className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{labels.newStoryboard}</h3>
                <p className="text-gray-500 text-sm mt-2 text-center max-w-[200px]">
                  {labels.startNextBestseller}
                </p>
              </Card>
            </div>
          </div>

          {/* 右侧项目详情面板 - 桌面端显示 */}
          <aside className="hidden xl:flex w-[380px] bg-white rounded-2xl border border-gray-100 shadow-sm flex-col overflow-hidden sticky top-24 h-fit">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{labels.projectDetails}</h2>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-gray-100">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* 项目封面和标题 */}
                <div className="flex gap-4 items-start">
                  <div className="w-24 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                    <img
                      src={selectedProject.cover}
                      alt={selectedProject.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedProject.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {labels.status}: <span className="text-emerald-600 font-semibold">Active Development</span>
                    </p>
                    <div className="flex gap-2 mt-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">Age 3-7</span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">{selectedProject.category}</span>
                    </div>
                  </div>
                </div>

                {/* 章节结构 */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{labels.chapterStructure}</h4>
                    <Button variant="ghost" size="sm" className="text-purple-600 text-xs font-bold hover:bg-purple-50 h-auto p-0">
                      + {labels.addChapter}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl group cursor-move">
                      <BookOpen className="h-5 w-5 text-purple-400" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">1. The Forest Meeting</p>
                        <p className="text-xs text-purple-600 font-medium">{labels.illustrationsComplete}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl group cursor-move transition-colors">
                      <BookOpen className="h-5 w-5 text-gray-300" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">2. The Midnight River</p>
                        <p className="text-xs text-gray-500">2 Illustrations, 1 draft</p>
                      </div>
                      <div className="size-2 rounded-full bg-amber-500" />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl group cursor-move transition-colors">
                      <BookOpen className="h-5 w-5 text-gray-300" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800 text-gray-400">3. The Golden Mountain</p>
                        <p className="text-xs text-gray-400 italic">{labels.noArtYet}</p>
                      </div>
                      <Image className="h-5 w-5 text-gray-300" />
                    </div>
                  </div>
                </div>

                {/* 统计信息 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{labels.wordCount}</p>
                    <p className="text-lg font-bold text-gray-800">12,400</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">{labels.avgArtStyle}</p>
                    <p className="text-lg font-bold text-gray-800">{labels.watercolor}</p>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="pt-4 space-y-3">
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-200 transition-all"
                    onClick={() => router.push(`/projects/${selectedProject.id}/illustrations`)}
                  >
                    <Plus className="h-5 w-5" />
                    {labels.generateStoryboard}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="py-3 border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">
                      {labels.exportPDF}
                    </Button>
                    <Button variant="outline" className="py-3 border-gray-200 rounded-xl text-gray-600 font-bold text-sm hover:bg-gray-50">
                      {labels.settings}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
