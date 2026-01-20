"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Coins } from "lucide-react"

export default function CreditsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          积分管理
        </h1>
        <p className="text-muted-foreground mt-2">
          查看积分余额和购买记录
        </p>
      </div>

      {/* Placeholder */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-6 mb-4">
            <Coins className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle className="mb-2">此功能正在开发中</CardTitle>
          <CardDescription className="text-center max-w-md mb-6">
            积分管理功能即将推出。您将能够查看积分余额、购买积分套餐、查看消费记录等。
          </CardDescription>
          <Button disabled>购买积分</Button>
        </CardContent>
      </Card>
    </div>
  )
}
