(()=>{var e={};e.id=636,e.ids=[636],e.modules={8550:e=>{"use strict";e.exports={title:`Jell의 세상 사는 이야기`,description:`이것 저것 해보는 블로그입니다.`,author:"Jell",siteUrl:"https://blog.jell.kr",profileImageFileName:"profile.jpeg",comment:"아직 갈 길이 멀다.",name:"Jell",company:"",location:"Seoul, Korea",email:"jellive7@gmail.com",website:"https://blog.jell.kr",linkedin:"https://www.linkedin.com/in/%ED%95%9C%EA%B5%B0-%EC%9C%A0-429980113/",facebook:"",instagram:"",github:"https://github.com/jellive",enablePostOfContents:!0,disqusShortname:"jell-1",enableSocialShare:!0,googleAnalytics:"UA-127125899-1",googleAdsenseSlot:"6839238861",googleAdsenseClient:"ca-pub-5518615618879832"}},798:(e,t,l)=>{"use strict";let s;l.d(t,{A:()=>o});var i=l(143);function o(e=null){let t=s??new i.ApolloClient({ssrMode:!0,link:(0,i.createHttpLink)({uri:"/api/graphql",credentials:"same-origin"}),cache:new i.InMemoryCache({addTypename:!1,typePolicies:{Query:{fields:{allMarkdownRemark:{read:e=>e||{edges:[]},merge:(e,t)=>({...e,edges:t?.edges||[],group:t?.group||[]})}}}}})});return e&&t.cache.restore(e),t}},7964:(e,t,l)=>{"use strict";l.r(t),l.d(t,{default:()=>d});var s=l(8732),i=l(7912),o=l.n(i),r=l(143),n=l(798),a=l(8550),c=l.n(a);function d({Component:e,pageProps:t}){let l=(0,n.A)(t.initialApolloState);return(0,s.jsxs)(r.ApolloProvider,{client:l,children:[(0,s.jsx)(o(),{children:c().googleAdsenseClient&&(0,s.jsx)("script",{async:!0,src:"https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",crossOrigin:"anonymous","data-ad-client":c().googleAdsenseClient})}),(0,s.jsx)(e,{...t})]})}l(4519)},4519:()=>{},143:e=>{"use strict";e.exports=require("@apollo/client")},7912:e=>{"use strict";e.exports=require("next/head")},8732:e=>{"use strict";e.exports=require("react/jsx-runtime")}};var t=require("../webpack-runtime.js");t.C(e);var l=t(t.s=7964);module.exports=l})();