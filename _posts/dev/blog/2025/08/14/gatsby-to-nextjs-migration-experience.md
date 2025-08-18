---
title: 'Gatsby에서 Next.js로 마이그레이션하며 배운 것들 - 성공한 이야기와 그 과정에서의 깨달음'
date: '2025-08-14'
category: 'Blog'
tags: ['Gatsby', 'Next.js', '마이그레이션', '개발', 'React']
---

## 서론: 더 나은 기술을 향한 도전

개발자라면 누구나 한 번쯤은 경험하는 순간이 있습니다. "저 기술이 더 좋아 보이는데?" 하는 생각. 저 역시 그런 순간을 맞이했습니다.

2년간 안정적으로 운영되던 Gatsby 기반 블로그를 보며 문득 생각했습니다. "Next.js가 요즘 주목받고 있고, App Router도 출시되었는데, 더 모던하고 성능도 좋을 것 같다."

그렇게 시작된 마이그레이션의 여정. 처음에는 막막했지만, 체계적인 접근과 꼼꼼한 준비를 통해 성공적으로 Next.js 14로 마이그레이션을 완료했습니다. draft 시스템과 복잡한 마크다운 처리까지 모두 구현한 완전한 성공 사례를 공유하고자 합니다.

```toc

```

## 왜 마이그레이션을 결심했는가

### Gatsby의 아쉬운 점들

#### 1. 무거운 개발 환경

- **의존성 지옥**: 61개의 패키지 (Gatsby 에코시스템이 방대함)
- **빌드 시간**: GraphQL 레이어 때문에 초기 빌드가 느림
- **메모리 사용량**: 개발 서버가 상당히 무거움

#### 2. 복잡한 플러그인 생태계

```javascript
// gatsby-config.js - 19개의 플러그인
plugins: [
  'gatsby-plugin-react-helmet',
  'gatsby-plugin-sass',
  'gatsby-plugin-sharp',
  'gatsby-transformer-sharp',
  'gatsby-transformer-remark',
  // ... 14개 더
]
```

모든 기능마다 플러그인을 찾고, 설정하고, 버전 호환성을 확인해야 했습니다.

#### 3. GraphQL의 오버엔지니어링

단순한 마크다운 블로그에 GraphQL이 과연 필요한가? 라는 의문이 들기 시작했습니다.

### Next.js의 매력적인 점들

#### 1. 심플한 접근 방식

- 파일 기반 라우팅 시스템
- 더 적은 의존성 패키지 (39개)
- 직관적인 App Router 구조

#### 2. 성능 최적화

- 자동 코드 스플리팅 기능
- 내장된 이미지 최적화
- 향상된 빌드 최적화

#### 3. 높은 유연성

- API Routes 지원
- SSR/SSG 선택적 적용 가능
- 점진적 도입 가능

"이 기술이면 훨씬 깔끔하고 빠른 성능을 얻을 수 있겠다"는 확신이 들었습니다. 적어도 시작할 때까지는 그러했습니다.

## 마이그레이션 과정: 체계적인 접근

### 1단계: 기본 구조 이전

```bash
// 기존 Gatsby 구조
src/
├── components/
├── pages/
├── templates/
└── utils/

// Next.js App Router 구조
src/
├── app/
│   ├── posts/[slug]/
│   ├── tags/
│   └── layout.tsx
├── components/
└── lib/
```

여기까지는 순조롭게 진행되었습니다. 파일들을 옮기고, 라우팅을 App Router 방식으로 변경하는 것은 생각보다 어렵지 않았습니다.

### 2단계: 마크다운 처리 - 가장 복잡했던 부분

#### Gatsby에서는 간단했습니다

```javascript
// gatsby-config.js
{
  resolve: 'gatsby-transformer-remark',
  options: {
    plugins: [
      'gatsby-remark-emoji',
      'gatsby-remark-autolink-headers',
      'gatsby-remark-prismjs',
      // TOC도 자동으로...
    ]
  }
}
```

단 19줄로 모든 마크다운 처리가 완료되었습니다.

#### Next.js에서는 직접 구현이 필요했습니다

248줄에 달하는 `lib/markdown.ts` 파일을 직접 구현해야 했습니다:

````typescript
export async function parseMarkdownFile(filePath: string): Promise<PostData> {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data: frontMatter, content } = matter(fileContent)

  // 이미지 경로 변환 로직
  let transformedContent = transformImagePaths(content, filePath)

  // TOC 처리 로직
  transformedContent = transformedContent.replace(
    /```toc\s*```/g,
    '## Table of Contents'
  )

  // unified + remark + rehype 파이프라인
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkEmoji)
    .use(remarkToc, {
      /* 복잡한 설정 */
    })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypePrism, {
      /* 더 복잡한 설정 */
    })
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(transformedContent)

  // TOC 추출 로직 (30줄 더...)
  let tableOfContents = ''
  const tocHeadingMatch = htmlContent.match(
    /<h2[^>]*>Table of Contents<\/h2>([\s\S]*?)(?=<h[1-6]|$)/i
  )
  // ... 복잡한 정규식과 파싱 로직

  return {
    /* 처리된 데이터 */
  }
}
````

특히 TOC(Table of Contents) 추출이 가장 까다로웠습니다. Gatsby에서는 플러그인이 자동으로 처리해주던 것을, Next.js에서는 HTML을 파싱해서 직접 추출해야 했습니다.

### 3단계: 이미지 처리의 복잡성

#### Gatsby에서는 간단했습니다

```markdown
![제주도 풍경](images/jeju.png)
```

이렇게 작성하면 모든 것이 끝이었습니다. `gatsby-plugin-sharp`가 자동으로 최적화하고 경로도 알맞게 변경해주었습니다.

#### Next.js에서는 직접 처리가 필요했습니다

```typescript
function transformImagePaths(content: string, filePath: string): string {
  const relativePath = path.relative(postsDirectory, filePath)
  const pathParts = relativePath.split(path.sep)

  if (pathParts.length >= 4) {
    const category = pathParts[0]
    const year = pathParts[1]
    const month = pathParts[2]
    const day = pathParts[3]

    return content.replace(
      /!\[([^\]]*)\]\(images\/([^)]+)\)/g,
      `![$1](/images/${category}/${year}/${month}/${day}/$2)`
    )
  }
  return content
}
```

수동으로 경로 변환 로직을 구현해야 했습니다.

### 4단계: 빌드와 배포 설정

#### Gatsby에서는

```json
{
  "scripts": {
    "deploy": "rm -rf .cache/ && rm -rf public/ && gatsby build && gh-pages -b master -d public"
  }
}
```

#### Next.js에서는

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  // 정적 배포를 위한 추가 설정들...
}
```

Static Export 설정과 이미지 최적화 비활성화 등 추가 설정이 필요했습니다.

## 마이그레이션 후 얻은 것들

### 개선된 점들

#### 1. 더 가벼운 번들 사이즈

- 의존성: 61개 → 39개로 대폭 감소
- 개발 서버 시작 시간 단축
- 메모리 사용량 현저한 감소

#### 2. 직관적인 프로젝트 구조

```text
src/app/
├── page.tsx                 # 홈페이지
├── posts/[slug]/page.tsx    # 블로그 포스트
├── tags/page.tsx            # 태그 페이지
└── layout.tsx               # 레이아웃
```

파일 구조만 보아도 각각의 역할을 명확하게 파악할 수 있습니다.

#### 3. 향상된 TypeScript 지원

Next.js의 TypeScript 지원이 더욱 매끄러웠습니다. 특히 App Router와의 조합은 정말 훌륭했습니다.

### 도전적이었던 부분들

#### 1. 초기 개발 투자 시간 증가

- 기존에 플러그인으로 간단히 해결되던 기능을 직접 구현하는 데 시간 소요
- 디버깅 과정에서 더 많은 시간 투자 필요
- 커스텀 로직이 늘어날수록 유지보수 복잡도 증가

#### 2. 기능 구현의 세밀함

- TOC 생성 로직만 30줄의 정교한 구현
- 이미지 경로 변환 로직 20줄의 체계적 처리
- 마크다운 파이프라인 전체 248줄의 통합적 구현

#### 3. 예외 상황 처리의 필요성

Gatsby는 에코시스템이 성숙하여 대부분의 엣지 케이스가 이미 처리되어 있었습니다. 반면 Next.js에서는 모든 예외 상황을 직접 핸들링해야 했습니다.

## 성공적인 마이그레이션 완성 과정

마이그레이션 과정에서 여러 도전이 있었지만, 체계적인 접근과 꼼꼼한 구현을 통해 모든 기능을 성공적으로 완성할 수 있었습니다.

### 성공 요인들

#### 1. 체계적인 문제 해결 접근

248줄의 마크다운 처리 코드를 단계별로 분석하고 개선하면서 안정적인 구조를 구축했습니다.

#### 2. 완전한 기능 구현

Next.js가 단순히 "동작하는" 수준이 아니라, draft 시스템까지 완벽하게 구현하여 기존 Gatsby의 모든 기능을 재현했습니다.

#### 3. 세밀한 디테일 처리

개발 워크플로우, 이미지 처리, TOC 생성까지 모든 기능을 원래 수준 이상으로 완성했습니다.

### 최종 완성된 결과

현재 블로그는 Next.js 14 기반으로 안정적으로 운영되고 있습니다:

```tsx
// layout.tsx의 footer
<footer>Built with Next.js 14 {/* ✅ */}</footer>
```

Next.js로 구현된 블로그가 자신있게 Next.js라고 표시하고 있습니다.

## 마이그레이션을 통해 배운 교훈들

### 1. 기술 스택 변경에 대한 신중한 접근 필요

"더 좋은 기술"이라고 해서 반드시 "더 좋은 결과"로 이어지는 것은 아닙니다.

#### 반드시 고려해야 할 요소들

- **학습 곡선**: 새로운 기술을 익히는 데 필요한 시간과 노력
- **생태계 성숙도**: 플러그인, 라이브러리, 커뮤니티 지원 수준
- **마이그레이션 비용**: 기존 코드를 이전하는 데 드는 시간과 리소스
- **장기적 유지보수성**: 커스텀 코드 대비 검증된 솔루션의 안정성

### 2. "간단해 보이는" 기술의 숨겨진 복잡성

Next.js가 처음에는 간단해 보였지만, 실제로는 다음과 같은 상황이었습니다:

- Gatsby에서 플러그인이 자동으로 처리해주던 기능들을 직접 구현해야 함
- 에코시스템의 도움 없이 모든 로직을 직접 해결해야 하는 상황
- 겉보기에는 심플하지만 실제로는 훨씬 많은 코드 작성이 필요함

### 3. 완벽한 기술은 존재하지 않는다는 것

#### Gatsby의 장단점

- **장점**: 풍부한 플러그인 생태계, 검증된 솔루션들, 빠른 초기 개발 속도
- **단점**: 무거운 개발 환경, 복잡한 설정 구조, GraphQL 오버헤드

#### Next.js의 장단점

- **장점**: 가벼운 번들 크기, 직관적인 프로젝트 구조, 높은 유연성
- **단점**: 직접 구현해야 할 기능들이 많음, 초기 개발 시간 투자 필요

### 4. 기술적 완성도와 실용성의 균형

때로는 "기술적으로 더 우아한" 솔루션보다 "안정적으로 동작하는" 솔루션이 더욱 가치있을 수 있습니다.

## 결론: 성공적인 마이그레이션의 의미

현재 상황을 정리하면:

- Next.js 14로 마이그레이션 성공적으로 완료 (✅)
- 모든 기존 기능 완벽 재현 (✅)
- Draft 시스템까지 완전 구현 (✅)
- 안정적으로 운영 중 (✅)

### 현재의 만족스러운 결과

#### 기술적 성과

1. 248줄의 마크다운 처리 시스템 완성
2. 완전한 기능 구현으로 기존 Gatsby 수준 달성
3. 더 가벼운 번들과 빠른 개발 환경 구축

#### 운영적 개선

Next.js로의 전환을 통해 다음과 같은 개선사항을 얻었습니다:

1. **Next.js 계속 사용**: 투자한 시간과 노력이 결실을 맺었습니다
2. **안정적인 운영**: 모든 기능이 원활하게 동작하고 있습니다
3. **미래 확장성**: 필요에 따라 추가 기능 구현이 용이합니다

### 다른 개발자들에게

만약 비슷한 마이그레이션을 고려하고 계신다면:

#### ✅ 마이그레이션을 고려해볼 만한 경우

- 현재 기술 스택에 명확한 한계가 있을 때
- 팀의 기술 스택 통일이 필요할 때
- 새로운 기술이 제공하는 고유한 기능이 꼭 필요할 때

#### ❌ 마이그레이션을 피해야 할 경우

- 단순히 "더 핫한 기술"이라는 이유만으로
- 현재 시스템이 잘 동작하고 있을 때
- 마이그레이션에 투자할 시간이 부족할 때

## Epilogue: 기술은 도구일 뿐

결국 중요한 것은 기술 그 자체가 아니라, 그 기술로 무엇을 만들어내느냐입니다.

Gatsby든 Next.js든, 독자 여러분이 이 글을 읽고 도움이 되셨다면 그것으로 충분합니다.

---

_PS: 이 글을 작성하면서도 Next.js의 마크다운 파이프라인을 사용했습니다. 248줄의 코드가 또 한 번 증명했듯이, 기술 선택에는 항상 trade-off가 있습니다._
