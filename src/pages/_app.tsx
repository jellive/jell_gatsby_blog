import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { initializeApollo } from '../lib/apollo'
import config from '../../config'
import '../styles/global.scss'

export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = initializeApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        {config.googleAdsenseClient && (
          <script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
            crossOrigin="anonymous"
            data-ad-client={config.googleAdsenseClient}
          />
        )}
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
