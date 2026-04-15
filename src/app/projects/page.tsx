import type { Metadata } from 'next'
import { projects } from '@/lib/projects'
import ProjectCard from '@/components/ProjectCard'
import { siteConfig } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Jell이 만들고 있는 프로젝트들을 소개합니다.',
  openGraph: {
    title: `Projects | ${siteConfig.title}`,
    description: 'Jell이 만들고 있는 프로젝트들을 소개합니다.',
    url: `${siteConfig.siteUrl}/projects`,
    siteName: siteConfig.title,
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function ProjectsPage() {
  const activeProjects = projects.filter(
    p => p.status === 'active' || p.status === 'wip'
  )
  const archivedProjects = projects.filter(p => p.status === 'archived')

  return (
    <div className="py-content">
      {/* Page header */}
      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
          Projects
        </h1>
        <p className="text-muted-foreground">
          직접 만들고 있는 것들. 모바일, 웹, 데스크탑 다 해봄.
        </p>
      </div>

      {/* Active projects */}
      <section className="mb-12">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          운영 중 / 개발 중 — {activeProjects.length}개
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {activeProjects.map(project => (
            <ProjectCard key={project.name} project={project} />
          ))}
        </div>
      </section>

      {/* Archived projects (only shown if any exist) */}
      {archivedProjects.length > 0 && (
        <section>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            아카이브 — {archivedProjects.length}개
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {archivedProjects.map(project => (
              <ProjectCard key={project.name} project={project} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
