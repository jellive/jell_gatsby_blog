import * as React from 'react'
import Link from 'gatsby-link'

export const data = {
  title: '일단 급한 일',
  date: "2018-06-19T13:52:59-07:00",
  path: '/notice/2018/06/19/일단_급한_일'
}

const 일단_급한_일 = () => (
  <div>
    <h1>일단 급한 일</h1>
    <p>분류를 정하고, 목록 뽑기</p>
    <Link to="/">돌아가기</Link>
  </div>
)

export default 일단_급한_일
