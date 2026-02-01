"use client"

import { useCallback, useState } from "react"
import { Upload, FileText, File, X, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { parseFile, isValidFileType, isValidFileSize, getFileAccept, type FileParseResult } from "@/lib/file-parser"
import { useI18n } from "@/lib/i18n"

interface FileUploadProps {
  onFileParsed: (result: FileParseResult) => void
  maxSizeMB?: number
  accept?: string
  className?: string
  disabled?: boolean
}

export function FileUpload({
  onFileParsed,
  maxSizeMB = 10,
  accept = getFileAccept(),
  className,
  disabled = false,
}: FileUploadProps) {
  const { t } = useI18n()
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [parsedFile, setParsedFile] = useState<FileParseResult | null>(null)

  // Disable interaction when disabled
  const handleDrag = useCallback((e: React.DragEvent) => {
    if (disabled) return
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [disabled])

  const processFile = async (file: File) => {
    // 验证文件类型
    if (!isValidFileType(file)) {
      setError(t("invalidFileType"))
      return
    }

    // 验证文件大小
    if (!isValidFileSize(file, maxSizeMB)) {
      setError(t("fileTooLarge"))
      return
    }

    setError(null)
    setUploading(true)
    setProgress(0)

    // 模拟上传进度
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90))
    }, 100)

    try {
      const result = await parseFile(file)
      setParsedFile(result)
      setProgress(100)
      onFileParsed(result)
    } catch (err) {
      setError("Failed to parse file. Please try again.")
      console.error("File parsing error:", err)
    } finally {
      clearInterval(progressInterval)
      setUploading(false)
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled) return
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0])
      }
    },
    [onFileParsed, t, maxSizeMB, disabled]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return
      if (e.target.files && e.target.files[0]) {
        processFile(e.target.files[0])
      }
    },
    [onFileParsed, t, maxSizeMB, disabled]
  )

  const handleRemove = () => {
    setParsedFile(null)
    setError(null)
    setProgress(0)
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    if (ext === "pdf") {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    if (ext === "docx") {
      return <FileText className="h-8 w-8 text-blue-600" />
    }
    return <File className="h-8 w-8 text-blue-500" />
  }

  if (parsedFile) {
    return (
      <Card className={className}>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            {getFileIcon(parsedFile.fileName)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{parsedFile.fileName}</p>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground">
                {(parsedFile.fileSize / 1024).toFixed(1)} KB • {parsedFile.text.length} {t("charactersCount")}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("relative", className)}>
      <Card
        className={cn(
          "border-2 border-dashed transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          error && "border-destructive",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <CardContent className="flex flex-col items-center justify-center py-8 px-4">
          <input
            type="file"
            accept={accept}
            onChange={handleChange}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            disabled={disabled || uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {uploading ? (
            <div className="text-center space-y-4">
              <div className="animate-pulse">
                <Upload className="h-12 w-12 mx-auto text-primary" />
              </div>
              <div className="space-y-2 w-48 mx-auto">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-muted-foreground">
                  {progress < 100 ? t("analyzingProgress") : t("analysisComplete")}
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <p className="text-center font-medium mb-1">{t("dropZoneText")}</p>
              <p className="text-sm text-muted-foreground text-center mb-4">
                支持 .pdf、.docx、.txt、.md 格式，最大 {maxSizeMB}MB
              </p>
            </>
          )}
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  )
}
