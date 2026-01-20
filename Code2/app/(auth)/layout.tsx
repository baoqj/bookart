import type React from "react"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container flex h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="font-semibold text-lg">Bookart AI</span>
          </Link>
        </div>
      </header>
      <div className="flex-1 flex items-center justify-center p-4">{children}</div>
    </div>
  )
}
