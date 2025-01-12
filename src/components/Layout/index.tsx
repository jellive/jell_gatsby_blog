import * as React from 'react'
import { useRouter } from 'next/router'

import Header from '../Header'
import './layout.scss'

interface LayoutPropsType {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutPropsType) => {
  // const siteTitle = require('../../../config').title
  const router = useRouter()
  const isRootPage = router.pathname === '/'

  return (
    <>
      <Header />
      <div id="content" className={isRootPage ? 'root-page' : ''}>
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
