import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n"
import { AppHeader } from "@/components/app-header"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "BookArt - AI 书籍插图生成器",
  description: "使用 AI 为您的书稿生成精美插图",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <I18nProvider>
          <AppHeader />
          <main className="min-h-[calc(100vh-64px)]">{children}</main>
          <Toaster position="top-center" richColors />
        </I18nProvider>
      </body>
    </html>
  )
}
