---
category: "Dev"
date: "2020-01-07T18:51:00Z"
title: "Axios 설정 시 헤더를 넣는 법"
tags: ["개발", "Javascript", "Typescript"]
---

```toc
```

## 개요
Javascript 개발 시 (특히 node.js 개발 시) 반드시라고 해도 좋을 정도로 유용한 라이브러리가 있습니다.  
바로 'axios'인데요, http(s)를 통해 다른 서버와 통신할 때의 코드를 줄여주는 매크로 모음 라이브러리입니다.  
get은 바로

```javascript
  axios.get('https://blog.jell.kr')
```
처리할 수 있지만, post는 보내는 방법에 따라 달라집니다. (form-data라거나.. x-www-form-urlencoded라거나...)  
이럴 때 우리는 헤더를 집어넣게 되는데, 다음과 같은 방식으로 넣을 수 있습니다.

## 코드
### header 삽입
```javascript
const headers = {
  'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Accept': '*/*'
}
axios.defaults.headers.post = null
axios.post('https://blog.jell.kr', param, {headers})
.then(res => { // headers: {…} 로 들어감.
  console.log('send ok', res.data)
})
```

여기서 주목할 것은 {headers}인데요, 위와 같이 넣게 되면 object가 그대로 들어가는 게 아닌
```javascript
headers: {
  'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'Accept': '*/*'
}
```
의 형태로 들어가게 됩니다.  
뭔가 매크로 같기도 하고..저도 아직 정확한 명칭을 못 찾았는데, 찾게 되면 수정하도록 하겠습니다.