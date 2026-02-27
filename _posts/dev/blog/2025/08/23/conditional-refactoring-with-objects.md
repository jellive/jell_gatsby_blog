---
title: '복잡한 조건문 리팩토링 | 객체 활용으로 코드 가독성 향상시키기'
date: '2025-08-23'
category: 'Blog'
tags:
  [
    'refactoring',
    'clean-code',
    'javascript',
    'conditional-statements',
    'best-practices',
  ]
---

## 목차

```toc

```

개발하다 보면 if문이 줄줄이 이어지는 코드를 자주 마주치게 됩니다. 처음엔 두세 개라 괜찮은데, 조건이 하나씩 늘어날수록 점점 손대기 싫은 코드가 됩니다.

```javascript
// 흔히 볼 수 있는 조건문 코드
function getStatusMessage(status) {
  if (status === 'loading') {
    return '데이터를 불러오는 중입니다...'
  }
  if (status === 'success') {
    return '성공적으로 처리되었습니다!'
  }
  if (status === 'error') {
    return '오류가 발생했습니다. 다시 시도해주세요.'
  }
  if (status === 'empty') {
    return '표시할 데이터가 없습니다.'
  }
  if (status === 'unauthorized') {
    return '권한이 없습니다.'
  }
  return '알 수 없는 상태입니다.'
}
```

새로운 상태가 추가될 때마다 if문이 하나씩 붙고, 특정 상태를 찾으려면 전체를 훑어야 합니다. 객체로 바꾸면 이게 생각보다 훨씬 깔끔해집니다.

## 기본적인 객체 활용

```javascript
// 개선된 방식
const STATUS_MESSAGES = {
  loading: '데이터를 불러오는 중입니다...',
  success: '성공적으로 처리되었습니다!',
  error: '오류가 발생했습니다. 다시 시도해주세요.',
  empty: '표시할 데이터가 없습니다.',
  unauthorized: '권한이 없습니다.',
}

function getStatusMessage(status) {
  return STATUS_MESSAGES[status] || '알 수 없는 상태입니다.'
}
```

모든 상태와 메시지가 한 곳에 모여있어 한눈에 파악되고, 새로운 상태 추가도 한 줄이면 됩니다. 객체 프로퍼티 접근은 O(1)이라 조건이 많아져도 성능에 영향이 없습니다.

## 함수를 값으로 넣기

단순 문자열 매핑을 넘어서 함수를 값으로 쓰면 더 복잡한 로직도 처리할 수 있습니다:

```javascript
// 사용자 권한 처리 예시
const USER_PERMISSION_HANDLERS = {
  admin: user => ({
    ...user,
    canDelete: true,
    canEdit: true,
    canView: true,
    canManageUsers: true,
  }),

  editor: user => ({
    ...user,
    canDelete: false,
    canEdit: true,
    canView: true,
    canManageUsers: false,
  }),

  viewer: user => ({
    ...user,
    canDelete: false,
    canEdit: false,
    canView: true,
    canManageUsers: false,
  }),

  guest: user => ({
    ...user,
    canDelete: false,
    canEdit: false,
    canView: false,
    canManageUsers: false,
  }),
}

function getUserPermissions(user) {
  const handler =
    USER_PERMISSION_HANDLERS[user.role] || USER_PERMISSION_HANDLERS.guest
  return handler(user)
}

// 사용 예시
const user = { name: 'John', role: 'editor', id: 123 }
const userWithPermissions = getUserPermissions(user)
console.log(userWithPermissions)
// { name: 'John', role: 'editor', id: 123, canDelete: false,
//   canEdit: true, ... }
```

## 중첩 객체 활용

API 에러처럼 두 가지 키를 조합해야 할 때는 중첩 객체가 유용합니다:

```javascript
const API_ERROR_HANDLERS = {
  400: {
    INVALID_REQUEST: '잘못된 요청입니다.',
    MISSING_PARAMETER: '필수 매개변수가 누락되었습니다.',
    VALIDATION_FAILED: '입력값 검증에 실패했습니다.',
  },
  401: {
    UNAUTHORIZED: '인증이 필요합니다.',
    TOKEN_EXPIRED: '토큰이 만료되었습니다.',
    INVALID_TOKEN: '유효하지 않은 토큰입니다.',
  },
  403: {
    FORBIDDEN: '접근 권한이 없습니다.',
    INSUFFICIENT_PERMISSIONS: '권한이 부족합니다.',
  },
  404: {
    NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
    ENDPOINT_NOT_EXISTS: '존재하지 않는 API 엔드포인트입니다.',
  },
}

function getErrorMessage(statusCode, errorCode) {
  const statusErrors = API_ERROR_HANDLERS[statusCode]
  if (!statusErrors) return '알 수 없는 오류가 발생했습니다.'

  return statusErrors[errorCode] || '처리되지 않은 오류입니다.'
}

// 사용 예시
console.log(getErrorMessage(401, 'TOKEN_EXPIRED'))
// '토큰이 만료되었습니다.'
```

## 실무 적용 예시

### React 컴포넌트 렌더링 분기

```javascript
// 기존 방식 - 복잡한 if-else
function renderContent(type, data) {
  if (type === 'loading') {
    return <LoadingSpinner />
  }
  if (type === 'empty') {
    return <EmptyState message="데이터가 없습니다" />
  }
  if (type === 'error') {
    return <ErrorMessage error={data} />
  }
  if (type === 'success') {
    return <DataList items={data} />
  }
  return <div>알 수 없는 상태</div>
}

// 개선된 방식 - 객체 활용
const CONTENT_RENDERERS = {
  loading: () => <LoadingSpinner />,
  empty: () => <EmptyState message="데이터가 없습니다" />,
  error: data => <ErrorMessage error={data} />,
  success: data => <DataList items={data} />,
}

function renderContent(type, data) {
  const renderer = CONTENT_RENDERERS[type]
  return renderer ? renderer(data) : <div>알 수 없는 상태</div>
}
```

### 상태 머신 구현

```javascript
const SHOPPING_CART_TRANSITIONS = {
  empty: {
    ADD_ITEM: 'has_items',
    CLEAR: 'empty',
  },
  has_items: {
    ADD_ITEM: 'has_items',
    REMOVE_ITEM: (state, payload) => {
      return state.items.length === 1 ? 'empty' : 'has_items'
    },
    CHECKOUT: 'checking_out',
    CLEAR: 'empty',
  },
  checking_out: {
    SUCCESS: 'order_completed',
    FAILURE: 'has_items',
    CANCEL: 'has_items',
  },
  order_completed: {
    NEW_ORDER: 'empty',
    VIEW_ORDER: 'order_completed',
  },
}

function getNextState(currentState, action, payload = null) {
  const transitions = SHOPPING_CART_TRANSITIONS[currentState]
  if (!transitions) return currentState

  const transition = transitions[action]
  if (!transition) return currentState

  return typeof transition === 'function'
    ? transition(currentState, payload)
    : transition
}
```

### 폼 유효성 검사

```javascript
const VALIDATION_RULES = {
  email: {
    required: value => (!value ? '이메일은 필수입니다.' : null),
    format: value => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return !emailRegex.test(value) ? '올바른 이메일 형식이 아닙니다.' : null
    },
  },
  password: {
    required: value => (!value ? '비밀번호는 필수입니다.' : null),
    minLength: value =>
      value.length < 8 ? '비밀번호는 8자 이상이어야 합니다.' : null,
    complexity: value => {
      const hasNumber = /\d/.test(value)
      const hasLetter = /[a-zA-Z]/.test(value)
      return !hasNumber || !hasLetter
        ? '비밀번호는 숫자와 문자를 포함해야 합니다.'
        : null
    },
  },
  name: {
    required: value => (!value?.trim() ? '이름은 필수입니다.' : null),
    minLength: value =>
      value.trim().length < 2 ? '이름은 2자 이상이어야 합니다.' : null,
  },
}

function validateField(fieldName, value) {
  const rules = VALIDATION_RULES[fieldName]
  if (!rules) return null

  for (const [ruleName, validator] of Object.entries(rules)) {
    const error = validator(value)
    if (error) return error
  }
  return null
}
```

## 다른 언어에서의 동일 패턴

### Python 딕셔너리 활용

```python
# Python에서의 구현
STATUS_HANDLERS = {
    'loading': lambda: '로딩 중입니다...',
    'success': lambda data: f'성공: {len(data)}개 항목',
    'error': lambda error: f'오류 발생: {error.message}',
    'empty': lambda: '데이터가 없습니다'
}

def handle_status(status, data=None):
    handler = STATUS_HANDLERS.get(status)
    return handler(data) if handler else '알 수 없는 상태'
```

### TypeScript 타입 안전성과 함께

```typescript
type StatusType = 'loading' | 'success' | 'error' | 'empty'
type StatusHandler<T> = (data?: T) => string

interface StatusHandlers {
  loading: StatusHandler<never>
  success: StatusHandler<any[]>
  error: StatusHandler<Error>
  empty: StatusHandler<never>
}

const STATUS_HANDLERS: StatusHandlers = {
  loading: () => '로딩 중입니다...',
  success: (data = []) => `성공: ${data.length}개 항목`,
  error: error => `오류 발생: ${error?.message || '알 수 없는 오류'}`,
  empty: () => '데이터가 없습니다',
}

function handleStatus<T>(status: StatusType, data?: T): string {
  const handler = STATUS_HANDLERS[status]
  return handler ? handler(data as any) : '알 수 없는 상태'
}
```

### Java Map과 람다 활용

```java
import java.util.Map;
import java.util.function.Function;

Map<String, Function<Object, String>> statusHandlers = Map.of(
    "loading", data -> "로딩 중입니다...",
    "success", data -> "성공적으로 처리되었습니다!",
    "error", data -> "오류가 발생했습니다: " + data.toString(),
    "empty", data -> "데이터가 없습니다"
);

public String getStatusMessage(String status, Object data) {
    return statusHandlers
        .getOrDefault(status, data -> "알 수 없는 상태입니다")
        .apply(data);
}
```

## 언제 쓰면 좋을까?

조건이 3개 이상이고, 각 조건의 결과가 단순한 값이나 함수 호출 수준이고, 앞으로 조건이 더 추가될 것 같다면 객체 기반으로 바꾸는 게 낫습니다.

반면 조건이 두 개 이하거나, 조건들이 서로 의존적이거나, 판단 로직 자체가 복잡한 경우엔 그냥 if-else가 더 읽기 편할 수 있습니다:

```javascript
// 이런 경우에는 if-else가 더 적합
function calculateDiscount(user, item, season) {
  if (
    user.membership === 'premium' &&
    item.category === 'electronics' &&
    season === 'holiday'
  ) {
    // 복잡한 할인 계산 로직
    return calculateComplexDiscount(user, item, season)
  }
  if (user.firstPurchase && item.price > 100000) {
    // 첫 구매 할인 로직
    return calculateFirstPurchaseDiscount(item)
  }
  return 0
}
```

이 패턴이 익숙해지면 Strategy Pattern, State Pattern 같은 디자인 패턴들이 사실 같은 아이디어의 연장선임을 느낄 수 있습니다.
