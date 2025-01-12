import { createYoga } from 'graphql-yoga'
import { schema } from '@/lib/schema'

const { handleRequest } = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
  // Edge Runtime을 위한 설정
  cors: false,
  batching: true
})

export const config = {
  runtime: 'edge',
  regions: ['icn1'] // 서울 리전 사용
}

export default async function handler(req: Request) {
  return handleRequest(req)
}
