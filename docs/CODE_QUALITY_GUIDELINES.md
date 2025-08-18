# 코드 품질 가이드라인

**목표**: 유지보수 가능하고 확장 가능한 고품질 코드베이스 구축  
**원칙**: 타입 안전성, 가독성, 테스트 가능성, 성능 최적화  
**적용 범위**: TypeScript/React 컴포넌트, 유틸리티 함수, 테스트 코드

## 🎯 코드 품질 목표

### 정량적 목표

| 지표                     | 현재   | 목표 | 측정 도구         |
| ------------------------ | ------ | ---- | ----------------- |
| TypeScript strict 적용률 | 80%    | 95%  | tsc --noEmit      |
| 테스트 커버리지          | 0%     | 80%  | Jest coverage     |
| ESLint 규칙 준수율       | 85%    | 98%  | ESLint report     |
| 코드 중복도              | 미측정 | <3%  | SonarQube         |
| 순환 복잡도              | 미측정 | <10  | ESLint complexity |

### 정성적 목표

- 📖 **가독성**: 코드만 보고도 의도를 파악할 수 있는 수준
- 🛡️ **타입 안전성**: 런타임 오류 최소화
- 🧪 **테스트 가능성**: 단위 테스트 작성이 용이한 구조
- 🔄 **재사용성**: 컴포넌트와 함수의 높은 재사용성
- ⚡ **성능**: 불필요한 렌더링과 연산 최소화

## 📋 TypeScript 활용 가이드라인

### 1.1 타입 정의 강화

**현재 tsconfig.json 개선**:

```json
{
  "compilerOptions": {
    // 기존 설정 유지
    "strict": true,
    "noEmit": true,

    // 추가 엄격한 설정
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "noPropertyAccessFromIndexSignature": true,

    // 고급 타입 체크
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true
  }
}
```

### 1.2 인터페이스 설계 패턴

**컴포넌트 Props 인터페이스**:

```typescript
// ❌ 약한 타입 정의
interface HeaderProps {
  siteTitle: string
  [key: string]: any // 지양해야 할 패턴
}

// ✅ 강한 타입 정의
interface HeaderProps {
  readonly siteTitle: string
  readonly className?: string
  readonly onNavigate?: (path: string) => void
  readonly testId?: string
}

// ✅ 제네릭을 활용한 재사용 가능한 타입
interface BaseComponentProps<T = HTMLDivElement> {
  readonly className?: string
  readonly children?: React.ReactNode
  readonly testId?: string
  readonly ref?: React.Ref<T>
}

interface ButtonProps extends BaseComponentProps<HTMLButtonElement> {
  readonly variant: 'primary' | 'secondary' | 'outline'
  readonly size: 'sm' | 'md' | 'lg'
  readonly onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  readonly disabled?: boolean
}
```

### 1.3 유틸리티 타입 활용

**도메인 타입 정의**:

```typescript
// src/types/blog.ts
export interface PostFrontMatter {
  readonly category: string
  readonly date: string
  readonly title: string
  readonly tags: readonly string[]
  readonly featuredImage?: string
}

export interface PostData {
  readonly slug: string
  readonly frontMatter: PostFrontMatter
  readonly content: string
  readonly htmlContent: string
  readonly excerpt: string
  readonly path: string
  readonly tableOfContents: string
  readonly isDraft: boolean
}

// 유틸리티 타입을 활용한 변형
export type PostSummary = Pick<PostData, 'slug' | 'frontMatter' | 'excerpt'>
export type PostMeta = Omit<PostData, 'content' | 'htmlContent'>
export type CreatePostData = Omit<PostData, 'slug' | 'isDraft'>

// 조건부 타입 활용
export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string; code?: number }
```

### 1.4 타입 가드 및 Assertion

**타입 안전한 데이터 검증**:

```typescript
// src/lib/type-guards.ts
export function isValidPostFrontMatter(data: unknown): data is PostFrontMatter {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).category === 'string' &&
    typeof (data as any).date === 'string' &&
    typeof (data as any).title === 'string' &&
    Array.isArray((data as any).tags) &&
    (data as any).tags.every((tag: unknown) => typeof tag === 'string')
  )
}

export function assertValidEnv(env: string | undefined, name: string): string {
  if (!env) {
    throw new Error(`Environment variable ${name} is required`)
  }
  return env
}

// 사용 예시
const validateApiResponse = <T>(
  response: unknown,
  validator: (data: unknown) => data is T
): T => {
  if (!validator(response)) {
    throw new Error('Invalid API response format')
  }
  return response
}
```

## 🏗️ 컴포넌트 설계 패턴

### 2.1 컴포넌트 구조 표준화

**기본 컴포넌트 템플릿**:

```typescript
// components/ui/ExampleComponent/index.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import { ExampleComponentProps } from './types'
import { useExampleComponent } from './hooks'
import styles from './ExampleComponent.module.css'

const ExampleComponent: React.FC<ExampleComponentProps> = ({
  className,
  children,
  testId = 'example-component',
  ...props
}) => {
  const { state, handlers } = useExampleComponent(props)

  return (
    <div
      className={cn(styles.container, className)}
      data-testid={testId}
      {...state.containerProps}
    >
      {children}
    </div>
  )
}

export default ExampleComponent

// components/ui/ExampleComponent/types.ts
export interface ExampleComponentProps extends BaseComponentProps {
  readonly variant?: 'primary' | 'secondary'
  readonly onAction?: (value: string) => void
}

// components/ui/ExampleComponent/hooks.ts
export function useExampleComponent(props: ExampleComponentProps) {
  const [state, setState] = useState(initialState)

  const handlers = useMemo(() => ({
    handleAction: (value: string) => {
      props.onAction?.(value)
      setState(prev => ({ ...prev, value }))
    }
  }), [props.onAction])

  return { state, handlers }
}
```

### 2.2 Hook 설계 패턴

**Custom Hook 모범 사례**:

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect, useCallback } from 'react'

type SetValue<T> = (value: T | ((val: T) => T)) => void

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>, () => void] {
  // 타입 안전한 초기값 설정
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      if (typeof window === 'undefined') return initialValue

      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // 메모화된 setter
  const setValue: SetValue<T> = useCallback(
    value => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // 값 제거 함수
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
      setStoredValue(initialValue)
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
```

### 2.3 상태 관리 패턴

**Context + Reducer 패턴**:

```typescript
// contexts/BlogContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react'

interface BlogState {
  readonly posts: PostData[]
  readonly loading: boolean
  readonly error: string | null
  readonly searchQuery: string
  readonly selectedTags: readonly string[]
}

type BlogAction =
  | { type: 'SET_POSTS'; payload: PostData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_TAG'; payload: string }

function blogReducer(state: BlogState, action: BlogAction): BlogState {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload, loading: false, error: null }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'TOGGLE_TAG':
      return {
        ...state,
        selectedTags: state.selectedTags.includes(action.payload)
          ? state.selectedTags.filter(tag => tag !== action.payload)
          : [...state.selectedTags, action.payload],
      }
    default:
      return state
  }
}

const BlogContext = createContext<{
  state: BlogState
  actions: {
    setPosts: (posts: PostData[]) => void
    setLoading: (loading: boolean) => void
    setError: (error: string | null) => void
    setSearchQuery: (query: string) => void
    toggleTag: (tag: string) => void
  }
} | null>(null)

export function useBlog() {
  const context = useContext(BlogContext)
  if (!context) {
    throw new Error('useBlog must be used within BlogProvider')
  }
  return context
}
```

## 🧪 테스트 전략 및 구현

### 3.1 테스트 환경 설정

**Jest + Testing Library 설정**:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev @testing-library/user-event jest-environment-jsdom
```

```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### 3.2 컴포넌트 테스트 패턴

**React 컴포넌트 테스트**:

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = jest.fn()

    render(<Button onClick={handleClick}>Click me</Button>)

    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct CSS classes for variants', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-primary')

    rerender(<Button variant="secondary">Secondary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-transparent')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

### 3.3 유틸리티 함수 테스트

**함수 테스트 예시**:

```typescript
// __tests__/lib/utils.test.ts
import { cn, formatDate, slugify } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('cn (class names)', () => {
    it('combines class names correctly', () => {
      expect(cn('base', 'additional')).toBe('base additional')
      expect(cn('base', undefined, 'additional')).toBe('base additional')
      expect(cn('base', false && 'conditional')).toBe('base')
    })
  })

  describe('formatDate', () => {
    it('formats date correctly', () => {
      expect(formatDate('2024-01-15')).toBe('2024년 1월 15일')
    })

    it('handles invalid dates', () => {
      expect(formatDate('invalid')).toBe('Invalid Date')
    })
  })

  describe('slugify', () => {
    it('creates proper slugs', () => {
      expect(slugify('Hello World!')).toBe('hello-world')
      expect(slugify('한글 제목')).toBe('한글-제목')
    })
  })
})
```

### 3.4 E2E 테스트 개선

**기존 Playwright 테스트 강화**:

```typescript
// tests/e2e/blog-functionality.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Blog Core Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display blog posts correctly', async ({ page }) => {
    // 포스트 목록 확인
    const postList = page.locator('[data-testid="post-list"]')
    await expect(postList).toBeVisible()

    // 첫 번째 포스트 클릭
    const firstPost = page.locator('[data-testid="post-item"]').first()
    await expect(firstPost).toBeVisible()

    const postTitle = await firstPost.locator('h2').textContent()
    await firstPost.click()

    // 포스트 상세 페이지 확인
    await expect(page.locator('h1')).toContainText(postTitle || '')
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible()
  })

  test('should support search functionality', async ({ page }) => {
    // 검색 팔레트 열기
    await page.keyboard.press('Meta+K')

    const searchInput = page.locator('[data-testid="search-input"]')
    await expect(searchInput).toBeVisible()

    // 검색어 입력
    await searchInput.fill('Next.js')

    // 검색 결과 확인
    const searchResults = page.locator('[data-testid="search-results"]')
    await expect(searchResults).toBeVisible()
  })
})
```

## 🎨 스타일 및 컨벤션

### 4.1 네이밍 컨벤션

**파일 및 디렉토리 명명**:

```
✅ 좋은 예시
components/
├── ui/
│   ├── Button/
│   │   ├── index.tsx          # 기본 export
│   │   ├── types.ts           # 타입 정의
│   │   ├── hooks.ts           # 커스텀 훅
│   │   └── Button.test.tsx    # 테스트
│   └── Card/
├── feature/
│   ├── PostList/
│   └── Header/
└── layout/
    ├── BlogLayout/
    └── PageLayout/

❌ 피해야 할 패턴
components/
├── button.tsx                 # 소문자 시작
├── post-list.tsx             # kebab-case
├── PostListComponent.tsx      # 불필요한 접미사
```

**변수 및 함수 명명**:

```typescript
// ✅ 좋은 예시
const userAuthenticated = true
const fetchUserData = async (userId: string) => {}
const handleButtonClick = (event: React.MouseEvent) => {}

// Boolean 값
const isLoading = false
const hasError = true
const canEdit = false

// 상수
const MAX_RETRY_COUNT = 3
const API_ENDPOINTS = {
  USERS: '/api/users',
  POSTS: '/api/posts',
} as const

// ❌ 피해야 할 패턴
const flag = true // 의미 불명확
const data = [] // 너무 일반적
const temp = {} // 임시 변수명
```

### 4.2 코드 포맷팅 규칙

**Prettier 설정**:

```json
// .prettierrc
{
  "semi": false,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

**ESLint 규칙**:

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { "argsIgnorePattern": "^_" }
    ],
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error",
    "no-var": "error",
    "complexity": ["warn", 10],
    "max-lines-per-function": ["warn", 50],
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 4.3 주석 및 문서화

**JSDoc 활용**:

````typescript
/**
 * 블로그 포스트 데이터를 가져오는 함수
 * @param slug - 포스트의 고유 식별자
 * @param includeContent - 포스트 내용 포함 여부
 * @returns 포스트 데이터 또는 null
 * @throws {Error} 포스트를 찾을 수 없는 경우
 * @example
 * ```typescript
 * const post = await getPostBySlug('my-first-post', true)
 * if (post) {
 *   console.log(post.frontMatter.title)
 * }
 * ```
 */
export async function getPostBySlug(
  slug: string,
  includeContent: boolean = false
): Promise<PostData | null> {
  // 구현 내용
}

/**
 * React Hook for managing theme state
 * @returns theme state and toggle function
 */
export function useTheme(): {
  theme: 'light' | 'dark' | 'system'
  toggleTheme: () => void
  isDark: boolean
} {
  // 구현 내용
}
````

## 🔧 개발 도구 설정

### 5.1 VS Code 설정

**.vscode/settings.json**:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "javascript",
    "typescriptreact": "javascript"
  }
}
```

### 5.2 Git Hooks 설정

**Husky + lint-staged**:

```bash
npm install --save-dev husky lint-staged
npx husky init
```

```json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx,js,jsx}": ["eslint --fix", "prettier --write"],
    "*.{md,json}": ["prettier --write"]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
npm run type-check
```

## 📊 코드 품질 측정

### 6.1 정적 분석 도구

**SonarQube 설정** (선택사항):

```yaml
# sonar-project.properties
sonar.projectKey=jell-blog
sonar.sources=src
sonar.tests=__tests__,tests
sonar.typescript.tsconfigPath=tsconfig.json
sonar.testExecutionReportPaths=test-results/test-report.xml
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

### 6.2 코드 복잡도 관리

**복잡도 측정 스크립트**:

```javascript
// scripts/analyze-complexity.js
const { ESLint } = require('eslint')

async function analyzeComplexity() {
  const eslint = new ESLint({
    overrideConfig: {
      rules: {
        complexity: ['error', 1], // 모든 복잡도 확인
      },
    },
  })

  const results = await eslint.lintFiles(['src/**/*.{ts,tsx}'])

  const complexityIssues = results
    .flatMap(result => result.messages)
    .filter(message => message.ruleId === 'complexity')
    .sort((a, b) => b.severity - a.severity)

  console.log('복잡도가 높은 함수들:')
  complexityIssues.forEach(issue => {
    console.log(`${issue.filePath}:${issue.line} - ${issue.message}`)
  })
}

analyzeComplexity()
```

## 🚀 실행 계획

### Phase 1: 기반 구축 (1주)

- [x] TypeScript 설정 강화
- [ ] ESLint/Prettier 규칙 적용
- [ ] 테스트 환경 구축
- [ ] Git hooks 설정

### Phase 2: 코드 리팩토링 (2주)

- [ ] 컴포넌트 타입 안전성 강화
- [ ] DOM 직접 조작을 React 패턴으로 전환
- [ ] 커스텀 훅 추출 및 최적화
- [ ] 유틸리티 함수 단위 테스트 작성

### Phase 3: 테스트 커버리지 확대 (1주)

- [ ] 핵심 컴포넌트 단위 테스트
- [ ] E2E 테스트 시나리오 확장
- [ ] 통합 테스트 환경 구축
- [ ] 성능 테스트 추가

### 성공 지표

- TypeScript strict 규칙 95% 적용
- 테스트 커버리지 80% 달성
- ESLint 규칙 98% 준수
- 코드 리뷰 통과율 95% 이상

이 가이드라인을 점진적으로 적용하여 코드 품질을 체계적으로 개선할 수 있습니다.
