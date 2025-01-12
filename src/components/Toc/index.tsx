import React, { useEffect, useState } from 'react'
import './toc.scss'

interface TocProps {
  headings: {
    id: string
    title: string
    level: number
  }[]
}

const Toc = ({ headings }: TocProps) => {
  const [activeId, setActiveId] = useState('')

  console.log('TOC rendered with headings:', headings)

  useEffect(() => {
    console.log('TOC useEffect triggered')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Intersecting heading:', entry.target.id)
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 1.0
      }
    )

    const headingElements = headings
      .map(({ id }) => {
        const element = document.getElementById(id)
        if (!element) console.log('Heading element not found:', id)
        return element
      })
      .filter((element): element is HTMLElement => element !== null)

    console.log('Observing elements:', headingElements.length)
    headingElements.forEach((element) => observer.observe(element))

    return () => {
      console.log('Cleaning up observer')
      headingElements.forEach((element) => observer.unobserve(element))
    }
  }, [headings])

  if (headings.length === 0) {
    console.log('No headings available')
    return null
  }

  return (
    <nav className="toc outside">
      <ul>
        {headings.map(({ id, title, level }) => (
          <li key={id} style={{ marginLeft: `${(level - 1) * 1}rem` }}>
            <a
              href={`#${id}`}
              style={{ opacity: activeId === id ? 1 : 0.4 }}
              onClick={(e) => {
                e.preventDefault()
                console.log('Clicked heading:', id)
                document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Toc
