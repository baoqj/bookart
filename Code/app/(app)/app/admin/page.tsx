"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          管理员面板
        </h1>
        <p className="text-muted-foreground mt-2">
          系统管理和统计信息
        </p>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-red-100 dark:bg-red-900 p-6 mb-4">
            <Settings className="h-12 w-12 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="mb-2">此功能正在开发中</CardTitle>
          <CardDescription className="text-center max-w-md">
            管理员功能即将推出。您将能够查看用户统计、管理用户、查看系统日志等。
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
