---
title: 'JavaScript 호이스팅 완전 가이드 - var/let/const 차이점과 실무 함정 회피법'
date: '2025-09-02'
category: 'Javascript'
tags:
  ['javascript', 'hoisting', 'var-let-const', 'scope', 'debugging', 'interview']
---

## 목차

```toc

```

## 🤔 이 코드의 실행 결과를 맞춰보세요

프로젝트 마감 2시간 전, 테스트에서 예상치 못한 결과가 나왔습니다. 다음 코드를 보고 실행 결과를
예측해보세요:

```javascript
console.log(x) // ?
console.log(y) // ?
console.log(z) // ?

var x = 1
let y = 2
const z = 3

// 정답을 보기 전에 예상해보세요!
```

대부분의 개발자가 "모두 에러가 날 것"이라고 예상하지만, 실제 결과는 다릅니다. 첫 번째는
`undefined`, 두 번째와 세 번째는 `ReferenceError`가 발생합니다. 이런 예상치 못한 결과의 범인이
바로 **호이스팅(Hoisting)**입니다.

## 호이스팅이 일으키는 실제 버그 사례

실제로 3년 차 개발자 A씨가 겪었던 사례입니다. for문으로 여러 개의 버튼을 생성하고, 각 버튼에
클릭 이벤트를 달았는데 모든 버튼이 동일하게 마지막 값만 출력했습니다:

```javascript
// ❌ 3시간 동안 찾지 못한 버그
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(`버튼 ${i} 클릭됨`) // "버튼 3 클릭됨"만 3번 출력
  }, 100)
}
```

모든 버튼이 "버튼 3 클릭됨"을 출력하는 이유는 `var`의 호이스팅 특성 때문입니다. 이런 미묘한
버그가 실무에서 얼마나 많은 시간을 잡아먹는지 경험해보신 분들은 아실 겁니다.

## 호이스팅이란 무엇인가?

호이스팅(Hoisting)은 JavaScript 엔진이 코드를 실행하기 전에 변수와 함수 선언을 해당 스코프의
최상단으로 끌어올리는 것처럼 동작하는 JavaScript의 특성입니다.

실제로는 코드가 이동하는 것이 아니라, JavaScript 엔진이 다음과 같은 두 단계로 코드를 처리합니다:

### 1단계: Creation Phase (생성 단계)

- 스코프를 생성하고 변수와 함수를 메모리에 등록
- `var`는 `undefined`로 초기화
- `let`, `const`는 초기화하지 않음 (TDZ 상태)

### 2단계: Execution Phase (실행 단계)

- 코드를 한 줄씩 실행
- 변수에 실제 값을 할당

```javascript
// 실제 코드
console.log(myVar) // undefined
var myVar = 'Hello'

// JavaScript 엔진이 인식하는 방식 (개념적)
var myVar // undefined로 초기화 (Creation Phase)
console.log(myVar) // undefined 출력
myVar = 'Hello' // 값 할당 (Execution Phase)
```

## var의 호이스팅 - 함정의 시작

`var`는 완전히 호이스팅됩니다. 선언과 동시에 `undefined`로 초기화되기 때문에 예상치 못한
결과를 만들어냅니다.

### 함수 스코프의 함정

```javascript
function buggyFunction() {
  console.log(name) // undefined (에러가 아님!)

  if (false) {
    var name = 'John' // 실행되지 않는 코드지만...
  }

  console.log(name) // 여전히 undefined
}

buggyFunction()
```

`if (false)` 블록은 실행되지 않지만, `var name` 선언은 함수 전체에 호이스팅됩니다. 이로 인해
전역에 같은 이름의 변수가 있어도 접근할 수 없게 됩니다.

### 반복문에서의 클로저 문제

앞서 본 예제의 원인을 자세히 살펴보겠습니다:

```javascript
// var를 사용한 경우 - 문제 상황
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i) // 3, 3, 3 (예상: 0, 1, 2)
  }, 100)
}

// 위 코드가 실제로 동작하는 방식 (개념적)
var i // 호이스팅됨
for (i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i) // 반복문이 끝난 후 i의 최종 값인 3을 출력
  }, 100)
}
```

모든 `setTimeout` 콜백이 같은 `i` 변수를 참조하고, 반복문이 끝난 시점에는 `i`가 3이 되어있기
때문에 모두 3을 출력합니다.

## let/const의 TDZ(Temporal Dead Zone)

ES6에서 도입된 `let`과 `const`는 호이스팅되지만 TDZ라는 안전장치가 있습니다.

### TDZ란?

TDZ(Temporal Dead Zone)는 변수가 스코프에 등록되었지만 아직 초기화되지 않은 상태를 말합니다.
이 구간에서는 해당 변수에 접근할 수 없습니다.

```javascript
console.log(typeof myVar) // undefined (호이스팅됨, 초기화됨)
console.log(typeof myLet) // ReferenceError (호이스팅됨, 초기화 안됨 = TDZ)

var myVar = 1
let myLet = 2
```

### TDZ 동작 원리 시각화

```text
// 스코프 생성 시 (Creation Phase)
┌─────────────────────────────┐
│ 실행 컨텍스트               │
├─────────────────────────────┤
│ myVar: undefined            │ ← 즉시 사용 가능
│ myLet: <uninitialized>      │ ← TDZ 상태
│ myConst: <uninitialized>    │ ← TDZ 상태
└─────────────────────────────┘

// let myLet = 2; 실행 후
┌─────────────────────────────┐
│ 실행 컨텍스트               │
├─────────────────────────────┤
│ myVar: undefined            │
│ myLet: 2                    │ ← TDZ 해제, 사용 가능
│ myConst: <uninitialized>    │ ← 여전히 TDZ
└─────────────────────────────┘
```

### let/const로 반복문 문제 해결

```javascript
// ✅ let으로 해결
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i) // 0, 1, 2 (예상대로!)
  }, 100)
}

// 각 반복마다 새로운 블록 스코프 생성
// 각각 다른 i 변수를 가지게 됨
```

`let`은 블록 스코프이므로 각 반복마다 새로운 `i` 변수가 생성됩니다. 따라서 각 콜백이 서로 다른
`i`를 참조하게 됩니다.

## 함수 호이스팅의 두 얼굴

함수도 호이스팅되지만, 선언 방식에 따라 동작이 다릅니다.

### 함수 선언식 - 완전 호이스팅

```javascript
// 선언 전에 호출 가능
console.log(add(2, 3)) // 5 (정상 작동!)

function add(a, b) {
  return a + b
}
```

함수 선언식은 함수 전체가 호이스팅됩니다. 선언 전에 호출해도 정상 작동합니다.

### 함수 표현식 - 변수 호이스팅만

```javascript
// 에러 발생!
console.log(multiply(2, 3)) // TypeError: multiply is not a function

var multiply = function (a, b) {
  return a * b
}

// 위 코드의 실제 동작 (개념적)
var multiply // undefined로 초기화
console.log(multiply(2, 3)) // undefined는 함수가 아니므로 에러
multiply = function (a, b) {
  return a * b
}
```

함수 표현식은 변수 선언만 호이스팅되므로, 할당 전에는 `undefined` 상태입니다.

### 화살표 함수와 호이스팅

```javascript
// ❌ 에러 발생
console.log(arrow()) // ReferenceError (let 사용)

let arrow = () => {
  return 'Hello'
}

// ❌ 에러 발생 (다른 이유)
console.log(arrowVar()) // TypeError: arrowVar is not a function

var arrowVar = () => {
  return 'Hello'
}
```

화살표 함수는 항상 변수에 할당되므로, 해당 변수의 호이스팅 규칙을 따릅니다.

## 실무에서 자주 발생하는 호이스팅 버그

### 1. 조건부 선언의 함정

```javascript
// ❌ 예상치 못한 동작
function checkUser(isLoggedIn) {
  if (isLoggedIn) {
    var username = '사용자'
    var role = 'admin'
  } else {
    console.log(username) // undefined (에러 아님!)
    console.log(role) // undefined (에러 아님!)
  }
}

checkUser(false)

// ✅ let/const로 해결
function checkUser(isLoggedIn) {
  if (isLoggedIn) {
    let username = '사용자'
    let role = 'admin'
  } else {
    console.log(username) // ReferenceError (명확한 에러!)
    console.log(role) // ReferenceError (명확한 에러!)
  }
}
```

### 2. React에서의 실제 사례

```javascript
// ❌ React에서 흔한 실수
function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (shouldFetchUser) {
      // ReferenceError!
      fetchUserData()
    }

    let shouldFetchUser = user === null
  }, [user])

  return <div>{user?.name}</div>
}

// ✅ 올바른 순서
function UserProfile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    let shouldFetchUser = user === null

    if (shouldFetchUser) {
      fetchUserData()
    }
  }, [user])

  return <div>{user?.name}</div>
}
```

### 3. 모듈에서의 순환 참조 문제

```javascript
// module-a.js
console.log(moduleB); // undefined (호이스팅되었지만 아직 할당 안됨)

import moduleB from './module-b.js';
export default 'Module A';

// module-b.js
import moduleA from './module-a.js';
export default 'Module B';
```

## 호이스팅을 피하는 모던 JavaScript 패턴

### 1. const 우선, let 차선, var 금지

```javascript
// ✅ 권장 패턴
const API_URL = 'https://api.example.com' // 변경되지 않는 값
const users = [] // 배열 자체는 변경되지 않음 (요소 추가/제거는 가능)

let currentUser = null // 변경이 필요한 경우만 let
let isLoading = false

// ❌ var는 사용하지 않기 (레거시 코드에서만)
```

### 2. 함수는 사용 전에 선언

```javascript
// ✅ 권장: 화살표 함수와 const
const processData = data => {
  return data.filter(item => item.isActive)
}

const result = processData(rawData) // 선언 후 사용

// ✅ 또는 함수 선언식 (호이스팅 활용)
function processData(data) {
  return data.filter(item => item.isActive)
}

const result = processData(rawData) // 선언 전 사용 가능하지만 권장하지 않음
```

### 3. 블록 스코프 적극 활용

```javascript
// ✅ 블록 스코프로 변수 범위 제한
function processUsers(users) {
  const results = []

  for (const user of users) {
    if (user.isActive) {
      const processedUser = {
        // 블록 내에서만 사용
        id: user.id,
        name: user.name.toUpperCase(),
        lastLogin: new Date(user.lastLogin),
      }

      results.push(processedUser)
      // processedUser는 여기서만 접근 가능
    }
  }

  // console.log(processedUser); // ReferenceError - 접근 불가
  return results
}
```

### 4. 즉시 실행 함수 표현식(IIFE) 대신 모듈 사용

```javascript
// ❌ 예전 방식: IIFE로 스코프 격리
;(function () {
  var privateVar = 'secret'

  window.MyModule = {
    publicMethod: function () {
      return privateVar
    },
  }
})()

// ✅ 모던 방식: ES6 모듈
// my-module.js
const privateVar = 'secret'

export const publicMethod = () => {
  return privateVar
}
```

## 면접에서 자주 나오는 호이스팅 질문

### Q1: 다음 코드의 실행 결과는?

```javascript
var a = 1

function test() {
  console.log(a) // ?
  var a = 2
  console.log(a) // ?
}

test()
console.log(a) // ?
```

**정답과 설명:**

- 첫 번째: `undefined` - 함수 스코프 내 `var a`가 호이스팅되어 전역 변수 `a`를 가림
- 두 번째: `2` - 지역 변수에 값이 할당됨
- 세 번째: `1` - 전역 변수는 변경되지 않음

### Q2: let과 const도 호이스팅되나요?

**모범 답변:**

```text
네, let과 const도 호이스팅됩니다. 하지만 var와 달리 TDZ(Temporal Dead Zone)
라는 안전장치가 있어서 선언 전에 접근하면 ReferenceError가 발생합니다.
이는 런타임 에러를 통해 개발자가 문제를 빨리 발견할 수 있도록 돕습니다.
```

### Q3: 함수 선언식과 함수 표현식의 호이스팅 차이는?

```javascript
// 함수 선언식
function declaration() {
  return 'declaration'
}

// 함수 표현식
const expression = function () {
  return 'expression'
}

// 화살표 함수
const arrow = () => 'arrow'
```

**모범 답변:**

```text
함수 선언식은 완전히 호이스팅되어 선언 전에 호출 가능합니다.
함수 표현식은 변수 선언만 호이스팅되므로 할당 전에는 undefined 상태입니다.
화살표 함수도 함수 표현식과 동일하게 동작합니다.
```

## 호이스팅 디버깅 체크리스트

버그 발생 시 다음을 확인해보세요:

### 변수 관련

- [ ] 변수를 선언 전에 사용하고 있지 않나?
- [ ] `var` 대신 `let`/`const`를 사용하고 있나?
- [ ] 조건문 내부의 변수 선언이 예상치 못한 호이스팅을 일으키지 않나?
- [ ] 반복문에서 `let`을 사용하고 있나?

### 함수 관련

- [ ] 함수 표현식을 선언 전에 호출하고 있지 않나?
- [ ] 화살표 함수와 `let`/`const`의 TDZ를 고려했나?
- [ ] 조건부 함수 선언을 사용하고 있지 않나?

### 스코프 관련

- [ ] 블록 스코프를 제대로 활용하고 있나?
- [ ] 전역 변수와 지역 변수의 이름이 겹치지 않나?
- [ ] 클로저에서 예상한 변수를 참조하고 있나?

## var vs let/const 완벽 비교

| 특징      | var                                | let             | const           |
| --------- | ---------------------------------- | --------------- | --------------- |
| 스코프    | 함수 스코프                        | 블록 스코프     | 블록 스코프     |
| 호이스팅  | 완전 호이스팅 (undefined로 초기화) | TDZ (접근 불가) | TDZ (접근 불가) |
| 재선언    | 가능                               | 불가능          | 불가능          |
| 재할당    | 가능                               | 가능            | 불가능          |
| 초기화    | 선택사항                           | 선택사항        | 필수            |
| 권장 사용 | ❌                                 | 변경 필요시만   | ✅ 우선 사용    |

## 실무 가이드라인 - 내일부터 적용하세요

### 1. 변수 선언 우선순위

```javascript
// 1순위: const (90% 이상)
const userName = 'John'
const config = { theme: 'dark' }
const users = [] // 배열/객체 내용 변경은 가능

// 2순위: let (값 변경이 필요한 경우만)
let counter = 0
let currentStep = 1

// 3순위: var (사용하지 않기)
// 레거시 코드나 특수한 경우에만
```

### 2. 함수 선언 가이드라인

```javascript
// ✅ 권장: 화살표 함수 + const
const calculateTotal = items => {
  return items.reduce((sum, item) => sum + item.price, 0)
}

// ✅ 허용: 함수 선언식 (호이스팅 필요시)
function initializeApp() {
  // 앱 초기화 로직
}

// ❌ 피하기: var + 함수 표현식
var oldFunction = function () {
  // 피해야 할 패턴
}
```

### 3. 팀 코딩 컨벤션

```javascript
// .eslintrc.js 설정 예시
module.exports = {
  rules: {
    'no-var': 'error', // var 사용 금지
    'prefer-const': 'error', // const 우선 사용
    'no-undef': 'error', // 선언되지 않은 변수 사용 금지
    'block-scoped-var': 'error', // var의 블록 스코프 위반 금지
  },
}
```

## 마무리: 호이스팅 마스터 되기

### 핵심 개념 5가지 요약

1. **호이스팅은 실제 코드 이동이 아니라 메모리 등록**: JavaScript 엔진이 실행 전에 변수와 함수를
   메모리에 미리 등록하는 과정

2. **var는 완전 호이스팅, let/const는 TDZ**: var는 undefined로 초기화되지만, let/const는
   선언 전까지 접근 불가

3. **함수 선언식은 완전 호이스팅, 함수 표현식은 변수 호이스팅만**: 함수 선언식은 선언 전 호출
   가능, 함수 표현식은 할당 후에만 호출 가능

4. **블록 스코프 vs 함수 스코프**: let/const는 블록 스코프, var는 함수 스코프로 예상치 못한
   결과 발생 가능

5. **TDZ는 안전장치**: 선언 전 접근을 막아 런타임 에러로 문제를 빨리 발견할 수 있게 도움

### 내일부터 적용할 구체적 액션 플랜

```javascript
// ✅ 매일 적용할 패턴
// 1. const 우선, let 차선, var 금지
const config = {}
let state = null

// 2. 함수는 화살표 함수 + const
const processData = data => {
  /* ... */
}

// 3. 블록 스코프 적극 활용
if (condition) {
  const tempData = processUserData() // 블록 내에서만 사용
}

// 4. 디버깅 시 호이스팅 의심하기
// - undefined가 나오면 var 호이스팅 의심
// - ReferenceError가 나오면 TDZ 의심
// - 클로저 문제는 let으로 해결
```

### 면접에서 자주 나오는 질문 TOP 3과 모범 답변

**Q1: 호이스팅이란 무엇인가요?**

```text
모범 답변: JavaScript 엔진이 코드 실행 전에 변수와 함수 선언을
해당 스코프의 메모리에 미리 등록하는 과정입니다. var는 undefined로
초기화되어 선언 전에도 접근 가능하지만, let/const는 TDZ 상태로
선언 전에는 접근할 수 없습니다.
```

**Q2: var, let, const의 차이점은?**

```text
모범 답변: var는 함수 스코프이고 완전히 호이스팅되어 재선언이 가능합니다.
let은 블록 스코프이고 TDZ가 있어 재할당은 가능하지만 재선언은 불가능합니다.
const는 let과 동일하지만 재할당도 불가능하고 선언 시 반드시 초기화해야 합니다.
```

**Q3: TDZ란 무엇인가요?**

```text
모범 답안: Temporal Dead Zone의 줄임말로, let과 const로 선언된 변수가
스코프에 등록되었지만 아직 초기화되지 않은 구간입니다. 이 구간에서
해당 변수에 접근하면 ReferenceError가 발생합니다.
```

이제 호이스팅으로 인한 예상치 못한 버그에 당황하지 마세요. 문제의 원인을 정확히 파악하고,
모던 JavaScript 패턴으로 처음부터 예방할 수 있습니다. 면접에서도 자신 있게 답변하실 수 있을
거예요!

**디버깅 시간을 단축하고, 더 안전한 코드를 작성하는 여러분의 모습을 기대합니다!** 🚀
