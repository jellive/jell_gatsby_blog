---
title: '개발자의 PARA+GTD 자동화 시스템 구축기 - Obsidian + Cursor AI로 매일 아침 5분 루틴 만들기'
date: '2026-02-26'
category: 'Blog'
tags:
  [
    'productivity',
    'gtd',
    'para',
    'obsidian',
    'cursor-ide',
    'automation',
    'ai-tools',
    'second-brain',
  ]
---

## 목차

```toc

```

## 개발자에게 생산성 시스템이 필요한 이유

프리랜서 프로젝트, 사이드 프로젝트, 구직 활동, 블로그 운영을 동시에 하다 보면 머릿속이 혼란스러워집니다.

"오늘 뭐부터 하지?"

매일 아침 이 질문에 답하는 데 30분을 쓰고 있었습니다. 할 일 목록은 여기저기 흩어져 있고, 어제 뭘 했는지도 가물가물하고, 다음에 뭘 해야 하는지도 불분명했습니다.

저는 현재 Flutter 모바일 앱(빈자리), NestJS 백엔드(쿡팅 서버),
Next.js 웹앱(커플 플래너), Electron 데스크톱 앱(Dev Utils Hub) 등
여러 프로젝트를 병행하고 있습니다.
여기에 구직 활동과 면접 준비까지 더해지면 머릿속만으로는 절대 관리할 수 없습니다.

그래서 PARA와 GTD를 결합한 시스템을 만들었고, Cursor AI로 그 시스템을 **자동화**했습니다.

결과적으로 매일 아침 5분이면 하루 계획이 세워집니다. AI가 어제 분석부터 오늘 추천까지 다 해주니까요.

## PARA + GTD, 뭐가 다른가

### PARA: 정보의 구조

Tiago Forte의 PARA 방법론은 모든 정보를 네 가지로 분류합니다.

- **Projects**: 명확한 목표와 마감이 있는 것 (예: "쿡팅 v2.0 출시")
- **Areas**: 지속적으로 관리해야 하는 영역 (예: "건강", "재정", "개발 실력")
- **Resources**: 참고 자료 (예: "TypeScript 패턴", "면접 질문 모음")
- **Archive**: 완료되거나 비활성화된 것

### GTD: 행동의 관리

David Allen의 GTD(Getting Things Done)는 행동을 다섯 단계로 관리합니다.

1. **Capture**: 머릿속 모든 것을 꺼내서 기록
2. **Clarify**: "이건 뭐지? 행동이 필요한가?"
3. **Organize**: 적절한 곳에 배치 (Next Actions, Projects, Waiting For)
4. **Reflect**: 정기적으로 검토 (Daily, Weekly, Monthly)
5. **Engage**: 적절한 행동을 선택하고 실행

### 결합의 시너지

PARA는 "어디에 넣을까"를, GTD는 "언제 뭘 할까"를 해결합니다. 둘을 합치면 정보 관리와 행동 관리가 하나의 시스템으로 통합됩니다.

```text
PARA (정보 구조)  +  GTD (행동 관리)  =  Second Brain
     "어디에?"          "언제 뭘?"         "자동으로!"
```

## Obsidian 볼트 구조

실제로 사용 중인 Obsidian 볼트 구조입니다.

```text
Jell/
├── 🏠 PARA System Index.md        # PARA 시스템 허브
├── Projects/                       # 활성 프로젝트
│   ├── 냉장고를 부탁해/            # NestJS + Flutter 앱
│   ├── couple-planner/             # Next.js 웹앱
│   └── ...
├── Areas/                          # 지속 관리 영역
│   ├── GTD-System/                 # GTD 핵심 폴더 ⭐
│   │   ├── 🌅 내일 아침 Review 가이드.md  # Morning Preview
│   │   ├── 📊 GTD Dashboard.md
│   │   ├── 📥 Inbox.md
│   │   ├── 📋 Next Actions.md
│   │   ├── Daily-Reviews/          # 아카이브
│   │   └── Completed-Items-YYYY-MM.md
│   ├── 개발자로서의 나/
│   └── 건강/
├── Resources/                      # 참고 자료
│   ├── TypeScript/
│   ├── Flutter/
│   └── ...
└── Archive/                        # 완료된 프로젝트
```

핵심 파일은 `Areas/GTD-System/` 안에 있습니다. 특히 `🌅 내일 아침 Review 가이드.md`가 이 시스템의 심장입니다.

## 핵심: Morning Preview 시스템

"Morning Review"가 아니라 **"Morning Preview"**입니다. 아침에 하는 건 회고가 아니라 **오늘의 미리보기**이니까요.

### Morning Preview의 구조

매일 이 파일 하나만 열면 됩니다.

```markdown
# 🌅 Morning Preview - 2026년 02월 26일 (목요일)

> 일본여행 리프레시 완료! 이제 구직 풀스윙 시작! 💪🔥

## 📋 어제 완료 항목 리뷰 (1분)

- Top 3 성공률 분석
- 주요 성과 정리
- 미완료 작업 → 오늘 이월

## 📥 Inbox 확인 (30초)

- 오늘 처리할 항목
- 2분 규칙 적용 항목

## 🎯 Today's Top 3 (1분)

- 🔴 Top 1: 가장 중요한 작업 (필수)
- 🟡 Top 2: 중요한 작업
- 🟢 Top 3: 선택 작업

## ⏰ Time Blocking (1분)

- Morning: 자전거 + 준비
- Afternoon: Deep Work (Top 1)
- Evening: Top 2, 3

## 🚀 첫 작업 준비 (1분 30초)

- 준비물 체크리스트
- 첫 5분 액션 (구체적!)
- 시작 신호
```

이 구조를 매일 직접 작성하면 30분은 걸립니다. 하지만 AI에게 맡기면 **자동으로 생성됩니다**.

### 각 섹션이 존재하는 이유

**어제 리뷰 (1분)**: 어제 뭘 했는지 모르면 오늘 뭘 할지도 모릅니다. 성공률을 숫자로 보면 현실적인 계획을 세울 수 있습니다.

**Top 3 (1분)**: 하루에 할 수 있는 의미 있는 작업은 기껏해야 3개입니다. 10개 적어놓고 3개만 하면 실패한 느낌이지만, 3개 적어놓고 3개 하면 성공입니다.

**첫 5분 액션 (1분 30초)**: 가장 어려운 건 시작입니다.
"사이드 프로젝트 배포 준비"라고만 적으면 막막하지만,
"14:00에 스테이징 서버 접속 → 최종 체크리스트 확인"이라고 적으면 그냥 따라가면 됩니다.

## Cursor AI 자동화 설정

여기가 이 글의 핵심입니다. Obsidian 볼트에 `.cursorrules` 파일을 만들어 Cursor AI가 PARA+GTD 에이전트 역할을 하도록 설정했습니다.

### .cursorrules 핵심 설정

`.cursorrules` 파일은 약 800줄입니다. 핵심적인 부분만 추려보면 다음과 같습니다.

```text
# PARA+GTD 자동화 에이전트 - Cursor Rules

## 에이전트 역할
당신은 PARA+GTD 자동화 어시스턴트입니다.
1. Daily Review 완료 후 Morning Preview 자동 아카이빙
2. 다음날 Morning Preview 가이드 자동 생성
3. 어제 작업 성공 여부 분석
4. 오늘 추천 작업 세세하게 제안
5. GTD 시스템 상태 모니터링 및 업데이트
6. 일-생활 균형 보장
```

### 자동 실행 트리거

사용자(저)가 특정 키워드를 말하면 AI가 자동으로 워크플로우를 실행합니다.

```text
"Daily Review 완료" → Morning Preview 자동 아카이빙
"내일 준비"         → 다음날 Morning Preview 생성
"오늘 Top 3"        → 오늘 추천 작업 표시
"분석해줘"          → 최근 생산성 패턴 분석
```

### Morning Preview 생성 로직

AI에게 다음 파일들을 읽고 분석하라고 지시합니다.

1. **어제 Morning Preview** → Top 3 성공률 분석
2. **Next Actions.md** → 마감 임박한 작업 확인
3. **Inbox.md** → 새로 추가된 항목 확인
4. **Projects MOC** → 프로젝트 진행률 확인

그리고 이 데이터를 기반으로 오늘의 Top 3를 추천합니다.

```text
추천 기준:
1순위: 어제 미완료 작업
2순위: Next Actions의 마감 임박 작업
3순위: 진행률 낮은 프로젝트의 Next Action
4순위: Context & Energy 매칭 (High Energy → 어려운 작업)
```

### 파일 경로 설정

AI가 정확한 파일을 찾을 수 있도록 절대 경로를 명시합니다.

```text
BASE_PATH = /Users/jellpd/Library/Mobile Documents/
            iCloud~md~obsidian/Documents/Jell

MORNING_REVIEW = {BASE_PATH}/Areas/GTD-System/🌅 내일 아침 Review 가이드.md
DAILY_REVIEWS  = {BASE_PATH}/Areas/GTD-System/Daily-Reviews/
INBOX          = {BASE_PATH}/Areas/GTD-System/📥 Inbox.md
NEXT_ACTIONS   = {BASE_PATH}/Areas/GTD-System/📋 Next Actions.md
```

## 주말 자동 휴식 모드

이 시스템에서 가장 자랑하고 싶은 기능입니다.

### 왜 필요한가

개발자는 번아웃에 취약합니다. 특히 프리랜서나 사이드 프로젝트가 많으면 "주말에도 뭔가 해야 하는데..."라는 압박감에 시달립니다.

그래서 **토요일과 일요일은 자동으로 휴식 모드**가 됩니다. AI가 내일이 주말인지 체크해서 템플릿을 바꿉니다.

### 주말 Morning Preview

```markdown
# 🌅 Morning Preview - 토요일

> 🛌 완전한 휴식의 날! 주말은 푹 쉬는 날! 💤✨

## 🎯 Today's Top 3

### 🔴 Top 1: 완전한 휴식 및 컨디션 회복 (필수!)

- 계획된 작업 금지!
- 스트레스 받는 일 → 평일에!

### 🟡 Top 2: (선택) 뜬금없이 하고 싶은 것

- 하고 싶으면 함
- 하기 싫으면 안 함
- 의무감 0%, 즐거움 100%

### 🟢 Top 3: 없음!

## 첫 5분 액션

1. 눈 뜨기
2. "오늘은 주말!" 확인
3. 다시 눈 감기
4. 계속 자기! 💤
```

처음에는 농담 같지만, **"계획된 작업 0개가 목표"**라는 명시적인 선언이 실제로 죄책감을 줄여줍니다.

### 주말 예외 처리

물론 주말에도 해야 할 일이 있을 수 있습니다. "이번 주말에 면접 준비해야 해"처럼 명시적으로 언급한 경우에만 작업이 추가됩니다.

```text
판단 기준:
- 사용자가 "이번 주말에 XX 해야 해" → 작업 추가
- 그 외 모든 경우 → 무조건 휴식 모드
```

## 자전거 타기 루틴 자동화

건강 루틴도 시스템에 통합했습니다.

### 기본 규칙 (재택/휴일)

```text
09:00-11:00  자전거 타기 🚴
11:00-12:00  샤워 & 점심 준비
12:00-13:00  점심 & 휴식
13:00~       Deep Work 시작 (Top 1 작업)
```

### 자동 판단 로직

```text
회사 출근 → 자전거 일정 자동 제거
재택 근무 → 자전거 기본 포함
휴일 + 전날 여유 → "🚴 어제 여유로웠으니 자전거 타기 좋은 날!"
```

오전에 자전거를 타고 오면 오후에 집중력이 확 올라갑니다. 운동 후 2-3시간이 Golden Hour입니다.

## 실전 워크플로우

### 하루의 흐름

```text
전날 밤 or 당일 아침:
  "내일 준비" 입력
  → AI가 자동으로 Morning Preview 생성

아침 (5분):
  Obsidian에서 Morning Preview 열기
  → 어제 뭘 했는지 확인 ✅
  → 오늘 Top 3 확인 ✅
  → Time Blocking 확인 ✅
  → 첫 5분 액션 확인 ✅
  → 바로 시작!

저녁 (5분):
  "Daily Review 완료" 입력
  → Morning Preview가 Daily-Reviews/로 자동 아카이브
  → 내일 Morning Preview 생성
```

### 실제 사례: 사이드 프로젝트 베타 출시 D-3

사이드 프로젝트 베타 출시를 3일 앞둔 개발자가 받은 Morning Preview 예시입니다.

```markdown
## 🔴 Top 1: 랜딩 페이지 최종 검수 및 배포 (필수!)

**Why Important:**

- 🚀 베타 출시 D-3 — 지금 시작해야 기간 내 완료 가능
- ✅ 지난 주 피드백 반영 완료 — 이제 최종 확인만 남았음
- 📣 대기 중인 베타 테스터 — 빠를수록 피드백 루프 시작됨

예상 시간: 2~3시간
Best Time: 14:00~17:00 (High Energy, Deep Work)

**구체적 단계:**

1. (14:00-14:30) 모바일/데스크톱 반응형 최종 확인
2. (14:30-15:00) 핵심 플로우(회원가입 → 온보딩) 시나리오 테스트
3. (15:00-15:30) 스테이징 → 프로덕션 배포
4. (15:30-16:00) 배포 후 에러 모니터링 및 이상 없으면 완료

**예상 장애물 & 해결책:**

- "아직 완벽하지 않은데..." → Done is better than perfect!
- 예상치 못한 버그 발견 → 즉시 Inbox에 추가, 베타 기간에 처리
```

AI가 왜 이 작업이 중요한지, 언제 하면 좋은지, 어떤 순서로 하면 되는지, 막힐 때 어떻게 하면 되는지까지 알려줍니다. 아침에 이걸 보면 고민 없이 바로 시작할 수 있습니다.

## 시스템 도입 후 변화

### 숫자로 보는 변화

| 항목           | 도입 전       | 도입 후   |
| -------------- | ------------- | --------- |
| 아침 계획 시간 | 20~30분       | 5분       |
| Top 3 완료율   | 50~60%        | 80% 이상  |
| Weekly Review  | 건너뛰기 일쑤 | 매주 완료 |
| 주말 죄책감    | 높음          | 거의 없음 |
| Inbox 처리     | 주 1~2회      | 매일      |

### 정성적 변화

**"뭐 하지?" 고민이 사라졌습니다.** Morning Preview를 열면 답이 있습니다.

**미완료 작업이 자동으로 이월됩니다.** 예전에는 어제 못 한 작업을 까먹고 새 작업을 시작했는데, 이제는 AI가 "어제 미완료 → 오늘 Top 3 후보"로 자동 추천합니다.

**주말에 진짜 쉽니다.** 시스템이 "오늘은 쉬는 날"이라고 말해주니까 죄책감 없이 쉴 수 있습니다.

## 직접 구축하기

### 최소 구성

필요한 것:

- Obsidian (무료)
- Cursor IDE (무료 or Pro)
- 30분의 초기 설정 시간

### Step 1: Obsidian 폴더 구조 만들기

```text
YourVault/
├── Areas/
│   └── GTD-System/
│       ├── 🌅 Morning Preview.md
│       ├── 📥 Inbox.md
│       ├── 📋 Next Actions.md
│       └── Daily-Reviews/
├── Projects/
├── Resources/
└── Archive/
```

### Step 2: .cursorrules 파일 만들기

Obsidian 볼트 루트에 `.cursorrules` 파일을 만듭니다. 핵심 규칙은 세 가지입니다.

**1. AI의 역할 정의:**

```text
당신은 PARA+GTD 자동화 어시스턴트입니다.
사용자가 "내일 준비"라고 하면:
1. 어제 Morning Preview 파일 분석
2. Inbox.md, Next Actions.md 확인
3. Top 3 추천 생성
4. Time Blocking 제안
5. Morning Preview 파일 생성
```

**2. 파일 경로 명시:**

AI가 읽고 써야 할 파일의 정확한 경로를 명시합니다.

**3. 템플릿 정의:**

Morning Preview의 구조를 템플릿으로 정의해두면 AI가 매번 일관된 형식으로 생성합니다.

### Step 3: 매일 사용하기

처음 2주가 습관 형성 기간입니다. "내일 준비" → 아침에 Preview 열기 → 저녁에 "Daily Review 완료"를 반복하면 자연스럽게 루틴이 됩니다.

## 운영하면서 배운 것

### 1. 완벽보다 일관성

처음에는 템플릿을 완벽하게 만들려고 했습니다. 섹션을 20개로 나누고, 통계를 자동 계산하고, 그래프까지 넣으려 했습니다.

결론: **매일 5분 안에 끝나는 게 중요합니다.** 10분 걸리면 안 하게 됩니다.

### 2. AI가 놓치는 것

AI는 "어제 몸이 안 좋았다"는 걸 모릅니다. 컨디션, 감정, 갑작스러운 일정 변경은 사용자가 직접 조정해야 합니다. AI는 데이터 기반 추천을 하고, 최종 결정은 사람이 합니다.

### 3. 시스템은 살아있어야 한다

처음 만든 .cursorrules를 6개월째 그대로 쓰고 있지 않습니다.
주말 휴식 모드는 v1.1.0에서 추가했고, 자전거 루틴은 v1.2.0,
회사 출근 시 자전거 스킵은 v1.5.0에서 추가했습니다.
사용하면서 불편한 점을 계속 개선해야 합니다.

### 4. Inbox에 넣는 습관이 가장 중요

시스템 전체에서 가장 중요한 건 "머릿속에 떠오르는 것을 즉시 Inbox에 넣는 습관"입니다.
Inbox에 안 들어간 것은 시스템에 존재하지 않습니다. 존재하지 않으면 처리될 수 없습니다.

## 한계와 다음 단계

### 현재 한계

- **수동 트리거**: "내일 준비"를 직접 입력해야 합니다. 시간 기반 자동 트리거가 있으면 좋겠습니다.
- **Cursor 의존**: Cursor IDE 안에서만 동작합니다. Obsidian 플러그인으로 만들면 더 자연스럽겠죠.
- **단일 사용자**: 팀 단위로는 아직 확장이 안 됩니다.

### 다음에 해보고 싶은 것

- Obsidian 플러그인으로 Morning Preview 자동 생성
- 주간 성과 분석 자동화 (그래프 포함)
- Notion이나 Google Calendar 연동
- GPT API 직접 호출로 IDE 의존 제거

## 마무리

생산성 시스템의 목적은 **더 많이 하는 게 아니라, 중요한 것에 집중하는 것**입니다.

PARA는 정보를 체계적으로 관리해주고, GTD는 행동을 명확하게 해주고, Cursor AI는 이 모든 걸 자동화해줍니다.

매일 아침 5분. Morning Preview를 열고, Top 3을 확인하고, 첫 5분 액션을 시작하면 됩니다. 나머지는 시스템이 알아서 합니다.

그리고 주말에는 진짜 쉬세요. 시스템이 허락합니다. 🛌

---

**참고 자료:**

- David Allen, _Getting Things Done_
- Tiago Forte, _Building a Second Brain_
- Cal Newport, _Deep Work_
- [Obsidian](https://obsidian.md/)
- [Cursor IDE](https://cursor.sh/)
