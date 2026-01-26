/**
 * Groq API 客户端
 * 用于调用 Groq LLM 进行文本分析
 */

import type { Language } from "./i18n"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

// Groq 模型列表（按速度排序）
const GROQ_MODELS = [
  "llama-3.3-70b-versatile", // 快速且功能强大
  "llama-3.1-8b-instant",    // 更小更快
  "mixtral-8x7b-32768",      // 混合专家模型
]

export interface ChapterAnalysisResult {
  chapters: {
    title: string
    content: string
    summary: string
  }[]
}

export interface GroqConfig {
  apiKey?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

/**
 * 获取 Groq API Key
 */
function getApiKey(): string {
  const key = process.env.GROQ_API_KEY
  if (!key) {
    throw new Error("GROQ_API_KEY environment variable is not set")
  }
  return key
}

/**
 * 构建系统提示词
 */
function buildSystemPrompt(language: Language): string {
  const languageName: Record<Language, string> = {
    en: "English",
    fr: "French",
    de: "German",
    es: "Spanish",
    ja: "Japanese",
    ko: "Korean",
    "zh-CN": "Simplified Chinese",
    "zh-TW": "Traditional Chinese",
  }

  return `You are an expert at analyzing text and organizing it into logical chapters/sections.

Your task is to analyze the given text and divide it into appropriate chapters based on:
1. Natural topic breaks
2. Narrative flow
3. Logical section divisions
4. Meaningful grouping of content

Output requirements:
- Each chapter should have a clear, concise title
- Chapter content should be complete and meaningful
- Use ${languageName[language]} for titles and descriptions
- Return result as valid JSON`
}

/**
 * 构建用户提示词
 */
function buildUserPrompt(text: string, language: Language): string {
  return `Please analyze the following text and divide it into chapters.

Text:
${text.slice(0, 20000)}${text.length > 20000 ? "...[truncated]" : ""}

Return JSON format:
{
  "chapters": [
    {
      "title": "Chapter Title",
      "content": "Complete chapter content",
      "summary": "Brief summary of the chapter"
    }
  ]
}

Number of chapters should be appropriate for the text length (typically 3-10 chapters for moderate-length documents).`
}

/**
 * 调用 Groq API 进行文本分析
 */
export async function analyzeWithGroq(
  text: string,
  language: Language,
  config?: GroqConfig
): Promise<ChapterAnalysisResult> {
  const apiKey = getApiKey()
  const model = config?.model || GROQ_MODELS[0]
  const maxTokens = config?.maxTokens || 4096
  const temperature = config?.temperature || 0.3

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(language),
          },
          {
            role: "user",
            content: buildUserPrompt(text, language),
          },
        ],
        max_tokens: maxTokens,
        temperature,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || "Groq API request failed")
    }

    const data = await response.json()

    // 解析响应
    const content = data.choices?.[0]?.message?.content
    if (!content) {
      throw new Error("No content in response")
    }

    const result = JSON.parse(content) as ChapterAnalysisResult

    // 验证结果
    if (!result.chapters || !Array.isArray(result.chapters)) {
      throw new Error("Invalid response format")
    }

    return result
  } catch (error) {
    console.error("Groq API error:", error)
    throw error
  }
}

/**
 * 流式调用 Groq API（备用方案）
 */
export async function analyzeWithGroqStream(
  text: string,
  language: Language,
  onChunk: (chunk: string) => void,
  config?: GroqConfig
): Promise<ChapterAnalysisResult> {
  // 由于 Groq API 不支持流式响应返回 JSON，
  // 这里先调用 API，然后返回结果
  const result = await analyzeWithGroq(text, language, config)
  return result
}

/**
 * 估算分析时间
 */
export function estimateAnalysisTime(textLength: number): number {
  // 粗略估算：每 1000 个字符需要 1-2 秒
  const baseTime = Math.ceil(textLength / 1000) * 1.5
  return Math.min(baseTime, 60) // 最多 60 秒
}
