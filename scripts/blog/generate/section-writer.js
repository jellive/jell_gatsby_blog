// Per-section writing module (anti-AI pattern)
// Each section gets a slightly different prompt to avoid monotonous AI patterns

import { buildPrompt } from '../style/prompt-template.js'

// AI pattern detection in Korean text
const AI_PATTERNS_KO = [
  /하는 것이 중요합니다/,
  /에 대해 알아보겠습니다/,
  /다양한 방법이 있습니다/,
  /핵심 포인트를 정리/,
  /종합적으로 고려/,
  /효과적으로 활용/,
  /최적의 성능/,
  /주요 장점으로는/,
  /결론적으로 말씀/,
  /살펴보도록 하겠습니다/,
  /라고 할 수 있습니다/,
  /측면에서 살펴보면/,
]

// Detect AI-like patterns in generated text
export function detectAIPatterns(text) {
  const found = []
  const lines = text.split('\n')
  for (let i = 0; i < lines.length; i++) {
    for (const pattern of AI_PATTERNS_KO) {
      if (pattern.test(lines[i])) {
        found.push({
          line: i + 1,
          pattern: pattern.source,
          text: lines[i].trim(),
        })
      }
    }
  }
  return found
}

// Build a section-specific prompt with variation
export async function buildSectionPrompt({
  category,
  topic,
  section,
  sectionIndex,
  totalSections,
}) {
  const isIntro = sectionIndex === 0
  const isConclusion = sectionIndex === totalSections - 1

  // Get base prompt with style profile
  const basePrompt = await buildPrompt({
    category,
    topic,
    section: section.heading,
    isIntro,
    isConclusion,
  })

  // Add section-specific variation to avoid monotony
  const variations = [
    '개인적인 경험을 자연스럽게 녹여주세요.',
    '구체적인 코드 예시를 포함해주세요.',
    '비유나 실생활 예시를 들어 설명해주세요.',
    '초보자도 이해할 수 있게 단계적으로 설명해주세요.',
    '흔히 하는 실수나 주의사항을 언급해주세요.',
    '실무에서의 활용 팁을 추가해주세요.',
  ]

  const variationHint = variations[sectionIndex % variations.length]

  let sectionPrompt = basePrompt
  sectionPrompt += `\n## 이 섹션의 특별 지침\n`
  sectionPrompt += `- ${variationHint}\n`
  sectionPrompt += `- 이 섹션은 전체 ${totalSections}개 중 ${sectionIndex + 1}번째입니다\n`

  if (section.notes) {
    sectionPrompt += `- 섹션 노트: ${section.notes}\n`
  }

  // Add [PERSONAL] marker instructions
  sectionPrompt += `\n## [PERSONAL] 마커 사용법
개인적인 경험이나 일화가 들어가면 좋을 위치에 다음 형식으로 마커를 삽입합니다:

\`[PERSONAL: 여기에 관련 경험이나 에피소드를 추가해주세요 - 예: 처음 이 기능을 사용했을 때의 경험]\`

마커는 섹션당 0~1개 정도만 넣어주세요.
`

  return sectionPrompt
}

// Generate section heading markdown
export function sectionToMarkdown(section) {
  const prefix = '#'.repeat(section.level || 2)
  return `${prefix} ${section.heading}`
}
