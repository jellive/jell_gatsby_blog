'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/projects'
import { categoryLabel, statusLabel } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
  className?: string
}

const statusColor: Record<Project['status'], string> = {
  active:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
  wip: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  return (
    <div
      className={cn(
        'border-border/50 flex h-full flex-col rounded-lg border bg-card p-5',
        'hover:border-primary/40 transition-all duration-200 hover:shadow-md',
        className
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-foreground">
            {project.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {categoryLabel[project.category]}
          </span>
        </div>
        <span
          className={cn(
            'flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
            statusColor[project.status]
          )}
        >
          {statusLabel[project.status]}
        </span>
      </div>

      {/* Description */}
      <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      {/* Tech stack */}
      <div className="flex flex-wrap gap-1.5">
        {project.tech.map(t => (
          <span
            key={t}
            className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Links */}
      {(project.url || project.github) && (
        <div className="border-border/30 mt-4 flex gap-3 border-t pt-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              사이트 방문 →
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline"
            >
              GitHub
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectCard
