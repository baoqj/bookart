"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Star,
  History,
  Wallet,
  Sparkles,
  ChevronRight,
  Check,
  ArrowRight,
  Lightbulb
} from "lucide-react"
import { useAuthStore } from "@/lib/store"
import { useI18n } from "@/lib/i18n"

// 模拟积分使用数据
const mockTransactions = [
  {
    id: 1,
    action: "Magical Forest Cover",
    credits: -50,
    date: "Oct 12, 2023",
    status: "COMPLETED",
    icon: "auto_fix_high",
    iconColor: "bg-purple-100 text-purple-500"
  },
  {
    id: 2,
    action: "HD Upscale (2k)",
    credits: -10,
    date: "Oct 11, 2023",
    status: "COMPLETED",
    icon: "zoom_in",
    iconColor: "bg-blue-100 text-blue-500"
  },
  {
    id: 3,
    action: "Monthly Plus Refill",
    credits: +1000,
    date: "Oct 01, 2023",
    status: "REFILLED",
    icon: "wallet",
    iconColor: "bg-amber-100 text-amber-500"
  }
]

interface Feature {
  text: string
  included: boolean
  highlight?: boolean
}

interface PricingPlan {
  name: string
  price: number
  period: string
  description: string
  credits: string
  features: Feature[]
  current: boolean
  popular?: boolean
  color: string
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Sprout",
    price: 0,
    period: "/mo",
    description: "For curious explorers and hobbyists.",
    credits: "50",
    features: [
      { text: "50 Credits every month", included: true },
      { text: "Standard Image Resolution", included: true },
      { text: "Watermarked Images", included: false }
    ],
    current: true,
    color: "bg-emerald-100"
  },
  {
    name: "Storyteller",
    price: 29,
    period: "/mo",
    description: "Perfect for indie authors publishing books.",
    credits: "1,000",
    features: [
      { text: "1,000 Credits monthly", included: true, highlight: true },
      { text: "Ultra-HD Resolution", included: true },
      { text: "No Watermarks", included: true },
      { text: "Commercial Rights", included: true }
    ],
    current: false,
    popular: true,
    color: "bg-orange-100"
  },
  {
    name: "Publishing House",
    price: 89,
    period: "/mo",
    description: "Enterprise scale for pro creators.",
    credits: "5,000",
    features: [
      { text: "5,000 Credits monthly", included: true },
      { text: "Priority Queue Access", included: true },
      { text: "API Integration", included: true }
    ],
    current: false,
    color: "bg-rose-100"
  }
]

export default function CreditsPage() {
  const { t } = useI18n()
  const { user } = useAuthStore()
  const [currentPlan, setCurrentPlan] = useState("Storyteller")

  const totalCredits = 450
  const monthlyGoal = 1000
  const creditProgress = (totalCredits / monthlyGoal) * 100

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* 页面标题 */}
      <div className="bg-white/80 backdrop-blur-md border-b border-orange-100 px-6 md:px-10 py-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
                {t("creativeEnergy")}
              </h1>
              <p className="text-gray-500 text-lg mt-2">
                {t("keepStorytelling")}
              </p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-200 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              {t("getExtraCredits")}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 积分使用概览 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* 环形进度图 */}
          <Card className="lg:col-span-4 bg-white rounded-2xl border border-orange-50 shadow-lg shadow-orange-100/50">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Star className="h-5 w-5 text-teal-500" />
                {t("creditUsage")}
              </h2>

              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle
                    className="text-orange-50"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="85"
                    stroke="currentColor"
                    strokeWidth="16"
                  />
                  <circle
                    className="text-teal-500"
                    cx="96"
                    cy="96"
                    fill="transparent"
                    r="85"
                    stroke="currentColor"
                    strokeWidth="16"
                    strokeDasharray="534"
                    strokeDashoffset={534 - (534 * creditProgress) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-gray-800">{totalCredits}</span>
                  <span className="text-sm text-gray-400 font-bold uppercase tracking-wider">{t("leftToUse")}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-teal-50 p-4 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-teal-600 mb-1">{t("monthlyGoal")}</p>
                  <p className="text-2xl font-bold text-teal-600">{monthlyGoal.toLocaleString()}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-amber-600 mb-1">{t("resetsIn")}</p>
                  <p className="text-2xl font-bold text-amber-600">12 {t("days")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 交易历史 */}
          <Card className="lg:col-span-8 bg-white rounded-2xl border border-orange-50 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-orange-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <History className="h-5 w-5 text-orange-500" />
                {t("recentActivity")}
              </h2>
              <Button variant="ghost" className="text-orange-500 text-sm font-bold flex items-center gap-1 hover:bg-orange-50">
                {t("fullStatement")} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-orange-50/30">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("action")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">{t("credits")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("date")}</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">{t("status")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-orange-50/20 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${tx.iconColor}`}>
                            <Wallet className="h-4 w-4" />
                          </div>
                          <span className="font-bold text-gray-700">{tx.action}</span>
                        </div>
                      </td>
                      <td className={`px-6 py-5 text-right font-bold ${tx.credits > 0 ? "text-emerald-500" : "text-rose-400"}`}>
                        {tx.credits > 0 ? "+" : ""}{tx.credits}
                      </td>
                      <td className="px-6 py-5 text-gray-500 font-medium">{tx.date}</td>
                      <td className="px-6 py-5">
                        <Badge className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          tx.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-amber-100 text-amber-600"
                        }`}>
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* 定价计划 */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">{t("pickYourAdventure")}</h2>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">
              {t("pricingSubtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col p-8 rounded-2xl transition-all duration-300 ${
                  plan.popular
                    ? "bg-white border-4 border-orange-400 shadow-2xl shadow-orange-200 scale-105 z-10"
                    : "bg-white border border-orange-50 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[12px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">
                    {t("bestValue")}
                  </div>
                )}

                <div className="mb-8 text-center">
                  <div className={`w-20 h-20 ${plan.color} rounded-full flex items-center justify-center mx-auto mb-6 ${
                    plan.popular ? "text-orange-500" : "text-gray-500"
                  }`}>
                    <Star className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 my-4">
                    <span className="text-5xl font-black text-gray-800">${plan.price}</span>
                    <span className="text-gray-400 font-bold">{plan.period}</span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-semibold">
                      <Check className={`h-5 w-5 flex-shrink-0 ${
                        feature.included
                          ? feature.highlight
                            ? "text-orange-500"
                            : "text-emerald-400"
                          : "text-gray-300"
                      }`} />
                      <span className={feature.included ? "text-gray-600" : "text-gray-400"}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full py-4 rounded-xl font-bold text-sm ${
                    plan.current
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : plan.popular
                        ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200"
                        : "bg-gray-800 hover:bg-gray-900 text-white"
                  }`}
                  disabled={plan.current}
                >
                  {plan.current
                    ? t("currentActivePlan")
                    : plan.popular
                      ? t("upgradeToPlus")
                      : t("goPro")
                  }
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* 提示卡片 */}
        <Card className="bg-teal-50 border-2 border-teal-100 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-teal-100/50">
          <div className="flex items-center gap-5">
            <div className="size-14 bg-white rounded-full flex items-center justify-center shadow-md">
              <Lightbulb className="h-7 w-7 text-teal-500" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{t("didYouKnow")}</h4>
              <p className="text-sm text-gray-500 font-medium">
                {t("creditRollover")}
              </p>
            </div>
          </div>
          <Button variant="outline" className="px-6 py-3 bg-white text-teal-600 font-bold text-sm rounded-xl border-2 border-teal-200 hover:bg-teal-50 whitespace-nowrap">
            {t("howCreditsWork")}
          </Button>
        </Card>
      </div>
    </div>
  )
}
