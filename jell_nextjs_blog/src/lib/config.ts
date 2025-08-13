export const siteConfig = {
  /** Site MetaData (Required all)*/
  title: process.env.NEXT_PUBLIC_SITE_TITLE || `Jell의 세상 사는 이야기`,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || `이것 저것 해보는 블로그입니다.`,
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
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN || 'https://www.linkedin.com/in/%ED%95%9C%EA%B5%B0-%EC%9C%A0-429980113/',
  facebook: '',
  instagram: '',
  github: process.env.NEXT_PUBLIC_GITHUB || 'https://github.com/jellive',

  /** Post */
  enablePostOfContents: true,
  disqusShortname: process.env.NEXT_PUBLIC_DISQUS_SHORTNAME || 'jell-1',
  enableSocialShare: true,

  /** Optional */
  googleAnalytics: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'UA-127125899-1',
  googleAdsenseSlot: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT || '6839238861',
  googleAdsenseClient: process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT || 'ca-pub-5518615618879832',
} as const

export default siteConfig