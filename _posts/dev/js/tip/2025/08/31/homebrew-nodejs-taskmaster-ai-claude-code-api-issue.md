---
title: 'Homebrew로 설치한 Node.js에서 taskmaster-ai가 Claude Code API를 찾지 못하는 문제 해결'
date: '2025-08-31'
category: 'Dev'
tags:
  [
    'Node.js',
    'Homebrew',
    'taskmaster-ai',
    'Claude Code',
    'API',
    'macOS',
    '환경설정',
  ]
---

## 목차

```toc

```

## 문제 상황

Homebrew로 Node.js를 설치하고 taskmaster-ai 패키지를 사용하려고 할 때, 다음과 같은 오류가
발생할 수 있습니다:

```bash
$ npx taskmaster-ai init
Error: Claude Code API key not found. Please check your environment configuration.
```

이는 Homebrew로 설치한 Node.js 환경에서 환경 변수나 설정 파일의 경로가 예상과 다를 때
발생하는 문제입니다.

## 원인 분석

### 1. Homebrew Node.js의 특별한 설치 경로

Homebrew로 Node.js를 설치하면 시스템 기본 위치가 아닌 `/opt/homebrew` (Apple Silicon) 또는
`/usr/local` (Intel Mac) 경로에 설치됩니다:

```bash
# Homebrew Node.js 설치 경로 확인
$ which node
/opt/homebrew/bin/node

$ which npm
/opt/homebrew/bin/npm
```

### 2. 환경 변수 인식 문제

taskmaster-ai는 Claude Code API 키를 다음 순서로 찾습니다:

1. `ANTHROPIC_API_KEY` 환경 변수
2. `.env` 파일
3. Claude Code 설정 파일 (`~/.claude/settings.json`)

Homebrew 환경에서는 이러한 경로들이 올바르게 인식되지 않을 수 있습니다.

## 해결 방법

### 방법 1: 환경 변수 직접 설정

가장 확실한 방법은 환경 변수를 직접 설정하는 것입니다:

```bash
# 현재 세션에만 적용
export ANTHROPIC_API_KEY="your_api_key_here"

# bash 사용자의 경우
echo 'export ANTHROPIC_API_KEY="your_api_key_here"' >> ~/.bashrc
source ~/.bashrc

# zsh 사용자의 경우 (macOS 기본값)
echo 'export ANTHROPIC_API_KEY="your_api_key_here"' >> ~/.zshrc
source ~/.zshrc
```

### 방법 2: 프로젝트별 .env 파일 생성

프로젝트 루트 디렉토리에 `.env` 파일을 만드는 것이 가장 안전한 방법입니다:

```bash
# 프로젝트 루트에서
echo "ANTHROPIC_API_KEY=your_api_key_here" > .env
echo "PERPLEXITY_API_KEY=your_perplexity_key_here" >> .env  # 선택사항
```

**중요**: `.env` 파일을 `.gitignore`에 반드시 추가하세요:

```bash
echo ".env" >> .gitignore
```

### 방법 3: Claude Code 설정 파일 수동 생성

Claude Code 설정 파일이 없는 경우 수동으로 생성할 수 있습니다:

```bash
# Claude Code 설정 디렉토리 생성
mkdir -p ~/.claude

# 설정 파일 생성
cat > ~/.claude/settings.json << EOF
{
  "anthropicApiKey": "your_api_key_here"
}
EOF
```

### 방법 4: npx 실행 시 환경 변수 전달

일회성으로 실행할 때는 명령어에 직접 환경 변수를 전달할 수 있습니다:

```bash
ANTHROPIC_API_KEY="your_api_key_here" npx taskmaster-ai init
```

## 검증 방법

### 1. 환경 변수 확인

```bash
# API 키가 올바르게 설정되었는지 확인
echo $ANTHROPIC_API_KEY

# 모든 환경 변수 중 ANTHROPIC으로 시작하는 것들 확인
env | grep ANTHROPIC
```

### 2. Node.js 환경에서 환경 변수 접근 테스트

```bash
node -e "console.log('API Key:', process.env.ANTHROPIC_API_KEY)"
```

### 3. taskmaster-ai 정상 작동 확인

```bash
# 초기화 명령어로 테스트
npx taskmaster-ai init

# 또는 모델 설정 확인
npx taskmaster-ai models
```

## 추가 트러블슈팅

### 권한 문제

Homebrew로 설치한 패키지의 권한 문제가 있는 경우:

```bash
# npm 전역 패키지 권한 수정
sudo chown -R $(whoami) $(npm config get prefix)/{lib/node_modules,bin,share}
```

### 캐시 정리

npm 캐시 문제가 의심되는 경우:

```bash
# npm 캐시 정리
npm cache clean --force

# npx 캐시 정리
npx clear-npx-cache
```

### Node.js 재설치

문제가 지속되면 Node.js를 완전히 재설치:

```bash
# 기존 Node.js 제거
brew uninstall node

# 최신 버전 설치
brew install node

# 설치 확인
node --version
npm --version
```

## 예방 방법

### 1. 일관된 개발 환경 구축

개발팀 전체가 동일한 환경을 사용하도록 권장사항을 정리합니다:

```bash
# .nvmrc 파일로 Node.js 버전 고정
echo "20.11.0" > .nvmrc

# package.json에 engines 필드 추가
"engines": {
  "node": ">=20.0.0",
  "npm": ">=9.0.0"
}
```

### 2. 환경 설정 자동화 스크립트

프로젝트에 환경 설정 스크립트를 추가:

```bash
#!/bin/bash
# setup-env.sh

echo "🔧 개발 환경을 설정합니다..."

# API 키 확인
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY 환경 변수가 설정되지 않았습니다."
    echo "💡 .env 파일에 API 키를 설정해주세요."
    exit 1
fi

# taskmaster-ai 설치 확인
if ! command -v taskmaster-ai &> /dev/null; then
    echo "📦 taskmaster-ai를 설치합니다..."
    npm install -g taskmaster-ai
fi

echo "✅ 환경 설정이 완료되었습니다!"
```

## 결론

Homebrew로 설치한 Node.js 환경에서 taskmaster-ai가 Claude Code API를 찾지 못하는 문제는
주로 환경 변수 설정과 경로 인식 문제에서 비롯됩니다.

**권장 해결 순서**:

1. 프로젝트별 `.env` 파일 생성 (가장 안전)
2. 환경 변수 직접 설정 (전역 사용 시)
3. Claude Code 설정 파일 확인
4. 필요 시 Node.js 재설치

이러한 단계를 통해 대부분의 환경 설정 문제를 해결할 수 있으며, 팀 단위 개발에서도
일관된 환경을 유지할 수 있습니다.
