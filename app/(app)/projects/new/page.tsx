"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, FileText, FileUp, Edit3, Sparkles, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { FileUpload } from "@/components/file-upload"
import { Progress } from "@/components/ui/progress"
import { useI18n, LANGUAGES, type Language } from "@/lib/i18n"
import { projectsApi, manuscriptApi, autoWorkflowApi } from "@/lib/api"
import { type FileParseResult } from "@/lib/file-parser"
import { WorkflowProgress } from "@/components/auto-workflow"

export default function NewProjectPage() {
  const { t, language, setLanguage } = useI18n()
  const router = useRouter()

  // 表单状态
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [textInput, setTextInput] = useState("")
  const [parsedFile, setParsedFile] = useState<FileParseResult | null>(null)
  const [creating, setCreating] = useState(false)
  const [creatingProgress, setCreatingProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // 自动工作流状态
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null)
  const [workflowComplete, setWorkflowComplete] = useState(false)
  const [workflowData, setWorkflowData] = useState<{
    characters: any[]
    chapters: any[]
    scenes: any[]
    mappings: any[]
  } | null>(null)

  // 处理文件解析结果
  const handleFileParsed = useCallback((result: FileParseResult) => {
    setParsedFile(result)
    setTextInput(result.text)
  }, [])

  // 检查是否可以创建项目
  const canCreate = title.trim().length > 0 && (textInput.trim().length > 0 || parsedFile !== null)

  // 创建项目
  const handleCreate = async () => {
    if (!canCreate) return

    setCreating(true)
    setCreatingProgress(0)
    setError(null)

    try {
      // 1. 创建项目
      setCreatingProgress(20)
      const project = await projectsApi.create({
        title: title.trim(),
        description: description.trim(),
        language,
        stylePresetKey: "children-story", // 默认风格
      })

      setCreatedProjectId(project.id)

      // 2. 导入书稿文本
      if (textInput.trim().length > 0) {
        setCreatingProgress(60)
        await manuscriptApi.importText(project.id, textInput.trim())
      }

      setCreatingProgress(100)

      // 延迟跳转，让用户看到工作流进度
      // 实际工作流会在后台继续运行
    } catch (err) {
      setError("Failed to create project. Please try again.")
      console.error("Create project error:", err)
      setCreating(false)
    }
  }

  // 工作流完成回调
  const handleWorkflowComplete = (data: {
    characters: any[]
    chapters: any[]
    scenes: any[]
    mappings: any[]
  }) => {
    setWorkflowData(data)
    setWorkflowComplete(true)
  }

  // 工作流错误回调
  const handleWorkflowError = (errorMsg: string) => {
    setError(`自动分析失败: ${errorMsg}`)
  }

  // 跳转到项目详情页
  const handleGoToProject = () => {
    if (createdProjectId) {
      router.push(`/projects/${createdProjectId}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/projects" className="hover:text-foreground">
          {t("myProjects")}
        </Link>
        <span>/</span>
        <span className="text-foreground">{t("createProject")}</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t("createNewProject")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("uploadOrPaste")}
          </p>
        </div>
      </div>

      {/* 单面板布局：项目信息 + 书稿内容 */}
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {t("projectInfo")} & {t("manuscriptContent")}
            </CardTitle>
            <CardDescription>
              {t("projectName")} / {t("description")} / {t("uploadOrPaste")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 项目信息 */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">{t("projectName")} *</Label>
                <Input
                  id="title"
                  placeholder={t("projectNamePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={creating || workflowComplete}
                />
              </div>
              <div className="space-y-2">
                <Label>{t("language")}</Label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "outline"}
                      size="sm"
                      onClick={() => setLanguage(lang.code as Language)}
                      disabled={creating || workflowComplete}
                    >
                      {lang.nativeName}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("projectDescription")}</Label>
              <Textarea
                id="description"
                placeholder={t("projectDescriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={creating || workflowComplete}
                rows={2}
              />
            </div>

            <hr className="border-gray-100" />

            {/* 书稿输入 */}
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="upload" className="gap-2">
                  <Upload className="h-4 w-4" />
                  {t("uploadManuscript")}
                </TabsTrigger>
                <TabsTrigger value="paste" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  {t("pasteManuscript")}
                </TabsTrigger>
              </TabsList>

              {/* 上传文件 */}
              <TabsContent value="upload" className="space-y-4">
                <FileUpload
                  onFileParsed={handleFileParsed}
                  accept=".pdf,.docx,.txt,.md"
                  disabled={creating || workflowComplete}
                />
                {parsedFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="h-4 w-4" />
                    {t("success")}: {parsedFile.fileName} ({parsedFile.text.length} {t("charactersCount")})
                  </div>
                )}
              </TabsContent>

              {/* 粘贴文本 */}
              <TabsContent value="paste" className="space-y-4">
                <Textarea
                  placeholder={t("manuscriptContentPlaceholder")}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px] resize-none"
                  disabled={creating || workflowComplete}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {textInput.length} {t("charactersCount")}
                  </span>
                  {textInput.length > 0 && (
                    <span className="text-green-600">
                      {t("success")}
                    </span>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* 底部操作栏 */}
            {!workflowComplete && (
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                <Button variant="outline" asChild disabled={creating}>
                  <Link href="/projects">{t("cancel")}</Link>
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!canCreate || creating}
                  className="gap-2"
                >
                  {creating ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" />
                      {t("creatingProject")}
                    </>
                  ) : (
                    <>
                      {t("createProject")}
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 创建进度 */}
        {creating && creatingProgress < 100 && (
          <Card className="mt-6">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
                <p className="font-medium">{t("creatingProject")}</p>
                <Progress value={creatingProgress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {creatingProgress}%
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 自动工作流进度 */}
        {createdProjectId && (
          <div className="mt-6">
            <WorkflowProgress
              projectId={createdProjectId}
              text={textInput || parsedFile?.text || ""}
              stylePreset="children-story"
              onComplete={handleWorkflowComplete}
              onError={handleWorkflowError}
            />
          </div>
        )}

        {/* 工作流完成 */}
        {workflowComplete && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-green-700 text-lg">AI 分析完成！</p>
                  <p className="text-sm text-green-600 mt-1">
                    已提取 {workflowData?.characters.length} 个角色，
                    切分 {workflowData?.chapters.length} 个章节，
                    {workflowData?.scenes.length} 个场景
                  </p>
                </div>
                <Button onClick={handleGoToProject} className="bg-green-600 hover:bg-green-700">
                  前往项目详情
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 错误提示 */}
        {error && (
          <Card className="mt-6 border-destructive">
            <CardContent className="py-4">
              <p className="text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
