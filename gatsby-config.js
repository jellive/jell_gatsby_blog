module.exports = {
  siteMetadata: {
    siteUrl: 'https://blog.jell.kr',
    title: `Jell의 세상 사는 이야기`,
    description: `Kick off your next, great Gatsby project with this default starter. This barebones starter ships with the main Gatsby configuration files you might need.`,
    author: `@jellive7`,
  },
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-react-helmet`,
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `images`,
    //     path: `${__dirname}/src/images`,
    //   },
    // },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'posts',
        path: `${__dirname}/posts`,
      },
    },
    'gatsby-transformer-remark',
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-generate-typings',
      options: {
        dest: './src/graphql-types.d.ts',
      },
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [{
          resolve: `gatsby-remark-images`,
          options: {
            // It's important to specify the maxWidth (in pixels) of
            // the content container as this plugin uses this as the
            // base for generating different widths of each image.
            maxWidth: 590,
          },
        }, {
          resolve: `gatsby-remark-prismjs`,
          options: {
            // Class prefix for <pre> tags containing syntax highlighting;
            // defaults to 'language-' (eg <pre class="language-js">).
            // If your site loads Prism into the browser at runtime,
            // (eg for use with libraries like react-live),
            // you may use this to prevent Prism from re-processing syntax.
            // This is an uncommon use-case though;
            // If you're unsure, it's best to use the default value.
            classPrefix: "language-",
            // This is used to allow setting a language for inline code
            // (i.e. single backticks) by creating a separator.
            // This separator is a string and will do no white-space
            // stripping.
            // A suggested value for English speakers is the non-ascii
            // character '›'.
            inlineCodeMarker: null,
            // This lets you set up language aliases.  For example,
            // setting this to '{ sh: "bash" }' will let you use
            // the language "sh" which will highlight using the
            // bash highlighter.
            aliases: {},
          },
        },
        {
          resolve: `gatsby-transformer-remark`,
          options: {
            plugins: [
              {
                resolve: `gatsby-remark-table-of-contents`,
                options: {
                  exclude: "Table of Contents",
                  tight: false,
                  fromHeading: 1,
                  toHeading: 6
                },
              }
            ],
          },
        },
        ]
      }
      // this (optional) plugin enables Progressive Web App + Offline functionality
      // To learn more, visit: https://gatsby.dev/offline
      // `gatsby-plugin-offline`,
    },
    // {
    //   resolve: `gatsby-plugin-material-ui`,
    //   options: {
    //     // stylesProvider: {
    //     //   pathToStylesProvider: `src/styles-provider-props`,
    //     //   injectFirst: true,
    //     // },
    //     webFontsConfig: {
    //       fonts: {
    //         google: [
    //           {
    //             family: `Montserrat`,
    //             variants: [`300`, `400`, `500`],
    //           },
    //         ],
    //       },
    //     },
    //   },
    // },
    `gatsby-theme-material-ui`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-disqus`,
      options: {
        shortname: `jell-1`
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/images/favicon.png",
      }
    }
  ],
};
