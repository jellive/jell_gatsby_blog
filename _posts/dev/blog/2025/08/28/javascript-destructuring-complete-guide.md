---
title: 'JavaScript 구조분해 할당 실전 가이드'
date: '2025-08-28'
category: 'Javascript'
tags: ['javascript', 'destructuring', 'es6', 'clean-code']
---

## 목차

```toc

```

## 구조분해 할당이란?

배열이나 객체의 속성을 해체하여 개별 변수에 담는 ES6 문법입니다.

```javascript
// Before
const userName = user.name
const userAge = user.age

// After - 구조분해 할당
const { name, age } = user
```

## 객체 구조분해

### 기본 사용법

```javascript
const user = { name: 'John', age: 30, job: 'Developer' }
const { name, age, job } = user

console.log(name) // 'John'
```

### 변수명 변경

```javascript
const { name: userName, age: userAge } = user
console.log(userName) // 'John'
```

### 기본값 설정

```javascript
const { name = 'Anonymous', level = 1 } = user
```

### 중첩 객체

```javascript
const {
  profile: { name, avatar },
} = userData
```

### Rest 패턴

```javascript
const { id, ...otherInfo } = user
console.log(otherInfo) // id를 제외한 나머지
```

## 배열 구조분해

### 기본 사용법

```javascript
const colors = ['red', 'green', 'blue']
const [primary, secondary] = colors
```

### 요소 건너뛰기

```javascript
const [first, , third] = [1, 2, 3]
```

### 값 교환

```javascript
let a = 1,
  b = 2
;[a, b] = [b, a]
```

### Rest로 나머지 수집

```javascript
const [first, ...rest] = [1, 2, 3, 4, 5]
console.log(rest) // [2, 3, 4, 5]
```

## 함수에서 활용

### 파라미터 구조분해

```javascript
function createUser({ name, email, age = 18 }) {
  return { name, email, age }
}

createUser({ name: 'John', email: 'john@test.com' })
```

### 리턴값 구조분해

```javascript
function getCoordinates() {
  return { x: 10, y: 20 }
}

const { x, y } = getCoordinates()
```

### 배열 메소드와 조합

```javascript
const users = [
  { name: 'John', age: 30 },
  { name: 'Jane', age: 25 },
]

users.map(({ name, age }) => `${name} (${age}세)`)
users.filter(({ age }) => age > 25)
```

## React에서 활용

### Props 구조분해

```javascript
function UserCard({ name, email, avatar, isOnline }) {
  return (
    <div>
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{isOnline ? '온라인' : '오프라인'}</span>
    </div>
  )
}
```

### Hook 구조분해

```javascript
const [count, setCount] = useState(0)
const { data, loading, error } = useQuery()
```

## 주의사항

### null/undefined 처리

```javascript
// ❌ 에러 발생
const { name } = null

// ✅ 안전한 처리
const { name } = user || {}
const { name } = user ?? {}
```

### 중첩 구조분해 주의

```javascript
// 너무 깊은 중첩은 가독성 저하
const {
  profile: {
    settings: {
      notifications: { email },
    },
  },
} = user || {}
```

## 실무 팁

### API 응답 처리

```javascript
const { data, status, message } = await api.fetchUser()

const {
  data: { user, posts },
  meta: { total },
} = response
```

### 조건부 구조분해

```javascript
const config = { theme: 'dark', notifications: true }
const { theme = 'light', language = 'ko' } = config
```

### TypeScript와 함께

```typescript
interface User {
  name: string
  age: number
  email?: string
}

const { name, age, email = 'no-email' }: User = await fetchUser()
```

## 핵심 정리

1. **객체 구조분해**: `const { prop } = obj`
2. **배열 구조분해**: `const [first, second] = arr`
3. **기본값 설정**: `const { prop = 'default' } = obj`
4. **변수명 변경**: `const { prop: newName } = obj`
5. **Rest 패턴**: `const { id, ...rest } = obj`

구조분해 할당은 코드를 간결하고 읽기 쉽게 만들어주는 강력한 도구입니다. React 개발에서 특히 유용하며, 함수 파라미터와 리턴값 처리를 훨씬 깔끔하게 만들어줍니다.
