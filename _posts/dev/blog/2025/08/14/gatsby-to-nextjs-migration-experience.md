---
title: 'Gatsby에서 Next.js로 마이그레이션하며 배운 것들 - 성공한 이야기와 그 과정에서의 깨달음'
date: '2025-08-14'
category: 'Blog'
tags: ['Gatsby', 'Next.js', '마이그레이션', '개발', 'React']
---

## 서론: 더 나은 기술을 향한 도전

2년간 안정적으로 운영되던 Gatsby 기반 블로그를 보며 문득 생각했습니다.
"Next.js가 요즘 주목받고 있고, App Router도 출시되었는데, 더 모던하고 성능도 좋을 것 같다."

그렇게 시작된 마이그레이션. 처음에는 막막했지만, 결국 Next.js 14로 draft 시스템과 복잡한 마크다운 처리까지 모두 옮겨오는 데 성공했습니다. 그 과정에서 배운 것들을 정리해봤습니다.

```toc

```

## 왜 마이그레이션을 결심했는가

### Gatsby의 아쉬운 점들

### 1. 무거운 개발 환경

- **의존성 지옥**: 61개의 패키지 (Gatsby 에코시스템이 방대함)
- **빌드 시간**: GraphQL 레이어 때문에 초기 빌드가 느림
- **메모리 사용량**: 개발 서버가 상당히 무거움

### 2. 복잡한 플러그인 생태계

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

### 3. GraphQL의 오버엔지니어링

단순한 마크다운 블로그에 GraphQL이 과연 필요한가? 라는 의문이 들기 시작했습니다.

### Next.js의 매력적인 점들

- 파일 기반 라우팅으로 더 직관적인 구조
- 의존성 패키지가 39개로 확연히 적음
- SSR/SSG 선택적 적용이나 API Routes 같은 유연성

"이 기술이면 훨씬 깔끔하겠다"는 생각이었습니다. 적어도 시작할 때까지는.

## 마이그레이션 과정

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

여기까지는 순조로웠습니다. 파일들을 옮기고 라우팅을 App Router 방식으로 변경하는 건 생각보다 어렵지 않았습니다.

### 2단계: 마크다운 처리 - 가장 복잡했던 부분

Gatsby에서는 이랬습니다.

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

단 19줄로 모든 마크다운 처리가 끝났습니다.

Next.js에서는 248줄짜리 `lib/markdown.ts`를 직접 짜야 했습니다.

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

특히 TOC 추출이 가장 까다로웠습니다. Gatsby에서는 플러그인이 자동으로 처리해주던 걸, Next.js에서는 HTML을 파싱해서 직접 뽑아내야 했습니다.

### 3단계: 이미지 처리

Gatsby에서는 마크다운에 `![제주도 풍경](images/jeju.png)` 이렇게만 써도 `gatsby-plugin-sharp`가 알아서 최적화하고 경로도 바꿔줬습니다.

Next.js에서는 경로 변환 로직을 직접 짰습니다.

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

### 4단계: 빌드와 배포 설정

Gatsby에서는 `package.json`의 스크립트 한 줄이었는데, Next.js에서는 Static Export 설정이 별도로 필요했습니다.

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

## 마이그레이션 후 달라진 것들

### 좋아진 점

- 의존성이 61개 → 39개로 줄었고, 개발 서버 시작도 훨씬 빨라졌습니다.
- 프로젝트 구조가 직관적입니다.

```text
src/app/
├── page.tsx                 # 홈페이지
├── posts/[slug]/page.tsx    # 블로그 포스트
├── tags/page.tsx            # 태그 페이지
└── layout.tsx               # 레이아웃
```

- TypeScript 지원이 더 매끄럽습니다. App Router와의 조합이 특히 그랬습니다.

### 생각보다 힘들었던 점

기존에 플러그인으로 간단히 해결되던 기능들을 직접 구현하는 데 시간이 꽤 들었습니다.
TOC 생성 로직만 30줄, 이미지 경로 변환 20줄, 마크다운 파이프라인 전체가 248줄.
Gatsby는 에코시스템이 성숙해서 대부분의 엣지 케이스가 이미 처리되어 있었는데,
Next.js에서는 그걸 하나하나 직접 핸들링해야 했습니다.

## 마이그레이션을 통해 배운 교훈들

### "더 좋은 기술"이 반드시 "더 쉬운 길"은 아니다

Next.js가 처음에는 단순해 보였지만, 실제로는 Gatsby에서 플러그인이 해주던 것들을
직접 구현해야 하는 상황이었습니다. 겉보기에는 심플한데 실제로는
훨씬 많은 코드 작성이 필요한 경우였습니다.

### 두 프레임워크 모두 장단점이 있다

Gatsby는 풍부한 플러그인 생태계 덕분에 초기 개발이 빠릅니다.
반면 개발 환경이 무겁고 GraphQL이 불필요한 오버헤드처럼 느껴질 때가 있습니다.
Next.js는 번들이 가볍고 구조가 직관적이지만, 직접 구현해야 할 부분이 많고
초기 투자 시간이 필요합니다. 어느 쪽이 낫다기보다 상황에 따른 선택의 문제인 것 같습니다.

### 기술적으로 우아한 것보다 안정적으로 동작하는 것

때로는 더 세련된 솔루션보다 이미 잘 동작하고 있는 솔루션이 더 가치있을 수 있다는 걸 이번 마이그레이션에서 다시 한번 느꼈습니다.

## 결론

현재 블로그는 Next.js 14 기반으로 안정적으로 운영되고 있습니다. 모든 기존 기능을 옮겨왔고 draft 시스템도 잘 돌아갑니다.

```tsx
// layout.tsx의 footer
<footer>Built with Next.js 14 {/* ✅ */}</footer>
```

마이그레이션 자체는 성공했고 지금은 만족스럽게 쓰고 있습니다.
다만 돌아보면 "Gatsby에 명확한 불만이 있어서"보다는 "Next.js가 요즘 핫하니까"에
가까운 동기였는데, 그런 이유라면 생각보다 품이 많이 든다는 걸 미리 알았으면 좋았을 것 같습니다.

---

_PS: 이 글을 작성하면서도 Next.js의 마크다운 파이프라인을 사용했습니다. 248줄의 코드가 또 한 번 증명했듯이, 기술 선택에는 항상 trade-off가 있습니다._
