// Outline generation helper
// Provides structured outline templates for different post types

export function generateOutline({ title, category, description, sections }) {
  // If user provides sections, use those
  if (sections && sections.length > 0) {
    return {
      title,
      sections: sections.map((s, i) => ({
        heading: s,
        level: 2,
        isIntro: i === 0,
        isConclusion: i === sections.length - 1,
        notes: '',
      })),
    }
  }

  // Generate default outline based on category
  const outlineTemplates = {
    // Technical tutorial pattern
    technical: [
      { heading: '개요', isIntro: true, notes: 'Context and motivation' },
      { heading: '준비 사항', notes: 'Prerequisites and setup' },
      { heading: '구현', notes: 'Step-by-step implementation' },
      { heading: '결과 확인', notes: 'Testing and verification' },
      {
        heading: '마무리',
        isConclusion: true,
        notes: 'Summary and next steps',
      },
    ],
    // Experience/story pattern
    narrative: [
      { heading: '시작하며', isIntro: true, notes: 'Personal context' },
      { heading: '과정', notes: 'What happened' },
      { heading: '배운 점', notes: 'Lessons learned' },
      { heading: '마무리', isConclusion: true, notes: 'Reflection' },
    ],
    // Problem-solution pattern
    problemSolving: [
      { heading: '문제 상황', isIntro: true, notes: 'Describe the problem' },
      { heading: '원인 분석', notes: 'Root cause analysis' },
      { heading: '해결 방법', notes: 'Solution approach' },
      { heading: '적용 결과', notes: 'Results after applying' },
      { heading: '마무리', isConclusion: true, notes: 'Takeaways' },
    ],
    // Simple/short post pattern
    simple: [
      { heading: '개요', isIntro: true, notes: 'Brief intro' },
      { heading: '내용', notes: 'Main content' },
      { heading: '마무리', isConclusion: true, notes: 'Wrap up' },
    ],
  }

  // Select template based on category
  const technicalCategories = [
    'Javascript',
    'Docker',
    'iOS',
    'Linux',
    'Network',
    'Algorithm',
    'Architecture',
    'Blog',
  ]
  const narrativeCategories = ['Chat', 'Bicycle']
  const simpleCategories = ['Notice', 'Game']

  let template
  if (technicalCategories.includes(category)) {
    template = outlineTemplates.technical
  } else if (narrativeCategories.includes(category)) {
    template = outlineTemplates.narrative
  } else if (simpleCategories.includes(category)) {
    template = outlineTemplates.simple
  } else {
    template = outlineTemplates.technical
  }

  return {
    title,
    description,
    sections: template.map(s => ({
      ...s,
      level: 2,
    })),
  }
}

// Format outline as markdown preview
export function outlineToMarkdown(outline) {
  const lines = [`# Outline: ${outline.title}`, '']
  if (outline.description) {
    lines.push(`> ${outline.description}`, '')
  }
  for (const section of outline.sections) {
    const prefix = '#'.repeat(section.level || 2)
    const markers = []
    if (section.isIntro) markers.push('[INTRO]')
    if (section.isConclusion) markers.push('[CONCLUSION]')
    lines.push(`${prefix} ${section.heading} ${markers.join(' ')}`.trim())
    if (section.notes) lines.push(`  > ${section.notes}`)
    lines.push('')
  }
  return lines.join('\n')
}
