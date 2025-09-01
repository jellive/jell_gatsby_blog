'use client'

import React, { useMemo, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { Post } from '@/components/PostList'
import PostList from '@/components/PostList'
import { cn } from '@/lib/utils'

export interface PostListWithPaginationProps {
  posts: Post[]
  postsPerPage?: number
  className?: string
}

/**
 * 페이지네이션 로딩 중 표시할 컴포넌트
 */
const PaginationFallback = () => (
  <div className="flex items-center justify-center py-8">
    <div className="h-8 w-32 animate-pulse rounded-md bg-muted"></div>
  </div>
)

/**
 * 실제 페이지네이션 로직을 담은 내부 컴포넌트
 */
const PostListWithPaginationInner = ({
  posts,
  postsPerPage = 10,
  className,
}: PostListWithPaginationProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL에서 현재 페이지 가져오기 (기본값: 1)
  const currentPage = parseInt(searchParams.get('page') || '1', 10)

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(posts.length / postsPerPage)

  // 현재 페이지의 포스트 계산
  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    return posts.slice(startIndex, endIndex)
  }, [posts, currentPage, postsPerPage])

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return

    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }

    const query = params.toString()
    const url = query ? `${pathname}?${query}` : pathname

    router.push(url, { scroll: false })

    // 부드러운 스크롤로 최상단으로 이동
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // 표시할 페이지 번호 계산 (스마트 페이지네이션)
  const getPageNumbers = () => {
    const delta = 2 // 현재 페이지 좌우로 보여줄 페이지 수
    const pages: (number | 'ellipsis')[] = []

    // 페이지가 7개 이하면 모두 표시
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    // 첫 페이지는 항상 표시
    pages.push(1)

    // 현재 페이지가 앞쪽에 있는 경우
    if (currentPage <= 4) {
      for (let i = 2; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    }
    // 현재 페이지가 뒤쪽에 있는 경우
    else if (currentPage >= totalPages - 3) {
      pages.push('ellipsis')
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    }
    // 현재 페이지가 중간에 있는 경우
    else {
      pages.push('ellipsis')
      for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        pages.push(i)
      }
      pages.push('ellipsis')
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // 포스트가 없는 경우
  if (posts.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">
            아직 작성된 포스트가 없습니다.
          </p>
        </div>
      </div>
    )
  }

  // 한 페이지에 모든 포스트가 들어가는 경우 페이지네이션 숨김
  if (totalPages <= 1) {
    return (
      <div className={className}>
        <PostList posts={currentPosts} />
      </div>
    )
  }

  return (
    <div className={cn('w-full space-y-8', className)}>
      {/* 포스트 리스트 */}
      <PostList posts={currentPosts} />

      {/* 페이지네이션 */}
      <div className="flex flex-col items-center gap-4">
        {/* 페이지 정보 (데스크탑에서만 표시) */}
        <div className="hidden text-sm text-muted-foreground sm:block">
          <span>
            {posts.length}개의 포스트 중{' '}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * postsPerPage + 1}-
              {Math.min(currentPage * postsPerPage, posts.length)}
            </span>
            번째 표시
          </span>
        </div>

        {/* 페이지네이션 컨트롤 */}
        <Pagination className="w-full">
          <PaginationContent className="flex-wrap justify-center gap-1">
            {/* 이전 페이지 버튼 */}
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault()
                  handlePageChange(currentPage - 1)
                }}
                className={cn(
                  'transition-all duration-200',
                  currentPage === 1
                    ? 'pointer-events-none opacity-50'
                    : 'hover:bg-primary/10 hover:scale-105'
                )}
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {/* 페이지 번호들 */}
            {pageNumbers.map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={pageNum === currentPage}
                    onClick={e => {
                      e.preventDefault()
                      handlePageChange(pageNum)
                    }}
                    className={cn(
                      'transition-all duration-200',
                      pageNum === currentPage
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'hover:bg-accent/80 hover:scale-105',
                      // 모바일에서 더 큰 터치 영역
                      'min-h-[44px] min-w-[44px] md:min-h-[40px] md:min-w-[40px]'
                    )}
                    aria-label={`페이지 ${pageNum}로 이동`}
                    aria-current={pageNum === currentPage ? 'page' : undefined}
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            {/* 다음 페이지 버튼 */}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault()
                  handlePageChange(currentPage + 1)
                }}
                className={cn(
                  'transition-all duration-200',
                  currentPage === totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'hover:bg-primary/10 hover:scale-105'
                )}
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>

        {/* 모바일용 간단한 페이지 정보 */}
        <div className="text-xs text-muted-foreground sm:hidden">
          페이지 {currentPage} / {totalPages}
        </div>
      </div>
    </div>
  )
}

/**
 * 페이지네이션이 포함된 포스트 리스트 컴포넌트 (Suspense 래퍼)
 * - URL 쿼리 파라미터로 현재 페이지 상태 관리
 * - 반응형 디자인 (모바일/데스크탑 최적화)
 * - 접근성 표준 준수 (ARIA 라벨, 키보드 네비게이션)
 * - 부드러운 애니메이션과 호버 효과
 */
const PostListWithPagination = (props: PostListWithPaginationProps) => {
  return (
    <Suspense fallback={<PaginationFallback />}>
      <PostListWithPaginationInner {...props} />
    </Suspense>
  )
}

export default PostListWithPagination
