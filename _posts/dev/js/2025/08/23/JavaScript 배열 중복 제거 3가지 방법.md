---
title: 'JavaScript 배열 중복 제거 3가지 방법'
date: '2025-08-23'
category: 'Javascript'
tags: ['Javascript', 'Array', 'Tips', '개발']
---

## 목차

```toc

```

## 개요

JavaScript 개발을 하다 보면 배열에서 중복된 값을 제거해야 하는 상황이 자주 발생합니다.
API에서 받아온 데이터나 사용자 입력 처리 시 중복을 제거하는 것은 필수적인 작업입니다.
오늘은 가장 효율적이고 실용적인 3가지 방법을 알아보겠습니다.

## 방법 1: Set을 이용한 중복 제거 (가장 간단)

```javascript
const numbers = [1, 2, 2, 3, 4, 4, 5]
const uniqueNumbers = [...new Set(numbers)]

console.log(uniqueNumbers) // [1, 2, 3, 4, 5]
```

**장점**: 코드가 매우 간결하고 직관적입니다.
**단점**: 객체 배열에서는 참조 비교로만 작동합니다.

## 방법 2: filter와 indexOf를 이용한 방법

```javascript
const numbers = [1, 2, 2, 3, 4, 4, 5]
const uniqueNumbers = numbers.filter(
  (item, index) => numbers.indexOf(item) === index
)

console.log(uniqueNumbers) // [1, 2, 3, 4, 5]
```

**원리**: 첫 번째로 나타나는 요소의 인덱스와 현재 인덱스가 같은 경우만 필터링합니다.

## 방법 3: 객체 배열의 중복 제거 (특정 프로퍼티 기준)

```javascript
const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 1, name: 'John' },
  { id: 3, name: 'Bob' },
]

// id 기준으로 중복 제거
const uniqueUsers = users.filter(
  (user, index, self) => index === self.findIndex(u => u.id === user.id)
)

console.log(uniqueUsers)
// [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }, { id: 3, name: 'Bob' }]
```

**활용도**: 실제 개발에서 가장 많이 사용되는 패턴입니다.

## 성능 비교

```javascript
// 큰 배열에서의 성능 테스트
const largeArray = Array.from({ length: 10000 }, () =>
  Math.floor(Math.random() * 1000)
)

console.time('Set 방법')
const result1 = [...new Set(largeArray)]
console.timeEnd('Set 방법') // 가장 빠름

console.time('filter 방법')
const result2 = largeArray.filter(
  (item, index) => largeArray.indexOf(item) === index
)
console.timeEnd('filter 방법') // 상대적으로 느림
```

## 실무에서 자주 쓰는 유틸 함수

```javascript
// 일반 배열 중복 제거
const removeDuplicates = arr => [...new Set(arr)]

// 객체 배열 중복 제거 (특정 키 기준)
const removeDuplicatesByKey = (arr, key) =>
  arr.filter(
    (item, index, self) =>
      index === self.findIndex(obj => obj[key] === item[key])
  )

// 사용 예시
const tags = ['react', 'javascript', 'react', 'css', 'javascript']
console.log(removeDuplicates(tags)) // ['react', 'javascript', 'css']

const products = [
  { id: 1, name: 'iPhone' },
  { id: 2, name: 'Samsung' },
  { id: 1, name: 'iPhone' },
]
console.log(removeDuplicatesByKey(products, 'id'))
// [{ id: 1, name: 'iPhone' }, { id: 2, name: 'Samsung' }]
```

## 마무리

- **간단한 원시값 배열**: Set 사용
- **원시값 배열 (구형 브라우저 지원 필요)**: filter + indexOf
- **객체 배열**: filter + findIndex

이 3가지 방법만 알고 있으면 99%의 중복 제거 상황을 해결할 수 있습니다.
가장 적합한 방법을 선택하여 깔끔하고 효율적인 코드를 작성하시기 바랍니다.
