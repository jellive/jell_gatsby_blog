# E2E Testing Guide

이 프로젝트는 Playwright를 사용하여 블로그의 종합적인 E2E 테스트를 제공합니다.

## 테스트 구성

### 테스트 파일 구조

```text
tests/e2e/
├── blog-navigation.spec.ts      # 블로그 내비게이션 및 UI 테스트
├── url-routing.spec.ts          # URL 라우팅 및 계층 구조 테스트
├── blog-post.spec.ts           # 블로그 포스트 기능 테스트
├── search-and-tags.spec.ts     # 검색 및 태그 시스템 테스트
└── performance-accessibility.spec.ts # 성능 및 접근성 테스트
```

### 테스트 범위

#### 1. 블로그 내비게이션 (blog-navigation.spec.ts)

- ✅ 홈페이지 로딩 확인
- ✅ 네비게이션 메뉴 동작
- ✅ 테마 토글 기능
- ✅ 모바일 반응형 네비게이션
- ✅ 뒤로가기 내비게이션

#### 2. URL 라우팅 (url-routing.spec.ts)

- ✅ 계층 구조 URL 정상 동작 (`/posts/dev/blog/2025/08/14/title`)
- ⚠️ URL 인코딩 이슈 검증 (`dev%2Fblog%2F...` → 404 현상)
- ✅ 한국어 URL 지원
- ✅ 카테고리별 URL 패턴
- ✅ 날짜 기반 URL 구조
- ✅ 잘못된 URL에 대한 404 처리
- ✅ URL 구조 일관성 검증

#### 3. 블로그 포스트 (blog-post.spec.ts)

- ✅ 포스트 콘텐츠 표시
- ✅ 목차(TOC) 기능
- ✅ 코드 신택스 하이라이팅
- ✅ 포스트 메타데이터 (날짜, 카테고리, 태그)
- ✅ 이미지 표시 및 최적화
- ✅ 소셜 공유 버튼
- ✅ 콘텐츠 포맷팅 (한국어 텍스트 포함)
- ✅ 댓글 시스템 (Disqus)

#### 4. 검색 및 태그 (search-and-tags.spec.ts)

- ✅ 검색 페이지 로딩
- ✅ 검색 기능 (한국어/영어 검색어)
- ✅ 검색 필터 (카테고리, 태그)
- ✅ 태그 페이지 표시
- ✅ 태그 링크 동작
- ✅ 태그별 포스트 필터링
- ✅ 검색 결과 없음 상태
- ✅ 키보드 내비게이션
- ✅ 태그 클라우드 시각적 표시

#### 5. 성능 및 접근성 (performance-accessibility.spec.ts)

- ✅ 페이지 로딩 성능 측정
- ✅ 이미지 최적화 확인
- ✅ 키보드 내비게이션 접근성
- ✅ 스크린 리더 지원
- ✅ 색상 대비 및 다크 모드
- ✅ 모바일 반응형 디자인
- ✅ 폰트 로딩 및 표시
- ✅ JavaScript 성능
- ✅ SEO 메타 태그

## 테스트 실행 방법

### 기본 실행

```bash
# 모든 E2E 테스트 실행
npm run test:e2e

# UI 모드로 테스트 실행 (상호작용 가능)
npm run test:e2e:ui

# 헤드리스가 아닌 브라우저에서 실행 (시각적 확인)
npm run test:e2e:headed

# 디버그 모드로 실행
npm run test:e2e:debug

# 테스트 리포트 보기
npm run test:e2e:report
```

### 특정 테스트 파일 실행

```bash
# URL 라우팅 테스트만 실행
npx playwright test url-routing

# 성능 테스트만 실행
npx playwright test performance-accessibility

# 특정 브라우저에서만 실행
npx playwright test --project=chromium
```

### 모바일 테스트

```bash
# 모바일 Chrome에서 테스트
npx playwright test --project="Mobile Chrome"

# 모바일 Safari에서 테스트
npx playwright test --project="Mobile Safari"
```

## 설정 구성

### 브라우저 지원

- ✅ Desktop Chrome
- ✅ Desktop Firefox
- ✅ Desktop Safari
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

### 테스트 환경

- **기본 URL**: `http://localhost:9000`
- **개발 서버**: 자동으로 시작/중지
- **타임아웃**: 120초
- **재시도**: CI에서만 2회
- **병렬 실행**: 지원

## 알려진 이슈

### 1. URL 인코딩 문제 ⚠️

- **문제**: URL에 `%2F` (인코딩된 슬래시)가 포함된 경우 404 오류
- **영향**: `dev%2Fblog%2F2025%2F08%2F14%2Fpost-title` 형태의 URL
- **해결책**: URL 디코딩 미들웨어 추가 필요
- **테스트**: `url-routing.spec.ts`에서 검증됨

### 2. 컴포넌트 테스트 ID 추가 필요

- **문제**: 일부 컴포넌트에 `data-testid` 속성 부족
- **영향**: 테스트 안정성 및 명확성
- **해결책**: 주요 컴포넌트에 테스트 ID 추가

### 3. 접근성 개선 사항

- **문제**: 일부 이미지의 alt 텍스트 누락 가능성
- **해결책**: 모든 이미지에 적절한 alt 텍스트 확인

## 테스트 결과 해석

### 성공 기준

- ✅ 모든 기본 내비게이션 작동
- ✅ 계층 구조 URL 정상 동작
- ✅ 블로그 포스트 표시 및 기능
- ✅ 검색 및 태그 시스템 동작
- ✅ 기본 성능 및 접근성 기준 만족

### 실패 시 확인사항

1. 개발 서버가 정상 실행 중인지 확인
2. 포트 9000이 사용 가능한지 확인
3. 블로그 포스트 데이터가 존재하는지 확인
4. 테스트 대상 컴포넌트에 올바른 `data-testid` 속성이 있는지 확인

## 테스트 확장

### 새로운 테스트 추가

1. `tests/e2e/` 디렉토리에 `.spec.ts` 파일 생성
2. 기존 테스트 파일을 참고하여 구조 작성
3. `data-testid` 속성을 적절히 활용
4. 다국어 지원 고려 (한국어/영어)

### 성능 테스트 확장

- Core Web Vitals 측정 추가
- 번들 사이즈 분석
- 이미지 최적화 검증
- 캐시 정책 확인

### 접근성 테스트 확장

- ARIA 라벨 검증
- 키보드 내비게이션 완전성
- 색상 대비 자동 측정
- 스크린 리더 호환성

이 E2E 테스트 시스템을 통해 블로그의 전반적인 품질과 사용자 경험을 지속적으로 검증하고 개선할 수 있습니다.
