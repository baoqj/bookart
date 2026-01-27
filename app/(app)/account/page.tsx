"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  User,
  Settings,
  Palette,
  Bell,
  CreditCard,
  Key,
  Plus,
  Check
} from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { useAuthStore } from "@/lib/store"

type SettingsTab = "profile" | "preferences" | "generation" | "notifications" | "billing"

const stylePresets = [
  { id: "watercolor", name: "Watercolor", icon: "palette", color: "bg-blue-100 text-blue-500" },
  { id: "fable", name: "Fable Story", icon: "castle", color: "bg-amber-100 text-amber-500" },
  { id: "vibrant", name: "Vibrant Art", icon: "sparkles", color: "bg-emerald-100 text-emerald-500" },
  { id: "sketch", name: "Pencil Draft", icon: "edit_note", color: "bg-slate-100 text-slate-500" }
]

const aspectRatios = [
  { ratio: "2:3", label: "Portrait", active: true },
  { ratio: "1:1", label: "Square", active: false },
  { ratio: "16:9", label: "Landscape", active: false }
]

const projectCategories = [
  { category: "Fantasy Adventure", theme: "Magical creatures, soft glow, epic vistas" },
  { category: "Bedtime Stories", theme: "Pastel palette, calming atmosphere, high texture" }
]

export default function AccountPage() {
  const { t } = useI18n()
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<SettingsTab>("preferences")
  const [selectedStyle, setSelectedStyle] = useState("watercolor")
  const [selectedAspect, setSelectedAspect] = useState("2:3")

  // 使用固定标签避免类型错误
  const labels = {
    profile: "Profile",
    preferences: "Preferences",
    generation: "Generation Defaults",
    notifications: "Notifications",
    billing: "Billing & Plans",
    systemSettings: "System Settings",
    settingsSubtitle: "Customize your creative environment and profile.",
    settings: "Settings",
    settingsDesc: "Manage your account preferences and creative defaults.",
    personalInfo: "Personal Information",
    updateAccountDetails: "Update your account details and security.",
    fullName: "Full Name",
    enterYourName: "Enter your name",
    emailAddress: "Email Address",
    saveChanges: "Save Changes",
    changePassword: "Change Password",
    creativeEngine: "Creative Engine",
    setBaselineDefaults: "Set the baseline for your storybook generations.",
    defaultStyle: "Default Generation Style",
    defaultAspectRatio: "Default Canvas Aspect Ratio",
    projectPresets: "Project Presets",
    autoApplyLogic: "Auto-apply specific logic for book categories.",
    addCategory: "Add Category",
    category: "Category",
    coreTheme: "Core Theme",
    notificationPreferences: "Notification Preferences",
    manageNotifications: "Choose how you want to be notified.",
    generationComplete: "Generation Complete",
    generationCompleteDesc: "Get notified when your illustrations are ready",
    creditAlerts: "Credit Alerts",
    creditAlertsDesc: "Low balance and refill reminders",
    projectUpdates: "Project Updates",
    projectUpdatesDesc: "Updates about your book projects",
    marketingEmails: "Marketing Emails",
    marketingEmailsDesc: "Tips, tricks, and special offers",
    billingInfo: "Billing Information",
    manageSubscription: "Manage your subscription and payment methods.",
    storytellerPlan: "Storyteller Plan",
    active: "Active",
    changePlan: "Change Plan",
    manageAccount: "Manage Your Account",
    deactivationWarning: "Deactivation will remove all access to saved assets.",
    deactivate: "Deactivate",
    saveAllPreferences: "Save All Preferences",
  }

  const tabs = [
    { id: "profile" as const, label: labels.profile, icon: User },
    { id: "preferences" as const, label: labels.preferences, icon: Settings },
    { id: "generation" as const, label: labels.generation, icon: Palette },
    { id: "notifications" as const, label: labels.notifications, icon: Bell },
    { id: "billing" as const, label: labels.billing, icon: CreditCard }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面标题 */}
      <div className="bg-white border-b border-gray-100 px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {labels.systemSettings}
          </h1>
          <p className="text-gray-500 font-medium">
            {labels.settingsSubtitle}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* 左侧导航 */}
          <aside className="w-full lg:w-72 flex flex-col gap-8">
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{labels.settings}</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                {labels.settingsDesc}
              </p>
            </div>

            <nav className="flex flex-col gap-2 p-1 bg-gray-100/50 rounded-2xl">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                    activeTab === tab.id
                      ? "bg-white shadow-sm text-purple-600 ring-1 ring-gray-200"
                      : "text-gray-600 hover:bg-white/60"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="text-sm">{tab.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* 右侧内容区 */}
          <main className="flex-1 max-w-4xl">
            {/* 个人资料 */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                <section>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">{labels.personalInfo}</h3>
                    <p className="text-gray-500 mt-1 font-medium">{labels.updateAccountDetails}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider ml-1">
                        {labels.fullName}
                      </label>
                      <Input
                        placeholder={labels.enterYourName}
                        defaultValue={user?.name || "Sarah Jenkins"}
                        className="rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider ml-1">
                        {labels.emailAddress}
                      </label>
                      <Input
                        placeholder="name@domain.com"
                        type="email"
                        defaultValue={user?.email || "author.jane@example.com"}
                        className="rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-xl">
                      {labels.saveChanges}
                    </Button>
                    <Button variant="outline" className="text-purple-600 font-bold px-4 py-2 rounded-xl border-purple-200 hover:bg-purple-50 flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      {labels.changePassword}
                    </Button>
                  </div>
                </section>
              </div>
            )}

            {/* 偏好设置 */}
            {activeTab === "preferences" && (
              <div className="space-y-8">
                <section>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">{labels.creativeEngine}</h3>
                    <p className="text-gray-500 mt-1 font-medium">{labels.setBaselineDefaults}</p>
                  </div>

                  {/* 默认风格 */}
                  <div className="space-y-4">
                    <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider ml-1">
                      {labels.defaultStyle}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {stylePresets.map((style) => (
                        <button
                          key={style.id}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`relative p-4 border-2 rounded-xl transition-all ${
                            selectedStyle === style.id
                              ? "border-purple-500 bg-purple-50 ring-1 ring-purple-500"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-full ${style.color} flex items-center justify-center mx-auto mb-3`}>
                            <Palette className="h-6 w-6" />
                          </div>
                          <span className="text-xs font-bold text-gray-700 block text-center">{style.name}</span>
                          {selectedStyle === style.id && (
                            <div className="absolute top-2 right-2">
                              <Check className="h-4 w-4 text-purple-500" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 默认画幅 */}
                  <div className="space-y-4 mt-8">
                    <label className="text-[13px] font-bold text-gray-700 uppercase tracking-wider ml-1">
                      {labels.defaultAspectRatio}
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {aspectRatios.map((ratio) => (
                        <button
                          key={ratio.ratio}
                          onClick={() => setSelectedAspect(ratio.ratio)}
                          className={`px-6 py-3 rounded-xl border-2 font-bold text-sm flex items-center gap-3 transition-all ${
                            selectedAspect === ratio.ratio
                              ? "border-purple-500 bg-purple-50 text-purple-600"
                              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                          }`}
                        >
                          <div className={`w-3 h-4 bg-current rounded-[1px] ${ratio.ratio === "1:1" ? "w-4 h-4" : ""} ${ratio.ratio === "16:9" ? "w-5 h-3" : ""}`} />
                          {ratio.ratio} {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* 生成默认 */}
            {activeTab === "generation" && (
              <div className="space-y-8">
                <section>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{labels.projectPresets}</h3>
                      <p className="text-gray-500 mt-1 font-medium">{labels.autoApplyLogic}</p>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      {labels.addCategory}
                    </Button>
                  </div>

                  <Card className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider">{labels.category}</th>
                          <th className="px-6 py-4 text-[13px] font-bold text-gray-500 uppercase tracking-wider">{labels.coreTheme}</th>
                          <th className="px-6 py-4 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {projectCategories.map((cat, idx) => (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-5">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                idx === 0 ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200" : "bg-purple-50 text-purple-600 ring-1 ring-purple-200"
                              }`}>
                                {cat.category}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-sm font-medium text-gray-600">{cat.theme}</td>
                            <td className="px-6 py-5 text-right">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-purple-600">
                                <Settings className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Card>
                </section>
              </div>
            )}

            {/* 通知设置 */}
            {activeTab === "notifications" && (
              <div className="space-y-8">
                <section>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">{labels.notificationPreferences}</h3>
                    <p className="text-gray-500 mt-1 font-medium">{labels.manageNotifications}</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { label: labels.generationComplete, desc: labels.generationCompleteDesc },
                      { label: labels.creditAlerts, desc: labels.creditAlertsDesc },
                      { label: labels.projectUpdates, desc: labels.projectUpdatesDesc },
                      { label: labels.marketingEmails, desc: labels.marketingEmailsDesc }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div>
                          <p className="font-bold text-gray-800">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked={idx < 3} className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* 账单和计划 */}
            {activeTab === "billing" && (
              <div className="space-y-8">
                <section>
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-gray-900">{labels.billingInfo}</h3>
                    <p className="text-gray-500 mt-1 font-medium">{labels.manageSubscription}</p>
                  </div>

                  <Card className="p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-orange-500" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{labels.storytellerPlan}</p>
                          <p className="text-sm text-gray-500">$29/month • {labels.active}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="rounded-xl">{labels.changePlan}</Button>
                    </div>
                  </Card>
                </section>
              </div>
            )}

            {/* 底部保存区域 */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-100">
              <div className="flex flex-col">
                <h4 className="text-sm font-bold text-gray-900">{labels.manageAccount}</h4>
                <p className="text-xs text-gray-500 font-medium">{labels.deactivationWarning}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" className="text-gray-400 hover:text-red-500 font-bold text-sm">
                  {labels.deactivate}
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-200">
                  {labels.saveAllPreferences}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
