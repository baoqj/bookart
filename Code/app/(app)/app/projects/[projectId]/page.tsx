"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, BookOpen } from "lucide-react"

export default function ProjectDetailPage({ params }: { params: { projectId: string } }) {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/app/projects" className="hover:text-foreground">
          项目
        </Link>
        <span>/</span>
        <span className="text-foreground">项目详情</span>
      </div>

      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/app/projects">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            项目详情
          </h1>
          <p className="text-muted-foreground mt-2">
            项目 ID: {params.projectId}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link href={`/app/projects/${params.projectId}/manuscript`}>
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                书稿管理
              </CardTitle>
              <CardDescription>
                上传和管理您的书稿文件
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href={`/app/projects/${params.projectId}/illustrations`}>
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                插图生成
              </CardTitle>
              <CardDescription>
                生成和管理书籍插图
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-6 mb-4">
            <BookOpen className="h-12 w-12 text-purple-600 dark:text-purple-400" />
          </div>
          <CardTitle className="mb-2">此功能正在开发中</CardTitle>
          <CardDescription className="text-center max-w-md">
            项目详情页面即将推出。您将能够查看项目概览、进度统计、最近活动等信息。
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
