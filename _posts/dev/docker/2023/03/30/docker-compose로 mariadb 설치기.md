---
category: 'Docker'
date: '2023-03-30'
title: 'Docker-compose로 mariadb 설치하기'
tags: ['Ubuntu', 'linux', 'docker', 'docker-compose', 'Jell']
featuredImage: 'images/zwift.png'
---

# 왜 쓰는가?

하드디스크를 교체하고 ([#](https://blog.jell.kr/dev/linux/2023/02/27/%EC%9A%B0%EB%B6%84%ED%88%AC%2022.04%EB%A1%9C%20%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C%20%ED%95%98%EB%8D%98%20%EC%A4%91%20%EB%B0%9C%EC%83%9D%ED%95%9C%20%EC%9D%B4%EC%8A%88/)) 꺼져있던 컴퓨터를 오랜만에 계속 켜면서 Docker를 본격적으로 공부해봐야겠다는 생각을 했습니다.
그 첫번째로, mariaDB를 docker-compose에 설치하는 시간을 가져봅시다.

# 왜 mariaDB지?

요즘은 이전보다 DB에 대한 선택이 많아져서, PostgreSQL이나 mongoDB를 업무에서 사용하는 경우를 흔히 볼 수 있습니다.  
하지만 많이 사용하는건 여전히 Oracle과 MySQL임을 알 수 있습니다. ([참고](https://db-engines.com/en/ranking))  
Oracle도 얼마든지 무료로 사용할 수 있지만, 현실적으로 사용할 수 있는 RBDMS는 MySQL과 그 pork인 MariaDB라고 생각합니다.  
그 중, 개인적인 욕심으로(?) MariaDB를 선택하게 되었습니다.

# docker-compose.yml 설정

docker-compose.yml을 편집해봅시다.

```yaml
        mariadb:
                container_name: "mariadb"
                image: mariadb:10
                restart: always
                ports:
                        - 3306:3306
                volumes:
                        - "./mariadb/conf.d:/etc/mysql/conf.d"
                        - "./mariadb/data:/var/lib/mysql"
                environment:
                        MARIADB_DATABASE: {사용할 DB}
                        MARIADB_USER: {사용자 ID}
                        MARIADB_PASSWORD: {사용자 비밀번호}
                        MARIADB_ROOT_PASSWORD: {마리아DB 루트유저의 비밀번호}
                restart: always
```

docker-compose.yml에는 이렇게 입력하면 됩니다.  
하지만..

```text
어? db도 안 만들었고 ID와 비밀번호는 더더욱 없는데요?
```

그렇기 위해 우리는 docker에 있는 mariaDB 컨테이너에 직접 접속할 필요가 있습니다.  
우선 저 상태로 두시고, 설치를 진행하시면 됩니다.

# mariaDB 컨테이너 설정

자! 이제 mariaDB의 컨테이너로 접속해봅시다.

```shell
docker ps
```

![mariaDB in docker](images/docker-ps-mariadb.png)
mariaDB의 Container ID를 확인 후

```shell
docker exec -it 415f01c42344 bash // ID가 415f01c42344인 컨테이너를 bash로 접속한다.
```

Container ID를 입력할 떈 앞이 구별될 정도까지만 입력하면 됩니다.  
저같은 경우는 셋째자리(이 경우 '415')까지만 입력하는 편입니다.  
여하튼 접속을 하게 되면...

![mariaDB exec docker](images/docker-exec-mariadb.png)

짠! 접속을 하게 됩니다.

여기서부터는 기존 Linux에서 mariaDB의 설정법대로 진행해주시면 됩니다.  
추후 mariaDB(MySQL)의 설정법도 적어보도록 하겠습니다 :)
