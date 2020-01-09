---
category: "Dev"
date: "2020-01-09T13:00:00Z"
title: "for-of를 사용해보자."
tags: ["개발", "Javascript", "Typescript"]
---

```toc
```

## 개요

모든 언어가 그렇지만, 반복문은 주로 for문을 사용합니다.  
아~~~~주 가끔 while문을 쓰는 정도이고요.  
Javascript에는 for문 말고도 map, forEach 등등 지원해주는 함수가 많이 있습니다.  
오늘은 그 중 for~of문을 소개할까 합니다.


### 사용법

```javascript
const years = [2001, 2010, 2015, 2016]

for (let year of years) {
	console.log(year)
}
```

간단하죠? 기존 ES5에서는 for~in 함수가 있었습니다.

```javascript
const years = [2001, 2010, 2015, 2016]

for (let year in years) {
	console.log(year)
}
```

ES6에는 for~in을 대체할 for~of가 나왔습니다.
for~in과 for~of는 역할이 거의 같습니다.
차이점은 break가 가능 여부이죠.

for~in은 불가능합니다.

for~in
```javascript
const years = [2001, 2010, 2015, 2016]

for (let year in years) {
  console.log(year)
  break
}
// 2001, 2010, 2015, 2016
```

for~of
```javascript
const years = [2001, 2010, 2015, 2016]

for (let year of years) {
  console.log(year)
  break
}
// 2001
```
