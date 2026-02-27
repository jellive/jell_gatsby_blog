---
title: 'JavaScript 호이스팅 이해하기 - var/let/const 차이점'
date: '2025-09-02'
category: 'Javascript'
tags: ['javascript', 'hoisting', 'var-let-const', 'scope']
---

## 목차

```toc

```

## 호이스팅이란?

JavaScript에서 변수와 함수 선언이 코드 실행 전에 메모리에 먼저 할당되는 현상입니다.

```javascript
console.log(x) // undefined (에러 X)
var x = 5
```

## var의 호이스팅

### 선언과 초기화 분리

```javascript
console.log(x) // undefined
var x = 5
console.log(x) // 5

// 실제 동작 방식
var x // 선언이 먼저 (호이스팅)
console.log(x) // undefined
x = 5 // 할당
console.log(x) // 5
```

### 실무 문제 사례

```javascript
// 모든 버튼이 같은 값 출력
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i) // 모두 3 출력
  }, 100)
}

// 해결: let 사용
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i) // 0, 1, 2 출력
  }, 100)
}
```

## let/const의 호이스팅

### TDZ (Temporal Dead Zone)

```javascript
console.log(x) // ReferenceError
let x = 5

// const도 동일
console.log(y) // ReferenceError
const y = 10
```

let과 const도 호이스팅되지만, 선언 전까지 접근할 수 없는 **TDZ(Temporal Dead Zone)**에 있습니다.

## 함수 호이스팅

### 함수 선언식

```javascript
sayHello() // "Hello!" - 정상 동작

function sayHello() {
  console.log('Hello!')
}
```

### 함수 표현식

```javascript
sayHi() // TypeError

var sayHi = function () {
  console.log('Hi!')
}
```

### 화살표 함수

```javascript
greet() // ReferenceError

const greet = () => {
  console.log('Greetings!')
}
```

## var vs let vs const 비교

| 특징     | var         | let         | const       |
| -------- | ----------- | ----------- | ----------- |
| 스코프   | 함수 스코프 | 블록 스코프 | 블록 스코프 |
| 재선언   | 가능        | 불가능      | 불가능      |
| 재할당   | 가능        | 가능        | 불가능      |
| 호이스팅 | 선언만      | 선언만      | 선언만      |
| TDZ      | 없음        | 있음        | 있음        |
| 초기값   | undefined   | 접근 불가   | 접근 불가   |
| 권장도   | 지양        | 권장        | 최우선      |

## 스코프 차이

### 함수 스코프 (var)

```javascript
function test() {
  if (true) {
    var x = 5
  }
  console.log(x) // 5 - 접근 가능
}
```

### 블록 스코프 (let/const)

```javascript
function test() {
  if (true) {
    let x = 5
    const y = 10
  }
  console.log(x) // ReferenceError
  console.log(y) // ReferenceError
}
```

## 실무 베스트 프랙티스

### 1. const 우선 사용

```javascript
const API_URL = 'https://api.example.com'
const users = await fetchUsers()
```

### 2. 재할당 필요시 let

```javascript
let count = 0
for (let i = 0; i < 10; i++) {
  count += i
}
```

### 3. var는 사용하지 않기

```javascript
// 피하기
var name = 'John'

// 대신 const/let 사용
const name = 'John'
```

### 4. 변수는 사용 전 선언

```javascript
// 좋은 패턴
const userName = 'John'
console.log(userName)

// 나쁜 패턴
console.log(userName) // 호이스팅에 의존
var userName = 'John'
```

## 클래스 호이스팅

```javascript
// 에러
const instance = new MyClass()

class MyClass {
  constructor() {}
}

// 올바른 순서
class MyClass {
  constructor() {}
}
const instance = new MyClass()
```

## 핵심 정리

호이스팅은 선언이 스코프 최상단으로 끌어올려지는 현상입니다.
var는 함수 스코프에서 undefined로 초기화되며 재선언이 가능한 반면,
let과 const는 블록 스코프를 따르고 TDZ에 있어 선언 전에 접근할 수 없습니다.
함수 선언식은 전체가 호이스팅되지만, 함수 표현식과 화살표 함수는 변수만 호이스팅됩니다.

## 실전 권장사항

const를 기본으로 사용하고, 재할당이 필요한 경우에만 let을 사용하세요.
var는 쓰지 않는 게 좋습니다. 변수는 사용 전에 명시적으로 선언하고,
블록 스코프를 활용해 코드의 예측 가능성을 높이는 게 포인트입니다.
