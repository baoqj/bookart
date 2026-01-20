"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { useI18n } from "@/lib/i18n"
import { Plus, Search, BookOpen, ImageIcon, Clock } from "lucide-react"
import { mockProjects } from "@/lib/mock-data"

function ProjectsContent() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [projects] = useState(mockProjects)

  const filteredProjects = projects.filter((project) => project.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <>
      <DashboardHeader
        title={t("bookProjects")}
        description={t("manageYourProjects")}
        action={
          <Button asChild className="gap-2">
            <Link href="/">
              <Plus className="h-4 w-4" />
              {t("newProject")}
            </Link>
          </Button>
        }
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t("searchProjects")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-xl transition-all duration-200 border-2 bg-card/80 backdrop-blur cursor-pointer"
            >
              <Link href={`/dashboard/projects/${project.id}`}>
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {project.updatedAt.toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{project.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      {project.paragraphCount} {t("paragraphs")}
                    </span>
                    <span className="uppercase font-medium">{project.language}</span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="p-12 text-center border-2 bg-card/80 backdrop-blur">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{t("noProjectsFound")}</h3>
            <p className="text-sm text-muted-foreground mb-6">{t("noProjectsFoundDesc")}</p>
          </Card>
        )}
      </div>
    </>
  )
}

export default function ProjectsPage() {
  return (
    <div className="flex flex-col">
      <Suspense fallback={null}>
        <ProjectsContent />
      </Suspense>
    </div>
  )
}
