// Style-aware prompt builder
// Generates system prompts grounded in the user's actual writing style

import { readFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PROFILE_PATH = join(__dirname, 'profile.json')

// Common AI Korean patterns to explicitly avoid
const AI_ANTI_PATTERNS = [
  '~하는 것이 중요합니다',
  '~에 대해 알아보겠습니다',
  '~의 핵심은',
  '~을 살펴보겠습니다',
  '다양한 방법이 있습니다',
  '이 글에서는 ~에 대해',
  '결론적으로 말씀드리자면',
  '~하는 것을 추천드립니다',
  '핵심 포인트를 정리해 보겠습니다',
  '주요 장점으로는',
  '효과적으로 활용하기 위해서는',
  '최적의 성능을 위해',
  '종합적으로 고려해 보면',
  '~라고 할 수 있습니다',
  '~측면에서 살펴보면',
]

async function loadProfile() {
  try {
    const raw = await readFile(PROFILE_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function buildEndingGuidance(endings) {
  if (!endings) return ''

  const sorted = Object.entries(endings)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  if (sorted.length === 0) return ''

  return `문장 끝맺음 패턴 (빈도순): ${sorted.map(([k, v]) => `"~${k}" (${v}회)`).join(', ')}`
}

function buildTransitionGuidance(transitions) {
  if (!transitions) return ''

  const sorted = Object.entries(transitions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  if (sorted.length === 0) return ''

  return `자주 사용하는 전환 표현: ${sorted.map(([k]) => `"${k}"`).join(', ')}`
}

function buildExampleBlock(examples) {
  if (!examples || examples.length === 0) return ''

  return `실제 글에서 발췌한 예시 문장들:\n${examples.map(e => `- "${e}"`).join('\n')}`
}

export async function buildPrompt({
  category,
  topic,
  section,
  isIntro,
  isConclusion,
}) {
  const profile = await loadProfile()

  const catProfile = profile?.byCategory?.[category]
  const overall = profile?.overall

  // Base style instructions
  let prompt = `당신은 한국어 기술 블로그 작성자입니다.
다음 규칙을 반드시 지켜주세요:

## 문체 규칙
- 존댓말(습니다/ㅂ니다 체)을 사용합니다
- 자연스럽고 편안한 톤을 유지합니다
- 과도하게 격식체이거나 딱딱하지 않게 씁니다
- 짧은 문장과 긴 문장을 섞어 리듬감을 줍니다

## 절대 금지 패턴 (AI스러운 표현)
다음 표현은 절대 사용하지 마세요:
${AI_ANTI_PATTERNS.map(p => `- "${p}"`).join('\n')}

## 대신 사용할 표현
- "~가 중요합니다" → "~를 놓치면 안 됩니다" 또는 구체적 이유 설명
- "살펴보겠습니다" → "해보겠습니다", "써보겠습니다", "만들어보겠습니다"
- "다양한 방법" → 구체적 숫자와 방법명 언급
- "핵심 포인트" → 그냥 내용을 직접 서술

## 포맷 규칙
- 한 줄은 150자를 넘기지 않습니다
- H1(#)은 사용하지 않습니다. H2(##)부터 시작합니다
- 코드 블록에는 반드시 언어 태그를 붙입니다
`

  // Add style profile data if available
  if (overall) {
    prompt += `\n## 이 블로그의 실제 문체 분석\n`
    prompt += `평균 문장 길이: ${overall.sentenceLengths.avg}자\n`
    prompt += `${buildEndingGuidance(overall.endings)}\n`
    prompt += `${buildTransitionGuidance(overall.transitions)}\n`

    if (catProfile) {
      prompt += `\n## "${category}" 카테고리 특성\n`
      prompt += `평균 코드 블록 수: ${catProfile.avgCodeBlocks}개/글\n`
      prompt += `${buildEndingGuidance(catProfile.endings)}\n`
      prompt += `\n${buildExampleBlock(catProfile.examples)}\n`
    } else if (overall.examples) {
      prompt += `\n${buildExampleBlock(overall.examples)}\n`
    }
  }

  // Section-specific instructions
  if (isIntro) {
    prompt += `\n## 서론 작성 지침
- 독자의 공감을 이끌어내는 상황 묘사로 시작합니다
- 개인적인 경험이나 에피소드가 있으면 좋습니다
- [PERSONAL] 마커로 개인 경험 삽입 위치를 표시합니다
- 이 글에서 다룰 내용을 자연스럽게 안내합니다
`
  }

  if (isConclusion) {
    prompt += `\n## 결론 작성 지침
- 핵심 내용을 간결하게 정리합니다
- 독자에게 다음 행동을 제안합니다
- 과도한 요약 나열은 피합니다
- [PERSONAL] 마커로 느낀 점/배운 점 위치를 표시합니다
`
  }

  if (topic) {
    prompt += `\n## 작성할 내용\n주제: ${topic}\n`
  }

  if (section) {
    prompt += `섹션: ${section}\n`
  }

  return prompt
}

export { loadProfile, AI_ANTI_PATTERNS }
