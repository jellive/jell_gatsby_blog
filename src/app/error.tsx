'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 에러 로깅 (프로덕션에서는 Sentry 등으로 대체)
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold text-destructive">오류</h1>
        <h2 className="mb-4 text-2xl font-semibold text-foreground">
          문제가 발생했습니다
        </h2>
        <p className="mb-8 max-w-md text-muted-foreground">
          죄송합니다. 페이지를 로드하는 중 오류가 발생했습니다.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="hover:bg-primary/90 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors"
          >
            다시 시도
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            홈으로 돌아가기
          </a>
        </div>
      </div>
    </div>
  )
}
