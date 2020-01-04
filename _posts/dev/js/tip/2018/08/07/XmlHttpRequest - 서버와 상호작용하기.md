---
category: "Dev"
date: "2018-08-07"
title: "XMLHttpMethod - 서버와 상호작용하기"
tags: ["개발", "Javascript"]
---
XMLHttpRequest(XHR)은 서버와 상호작용을 가능하게 해주는 객체입니다.  
Ajax에 주로 쓰이며, 마찬가지로 전체 데이터를 새로 불러오지 않고도 일부분만을 업데이트 할 수 있습니다.  
저는 이를 [블로그 서버의 online상태를 확인](https://blog.jell.kr/chat/2018/08/07/내_블로그는_살아있는가/)하는 데에 사용했습니다.
```javascript
let xhttp = new XMLHttpRequest() // XMLHttpRequest 객체를 만듭니다.
xhttp.onreadystatechange = () => { // xhttp객체의 상태가 변화할 때 비동기로 실행됩니다.
  if (xhttp.readyState == 4 && xhttp.status == 200) { 
    // readyState는 밑에서 따로 설명합니다. 지금 여기서는 서버로부터 정상적으로 반환되었을 때를 나타냅니다.
    document.getElementById('status').innerHTML = 'online'
  } else { 
    // 서버로부터 정상적으로 반환받지 못했거나, response status가 200이 아닐 때 들어옵니다.
    document.getElementById('status').innerHTML = 'offline'
  }
}
xhttp.open("GET", "https://blog.jell.kr")
// 서버의 주소와 method('GET', 'POST', 'PUT', 'DELETE' 등)을 설정합니다.
xhttp.send() // 지정된 XMLHttpRequest를 시작합니다.
```
  
readyState는 각각 다음과 같은 상태를 나타냅니다.  
~~~
  0 (uninitialized) - (request가 초기화되지 않음)  
  1 (loading) - (서버와의 연결이 성사됨)  
  2 (loaded) - (서버가 request를 받음)  
  3 (interactive) - (request(요청)을 처리하는 중)  
  4 (complete) - (request에 대한 처리가 끝났으며 응답할 준비가 완료됨)
~~~
