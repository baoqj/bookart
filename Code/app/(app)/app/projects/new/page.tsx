"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText } from "lucide-react"

export default function NewProjectPage() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/app/projects" className="hover:text-foreground">
          项目
        </Link>
        <span>/</span>
        <span className="text-foreground">创建项目</span>
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
            创建新项目
          </h1>
          <p className="text-muted-foreground mt-2">
            开始创建您的书籍插图项目
          </p>
        </div>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-6 mb-4">
            <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="mb-2">此功能正在开发中</CardTitle>
          <CardDescription className="text-center max-w-md">
            项目创建表单即将推出。您将能够上传书稿、设置项目参数、选择插图风格等。
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
