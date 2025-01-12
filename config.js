module.exports = {
  /** Site MetaData (Required all)*/
  title: `Jell의 세상 사는 이야기`,                           // (* Required)
  description: `이것 저것 해보는 블로그입니다.`,          // (* Required)
  author: `Jell`,                         // (* Required)
  siteUrl: 'https://blog.jell.kr',                      // (* Required)
    // ex.'https://junhobaik.github.io'
    // ex.'https://junhobaik.github.io/' << X, Do not enter "/" at the end.

  /** Header */
  profileImageFileName: 'profile.jpeg', // include filename extension ex.'profile.jpg'
    // The Profile image file is located at path "./images/"
    // If the file does not exist, it is replaced by a random image.

  /** Home > Bio information*/
  comment: '아직 갈 길이 멀다.',
  name: 'Jell',
  company: '',
  location: 'Seoul, Korea',
  email: 'jellive7@gmail.com',
  website: 'https://blog.jell.kr',           // ex.'https://junhobaik.github.io'
  linkedin: 'https://www.linkedin.com/in/%ED%95%9C%EA%B5%B0-%EC%9C%A0-429980113/',                                                          // ex.'https://www.linkedin.com/in/junho-baik-16073a19ab'
  facebook: '',                                                          // ex.'https://www.facebook.com/zuck' or 'https://www.facebook.com/profile.php?id=000000000000000'
  instagram: '',                                                         // ex.'https://www.instagram.com/junhobaik'
  github: 'https://github.com/jellive',                                                            // ex.'https://github.com/junhobaik'

  /** Post */
  enablePostOfContents: true,     // TableOfContents activation (Type of Value: Boolean. Not String)
  disqusShortname: 'jell-1',            // comments (Disqus sort-name)
  enableSocialShare: true,        // Social share icon activation (Type of Value: Boolean. Not String)

  /** Optional */
  googleAnalytics: 'UA-127125899-1',                  // Google Analytics TrackingID. ex.'UA-123456789-0'
  googleAdsenseSlot: '6839238861',                // Google Adsense Slot. ex.'5214956675'
  googleAdsenseClient: 'ca-pub-5518615618879832', // Google Adsense Client. ex.'ca-pub-5001380215831339'
    // Please correct the adsense client number(ex.5001380215831339) in the './static/ads.txt' file.
};
