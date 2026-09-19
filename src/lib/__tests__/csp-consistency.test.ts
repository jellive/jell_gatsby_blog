import { readFileSync } from 'node:fs'
import path from 'node:path'

/**
 * CSP 가 세 군데에 있다. 어긋나면 **조용히** 깨진다.
 *
 * 2026-05-18 에 umami 트래커를 붙이면서 `netlify.toml` 에만 `umami.jell.kr` 을 넣고
 * `public/_headers` 에는 안 넣었다. 넉 달간 아무도 몰랐다 — 프로덕션에서는
 * `netlify.toml` 이 이기니까 **동작은 멀쩡했기 때문**이다.
 *
 * 문제는 그 다음이다. Netlify 는 헤더를 **헤더 단위로** 병합하고 충돌 시 `netlify.toml`
 * 이 이긴다(2026-09-19 실측: `permissions-policy`·`strict-transport-security` 는
 * `_headers` 에서 오고 CSP 만 toml 값이 나간다). 즉 `netlify.toml` 의 헤더 블록이
 * 빠지거나 경로 패턴이 바뀌는 순간 `_headers` 가 유일한 CSP 가 되는데, 그때 그게
 * 넉 달 묵은 값이면 **트래커가 조용히 차단된다.** 태그도 서버도 멀쩡한 채로 집계만 0 이 된다.
 *
 * 그래서 둘을 바이트 동일로 못박는다.
 *
 * `next.config.js` 의 `headers()` 는 여기서 비교하지 않는다 — 이 레포는
 * `output: 'export'` 이고, Next.js 문서가 `headers` 를 static export 의
 * **Unsupported Features** 로 명시한다(빌드 때 "will not automatically work" 경고).
 * 프로덕션에 안 나가고 `next dev` 에서만 쓰이므로 어긋나도 배포가 안 깨진다.
 */

const ROOT = path.resolve(__dirname, '../../..')

const read = (p: string) => readFileSync(path.join(ROOT, p), 'utf8')

/** `netlify.toml` 의 `Content-Security-Policy = "..."` 값 */
function cspFromToml(): string {
  const m = /^\s*Content-Security-Policy\s*=\s*"(.+)"\s*$/m.exec(
    read('netlify.toml')
  )
  const value = m?.[1]
  if (!value) throw new Error('netlify.toml 에 Content-Security-Policy 가 없다')
  return value
}

/** `public/_headers` 의 `Content-Security-Policy: ...` 값 */
function cspFromHeaders(): string {
  const m = /^\s*Content-Security-Policy:\s*(.+)$/m.exec(
    read('public/_headers')
  )
  const value = m?.[1]
  if (!value)
    throw new Error('public/_headers 에 Content-Security-Policy 가 없다')
  return value
}

describe('CSP 일관성', () => {
  it('netlify.toml 과 public/_headers 의 CSP 가 바이트 동일하다', () => {
    expect(cspFromHeaders()).toBe(cspFromToml())
  })

  it('두 파일 다 CSP 를 실제로 갖고 있다 — 한쪽이 사라지면 나머지가 유일한 방어선이다', () => {
    expect(cspFromToml().length).toBeGreaterThan(100)
    expect(cspFromHeaders().length).toBeGreaterThan(100)
  })

  it('트래커 도메인이 script-src 와 connect-src 양쪽에 있다', () => {
    // script-src 만 열면 스크립트는 뜨는데 **이벤트 전송이 막혀** 집계가 0 이 된다.
    // 증상이 "안 붙었다" 가 아니라 "붙었는데 숫자가 안 는다" 라 알아채기 어렵다.
    const csp = cspFromToml()
    const directive = (name: string) =>
      csp
        .split(';')
        .map(s => s.trim())
        .find(s => s.startsWith(`${name} `)) ?? ''

    expect(directive('script-src')).toContain('umami.jell.kr')
    expect(directive('connect-src')).toContain('umami.jell.kr')
  })
})
