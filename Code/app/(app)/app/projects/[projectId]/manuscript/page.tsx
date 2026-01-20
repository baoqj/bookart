"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText } from "lucide-react"

export default function ManuscriptPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/app/projects" className="hover:text-foreground">
          项目
        </Link>
        <span>/</span>
        <Link href={`/app/projects/${params.projectId}`} className="hover:text-foreground">
          项目详情
        </Link>
        <span>/</span>
        <span className="text-foreground">书稿管理</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/app/projects/${params.projectId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            书稿管理
          </h1>
          <p className="text-muted-foreground mt-2">
            上传和编辑您的书稿内容
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-6 mb-4">
            <FileText className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="mb-2">此功能正在开发中</CardTitle>
          <CardDescription className="text-center max-w-md">
            书稿管理功能即将推出。您将能够上传文档、编辑章节、标注插图位置等。
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
