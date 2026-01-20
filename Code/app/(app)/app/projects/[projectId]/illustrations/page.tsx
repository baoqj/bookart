"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Image } from "lucide-react"

export default function IllustrationsPage({ params }: { params: { projectId: string } }) {
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
        <span className="text-foreground">插图生成</span>
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
            插图生成
          </h1>
          <p className="text-muted-foreground mt-2">
            使用 AI 生成书籍插图
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-pink-100 dark:bg-pink-900 p-6 mb-4">
            <Image className="h-12 w-12 text-pink-600 dark:text-pink-400" />
          </div>
          <CardTitle className="mb-2">此功能正在开发中</CardTitle>
          <CardDescription className="text-center max-w-md">
            插图生成功能即将推出。您将能够选择风格、设置参数、批量生成插图、编辑和导出等。
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
