export const siteConfig = {
  /** Site MetaData (Required all)*/
  title: process.env.NEXT_PUBLIC_SITE_TITLE || `Jell의 세상 사는 이야기`,
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    `이것 저것 해보는 블로그입니다.`,
  author: process.env.NEXT_PUBLIC_AUTHOR || `Jell`,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.jell.kr',

  /** Header */
  profileImageFileName: 'profile.jpeg',

  /** Home > Bio information*/
  comment: '아직 갈 길이 멀다.',
  name: process.env.NEXT_PUBLIC_AUTHOR || 'Jell',
  company: '',
  location: 'Seoul, Korea',
  email: process.env.NEXT_PUBLIC_EMAIL || 'jellive7@gmail.com',
  website: process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.jell.kr',
  linkedin:
    process.env.NEXT_PUBLIC_LINKEDIN ||
    'https://www.linkedin.com/in/%ED%95%9C%EA%B5%B0-%EC%9C%A0-429980113/',
  facebook: '',
  instagram: '',
  github: process.env.NEXT_PUBLIC_GITHUB || 'https://github.com/jellive',

  /** Post */
  enablePostOfContents: true,
  disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || 'jell-1',
  enableSocialShare: true,

  /** Optional */
  // ★폴백을 빈 문자열로 둔다. 전에는 `UA-127125899-1`(2023년에 종료된 Universal
  //   Analytics 속성)이라, 환경변수가 빠지면 **아무 데도 안 가는 태그가 붙은 채
  //   설치된 것처럼 보였다.** 빈 값이면 GoogleAnalytics 컴포넌트가 null 을 돌려
  //   아예 안 붙는다 — 없는 게 죽은 게 붙은 것보다 낫다.
  googleAnalytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
  // 2026-09-19 교체. 옛 값 `6839238861` 은 **이 계정에 존재하지 않는 단위**였고
  // (광고 단위 목록에 time-letter 것 2개뿐), 그래서 광고 요청이 매번 400 이었다.
  // 자동광고는 슬롯 없이 페이지 단위로 돌아서 멀쩡했기 때문에 티가 안 났다.
  googleAdsenseSlot:
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT || '5669856504',
  googleAdsenseClient:
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || 'ca-pub-5518615618879832',
} as const

export default siteConfig
