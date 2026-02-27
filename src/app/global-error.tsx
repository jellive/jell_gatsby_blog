'use client'

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="ko">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily:
              '"Pretendard Variable", "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                marginBottom: '1rem',
                fontSize: '3.75rem',
                fontWeight: 'bold',
                color: '#ef4444',
              }}
            >
              오류
            </h1>
            <h2
              style={{
                marginBottom: '1rem',
                fontSize: '1.5rem',
                fontWeight: '600',
              }}
            >
              심각한 오류가 발생했습니다
            </h2>
            <p
              style={{
                marginBottom: '2rem',
                maxWidth: '28rem',
                color: '#64748b',
              }}
            >
              죄송합니다. 예기치 않은 오류가 발생했습니다.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.375rem',
                  backgroundColor: '#3b82f6',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                다시 시도
              </button>
              <a
                href="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  backgroundColor: 'white',
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: '#0f172a',
                  textDecoration: 'none',
                }}
              >
                홈으로 돌아가기
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
