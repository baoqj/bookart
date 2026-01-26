"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/lib/i18n"
import { useAuthStore } from "@/lib/store"
import type { User } from "@/lib/types"
import {
  Upload,
  FileText,
  Plus,
  FolderOpen,
  Save,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle,
  Loader2,
  X
} from "lucide-react"

// 临时项目类型
interface TempProject {
  id: string
  title: string
  content: string
  chapters: Chapter[]
  createdAt: Date
  updatedAt: Date
}

interface Chapter {
  id: string
  title: string
  content: string
  paragraphs: Paragraph[]
}

interface Paragraph {
  id: string
  index: number
  content: string
  selected: boolean
}

export default function ProjectsPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { user, isAuthenticated, setUser } = useAuthStore()
  const [tempProject, setTempProject] = useState<TempProject | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [registerName, setRegisterName] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 加载临时项目
  useEffect(() => {
    const saved = localStorage.getItem("tempProject")
    if (saved) {
      try {
        const project = JSON.parse(saved)
        setTempProject(project)
      } catch (e) {
        console.error("Failed to load temp project:", e)
      }
    }
  }, [])

  // 保存临时项目到 localStorage
  const saveTempProject = useCallback((project: TempProject) => {
    localStorage.setItem("tempProject", JSON.stringify(project))
    setTempProject(project)
  }, [])

  // 处理文本粘贴
  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text")
    if (text) {
      e.preventDefault()
      processText(text)
    }
  }, [])

  // 处理文件拖拽
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === "text/plain" || file.name.endsWith(".txt")) {
        const text = await file.text()
        processText(text)
      } else {
        setError("只支持 .txt 格式的文件")
        setTimeout(() => setError(""), 3000)
      }
    }
  }, [])

  // 处理文本内容（分割成章节和段落）
  const processText = (text: string) => {
    // 简单的段落分割（按双换行符）
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0)

    if (paragraphs.length === 0) return

    const newProject: TempProject = {
      id: tempProject?.id || `temp-${Date.now()}`,
      title: paragraphs[0].substring(0, 50) + "..." || "未命名项目",
      content: text,
      chapters: [{
        id: `chapter-1`,
        title: "第一章",
        content: text,
        paragraphs: paragraphs.map((content, index) => ({
          id: `para-${index}`,
          index,
          content,
          selected: false
        }))
      }],
      createdAt: tempProject?.createdAt || new Date(),
      updatedAt: new Date()
    }

    saveTempProject(newProject)
  }

  // 打开登录对话框
  const handleSave = () => {
    if (!tempProject) return
    setShowSaveDialog(true)
  }

  // 登录
  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      setError("请填写邮箱和密码")
      return
    }

    setIsSaving(true)
    setError("")

    try {
      // 模拟登录
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email: loginEmail,
        name: loginEmail.split("@")[0],
        role: loginEmail.includes("admin") ? "admin" as const : "user" as const,
        credits: 100,
        createdAt: new Date()
      }

      // 延迟模拟
      await new Promise(resolve => setTimeout(resolve, 1000))

      setUser(mockUser)
      setShowSaveDialog(false)
      setShowLoginDialog(true)
      setSuccess("登录成功！正在保存您的项目...")
      setTimeout(() => setSuccess(""), 3000)

      // 保存到用户账户（实际应该调用 API）
      localStorage.setItem(`userProject-${mockUser.id}`, JSON.stringify(tempProject))
      localStorage.removeItem("tempProject")
      setTempProject(null)

      // 跳转到项目详情
      setTimeout(() => {
        router.push("/projects/new")
      }, 1500)

    } catch (err) {
      setError("登录失败，请重试")
    } finally {
      setIsSaving(false)
    }
  }

  // 注册
  const handleRegister = async () => {
    if (!registerName || !registerEmail || !registerPassword) {
      setError("请填写所有字段")
      return
    }

    if (registerPassword.length < 6) {
      setError("密码至少需要6个字符")
      return
    }

    setIsRegistering(true)
    setError("")

    try {
      // 模拟注册
      const mockUser: User = {
        id: `user-${Date.now()}`,
        email: registerEmail,
        name: registerName,
        role: "user" as const,
        credits: 100,
        createdAt: new Date()
      }

      await new Promise(resolve => setTimeout(resolve, 1000))

      setUser(mockUser)
      setShowSaveDialog(false)
      setSuccess("注册成功！正在恢复您的项目...")

      // 恢复临时项目到用户账户
      if (tempProject) {
        localStorage.setItem(`userProject-${mockUser.id}`, JSON.stringify(tempProject))
        localStorage.removeItem("tempProject")
        setTempProject(null)
      }

      setTimeout(() => {
        setSuccess("")
        router.push("/projects/new")
      }, 1500)

    } catch (err) {
      setError("注册失败，请重试")
    } finally {
      setIsRegistering(false)
    }
  }

  // 关闭登录对话框，留在当前页面继续编辑
  const handleCloseLoginDialog = () => {
    setShowLoginDialog(false)
    setError("")
    setLoginEmail("")
    setLoginPassword("")
    setRegisterName("")
    setRegisterEmail("")
    setRegisterPassword("")
  }

  // 删除临时项目
  const handleDeleteProject = () => {
    if (confirm("确定要删除当前项目吗？")) {
      localStorage.removeItem("tempProject")
      setTempProject(null)
    }
  }

  // 渲染空状态（无项目时）
  if (!tempProject) {
    return (
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("myProjects")}
            </h1>
            <p className="text-gray-500 mt-2">
              {t("manageYourProjects")}
            </p>
          </div>
        </div>

        {/* 上传区域 */}
        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full bg-purple-100 p-6 mb-4">
              <Upload className="h-12 w-12 text-purple-600" />
            </div>
            <CardTitle className="mb-2 text-gray-700">
              上传您的书稿
            </CardTitle>
            <CardDescription className="text-center max-w-md mb-6 text-gray-500">
              直接粘贴文本内容，或拖拽 .txt 文件到此处开始创建插图
            </CardDescription>

            {/* 粘贴区域 */}
            <Textarea
              ref={textareaRef}
              placeholder="在此粘贴书稿内容..."
              className="w-full max-w-2xl h-48 mb-4 resize-none border-gray-300"
              onPaste={handlePaste}
            />

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                支持 .txt 格式
              </span>
              <span>|</span>
              <span>或直接粘贴文本</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 渲染已上传项目状态
  return (
    <div className="space-y-6">
      {/* 错误/成功提示 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => setError("")}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="py-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </CardContent>
        </Card>
      )}

      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {tempProject.title}
          </h1>
          <p className="text-gray-500 mt-2 flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
              未命名
            </span>
            <span>|</span>
            <span>{tempProject.chapters[0]?.paragraphs.length || 0} 个段落</span>
            <span>|</span>
            <span>约 {Math.floor(tempProject.content.length / 2)} 字</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleDeleteProject}
            className="text-red-600 hover:text-red-700"
          >
            <X className="mr-2 h-4 w-4" />
            删除
          </Button>
          <Button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save className="mr-2 h-4 w-4" />
            保存项目
          </Button>
        </div>
      </div>

      {/* 项目内容预览 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            书稿内容
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <p className="text-gray-700 whitespace-pre-wrap">
              {tempProject.content}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <span>
              共 {tempProject.chapters[0]?.paragraphs.length || 0} 个段落
            </span>
            <Button
              variant="link"
              onClick={() => {
                localStorage.removeItem("tempProject")
                setTempProject(null)
              }}
            >
              上传新书稿
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 下一步操作 */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="py-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">
              生成插图
            </h3>
            <p className="text-purple-700 mb-4">
              设置插图风格并为选定的段落生成 AI 插图
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => router.push("/projects/new")}
            >
              继续配置插图风格
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 登录/注册对话框 */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>登录或注册</DialogTitle>
            <DialogDescription>
              登录后即可保存您的项目到云端
            </DialogDescription>
          </DialogHeader>

          {/* 登录表单 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">邮箱</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="输入邮箱"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">密码</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="输入密码"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="flex flex-col gap-2">
            <Button
              className="w-full"
              onClick={handleLogin}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  登录
                </>
              )}
            </Button>

            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">或者</span>
              </div>
            </div>

            {/* 注册表单 */}
            <div className="space-y-4 pt-2 w-full">
              <div className="space-y-2">
                <Label htmlFor="register-name">用户名</Label>
                <Input
                  id="register-name"
                  placeholder="设置用户名"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">邮箱</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="设置邮箱"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">密码</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="设置密码（至少6位）"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleRegister}
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    注册中...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    注册新账户
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 保存确认对话框 */}
      <Dialog open={showSaveDialog && !showLoginDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>保存项目</DialogTitle>
            <DialogDescription>
              登录或注册以保存您的项目到云端，避免数据丢失
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              暂不登录，继续编辑
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setShowLoginDialog(true)}
            >
              <LogIn className="mr-2 h-4 w-4" />
              登录/注册
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
