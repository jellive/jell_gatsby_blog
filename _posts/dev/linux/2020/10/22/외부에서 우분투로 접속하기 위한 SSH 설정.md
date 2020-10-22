---
category: 'Dev'
date: '2020-10-22T13:40:00Z'
title: '외부에서 접속하기 위한 ssh 설치 가이드'
tags: ['Ubuntu', 'linux', 'Jell', 'Shell']
---

# 왜 쓰는가?

우분투를 메인으로 쓰시는 분이 많이 늘었다고는 하지만, 여전히 서브로 쓰시는 분들이 많습니다.  
그렇다고 우분투를 쓰기 위해 키보드 마우스를 계속 옮기는 일도 번거로운 일이죠.  
제일 크게 다가오는 이유는 역시 서버를 여러군데 두는 일일 것입니다.  
SSH는 우분투(리눅스, 유닉스)를 외부에서 접속할 수 있게 해주는 도구입니다.

# SSH 설정 방법

우선 제일 널리 알려진 OpenSSH를 설치해줍시다.

```shell
sudo apt update && sudo apt install openssh-server
```

설치는 완료되었지만, 이대로는 외부에서 접속 할 수 있는 방법이 없습니다. 바로 접속주체를 설정하지 않았기 때문인데요,  
우선 기본적으로 할 수 있는 비밀번호로 접속 허용을 해줍시다.

```shell
sudo vi /etc/ssh/sshd_config
```

이 파일은 ssh데몬의 설정파일인데요, 여기서...

```
#PasswordAuthentication yes
```

의 주석을 해제해주면 됩니다.
