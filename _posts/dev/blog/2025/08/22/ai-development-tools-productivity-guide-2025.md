---
title: '2025년 AI 개발 도구로 생산성 300% 향상시키기 - 실무자 관점 완벽 가이드'
date: '2025-08-22'
category: 'Blog'
tags:
  [
    'ai-tools',
    'development',
    'productivity',
    'cursor-ide',
    'github-copilot',
    'claude-code',
    '2025',
  ]
---

## 목차

```toc

```

## AI 개발 도구, 요즘 어떻게 쓰고 있나요

핀테크 플랫폼 AzFlow를 개발하면서 AI 도구들을 꽤 열심히 써봤습니다.
솔직히 처음에는 반신반의했는데, 막상 써보니 반복 작업이 줄어드는 게 체감이 돼서 계속 쓰게 됐습니다.
도구별로 어떤 상황에서 유용했는지 실제 경험 위주로 정리해 봤습니다.

## 도구 선택에 대해

세 가지 도구를 주로 씁니다. Cursor IDE, GitHub Copilot, Claude Code입니다.

팀 규모나 프로젝트 성격에 따라 조합이 달라지는데, 저 경우엔 이렇게 쓰고 있습니다.

- 대규모 팀: GitHub Copilot 중심 (팀 협업 기능) + Claude Code (아키텍처 리뷰)
- 소규모 팀/개인: Cursor IDE 중심 + GitHub Copilot 보조

학습 곡선은 Cursor IDE가 가장 낮습니다. 기존 VS Code 쓰던 분이라면 하루 이틀이면 기본은 됩니다.
Claude Code는 익숙해지는 데 좀 더 걸리는 편이고, 그만큼 복잡한 작업에서 강점이 있습니다.

## Cursor IDE

Cursor는 VS Code 기반 AI 에디터인데, 써보면 그냥 VS Code에 AI가 잘 붙어있다는 느낌입니다.

### 초기 설정

```bash
# 기존 VS Code 설정 자동 마이그레이션
curl -O https://download.cursor.com/cursor-installer.dmg
# 설치 후 VS Code 설정 가져오기 옵션 선택
```

기존 Copilot 관련 확장과 충돌할 수 있으니 비활성화하는 게 좋습니다.

### 프로젝트 설정

```json
// .cursor/settings.json
{
  "cursor.ai.model": "gpt-4o",
  "cursor.ai.contextLength": 200000,
  "cursor.ai.enableAutoSuggestions": true,
  "cursor.ai.enableComposer": true,
  "cursor.ai.customInstructions": "TypeScript와 React를 사용하는 핀테크 프로젝트입니다. 보안을 최우선으로 고려해주세요."
}
```

### 실제로 이렇게 씁니다

컴포넌트 생성은 `Ctrl+K`로 프롬프트 입력하는 방식입니다.

```text
Ctrl+K 입력 → "React 결제 컴포넌트 생성: 카드 정보 입력, 유효성 검사, PCI DSS 준수"
```

버그 수정할 때는 `Ctrl+L`로 에러 로그 붙여넣고 원인 물어보는 방식이 편합니다.

```text
Ctrl+L 입력 → 에러 로그 붙여넣기 → "이 오류의 원인과 해결 방법을 설명해주세요"
```

### Composer 모드

이게 생각보다 쓸 만합니다. 여러 파일을 동시에 수정하는 작업에 유용한데, JWT에서 OAuth 2.0으로
인증 방식을 바꾼다든지 하는 작업을 프롬프트 하나로 처리해줍니다.

```text
Ctrl+I 입력 후:
"사용자 인증 시스템을 JWT에서 OAuth 2.0으로 변경해주세요.
관련된 모든 파일을 업데이트하고 테스트 코드도 함께 수정해주세요."
```

```text
@codebase 태그 사용:
"@codebase 이 프로젝트의 아키텍처 패턴을 분석하고 개선점을 제안해주세요"
```

## GitHub Copilot

코드 자동완성 도구로만 쓰면 아깝습니다. 프롬프팅을 어떻게 하느냐에 따라 결과물 품질이 많이 달라집니다.

### 프롬프팅 패턴

컨텍스트를 먼저 코멘트로 써두는 게 효과적입니다.

```typescript
// 사용자 결제 이력을 관리하는 서비스 클래스
// 요구사항: PCI DSS 준수, 개인정보 암호화, 감사 로그 기록
class PaymentHistoryService {
  // 결제 이력 조회 메서드 (페이지네이션 포함)
```

의도를 명확히 써두면 원하는 방향으로 잘 따라옵니다.

```typescript
// TODO: 중복 결제 방지를 위한 idempotency key 검증 로직 추가
// 동일한 키로 요청이 오면 기존 결과 반환, 새로운 키면 결제 진행
function processPayment(amount: number, idempotencyKey: string) {
```

### Copilot Chat 활용

디버깅할 때 `/explain` 명령어가 편합니다.

```text
/explain 이 코드가 메모리 누수를 일으키는 이유를 설명해주세요:
[문제가 되는 코드 붙여넣기]
```

테스트 코드 생성도 됩니다.

```text
/tests PaymentService 클래스의 모든 메서드에 대한 단위 테스트를 작성해주세요.
엣지 케이스와 에러 상황도 포함해주세요.
```

### CI에서 코드 리뷰

```yaml
# GitHub Actions에서 Copilot 활용
- name: AI Code Review
  uses: github/copilot-cli@v1
  with:
    command: 'review --security --performance --best-practices'
```

## Claude Code

복잡한 설계나 리팩토링 작업에서 가장 많이 씁니다. 단순 코드 생성보다는 시스템 전반을 보는 작업에 유용합니다.

### 리팩토링 작업

AzFlow에서 모놀리식 구조를 마이크로서비스로 분리하는 작업을 Claude Code와 같이 했습니다.

```text
/analyze 현재 코드베이스를 분석하고 마이크로서비스 분리 전략을 제안해주세요.
도메인별 경계, 데이터 의존성, API 설계를 포함해서 설명해주세요.
```

### 성능 분석

```text
/improve 이 React 애플리케이션의 성능을 분석하고 최적화 방안을 제시해주세요.
번들 크기, 렌더링 성능, 메모리 사용량을 모두 고려해주세요.
```

### 보안 검토

핀테크 특성상 보안 검토를 자주 합니다.

```text
/audit security 이 코드에서 보안 취약점을 찾아주세요:
- OWASP Top 10 기준
- 핀테크 업계 보안 표준
- 개인정보보호법 준수 여부
```

### 아키텍처 문서

```text
/document 현재 시스템의 아키텍처 문서를 생성해주세요.
C4 Model 형식으로 컨텍스트, 컨테이너, 컴포넌트 다이어그램을 포함해주세요.
```

## 도구 조합

세 도구를 같이 쓸 때는 단계별로 나눠서 씁니다.

설계 단계에서는 Claude Code로 요구사항을 정리하고 아키텍처 방향을 잡습니다.
실제 구현할 때는 Cursor IDE로 기본 구조 잡고 GitHub Copilot으로 세부 로직을 채웁니다.
구현 마무리 단계에서는 다시 Claude Code로 코드 품질이나 보안 취약점을 검토합니다.

## 주의할 점

AI 제안을 검토 없이 그냥 쓰는 건 위험합니다.

```typescript
// 이런 코드를 그냥 쓰면 안 됩니다
const user = await getUserById(id) // AI가 생성한 코드
return user.password // 보안 위험! 패스워드 노출
```

보안 관련 코드는 AI 제안이더라도 직접 검토해야 합니다.

프롬프트 품질도 중요합니다. 모호하게 요청하면 모호한 결과가 나옵니다.

```text
// 이렇게 하면 안 됩니다
"함수 만들어줘"

// 이렇게 해야 원하는 결과가 나옵니다
"사용자 입력을 검증하는 TypeScript 함수를 만들어주세요.
이메일 형식, 비밀번호 강도, 필수 필드를 체크해야 합니다."
```

팀에 도입할 때는 한꺼번에 전환하기보다 비중요 기능부터 써보고 점진적으로 확대하는 게 낫습니다.
코드 외부 전송 허용 범위도 보안 정책과 맞춰서 확인해야 합니다.

## 마무리

AI 도구 쓴다고 개발 실력이 줄어드는 건 아닌 것 같습니다. 반복 작업에서 손을 빼고
더 의미 있는 문제에 집중하게 된다는 게 체감상으로는 맞습니다.
다만 AI 제안을 그냥 믿기보다는 이해하면서 쓰는 게 중요하고, 그게 장기적으로도 도움이 됩니다.

### 참고 링크

- [Cursor IDE 공식 문서](https://docs.cursor.com)
- [GitHub Copilot 베스트 프랙티스](https://github.blog/copilot)
- [Claude Code 활용 가이드](https://docs.anthropic.com/claude/docs)
