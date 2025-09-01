---
title: 'Next.js 개발 서버 프로세스 관리 - 찾기와 종료 완전 가이드'
date: '2025-08-31'
category: 'Dev'
tags:
  [
    'Next.js',
    'Process Management',
    'Development Server',
    'macOS',
    'Linux',
    'Shell',
    'Debugging',
  ]
---

## 목차

```toc

```

## 문제 상황

Next.js 개발을 하다 보면 종종 다음과 같은 상황에 마주치게 됩니다:

- 개발 서버가 제대로 종료되지 않아 포트가 계속 점유되어 있는 경우
- 백그라운드에서 실행 중인 `next-server` 프로세스가 CPU를 과도하게 사용하는 경우
- 새로운 개발 서버를 시작하려고 할 때 "포트가 이미 사용 중" 오류가 발생하는 경우

```bash
$ npm run dev
Error: listen EADDRINUSE: address already in use :::3000
```

이런 문제들은 대부분 백그라운드에서 실행 중인 `next-server` 프로세스 때문에 발생합니다.

## 해결 방법

### 1단계: next-server 프로세스 찾기

먼저 현재 실행 중인 `next-server` 프로세스들을 찾아봅시다:

```bash
# 기본적인 방법
ps aux | grep -i "next-server"

# 더 정확한 검색 (grep 프로세스 제외)
ps aux | grep -i "next-server\|next.*server" | grep -v grep
```

**실행 결과 예시:**

```bash
jellpd    39409 103.4  3.0 510424800 748832   ??  R    11:19AM   5:10.17 next-server (v14.2.32)
jellpd    61174  95.7 10.2 510789984 2558112   ??  U    11:30AM   5:40.17 next-server (v14.2.32)
```

각 컬럼의 의미:

- `jellpd`: 프로세스 소유자
- `39409`, `61174`: **PID (Process ID)** - 프로세스를 종료할 때 필요
- `103.4`, `95.7`: CPU 사용률 (%)
- `3.0`, `10.2`: 메모리 사용률 (%)
- `R`, `U`: 프로세스 상태 (R=실행중, U=인터럽트 불가능한 대기)

### 2단계: 프로세스 종료하기

#### 방법 1: 개별 PID로 종료

```bash
# 일반적인 종료 (SIGTERM)
kill 39409 61174

# 강제 종료 (SIGKILL) - 응답하지 않을 때
kill -9 39409 61174
```

#### 방법 2: 패턴으로 일괄 종료

```bash
# pkill 사용 (권장)
pkill -f "next-server"

# killall 사용
killall "next-server"

# 더 안전한 방법 - 확인 후 종료
pgrep -f "next-server" | xargs kill
```

### 3단계: 종료 확인

```bash
# 프로세스가 정말 종료되었는지 확인
ps aux | grep -i "next-server" | grep -v grep

# 아무 결과도 나오지 않으면 성공!
```

## 고급 기법

### 특정 포트를 사용하는 프로세스 찾기

```bash
# 3000 포트를 사용하는 프로세스 찾기
lsof -ti:3000

# 해당 프로세스 종료
lsof -ti:3000 | xargs kill -9
```

### 자동화 스크립트

매번 명령어를 입력하기 귀찮다면 스크립트로 만들어 둡시다:

```bash
# kill-next.sh
#!/bin/bash

echo "🔍 next-server 프로세스를 찾는 중..."
PIDS=$(pgrep -f "next-server")

if [ -z "$PIDS" ]; then
    echo "✅ 실행 중인 next-server 프로세스가 없습니다."
    exit 0
fi

echo "📋 발견된 프로세스:"
ps aux | grep -i "next-server" | grep -v grep

echo ""
echo "💀 프로세스를 종료합니다..."
echo "$PIDS" | xargs kill -9

sleep 1

# 종료 확인
REMAINING=$(pgrep -f "next-server")
if [ -z "$REMAINING" ]; then
    echo "✅ 모든 next-server 프로세스가 성공적으로 종료되었습니다."
else
    echo "⚠️  일부 프로세스가 여전히 실행 중입니다:"
    ps aux | grep -i "next-server" | grep -v grep
fi
```

**사용법:**

```bash
# 실행 권한 부여
chmod +x kill-next.sh

# 실행
./kill-next.sh
```

### package.json 스크립트로 등록

```json
{
  "scripts": {
    "dev": "next dev",
    "kill-server": "pkill -f next-server || true",
    "restart": "npm run kill-server && npm run dev"
  }
}
```

이제 다음과 같이 사용할 수 있습니다:

```bash
# 서버 종료
npm run kill-server

# 서버 재시작 (종료 후 시작)
npm run restart
```

## 예방 방법

### 1. 개발 서버 올바르게 종료하기

```bash
# 개발 서버 실행 중일 때
# Ctrl + C 를 눌러서 정상 종료
```

### 2. 터미널 종료 시 프로세스도 함께 종료

`.zshrc` 또는 `.bashrc`에 추가:

```bash
# 터미널 종료 시 next-server 프로세스도 정리
trap 'pkill -f "next-server" 2>/dev/null' EXIT
```

### 3. 개발 환경 설정

`next.config.js`에서 개발 서버 설정을 최적화:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 개발 모드에서 더 빠른 종료
  experimental: {
    turbo: {
      loaders: {
        // 필요한 로더만 활성화
      },
    },
  },
}

module.exports = nextConfig
```

## 문제 해결 팁

### CPU 사용률이 높은 next-server 프로세스

```bash
# CPU 사용률 순으로 정렬하여 확인
ps aux --sort=-%cpu | grep next-server

# 해당 프로세스의 상세 정보
ps -p <PID> -o pid,ppid,cmd,%cpu,%mem,time
```

### 메모리 누수 의심 시

```bash
# 메모리 사용량 모니터링
watch -n 1 'ps aux | grep next-server | grep -v grep'

# 특정 프로세스의 메모리 사용량 추적
top -p <PID>
```

### 권한 문제로 종료되지 않는 경우

```bash
# sudo 권한으로 강제 종료
sudo kill -9 <PID>

# 또는 프로세스 소유자 확인 후 해당 사용자로 전환
ps aux | grep next-server
su - <username>
kill -9 <PID>
```

## 마무리

Next.js 개발 서버 프로세스 관리는 개발 효율성에 직접적인 영향을 미칩니다. 위의 방법들을 활용하여:

1. **정기적인 프로세스 정리**로 시스템 리소스 절약
2. **자동화 스크립트**로 반복 작업 최소화
3. **예방 조치**로 문제 발생 최소화

개발 환경을 깔끔하게 유지하면 더 집중해서 코딩할 수 있습니다! 🚀

## 참고 자료

- [Next.js 공식 문서 - Development](https://nextjs.org/docs/getting-started)
- [프로세스 관리 명령어 참고](https://man7.org/linux/man-pages/man1/ps.1.html)
- [시그널과 프로세스 제어](https://www.gnu.org/software/libc/manual/html_node/Termination-Signals.html)
