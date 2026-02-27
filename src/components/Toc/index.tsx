'use client'

import React, { useEffect, useRef } from 'react'

interface TocProps {
  toc: string
  isOutside: boolean
}

const Toc = (props: TocProps) => {
  const { toc, isOutside } = props
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!tocRef.current) return

    const handleTocClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest('a') as HTMLAnchorElement

      if (target && target.tagName === 'A' && target.hash) {
        e.preventDefault()

        const rawTargetId = target.hash.slice(1)
        const targetId = decodeURIComponent(rawTargetId)

        const targetElement =
          document.getElementById(targetId) ||
          document.getElementById(rawTargetId) ||
          document.querySelector(`[id="${targetId}"]`) ||
          document.querySelector(`[id="${rawTargetId}"]`) ||
          document.querySelector(
            `[id*="${targetId.replace(/[^a-zA-Z0-9가-힣]/g, '')}"]`
          ) ||
          Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(
            el => {
              const elText = el.textContent?.trim() || ''
              const cleanTargetId = targetId.replace(/[-_]/g, ' ').trim()
              const cleanElText = elText.replace(/[-_]/g, ' ').trim()
              return (
                elText === targetId ||
                elText === decodeURIComponent(targetId) ||
                cleanElText === cleanTargetId ||
                elText.includes(targetId) ||
                targetId.includes(elText)
              )
            }
          ) ||
          Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).find(
            el => {
              const elText = (el.textContent?.trim() || '').replace(
                /^\d+\.\s*/,
                ''
              )
              const cleanTargetId = targetId.replace(/^\d+-/, '')
              return (
                elText.toLowerCase().includes(cleanTargetId.toLowerCase()) ||
                cleanTargetId.toLowerCase().includes(elText.toLowerCase())
              )
            }
          )

        if (targetElement) {
          const headerEl = document.getElementById('Header')
          const headerHeight = headerEl
            ? headerEl.getBoundingClientRect().height
            : 70
          const offset = headerHeight + 24
          const targetPosition =
            (targetElement as HTMLElement).offsetTop - offset
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight
          const finalPosition = Math.max(0, Math.min(targetPosition, maxScroll))

          window.scrollTo({ top: finalPosition, behavior: 'smooth' })

          if (history.replaceState) {
            history.replaceState(null, '', target.hash)
          }

          const allTocLinks = tocRef.current?.querySelectorAll('a') || []
          allTocLinks.forEach(link => {
            link.classList.remove('toc-active')
            link.style.opacity = ''
            link.style.fontWeight = ''
          })

          target.classList.add('toc-active')
          target.style.opacity = '1'
          target.style.fontWeight = 'bold'
          target.style.color = 'var(--primary)'

          setTimeout(() => {
            if (targetElement) {
              const htmlTarget = targetElement as HTMLElement
              htmlTarget.style.backgroundColor = 'rgba(94, 240, 176, 0.08)'
              htmlTarget.style.borderRadius = '4px'
              htmlTarget.style.transition = 'background-color 0.3s ease'
              setTimeout(() => {
                htmlTarget.style.backgroundColor = ''
                setTimeout(() => {
                  htmlTarget.style.borderRadius = ''
                  htmlTarget.style.transition = ''
                }, 300)
              }, 1000)
            }
          }, 100)
        }
      }
    }

    const tocContainer = tocRef.current
    tocContainer.addEventListener('click', handleTocClick)

    return () => {
      if (tocContainer) {
        tocContainer.removeEventListener('click', handleTocClick)
      }
    }
  }, [toc])

  if (!toc || toc === '') {
    return null
  }

  const tocContent = (
    <div
      ref={tocRef}
      className={[
        'toc-content text-sm',
        '[&_ul]:ml-4 [&_ul]:list-none [&_ul]:space-y-0.5',
        '[&_li]:leading-relaxed',
        '[&_p]:mb-0',
        '[&_a]:block [&_a]:truncate [&_a]:rounded-sm [&_a]:px-2 [&_a]:py-1',
        '[&_a]:no-underline [&_a]:opacity-50 [&_a]:transition-all [&_a]:duration-150',
        '[&_a]:hover:opacity-100',
        '[&_a.active]:font-medium [&_a.active]:opacity-100',
        '[&_img]:hidden',
      ].join(' ')}
      style={{
        fontFamily: 'var(--font-mono-display)',
        fontSize: '0.8rem',
        color: 'var(--muted-foreground)',
      }}
      data-testid="table-of-contents"
      // Content is generated server-side by remark-toc pipeline, not user input
      dangerouslySetInnerHTML={{ __html: toc }}
    />
  )

  if (isOutside) {
    return (
      <div
        className="toc-container fixed right-2 z-[999] hidden min-w-[280px] max-w-[300px] opacity-40 shadow-lg transition-opacity duration-300 hover:opacity-95 lg:block"
        style={{
          background: 'var(--background)',
          border: '1px solid var(--border)',
          maxHeight: 'calc(100vh - 8rem)',
          overflow: 'hidden',
        }}
        data-testid="toc-outside"
      >
        <div
          style={{
            padding: '10px 16px 8px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-mono-display)',
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
            }}
          >
            CONTENTS
          </span>
        </div>
        <div
          className="overflow-y-auto p-3 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-1"
          style={{ maxHeight: 'calc(100vh - 12rem)' }}
        >
          {tocContent}
        </div>
      </div>
    )
  }

  return (
    <div
      className="inside-toc-wrap"
      style={{
        borderLeft: '2px solid var(--border)',
        paddingLeft: '16px',
      }}
      data-testid="toc-inside"
    >
      {tocContent}
    </div>
  )
}

export default Toc
