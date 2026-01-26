"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileText, Sparkles, ChevronRight, BookOpen, FileUp, Edit3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileUpload } from "@/components/file-upload"
import { Progress } from "@/components/ui/progress"
import { useI18n } from "@/lib/i18n"
import { analysisApi } from "@/lib/api"
import type { Chapter } from "@/lib/types"
import type { FileParseResult } from "@/lib/file-parser"

export default function ManuscriptPage({ params }: { params: { projectId: string } }) {
  const { t, language } = useI18n()
  const router = useRouter()
  const projectId = params.projectId

  // 状态管理
  const [textInput, setTextInput] = useState("")
  const [parsedFile, setParsedFile] = useState<FileParseResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null)

  // 处理文件解析结果
  const handleFileParsed = useCallback((result: FileParseResult) => {
    setParsedFile(result)
    setTextInput(result.text)
  }, [])

  // 开始 AI 分析
  const handleAnalyze = async () => {
    const text = textInput.trim()
    if (!text) return

    setAnalyzing(true)
    setAnalysisProgress(0)

    // 模拟进度
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => Math.min(prev + 5, 90))
    }, 300)

    try {
      const result = await analysisApi.analyze(projectId, text, language)
      setChapters(result.chapters)
      setAnalysisProgress(100)

      // 如果有章节，默认选择第一个
      if (result.chapters.length > 0) {
        setSelectedChapterId(result.chapters[0].id)
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      clearInterval(progressInterval)
      setAnalyzing(false)
    }
  }

  // 选择章节查看详情
  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId)
  }

  // 获取当前选中的章节内容
  const selectedChapter = chapters.find((c) => c.id === selectedChapterId)

  // 检查是否可以进行分析
  const canAnalyze = textInput.trim().length > 100

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          {t("myProjects")}
        </Link>
        <span>/</span>
        <Link href={`/projects/${projectId}`} className="hover:text-foreground">
          {t("projectDetails")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{t("manuscriptManagement")}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t("manuscriptManagement")}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t("uploadOrPaste")}
            </p>
          </div>
        </div>

        {chapters.length > 0 && (
          <Button onClick={() => router.push(`/projects/${projectId}/illustrations`)}>
            {t("continue")}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 左侧：输入区域 */}
        <div className="space-y-4">
          <Tabs defaultValue="paste" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="paste" className="gap-2">
                <Edit3 className="h-4 w-4" />
                {t("pasteText")}
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2">
                <FileUp className="h-4 w-4" />
                {t("uploadFile")}
              </TabsTrigger>
            </TabsList>

            {/* 粘贴文本 */}
            <TabsContent value="paste" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("manuscriptLabel")}</CardTitle>
                  <CardDescription>
                    {t("manuscriptPlaceholder")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={t("manuscriptPlaceholder")}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="min-h-[300px] resize-none"
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">
                      {textInput.length} {t("charactersCount")}
                    </span>
                    <Button
                      onClick={handleAnalyze}
                      disabled={!canAnalyze || analyzing}
                      className="gap-2"
                    >
                      {analyzing ? (
                        <>
                          <Sparkles className="h-4 w-4 animate-pulse" />
                          {t("analyzing")}
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          {t("analyzeWithAI")}
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 上传文件 */}
            <TabsContent value="upload" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("uploadFile")}</CardTitle>
                  <CardDescription>
                    {t("supportedFormats")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload onFileParsed={handleFileParsed} />
                  {parsedFile && (
                    <div className="mt-4">
                      <Textarea
                        placeholder={t("manuscriptPlaceholder")}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        className="min-h-[200px] resize-none"
                      />
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-sm text-muted-foreground">
                          {textInput.length} {t("charactersCount")}
                        </span>
                        <Button
                          onClick={handleAnalyze}
                          disabled={!canAnalyze || analyzing}
                          className="gap-2"
                        >
                          {analyzing ? (
                            <>
                              <Sparkles className="h-4 w-4 animate-pulse" />
                              {t("analyzing")}
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" />
                              {t("analyzeWithAI")}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* 分析进度 */}
          {analyzing && (
            <Card>
              <CardContent className="py-6">
                <div className="text-center space-y-4">
                  <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
                  <p className="font-medium">{t("analyzingProgress")}</p>
                  <Progress value={analysisProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {t("pleaseWait")} ({analysisProgress}%)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧：章节列表 */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {chapters.length > 0 ? t("analysisComplete") : t("chapterTitle")}
                  </CardTitle>
                  <CardDescription>
                    {chapters.length > 0
                      ? t("chaptersFound", { count: chapters.length })
                      : t("noChaptersDesc")}
                  </CardDescription>
                </div>
                {chapters.length > 0 && (
                  <Badge variant="secondary">{chapters.length} {t("chapters")}</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {chapters.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{t("waitingForInput")}</p>
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {chapters.map((chapter, index) => (
                      <div
                        key={chapter.id}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedChapterId === chapter.id
                            ? "border-primary bg-primary/5"
                            : "border-transparent hover:bg-muted"
                        }`}
                        onClick={() => handleSelectChapter(chapter.id)}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="font-mono">
                            {index + 1}
                          </Badge>
                          <h3 className="font-semibold">{chapter.title}</h3>
                        </div>
                        {chapter.summary && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {chapter.summary}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {chapter.wordCount} {t("charactersCount")}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 选中章节详情 */}
      {selectedChapter && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedChapter.title}</CardTitle>
            <CardDescription>
              {selectedChapter.wordCount} {t("charactersCount")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{selectedChapter.content}</p>
              </div>
            </ScrollArea>
            <div className="flex justify-end mt-4 gap-2">
              <Button variant="outline" onClick={() => router.push(`/projects/${projectId}/illustrations`)}>
                {t("generateForChapter")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
