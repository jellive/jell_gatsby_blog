import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'

/**
 * 피드 경로의 Content-Type 은 **`netlify.toml` 이 정한다.**
 *
 * 라우트 핸들러(`src/app/rss/route.ts`)가 `NextResponse` 에 적어 둔
 * `Content-Type: application/rss+xml` 은 프로덕션에 안 나간다 — 이 레포는
 * `output: 'export'` 라 라우트가 빌드 때 정적 파일로 구워지고, 그 뒤로는
 * Netlify 가 헤더를 정하기 때문이다. 즉 코드에 적힌 타입은 `next dev` 전용이다.
 *
 * 2026-09-19 실측이 그걸 드러냈다. `/rss` 는 `netlify.toml` 에 규칙이 있어서
 * `application/rss+xml` 로 나갔는데, 같은 본문을 주는 별칭 `/rss.xml` 은 규칙이
 * 없어서 **확장자로 판정돼 `application/xml`** 로 나갔다. 둘 다 같은 핸들러를
 * 부르는데 타입이 갈린 것이다 — 코드만 보면 원리적으로 안 보인다.
 *
 * 그래서 "피드 라우트가 있으면 `netlify.toml` 에 그 경로의 Content-Type 규칙이
 * 있다" 를 못박는다. 다음에 `/feed.xml` 같은 경로를 추가할 때 헤더를 빠뜨리면
 * 여기서 걸린다.
 */

const ROOT = path.resolve(__dirname, '../../..')

const FEED_DIR = /^(rss|feed|atom)(\.|$)/i

/** `src/app` 바로 밑에서 피드를 내보내는 라우트의 URL 경로 */
function feedRoutePaths(): string[] {
  const appDir = path.join(ROOT, 'src/app')
  return readdirSync(appDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && FEED_DIR.test(d.name))
    .filter(d => existsSync(path.join(appDir, d.name, 'route.ts')))
    .map(d => `/${d.name}`)
    .sort()
}

/** `netlify.toml` 의 `[[headers]]` 블록에서 `for` → `Content-Type` 을 뽑는다 */
function contentTypeRules(): Map<string, string> {
  const toml = readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8')
  const rules = new Map<string, string>()

  for (const block of toml.split('[[headers]]').slice(1)) {
    // 다음 최상위 테이블([build] 등)이 시작되면 이 블록은 끝난 것으로 본다
    const body = block.split(/^\[(?!headers\.values)/m)[0] ?? ''
    const forMatch = /^\s*for\s*=\s*"([^"]+)"/m.exec(body)
    const typeMatch = /^\s*Content-Type\s*=\s*"([^"]+)"/m.exec(body)
    const forValue = forMatch?.[1]
    const typeValue = typeMatch?.[1]
    if (forValue && typeValue) rules.set(forValue, typeValue)
  }
  return rules
}

describe('피드 Content-Type', () => {
  it('피드 라우트를 실제로 찾아낸다 — 0개면 이 테스트는 공허하게 통과한다', () => {
    // 픽스처 없는 "0건 통과" 를 막는 대조군. 경로가 사라졌다면 그것도 알아야 한다.
    expect(feedRoutePaths()).toEqual(
      expect.arrayContaining(['/rss', '/rss.xml'])
    )
  })

  it.each(feedRoutePaths())(
    '%s 가 netlify.toml 에 application/rss+xml 로 선언돼 있다',
    routePath => {
      const declared = contentTypeRules().get(routePath)
      expect(declared).toBe('application/rss+xml')
    }
  )

  it('두 경로가 같은 본문을 낸다 — 별칭이 본체를 그대로 부르는지', () => {
    const alias = readFileSync(
      path.join(ROOT, 'src/app/rss.xml/route.ts'),
      'utf8'
    )
    // 별칭이 본문을 복사해 두면 본체를 고쳐도 별칭만 낡는다. import 로 묶여 있어야 한다.
    expect(alias).toMatch(/from\s+'\.\.\/rss\/route'/)
  })
})
