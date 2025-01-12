import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: createHttpLink({
      uri: '/api/graphql',
      credentials: 'same-origin'
    }),
    cache: new InMemoryCache({
      addTypename: false,
      typePolicies: {
        Query: {
          fields: {
            allMarkdownRemark: {
              read(existing) {
                return existing
              },
              merge(incoming) {
                return {
                  ...incoming,
                  edges: incoming.edges,
                  group: incoming.group
                }
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
    _apolloClient.cache.restore(initialState)
  }

  if (typeof window === 'undefined') return _apolloClient
  if (!apolloClient) apolloClient = _apolloClient

  return _apolloClient
}
