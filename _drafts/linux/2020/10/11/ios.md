---
category: 'Dev'
date: '2022-03-28T16:00:00Z'
title: 'ios'
tags: ['Ubuntu', 'linux', 'Jell', 'Shell']
---

# 왜 쓰는가?

저녁에 조금 일찍 잠들어서 자정즈음에 깼습니다.  
그냥 멍때리면서 개발하고 있다가, 문득 제가 쓰는 노트북~~나스 대용~~의 우분투 버전이 18.04 LTS라는 걸 떠올리면서 ~~왜 그랬는지는 모르겠지만~~ 20.04.1 LTS로 이 참에 업그레이드나 해야겠다...하고 아무 생각없이

```shell
do-release-upgrade -d
```

를 입력한 게 새벽 1시 경이었습니다.  
그리고 30분 뒤... 10년 된 제 노트북이 뻗더군요.  
순간 머리속이 새하얘졌습니다.

```
잠깐 내 데이터! 내 설정!
```

어찌저찌 살려보려고 급한 ssl인증서 정도만 백업하고 결국 초기화를 시작했습니다.

# 우분투 설치

우분투 설치는 기본적으로 같습니다. USB를 꽂고 부팅 순서를 맨 위로 올려주면 윈도우 설치하듯이 시작할 수 있습니다.

저 같은 경우에는 '그래픽과 Wi-Fi 하드웨어 그리고 추가 미디어 포맷을 위한 서드 파티 소프트웨어 설치'를 체크하면 설치 마지막에 실패를 하더군요. 체크를 해제하고 다시 설치하니 정상적으로 잡힙니다.

# SSH 설정

```shell
sudo apt update && sudo apt install openssh-server && sudo apt upgrade
```

# 노트북 뚜껑 해제

세팅에 가서 화면 꺼짐 옵션도 해제하고...

노트북 덮개 옵션도 해제합니다. 우선,

```shell
sudo vi /etc/systemd/logind.conf
```

```shell
#HandleLidSwitch=suspend -> HandleLidSwitch=ignore
```

# 외장하드

```shell
sudo vi /etc/fstab
```

```linux
# /etc/fstab: static file system information.
#
# Use 'blkid' to print the universally unique identifier for a
# device; this may be used with UUID= as a more robust way to name devices
# that works even if disks are added and removed. See fstab(5).
#
# <file system> <mount point>   <type>  <options>       <dump>  <pass>
# / was on /dev/sda2 during installation
UUID=0ee0c46f-b332-4435-9d2b-5bb1c8ae9ee8 /               ext4    errors=remount-ro 0       1
# /boot/efi was on /dev/sda1 during installation
UUID=0908-F0EB  /boot/efi       vfat    umask=0077      0       1
/swapfile                                 none            swap    sw              0       0
UUID=70fb2337-3f12-4d20-927b-9379dd7caadb /home/jell/media ext4 defaults        0       0
UUID=a1a78783-f95e-439e-8273-b8745259f4ca /home/jell/etc ext4 defaults  0       0
~
```

# 삼바

```shell
sudo apt-get -y install samba
sudo nano /etc/samba/smb.conf
```

```conf
[multimedia]
comment = multimedia directory
path = /data/Multimedia
valid users = id1,id2
writeable = yes
read only = no
create mode = 0777
directory mode = 0777
```
