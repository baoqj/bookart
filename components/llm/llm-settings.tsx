"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Key,
  Globe,
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  TestTube,
  Save,
  Trash2,
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { llmSettingsApi } from "@/lib/api"
import {
  LLM_MODELS,
  DEFAULT_LLM_SETTINGS,
  LlmProvider,
  LlmSettings
} from "@/lib/types"
import { toast } from "sonner"

interface LlmSettingsFormProps {
  userId: string
}

const providerInfo = {
  openai: {
    name: "OpenAI",
    description: "GPT-4o, GPT-4o-mini 等模型",
    icon: "🤖",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200"
  },
  anthropic: {
    name: "Anthropic",
    description: "Claude 3.5, Claude 3 等模型",
    icon: "🧠",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200"
  },
  groq: {
    name: "Groq",
    description: "Llama 3, Mixtral 等高速模型",
    icon: "⚡",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200"
  },
  custom: {
    name: "自定义 API",
    description: "支持任意兼容的 OpenAI 格式 API",
    icon: "🔧",
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200"
  }
}

export function LlmSettingsForm({ userId }: LlmSettingsFormProps) {
  const [settings, setSettings] = useState<LlmSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Form state
  const [provider, setProvider] = useState<LlmProvider>("openai")
  const [apiUrl, setApiUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [model, setModel] = useState("")
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(4096)
  const [enabledFeatures, setEnabledFeatures] = useState({
    characterExtraction: true,
    chapterSplit: true,
    sceneSplit: true,
    promptGeneration: true
  })

  // Load existing settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        const existing = await llmSettingsApi.get(userId)
        if (existing) {
          setSettings(existing)
          setProvider(existing.provider)
          setApiUrl(existing.apiUrl || "")
          setApiKey(existing.apiKey || "")
          setModel(existing.model || "")
          setTemperature(existing.temperature || 0.7)
          setMaxTokens(existing.maxTokens || 4096)
          setEnabledFeatures(existing.enabledFeatures)
        } else {
          // Load defaults
          const defaults = DEFAULT_LLM_SETTINGS["openai"]
          setModel(defaults.model || "")
          setTemperature(defaults.temperature || 0.7)
          setMaxTokens(defaults.maxTokens || 4096)
        }
      } catch (error) {
        console.error("Failed to load LLM settings:", error)
        toast.error("加载设置失败")
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [userId])

  // Update model when provider changes
  const handleProviderChange = (newProvider: LlmProvider) => {
    setProvider(newProvider)
    const defaults = DEFAULT_LLM_SETTINGS[newProvider]
    setModel(defaults.model || "")
  }

  // Test connection
  const handleTest = async () => {
    if (!apiKey.trim()) {
      toast.error("请输入 API Key")
      return
    }

    try {
      setTesting(true)
      const result = await llmSettingsApi.test(
        userId,
        provider,
        provider === "custom" ? apiUrl : undefined,
        apiKey,
        model
      )

      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error("Test failed:", error)
      toast.error("连接测试失败")
    } finally {
      setTesting(false)
    }
  }

  // Save settings
  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error("请输入 API Key")
      return
    }

    try {
      setSaving(true)
      await llmSettingsApi.save(userId, {
        provider,
        apiUrl: provider === "custom" ? apiUrl : undefined,
        apiKey, // In production, this should be encrypted
        model: model || undefined,
        temperature,
        maxTokens,
        enabledFeatures
      })
      toast.success("设置已保存")
    } catch (error) {
      console.error("Failed to save settings:", error)
      toast.error("保存设置失败")
    } finally {
      setSaving(false)
    }
  }

  // Reset to defaults
  const handleReset = () => {
    const defaults = DEFAULT_LLM_SETTINGS[provider]
    setModel(defaults.model || "")
    setTemperature(defaults.temperature || 0.7)
    setMaxTokens(defaults.maxTokens || 4096)
    setEnabledFeatures({
      characterExtraction: true,
      chapterSplit: true,
      sceneSplit: true,
      promptGeneration: true
    })
    toast.info("已重置为默认设置")
  }

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="py-8">
          <div className="space-y-4">
            <div className="h-10 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-200 rounded" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              LLM 模型设置
            </CardTitle>
            <CardDescription>
              配置用于文本分析的 AI 模型服务
            </CardDescription>
          </div>
          {settings?.isValid && (
            <Badge variant="default" className="bg-green-500">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              已配置
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Provider Selection */}
        <div className="space-y-3">
          <Label>选择 LLM 提供商</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(Object.keys(providerInfo) as LlmProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => handleProviderChange(p)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  provider === p
                    ? providerInfo[p].bg + " border-current"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-2xl mb-2">{providerInfo[p].icon}</div>
                <div className={`font-medium ${provider === p ? providerInfo[p].color : ""}`}>
                  {providerInfo[p].name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {providerInfo[p].description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* API Settings */}
        <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
          <h4 className="font-medium flex items-center gap-2">
            <Key className="w-4 h-4" />
            API 凭证
          </h4>

          {provider === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API 地址 *</Label>
              <Input
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/v1"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key *</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={provider === "openai" ? "sk-..." : "输入您的 API Key"}
            />
            <p className="text-xs text-muted-foreground">
              {provider === "openai" && "在 OpenAI 平台获取: https://platform.openai.com/api-keys"}
              {provider === "anthropic" && "在 Anthropic Console 获取: https://console.anthropic.com"}
              {provider === "groq" && "在 Groq Console 获取: https://console.groq.com"}
              {provider === "custom" && "提供兼容 OpenAI 格式的 API 服务地址"}
            </p>
          </div>
        </div>

        {/* Model Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              模型设置
            </h4>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              重置默认
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>模型</Label>
              <Select value={model} onValueChange={setModel}>
                <SelectTrigger>
                  <SelectValue placeholder="选择模型" />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS[provider].map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>最大 Token 数</Label>
              <Select
                value={String(maxTokens)}
                onValueChange={(v) => setMaxTokens(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2048">2,048</SelectItem>
                  <SelectItem value="4096">4,096</SelectItem>
                  <SelectItem value="8192">8,192</SelectItem>
                  <SelectItem value="16384">16,384</SelectItem>
                  <SelectItem value="32768">32,768</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <Label>Temperature (随机性)</Label>
              <span className="text-sm text-muted-foreground">{temperature}</span>
            </div>
            <Slider
              value={[temperature]}
              onValueChange={([v]) => setTemperature(v)}
              min={0}
              max={1}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>精确 (0)</span>
              <span>平衡 (0.7)</span>
              <span>创意 (1)</span>
            </div>
          </div>
        </div>

        {/* Feature Toggle */}
        <div className="space-y-4">
          <h4 className="font-medium">启用的功能</h4>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
              <div>
                <div className="font-medium text-sm">角色提取</div>
                <div className="text-xs text-muted-foreground">从文本中识别和提取角色</div>
              </div>
              <Switch
                checked={enabledFeatures.characterExtraction}
                onCheckedChange={(v) => setEnabledFeatures(prev => ({
                  ...prev,
                  characterExtraction: v
                }))}
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
              <div>
                <div className="font-medium text-sm">章节切分</div>
                <div className="text-xs text-muted-foreground">将书稿智能切分为章节</div>
              </div>
              <Switch
                checked={enabledFeatures.chapterSplit}
                onCheckedChange={(v) => setEnabledFeatures(prev => ({
                  ...prev,
                  chapterSplit: v
                }))}
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
              <div>
                <div className="font-medium text-sm">场景切分</div>
                <div className="text-xs text-muted-foreground">将章节切分为场景</div>
              </div>
              <Switch
                checked={enabledFeatures.sceneSplit}
                onCheckedChange={(v) => setEnabledFeatures(prev => ({
                  ...prev,
                  sceneSplit: v
                }))}
              />
            </label>

            <label className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer">
              <div>
                <div className="font-medium text-sm">Prompt 生成</div>
                <div className="text-xs text-muted-foreground">为场景生成图像提示词</div>
              </div>
              <Switch
                checked={enabledFeatures.promptGeneration}
                onCheckedChange={(v) => setEnabledFeatures(prev => ({
                  ...prev,
                  promptGeneration: v
                }))}
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleTest}
            disabled={testing || !apiKey.trim()}
          >
            {testing ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <TestTube className="w-4 h-4 mr-2" />
            )}
            测试连接
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !apiKey.trim()}
            className="flex-1"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            保存设置
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
