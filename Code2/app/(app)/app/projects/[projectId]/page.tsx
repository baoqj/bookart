"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { FileText, ImageIcon, Calendar, Globe, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { projectsApi } from "@/lib/api"
import type { Project } from "@/lib/types"
import { format } from "date-fns"

export default function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProject()
  }, [resolvedParams.projectId])

  const loadProject = async () => {
    try {
      const data = await projectsApi.get(resolvedParams.projectId)
      setProject(data)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Skeleton className="h-48" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="container max-w-6xl py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="font-semibold">Project not found</h3>
            <Link href="/app/projects">
              <Button className="mt-4">Back to Projects</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/app/projects" className="hover:text-foreground transition-colors">
          Projects
        </Link>
        <span>/</span>
        <span className="text-foreground">{project.title}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight text-balance">{project.title}</h1>
          <p className="text-muted-foreground mt-2 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="gap-1">
              <Globe className="h-3 w-3" />
              {project.language.toUpperCase()}
            </Badge>
            <Badge variant="outline">{project.manuscriptStatus}</Badge>
            {project.paragraphCount > 0 && <Badge variant="outline">{project.paragraphCount} paragraphs</Badge>}
            <span className="text-sm text-muted-foreground flex items-center gap-1 ml-2">
              <Calendar className="h-3 w-3" />
              Created {format(new Date(project.createdAt), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="manuscript">Manuscript</TabsTrigger>
          <TabsTrigger value="illustrations">Illustrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with your project</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <Link href={`/app/projects/${project.id}/manuscript`}>
                <Button variant="outline" className="w-full h-auto flex-col items-start p-4 gap-2 bg-transparent">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    <span className="font-semibold">Import Manuscript</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left leading-relaxed">
                    Upload or paste your text content to get started
                  </p>
                </Button>
              </Link>
              <Link href={`/app/projects/${project.id}/illustrations`}>
                <Button variant="outline" className="w-full h-auto flex-col items-start p-4 gap-2 bg-transparent">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    <span className="font-semibold">Generate Illustrations</span>
                  </div>
                  <p className="text-xs text-muted-foreground text-left leading-relaxed">
                    Create AI-powered illustrations for your content
                  </p>
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Project Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Manuscript Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{project.manuscriptStatus}</div>
                <p className="text-xs text-muted-foreground mt-1">{project.paragraphCount} paragraphs imported</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Illustrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Generated images</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Active generation tasks</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="manuscript">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Navigate to the Manuscript page to import your content</p>
              <Link href={`/app/projects/${project.id}/manuscript`}>
                <Button>Go to Manuscript</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="illustrations">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Navigate to the Illustrations page to generate images</p>
              <Link href={`/app/projects/${project.id}/illustrations`}>
                <Button>Go to Illustrations</Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
