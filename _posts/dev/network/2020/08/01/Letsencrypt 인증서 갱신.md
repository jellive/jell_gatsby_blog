---
category: 'Dev'
date: '2020-08-01'
title: "Let's encrypt 인증서 갱신하기"
tags: ['개발', '네트워크']
---

제 블로그는 Let's Encrypt로 SSL을 구성하고 있습니다.  
Let's Encrypt는 무료이기 떄문에 많은 분들이 이용하고 있지만, 무분별한 인증서 남용을 막기 위해 3개월로 기간을 제한하고 있습니다.

저도 다음주에 만기가 되어서 슬슬 알아보다가, 대부분 이용하는 certbot이 아닌 apt 패키지인 'letsencrypt'를 사용하고 있기에 메모할 겸 남겨둡니다.  
현재 저는 nginx를 사용하고 있으며, 와일드카드(\*) 인증서를 사용하고 있습니다.

```console
root@jell:~# letsencrypt certonly -a webroot --agree-tos --renew-by-default --webroot-path=/var/www/blog -d [와일드카드주소]
```

3개월마다 해줘야하는 게 귀찮은 일이기도 하지만, crontab으로 3개월마다 자동갱신을 할 수도 있습니다.  
이에 대해서는 추후 포스팅 하도록 하겠습니다.
