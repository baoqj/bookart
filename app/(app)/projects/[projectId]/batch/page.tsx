"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n"
import { batchJobsApi, chaptersApi, scenesApi, projectsApi } from "@/lib/api"
import type { BatchJob, Chapter, Scene, Project } from "@/lib/types"
import { toast } from "sonner"

type Step = "split_chapters" | "split_scenes" | "gen_prompts" | "gen_images"

const steps: { key: Step; label: string; description: string }[] = [
  {
    key: "split_chapters",
    label: "切分章节",
    description: "将书稿内容切分为章节"
  },
  {
    key: "split_scenes",
    label: "切分场景",
    description: "将每个章节切分为场景"
  },
  {
    key: "gen_prompts",
    label: "生成 Prompt",
    description: "为每个场景生成图像提示词"
  },
  {
    key: "gen_images",
    label: "生成图片",
    description: "批量生成所有场景的插图"
  }
]

export default function BatchPage() {
  const { t } = useI18n()
  const params = useParams()
  const projectId = params.projectId as string

  const [project, setProject] = useState<Project | null>(null)
  const [jobs, setJobs] = useState<BatchJob[]>([])
  const [currentJob, setCurrentJob] = useState<BatchJob | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedSteps, setSelectedSteps] = useState<Step[]>([
    "split_chapters",
    "split_scenes",
    "gen_prompts",
    "gen_images"
  ])
  const [imagesPerScene, setImagesPerScene] = useState(1)

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [projectData, jobsData] = await Promise.all([
          projectsApi.get(projectId),
          batchJobsApi.getByProject(projectId)
        ])
        setProject(projectData)
        setJobs(jobsData)
        if (jobsData.length > 0 && jobsData[0].status === "running") {
          setCurrentJob(jobsData[0])
          pollJobStatus(jobsData[0].id)
        }
      } catch (error) {
        console.error("Failed to load data:", error)
        toast.error("加载数据失败")
      } finally {
        setLoading(false)
      }
    }
    loadData()

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      if (currentJob?.status === "running") {
        pollJobStatus(currentJob.id)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [projectId, currentJob?.id])

  const pollJobStatus = async (jobId: string) => {
    try {
      const job = await batchJobsApi.get(jobId)
      if (job) {
        setCurrentJob(job)
        setJobs(prev => prev.map(j => j.id === jobId ? job : j))

        if (job.status !== "running") {
          toast.success(job.status === "succeeded" ? "批处理完成" : "批处理失败")
        }
      }
    } catch (error) {
      console.error("Failed to poll job status:", error)
    }
  }

  const toggleStep = (step: Step) => {
    setSelectedSteps(prev => {
      if (prev.includes(step)) {
        if (prev.length > 1) {
          return prev.filter(s => s !== step)
        }
        return prev
      }
      return [...prev, step]
    })
  }

  const handleStartBatch = async () => {
    if (!project) return

    try {
      setDialogOpen(false)
      toast.info("正在启动批处理...")

      const job = await batchJobsApi.startFullBookProcess(projectId, project.userId, {
        imagesPerScene
      })

      setCurrentJob(job)
      setJobs(prev => [job, ...prev])
      toast.success("批处理已启动")

      // Start polling
      pollJobStatus(job.id)
    } catch (error) {
      console.error("Failed to start batch:", error)
      toast.error("启动失败")
    }
  }

  const handleCancelJob = async (jobId: string) => {
    try {
      await batchJobsApi.cancel(jobId)
      toast.info("已取消批处理")

      setJobs(prev => prev.map(j =>
        j.id === jobId ? { ...j, status: "canceled" as const } : j
      ))
      if (currentJob?.id === jobId) {
        setCurrentJob(prev => prev ? { ...prev, status: "canceled" } : null)
      }
    } catch (error) {
      console.error("Failed to cancel job:", error)
      toast.error("取消失败")
    }
  }

  const handleRetryJob = async (job: BatchJob) => {
    try {
      toast.info("正在重新启动...")

      const newJob = await batchJobsApi.startFullBookProcess(projectId, project!.userId, {
        imagesPerScene
      })

      setJobs(prev => [newJob, ...prev])
      setCurrentJob(newJob)
      toast.success("已重新启动")
    } catch (error) {
      console.error("Failed to retry job:", error)
      toast.error("重试失败")
    }
  }

  const getStatusIcon = (status: BatchJob["status"]) => {
    switch (status) {
      case "queued":
        return <Circle className="w-5 h-5 text-slate-400" />
      case "running":
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
      case "succeeded":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "canceled":
        return <Pause className="w-5 h-5 text-slate-400" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/projects/${projectId}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">加载中...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/projects/${projectId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8" />
            批量处理
          </h1>
          <p className="text-muted-foreground mt-1">
            一键完成全书插画生成
          </p>
        </div>
        {(!currentJob || currentJob.status !== "running") && (
          <Button onClick={() => setDialogOpen(true)}>
            <Play className="w-4 h-4 mr-2" />
            启动批处理
          </Button>
        )}
      </div>

      {/* Current Job Progress */}
      {currentJob && currentJob.status === "running" && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              正在处理中...
              <Badge variant="secondary">{currentJob.progress}%</Badge>
            </CardTitle>
            <CardDescription>
              {currentJob.currentStep || "准备中..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={currentJob.progress} className="mb-4" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCancelJob(currentJob.id)}
            >
              <Pause className="w-4 h-4 mr-2" />
              取消
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Job History */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">处理历史</h2>

        {jobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Sparkles className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-muted-foreground">暂无批处理记录</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <div className="flex items-center gap-4 p-4">
                  {getStatusIcon(job.status)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {job.type === "full_book" ? "全书批处理" : "批处理任务"}
                      </span>
                      <Badge
                        variant={
                          job.status === "succeeded" ? "default" :
                          job.status === "failed" ? "destructive" :
                          "secondary"
                        }
                      >
                        {job.status === "queued" && "排队中"}
                        {job.status === "running" && "处理中"}
                        {job.status === "succeeded" && "完成"}
                        {job.status === "failed" && "失败"}
                        {job.status === "canceled" && "已取消"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(job.createdAt).toLocaleString()}
                      {job.status === "running" && ` · ${job.progress}%`}
                      {job.errorMessage && (
                        <span className="text-red-500"> · {job.errorMessage}</span>
                      )}
                    </p>
                  </div>

                  {job.status === "running" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancelJob(job.id)}
                    >
                      取消
                    </Button>
                  )}

                  {job.status === "failed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRetryJob(job)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      重试
                    </Button>
                  )}
                </div>

                {job.status === "running" && (
                  <div className="px-4 pb-4">
                    <Progress value={job.progress} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Start Batch Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-[500px]">
          <DialogHeader>
            <DialogTitle>启动批处理</DialogTitle>
            <DialogDescription>
              选择要执行的步骤，系统将自动处理整个流程
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Steps Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">执行步骤</Label>
              <div className="space-y-2">
                {steps.map((step, index) => (
                  <div
                    key={step.key}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSteps.includes(step.key)
                        ? "bg-primary/5 border-primary"
                        : "hover:bg-slate-50"
                    }`}
                    onClick={() => toggleStep(step.key)}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedSteps.includes(step.key)
                        ? "bg-primary text-primary-foreground"
                        : "bg-slate-200"
                    }`}>
                      {selectedSteps.includes(step.key) && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{step.label}</span>
                        {index < steps.length - 1 && (
                          <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Images per scene */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">每场景生成图片数</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <Button
                    key={num}
                    variant={imagesPerScene === num ? "default" : "outline"}
                    size="sm"
                    onClick={() => setImagesPerScene(num)}
                  >
                    {num} 张
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleStartBatch}>
              <Play className="w-4 h-4 mr-2" />
              开始执行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={`text-sm font-medium ${className || ""}`}>{children}</label>
}
