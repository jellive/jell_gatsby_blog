---
title: 'Next.js 블로그 자동화 도구 구축기'
date: '2026-01-29'
category: 'Blog'
tags: ['Blog', 'Automation', 'Makefile', 'Obsidian']
---

## 목차

```toc

```

## 개요

블로그를 운영하다 보면 반복적인 작업이 많습니다.
새 포스트를 만들 때마다 폴더 구조를 생성하고, frontmatter를 작성하고, 이미지 폴더를 만들어야 합니다.
이런 작업을 자동화하면 글쓰기에만 집중할 수 있습니다.

이 글에서는 Next.js 블로그에 구축한 자동화 도구들을 소개합니다.

## 자동화 도구 구성

### 전체 구조

블로그 자동화 시스템은 크게 네 가지 영역으로 구성됩니다.

```text
scripts/blog/
├── scaffold.js          # 포스트 템플릿 생성
├── categories.js        # 카테고리 매핑
├── quality/             # 품질 검증
│   ├── validate.js
│   ├── frontmatter-check.js
│   ├── tone-check.js
│   └── structure-check.js
├── style/               # 스타일 분석
│   ├── analyze.js
│   └── profile.json
├── generate/            # AI 연동
│   ├── generator.js
│   └── outline.js
└── obsidian/            # Obsidian 연동
    ├── reader.js
    ├── transformer.js
    └── config.js
```

### 포스트 스캐폴딩

새 포스트를 만들 때 가장 번거로운 작업은 디렉토리 구조 생성입니다.
날짜별로 폴더를 만들고, 이미지 폴더도 함께 준비해야 합니다.

`scaffold.js`는 이 작업을 한 번에 처리합니다.

```bash
node scripts/blog/scaffold.js \
  --category dev/js \
  --title "제목" \
  --tags "tag1,tag2"
```

실행하면 다음과 같은 구조가 생성됩니다.

```text
_posts/dev/js/2026/01/29/
├── 제목.md
└── images/
```

frontmatter도 자동으로 채워집니다.
카테고리에 따라 기본 태그가 추가되고, 목차 블록과 개요 섹션이 포함됩니다.

### 품질 검증

포스트를 작성한 후에는 품질을 검증해야 합니다.
`validate.js`는 세 가지 검사를 수행합니다.

#### frontmatter 검사

- 필수 필드(title, date, category) 존재 여부
- 날짜 형식 유효성
- 태그 배열 형식

#### 톤 검사

- 존댓말/반말 일관성
- 문장 어미 분석

#### 구조 검사

- 목차 블록 존재 여부
- 줄 길이 제한 (150자)
- 이미지 경로 유효성

```bash
node scripts/blog/quality/validate.js _posts/dev/blog/2026/01/29/포스트.md
```

### 스타일 분석

일관된 글쓰기 스타일을 유지하려면 기존 글의 패턴을 파악해야 합니다.
`analyze.js`는 모든 포스트를 스캔하여 스타일 프로필을 생성합니다.

분석 항목은 다음과 같습니다.

- 평균 문장 길이
- 자주 사용하는 문장 어미
- 전환어 사용 패턴
- 카테고리별 코드 블록 비율

```bash
node scripts/blog/style/analyze.js
```

결과는 `profile.json`에 저장됩니다.
새 글을 쓸 때 이 프로필을 참고하면 일관된 스타일을 유지할 수 있습니다.

### Obsidian 연동

평소에 Obsidian으로 메모를 작성하는 경우가 많습니다.
이 메모를 블로그 포스트로 변환하는 기능도 구현했습니다.

Obsidian 문법과 블로그 마크다운은 약간 다릅니다.
`transformer.js`가 이 차이를 처리합니다.

| Obsidian         | 블로그        |
| ---------------- | ------------- |
| `[[위키링크]]`   | 일반 텍스트   |
| `[[링크\|표시]]` | 표시 텍스트   |
| `> [!note]`      | `> **참고**:` |
| `==하이라이트==` | `**볼드**`    |
| `%%주석%%`       | 삭제          |

```bash
node scripts/blog/obsidian/transformer.js \
  --input ~/Documents/Obsidian/note.md \
  --output _posts/converted.md
```

PARA 방식으로 노트를 관리한다면 `reader.js`로 최근 노트를 스캔할 수 있습니다.
블로그 주제로 적합한 노트를 빠르게 찾을 수 있습니다.

## Makefile로 통합

위 도구들을 매번 긴 명령어로 실행하기는 번거롭습니다.
Makefile로 통합하면 간단한 명령어로 사용할 수 있습니다.

```makefile
new: ## 새 포스트 생성
 @read -p "카테고리: " category; \
 read -p "제목: " title; \
 node scripts/blog/scaffold.js \
   --category "$$category" \
   --title "$$title"

validate: ## 포스트 검증
 node scripts/blog/quality/validate.js "$(FILE)"

style: ## 스타일 분석
 node scripts/blog/style/analyze.js
```

주요 명령어는 다음과 같습니다.

| 명령어                                        | 설명                      |
| --------------------------------------------- | ------------------------- |
| `make new`                                    | 대화형으로 새 포스트 생성 |
| `make new-quick CATEGORY=dev/js TITLE="제목"` | 빠른 생성                 |
| `make validate FILE=경로`                     | 품질 검증                 |
| `make style`                                  | 스타일 분석               |
| `make obsidian-scan`                          | Obsidian 노트 스캔        |
| `make help`                                   | 전체 명령어 목록          |

## 워크플로우 예시

실제로 포스트를 작성하는 워크플로우를 살펴보겠습니다.

#### 1단계: 스캐폴딩

```bash
make new-quick CATEGORY=dev/js TITLE="React 성능 최적화"
```

#### 2단계: 내용 작성

생성된 파일을 열고 내용을 작성합니다.
스타일 프로필을 참고하면 일관된 톤을 유지할 수 있습니다.

#### 3단계: 검증

```bash
make validate FILE=_posts/dev/js/2026/01/29/React\ 성능\ 최적화.md
```

오류가 있으면 수정합니다.
경고는 필요에 따라 무시할 수 있습니다.

#### 4단계: 빌드 확인

```bash
make build
```

문제없이 빌드되면 배포 준비가 완료된 것입니다.

## 마무리

블로그 자동화 도구를 구축하면서 몇 가지 교훈을 얻었습니다.

우선 작은 도구부터 시작하는 것이 좋습니다.
처음부터 완벽한 시스템을 만들려고 하면 오히려 복잡해집니다.
스캐폴딩 하나만 있어도 생산성이 크게 향상됩니다.

또한 검증 도구는 엄격하게 만들되, 경고와 오류를 구분해야 합니다.
모든 것을 오류로 처리하면 피로감이 쌓입니다.
핵심적인 것만 오류로, 나머지는 경고로 처리하는 것이 좋습니다.

마지막으로 Makefile은 훌륭한 진입점입니다.
복잡한 스크립트도 `make 명령어` 형태로 단순화할 수 있습니다.
`make help`로 사용 가능한 명령어를 보여주면 더욱 편리합니다.

이 글에서 소개한 도구들이 블로그 운영에 도움이 되길 바랍니다.
