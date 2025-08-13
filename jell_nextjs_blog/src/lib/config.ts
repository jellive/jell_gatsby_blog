export const siteConfig = {
  /** Site MetaData (Required all)*/
  title: `Jell의 세상 사는 이야기`,
  description: `이것 저것 해보는 블로그입니다.`,
  author: `Jell`,
  siteUrl: 'https://blog.jell.kr',

  /** Header */
  profileImageFileName: 'profile.jpeg',

  /** Home > Bio information*/
  comment: '아직 갈 길이 멀다.',
  name: 'Jell',
  company: '',
  location: 'Seoul, Korea',
  email: 'jellive7@gmail.com',
  website: 'https://blog.jell.kr',
  linkedin: 'https://www.linkedin.com/in/%ED%95%9C%EA%B5%B0-%EC%9C%A0-429980113/',
  facebook: '',
  instagram: '',
  github: 'https://github.com/jellive',

  /** Post */
  enablePostOfContents: true,
  disqusShortname: 'jell-1',
  enableSocialShare: true,

  /** Optional */
  googleAnalytics: 'UA-127125899-1',
  googleAdsenseSlot: '6839238861',
  googleAdsenseClient: 'ca-pub-5518615618879832',
} as const

export default siteConfig