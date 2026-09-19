/**
 * `/rss.xml` — 관례 경로 별칭.
 *
 * 피드 본체는 `/rss` 에 있는데, RSS 리더와 아그리게이터 상당수가 `/rss.xml`·`/feed.xml`
 * 같은 관례 경로를 먼저 찔러 본다. 2026-09-19 실측으로 그 경로들이 전부 404 였고,
 * `<link rel="alternate">` 태그도 없어서 자동 발견이 원리적으로 불가능했다.
 * 링크 태그는 `layout.tsx` 에서 이 경로를 가리킨다.
 */
import { GET as rssGET } from '../rss/route'

export const dynamic = 'force-static'

export async function GET() {
  return rssGET()
}
