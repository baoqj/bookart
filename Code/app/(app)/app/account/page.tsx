"use client"

import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { User } from "lucide-react"

export default function AccountPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          账户设置
        </h1>
        <p className="text-muted-foreground mt-2">
          管理您的个人信息和偏好设置
        </p>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-6 mb-4">
            <User className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="mb-2">此功能正在开发中</CardTitle>
          <CardDescription className="text-center max-w-md">
            账户设置功能即将推出。您将能够修改个人信息、更改密码、设置通知偏好等。
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  )
}
