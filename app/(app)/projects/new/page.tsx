"use client"

import { useState, useCallback } from "react"
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
import { projectsApi, manuscriptApi } from "@/lib/api"
import { type FileParseResult } from "@/lib/file-parser"

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

      // 2. 导入书稿文本
      if (textInput.trim().length > 0) {
        setCreatingProgress(60)
        await manuscriptApi.importText(project.id, textInput.trim())
      }

      setCreatingProgress(100)

      // 跳转到项目详情页
      router.push(`/projects/${project.id}`)
    } catch (err) {
      setError("Failed to create project. Please try again.")
      console.error("Create project error:", err)
      setCreating(false)
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 左侧：项目信息表单 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("projectInfo")}</CardTitle>
              <CardDescription>
                {t("projectName")} / {t("description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("projectName")} *</Label>
                <Input
                  id="title"
                  placeholder={t("projectNamePlaceholder")}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={creating}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("projectDescription")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("projectDescriptionPlaceholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={creating}
                  rows={3}
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
                      disabled={creating}
                    >
                      {lang.nativeName}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 创建进度 */}
          {creating && (
            <Card>
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

          {/* 错误提示 */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="py-4">
                <p className="text-destructive text-center">{error}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 右侧：书稿输入 */}
        <div className="space-y-4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t("manuscriptContent")}
              </CardTitle>
              <CardDescription>
                {t("uploadOrPaste")}
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    className="min-h-[250px] resize-none"
                    disabled={creating}
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
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t">
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
    </div>
  )
}
