---
title: 'TypeScript 안전한 프론트엔드 개발 가이드'
date: '2025-08-18'
category: 'Javascript'
tags: ['TypeScript', 'Frontend', 'Type Safety', 'React']
---

## 목차

```toc

```

## 왜 TypeScript를 제대로 사용해야 할까?

단순히 인터페이스 몇 개 정의하고 `any`를 남발하는 것만으로는 진정한 타입 안전성을 얻을 수 없습니다.

```typescript
// ❌ 이런 코드는 안전하지 않습니다
function getUser(data: any): User {
  return data
}
```

## 타입 가드로 런타임 안전성 확보

### 사용자 정의 타입 가드

```typescript
interface User {
  id: number
  name: string
  email: string
}

function isUser(obj: unknown): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof obj.id === 'number' &&
    'name' in obj &&
    typeof obj.name === 'string' &&
    'email' in obj &&
    typeof obj.email === 'string'
  )
}

// 사용
const data = await fetchData()
if (isUser(data)) {
  console.log(data.name) // 안전하게 접근
}
```

### API 응답 검증

```typescript
interface ApiResponse<T> {
  data: T
  status: number
}

async function fetchUser(id: number): Promise<User> {
  const response = await fetch(`/api/users/${id}`)
  const json = await response.json()

  if (!isUser(json.data)) {
    throw new Error('Invalid user data')
  }

  return json.data
}
```

## Union 타입과 판별자

### 판별 유니온 (Discriminated Unions)

```typescript
interface SuccessResponse {
  type: 'success'
  data: User[]
}

interface ErrorResponse {
  type: 'error'
  message: string
  code: number
}

type ApiResult = SuccessResponse | ErrorResponse

function handleResponse(result: ApiResult) {
  if (result.type === 'success') {
    console.log(result.data) // User[] 타입
  } else {
    console.error(result.message) // string 타입
  }
}
```

## 제네릭 활용

### 기본 제네릭

```typescript
function wrapInArray<T>(value: T): T[] {
  return [value]
}

const numbers = wrapInArray(1) // number[]
const strings = wrapInArray('hello') // string[]
```

### 제약이 있는 제네릭

```typescript
interface HasId {
  id: number
}

function findById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id)
}
```

### 제네릭 React 컴포넌트

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map(renderItem)}</ul>
}

// 사용
<List items={users} renderItem={user => <li>{user.name}</li>} />
```

## React Props 타입 정의

### 기본 Props

```typescript
interface ButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

function Button({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={variant}>
      {label}
    </button>
  )
}
```

### Children Props

```typescript
interface CardProps {
  title: string
  children: React.ReactNode
}

function Card({ title, children }: CardProps) {
  return (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  )
}
```

### 이벤트 핸들러

```typescript
interface FormProps {
  onSubmit: (data: FormData) => void
}

function Form({ onSubmit }: FormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onSubmit(formData)
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>
}
```

## 유틸리티 타입

### Partial과 Required

```typescript
interface User {
  id: number
  name: string
  email: string
}

type PartialUser = Partial<User> // 모든 속성 optional
type RequiredUser = Required<User> // 모든 속성 required
```

### Pick과 Omit

```typescript
type UserPreview = Pick<User, 'id' | 'name'> // id, name만
type UserWithoutId = Omit<User, 'id'> // id 제외
```

### Record

```typescript
type UserRole = 'admin' | 'user' | 'guest'
type Permissions = Record<UserRole, string[]>

const permissions: Permissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
}
```

## 실무 패턴

### API 클라이언트

```typescript
class ApiClient {
  async get<T>(url: string): Promise<T> {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }
    return response.json()
  }

  async post<T, D>(url: string, data: D): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return response.json()
  }
}

// 사용
const client = new ApiClient()
const user = await client.get<User>('/api/user')
```

### Custom Hooks

```typescript
interface UseApiResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

function useApi<T>(url: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [url])

  return { data, loading, error }
}
```

## 엄격한 설정

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## 자주 하는 실수

### 1. any 남용

```typescript
// ❌ 나쁜 예
function process(data: any) {
  return data.value
}

// ✅ 좋은 예
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return data.value
  }
  throw new Error('Invalid data')
}
```

### 2. 타입 단언 남용

```typescript
// ❌ 나쁜 예
const user = data as User

// ✅ 좋은 예
if (isUser(data)) {
  const user = data
}
```

### 3. Optional 체이닝 과용

```typescript
// ❌ 나쁜 예
user?.profile?.settings?.theme?.color

// ✅ 좋은 예 - 타입을 명확히
interface User {
  profile: {
    settings: {
      theme: {
        color: string
      }
    }
  }
}
```

## 핵심 정리

1. **타입 가드**로 런타임 안전성 확보
2. **판별 유니온**으로 타입 좁히기
3. **제네릭**으로 재사용 가능한 코드
4. **유틸리티 타입** 적극 활용
5. **any 대신 unknown** 사용
6. **strict 모드** 활성화

TypeScript를 제대로 사용하면 런타임 에러를 크게 줄이고, 더 안전하고 유지보수하기 쉬운 코드를 작성할 수 있습니다.
