/**
 * 统一文件解析工具
 * 支持解析 PDF、DOCX、TXT、Markdown 文件并提取文本内容
 */

import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// 设置 pdfjs-dist 的 worker
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`
}

export type FileType = 'txt' | 'md' | 'pdf' | 'docx'

export interface FileParseResult {
  text: string
  fileType: FileType
  fileName: string
  fileSize: number
}

/**
 * 从文本文件读取内容
 */
export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

/**
 * 从 Markdown 文件读取内容（与 txt 相同处理）
 */
export async function readMarkdownFile(file: File): Promise<string> {
  return readTextFile(file)
}

/**
 * 从 PDF 文件提取文本内容
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise

    let fullText = ''

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()

      const pageText = textContent.items
        .map((item: any) => {
          if (item.str) {
            return item.str
          }
          return ''
        })
        .join('')

      fullText += pageText + '\n\n'
    }

    return fullText.trim()
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF')
  }
}

/**
 * 从 DOCX 文件提取文本内容
 */
export async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value
  } catch (error) {
    console.error('Error extracting text from DOCX:', error)
    throw new Error('Failed to extract text from DOCX')
  }
}

/**
 * 解析文件并提取文本内容
 */
export async function parseFile(file: File): Promise<FileParseResult> {
  const fileName = file.name
  const fileSize = file.size
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  let text = ''
  let fileType: FileType = 'txt'

  switch (extension) {
    case 'pdf':
      fileType = 'pdf'
      text = await extractTextFromPDF(file)
      break
    case 'docx':
      fileType = 'docx'
      text = await extractTextFromDOCX(file)
      break
    case 'md':
    case 'markdown':
      fileType = 'md'
      text = await readMarkdownFile(file)
      break
    case 'txt':
    default:
      fileType = 'txt'
      text = await readTextFile(file)
      break
  }

  return {
    text,
    fileType,
    fileName,
    fileSize,
  }
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File): boolean {
  const validExtensions = ['txt', 'md', 'pdf', 'docx', 'markdown']
  const extension = file.name.split('.').pop()?.toLowerCase() || ''
  return validExtensions.includes(extension)
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * 获取文件类型的 Accept 属性值
 */
export function getFileAccept(): string {
  return '.pdf,.docx,.txt,.md,.markdown'
}
