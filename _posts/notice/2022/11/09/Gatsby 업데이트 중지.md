---
category: "Notice"
date: "2022-11-09"
title: "Gatsby 업데이트 중지"
tags: ["공지"]
---

몇 달 동안 업로드가 없었죠?  
죄송합니다(__)  
일도 있었고, 제가 업로드 할 당시의 Gatsby V3와 React 16, node 14에서  
지금은 Gatsby V5, React 18, node 18이 나왔더라구요?  
원작자분도 업데이트를 그만 두신 듯 하고..  
업데이트를 시도하다가, 조금 더 알아보고 업데이트를 하는게 낫겠다 싶어서 모두 롤백했습니다.  
업데이트한 부분은, ARM 아키텍쳐 (M1, M2)를 사용하는 맥북을 위해 node-sass에서 sass로 전환한 정도입니다.  
또한 빌드는 node 16으로 하시는 걸 권장드립니다.  
NVM으로 사용 설정하시고, docker등을 사용한다면 NODE_VERSION을 16 마지막인 16.18.0으로 고정시키는 걸 권장드립니다.  
그럼, 또 뵙겠습니다 :)

추가로, gatsby-transformer-sharp를 사용했다면 node_modules/sharp 디렉토리를 삭제하고 진행하시면 됩니다 :)  
