# ngrok 설정 가이드

외부에서 로컬 개발 서버에 접근할 수 있도록 ngrok을 설정하는 방법입니다.

## 🚀 빠른 시작

### 1. 기본 사용법

```bash
# 개발 서버 시작 (포트 9000)
npm run dev

# 새 터미널에서 ngrok 터널 시작
npm run tunnel
```

### 2. 자동화된 사용법

```bash
# 개발 서버와 ngrok를 동시에 시작
npm run dev:tunnel

# 또는 순차적으로 시작 (추천)
npm run dev:tunnel:start
```

## 📋 사용 가능한 명령어

| 명령어                     | 설명                                 |
| -------------------------- | ------------------------------------ |
| `npm run dev`              | Next.js 개발 서버만 시작 (포트 9000) |
| `npm run tunnel`           | ngrok 터널만 시작                    |
| `npm run dev:tunnel`       | 개발 서버와 ngrok를 동시에 시작      |
| `npm run dev:tunnel:start` | 개발 서버 시작 후 ngrok 실행 (추천)  |

## 🔧 설정 정보

- **로컬 포트**: 9000
- **ngrok 버전**: 3.26.0
- **프로토콜**: HTTP/HTTPS
- **터널 도메인**: 자동 생성 (.ngrok-free.app)

## 💡 사용 시나리오

### 모바일 테스트

```bash
# 개발 서버 시작
npm run dev:tunnel:start

# ngrok에서 제공하는 URL로 모바일 기기에서 접속
# 예: https://abcd1234.ngrok-free.app
```

### 외부 공유

```bash
# 동료나 클라이언트와 작업 중인 사이트 공유
npm run dev:tunnel:start

# 생성된 URL 공유
```

### API 테스트

```bash
# 웹훅이나 외부 API 콜백 테스트 시
npm run dev:tunnel:start

# ngrok URL을 콜백 URL로 설정
```

## 📖 ngrok 출력 예시

```text
ngrok

Session Status                online
Account                       your@email.com (Plan: Free)
Version                       3.26.0
Region                        Korea Republic (kr)
Latency                       30ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abcd1234.ngrok-free.app -> http://localhost:9000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

## 🌐 접속 URL

ngrok 실행 후 표시되는 URL로 접속:

- **HTTPS**: [https://abcd1234.ngrok-free.app](https://abcd1234.ngrok-free.app) (권장)
- **HTTP**: [http://abcd1234.ngrok-free.app](http://abcd1234.ngrok-free.app)

## 🔍 모니터링

### ngrok 웹 인터페이스

- **URL**: [http://127.0.0.1:4040](http://127.0.0.1:4040)
- **기능**: 요청 로그, 응답 확인, 재전송 등

### 개발 서버 로그

```bash
# Next.js 개발 서버 로그 확인
tail -f .next/trace

# 또는 개발 서버 터미널에서 실시간 확인
```

## ⚠️ 주의사항

### 보안

- 무료 플랜은 8시간 세션 제한
- 터널 URL은 공개적으로 접근 가능
- 민감한 데이터 노출 주의

### 성능

- 인터넷 연결 속도에 따라 지연 발생 가능
- 대용량 파일 업로드/다운로드 시 제한
- 동시 연결 수 제한 (무료 플랜)

### 개발 환경

- 환경 변수에서 localhost 대신 ngrok URL 사용 필요한 경우
- CORS 설정 확인 필요
- 쿠키 도메인 설정 주의

## 🛠️ 고급 설정

### ngrok 계정 연동 (선택사항)

```bash
# ngrok 회원가입 후 인증 토큰 설정
ngrok config add-authtoken YOUR_TOKEN

# 설정 확인
ngrok config check
```

### 커스텀 도메인 (유료 플랜)

```bash
# 커스텀 서브도메인 사용
ngrok http 9000 --subdomain=jell-blog

# 접속 URL: https://jell-blog.ngrok.io
```

### 설정 파일 생성

```yaml
# ~/.ngrok2/ngrok.yml
version: '2'
authtoken: YOUR_TOKEN
tunnels:
  blog:
    addr: 9000
    proto: http
    subdomain: jell-blog
```

## 🐛 문제 해결

### 일반적인 오류

#### "Port already in use"

```bash
# 포트 9000 사용 중인 프로세스 확인
lsof -i :9000

# 프로세스 종료
kill -9 PID
```

#### "Connection refused"

```bash
# Next.js 개발 서버가 실행 중인지 확인
npm run dev

# 다른 터미널에서 ngrok 실행
npm run tunnel
```

#### "Tunnel not found"

```bash
# ngrok 프로세스 확인
ps aux | grep ngrok

# ngrok 재시작
npm run tunnel
```

## 📱 모바일 테스트 팁

### iOS Safari

- 개발자 도구 연결: 설정 > Safari > 고급 > 웹 검사기
- 맥의 Safari에서 개발 > iPhone 선택

### Android Chrome

- USB 디버깅 활성화
- Chrome DevTools > More tools > Remote devices

### 반응형 테스트

```bash
# ngrok URL로 접속 후 다양한 기기에서 테스트
# - iPhone 다양한 모델
# - Android 다양한 해상도
# - 태블릿 (iPad, Galaxy Tab)
# - 데스크톱 다양한 해상도
```

## 🔗 유용한 링크

- [ngrok 공식 문서](https://ngrok.com/docs)
- [ngrok 가격 정책](https://ngrok.com/pricing)
- [Next.js 개발 서버 문서](https://nextjs.org/docs/api-reference/cli#development)

## 📞 지원

문제가 발생하면 다음을 확인해주세요:

1. **ngrok 상태**: ngrok이 정상 실행 중인지 확인
2. **개발 서버**: Next.js 개발 서버가 포트 9000에서 실행 중인지 확인
3. **방화벽**: 로컬 방화벽 설정 확인
4. **인터넷 연결**: 안정적인 인터넷 연결 확인

문제가 지속되면 ngrok 로그와 Next.js 개발 서버 로그를 함께 확인해주세요.
