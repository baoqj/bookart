"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LanguageSelector } from "@/components/language-selector"
import { BookOpen, LogIn } from "lucide-react"
import { useAuthStore } from "@/lib/store"

export function AppHeader() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-gray-900">BookArt</span>
        </Link>

        {/* Right: Language Selector + Login Button */}
        <div className="flex items-center gap-4">
          <LanguageSelector />
          <Button
            onClick={() => router.push("/auth/sign-in")}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <LogIn className="h-4 w-4" />
            <span>登录</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
