import Link from 'next/link'

export default function TagNotFound() {
  return (
    <div className="tag-not-found">
      <div className="tag-not-found-content">
        <h1>태그를 찾을 수 없습니다</h1>
        <p>요청하신 태그가 존재하지 않거나 해당 태그로 작성된 포스트가 없습니다.</p>
        <p>
          만약 "Blog"를 찾고 계신다면, 이는 <strong>카테고리</strong>입니다. 
          태그가 아닌 카테고리로 분류되어 있어요.
        </p>
        
        <div className="tag-not-found-actions">
          <Link href="/tags" className="btn-primary">
            전체 태그 보기
          </Link>
          <Link href="/" className="btn-secondary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}