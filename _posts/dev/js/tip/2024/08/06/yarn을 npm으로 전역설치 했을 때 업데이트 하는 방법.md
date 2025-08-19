---
category: 'Dev'
date: '2024-08-06'
title: 'yarn을 npm으로 전역설치 했을 때 업데이트 하는 방법'
tags: ['npm', 'Yarn', 'package.json']
---

## 왜 작성하게 되었는가

![이전버전](images/previous-version.png)
![최신버전](images/current-version.png)
npm update -g yarn

만약 업그레이드 후 에러가 나온다면, package.json의 'packageManager'를 지정해주면 된다.
![package.json의 'packageManager'](images/package-manager.png)
