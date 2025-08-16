---
title: 'Draft 임시 게시물 예제'
date: '2025-08-14'
category: 'Notice'
tags: ['Example', 'Draft']
---

## 임시 게시물 포스트

해당 게시물은 로컬 개발 환경에서만 표시되며, 배포시에는 표시되지 않습니다.

임시 게시물(draft)은 `_drafts/category/YYYY/MM/DD/` 폴더에 위치합니다.

### 새로운 Draft 구조

이제 모든 draft 파일은 다음과 같은 구조를 따라야 합니다:

```text
_drafts/
└── category/
    └── YYYY/
        └── MM/
            └── DD/
                ├── post-title.md
                └── images/
                    └── image-files.png
```

### 작성 방법

1. 현재 날짜 확인: `date +"%Y-%m-%d"`
2. 적절한 디렉토리 생성: `mkdir -p _drafts/category/YYYY/MM/DD`
3. 마크다운 파일 생성
4. 완전한 frontmatter 작성 (title, date, category, tags 필수)

자세한 가이드는 CLAUDE.md의 "Blog Writing Guide" 섹션을 확인해주세요.