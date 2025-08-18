'use client'

import { useEffect } from 'react'
import { siteConfig } from '@/lib/config'

interface DisqusProps {
  url: string
  identifier: string
  title: string
}

declare global {
  interface Window {
    DISQUS: any
    disqus_config: () => void
  }
}

interface DisqusThis {
  page: {
    url: string
    identifier: string
    title: string
  }
}

export default function Disqus({ url, identifier, title }: DisqusProps) {
  const shortname = siteConfig.disqusShortname
  const isProduction = process.env.NODE_ENV === 'production' && shortname

  useEffect(() => {
    if (!isProduction || typeof window === 'undefined') return

    // Configure Disqus
    window.disqus_config = function (this: DisqusThis) {
      this.page.url = url
      this.page.identifier = identifier
      this.page.title = title
    }

    // Load Disqus
    if (window.DISQUS) {
      // If Disqus is already loaded, reset it
      window.DISQUS.reset({
        reload: true,
        config: window.disqus_config,
      })
    } else {
      // Load Disqus for the first time
      const script = document.createElement('script')
      script.src = `https://${shortname}.disqus.com/embed.js`
      script.setAttribute('data-timestamp', String(+new Date()))
      script.async = true
      document.head.appendChild(script)
    }
  }, [url, identifier, title, shortname, isProduction])

  if (!isProduction) {
    return (
      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <p className="text-gray-600">댓글은 프로덕션 환경에서만 표시됩니다.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-semibold text-gray-900">댓글</h3>
      <div id="disqus_thread"></div>
      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript">
          comments powered by Disqus.
        </a>
      </noscript>
    </div>
  )
}
