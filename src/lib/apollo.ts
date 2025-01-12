import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createHttpLink({
      uri: process.env.NEXT_PUBLIC_API_URL || '/api/graphql',
      credentials: 'same-origin'
    }),
    cache: new InMemoryCache({
      addTypename: false,
      typePolicies: {
        Query: {
          fields: {
            allMarkdownRemark: {
              merge(existing, incoming) {
                return incoming
              }
            }
          }
        }
      }
    })
  })
}

let apolloClient: ApolloClient<any>

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  if (initialState) {
    const existingCache = _apolloClient.cache.extract()
    _apolloClient.cache.restore({
      ...existingCache,
      ...initialState
    })
  }

  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
