import * as React from 'react'
import { useLayoutStore } from '../../store'

import Header from '../Header'
import './layout.scss'

interface LayoutPropsType {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutPropsType) => {
  const siteTitle = require('../../../config').title
  const { path, size, setPath } = useLayoutStore()

  return (
    <>
      <Header siteTitle={siteTitle} path={path} setPath={setPath} size={size} />
      <div id="content">
        <main>{children}</main>
      </div>
    </>
  )
}

export default Layout
