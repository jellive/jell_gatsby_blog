import * as React from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'

export default function NotFoundPage() {
  return (
    <Layout>
      <Head>
        <title>404: Not found</title>
        <meta name="description" content="Page not found" />
      </Head>

      <div
        style={{
          maxWidth: '720px',
          padding: '1rem',
          margin: '0 auto',
          marginTop: '3rem'
        }}
      >
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </Layout>
  )
}
