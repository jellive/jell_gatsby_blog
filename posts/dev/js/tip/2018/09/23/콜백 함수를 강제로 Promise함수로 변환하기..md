---
category: "Dev"
date: "2018-09-23T17:08:00Z"
title: "콜백 함수를 강제로 Promise로 변환하기."
tags: ["개발", "Javascript", "Typescript"]
---
Node.js는 Javascript를 html에서 어플리케이션용 언어로 쓸 수 있게 해주는 언어입니다.  

다만 Node.js의 특성 상, 싱글 스레드이기 때문에 효율적인 처리를 위해 외부 프로세스를 생성하여 비동기 처리하고 있습니다.  
이를 받아들일 때는 콜백 함수(Callback Function)라는 특수한 형태의 함수를 사용하는데, 문제는 이 콜백 함수의 중복이 늘어날 수록 코드를 알아보기 힘들어 진다는 단점이 있습니다.  

해결하기 위해 개발자들은 고심했고, Promise 및 async/await가 발표되어 ECMAScript6(es6, es2015)에는 정식으로 채택되기에 이릅니다.  

이번에 해볼 작업은 기존의 콜백 함수를 Promise타입으로 변환하는 작업을 해봅시다.  
여기서는 파일 시스템('fs')의 readFile을 Promise함수로 변환해봅시다. 물론 fs에는 readFileSync라는 동기화 함수가 있으므로, 예시로만 기억해두시면 좋을 듯 싶습니다.  

```javascript
import fs from 'fs';

function read() {
    fs.readFile(__dirname + 'index.js', (err, data) => {
        if (err) {
            //...when fail
        }
        //...do something
    })
}
```

이 형태가 기존의 Callback function의 구조입니다. 이 안에 많은 콜백 함수가 늘어난다면?

```javascript
import fs from 'fs';

function read() {
    fs.readFile(__dirname + 'index.js', (err, data) => {
        if (err) {
            //...when fail
        }
        //...do something
        fs.readFile(__dirname + 'index.js', (err, data) => {
            if (err) {
                //...when fail
            }
            //...do something
            fs.readFile(__dirname + 'index.js', (err, data) => {
                if (err) {
                    //...when fail
                }
                //...do something
                fs.readFile(__dirname + 'index.js', (err, data) => {
                    if (err) {
                        //...when fail
                    }
                    //...do something
                    fs.readFile(__dirname + 'index.js', (err, data) => {
                        if (err) {
                            //...when fail
                        }
                        //...do something
                        fs.readFile(__dirname + 'index.js', (err, data) => {
                            if (err) {
                                //...when fail
                            }
                            //...do something
                        })
                    })
                })
            })
        })
    })
}
```

...네, 생각만으로도 끔찍하겠죠?  
강제로 변환시킨 Promise함수는 다음과 같습니다.  

```javascript
import fs from 'fs';

function read() {
    return new Promise((resolve, reject) => {
        fs.readFile(__dirname + 'index.js', (err, data) => {}
            if (err) {
                //...when fail
                reject(err)
            }
            //...do something
            resolve(data)
        })
    })
}
```

원리는 간단한데, Callback함수에 error callback과 data를 구분하여 각각 reject, resolve를 반환하는 Promise함수로 감싸주는 데에 중점을 뒀습니다.  
생각보다 간단하죠?  
다른 좋은 방법을 알고 계시다면 댓글 달아주세요. 참고하여 수정하겠습니다.