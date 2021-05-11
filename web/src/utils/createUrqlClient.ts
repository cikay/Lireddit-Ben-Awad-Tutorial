import { cacheExchange, Resolver, Cache } from '@urql/exchange-graphcache'
import gql from 'graphql-tag'
import {
  createClient,
  dedupExchange,
  Exchange,
  fetchExchange,
  stringifyVariables,
} from 'urql'
import { pipe, tap } from 'wonka'
import {
  DeletePostMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from '../generated/graphql'
import { betterUpdateQuery } from './betterUpdateQuery'
const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message.includes('not authenticated')) {
          console.log('not authenticated')
        }
      }
    })
  )
}

export const cursorPagination = (cursorArgument = 'cursor'): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info
    console.log(entityKey, fieldName)
    const allFields = cache.inspectFields(entityKey)
    console.log(allFields)
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)
    const size = fieldInfos.length
    if (size === 0) {
      return undefined
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    console.log('field Key', fieldKey)
    const isInCache = cache.resolve(entityKey, fieldKey)
    console.log('is in cache')
    console.log(isInCache)
    info.partial = !isInCache
    let result: string[] = []
    let hasMore = true
    console.log('entityKey', entityKey)
    for (const field of fieldInfos) {
      const key = cache.resolveFieldByKey(entityKey, field.fieldKey) as string

      // const key = cache.keyOfField('posts')
      console.log('key', key)
      const data = cache.resolve(key, 'posts') as string[]

      const _hasMore = cache.resolve(key, 'hasMore')
      console.log('_hasMore', _hasMore)
      if (!_hasMore) {
        hasMore = _hasMore as boolean
      }
      console.log('data', data)
      result.push(...data)
    }
    console.log('result ', result)
    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: result,
    }
  }
}

function invalidateAllPost(cache: Cache) {
  const allFields = cache.inspectFields('Query')
  console.log(allFields)
  const fieldInfos = allFields.filter((info) => info.fieldName === 'posts')
  console.log('fieldInfos', fieldInfos)
  for (const fieldInfo of fieldInfos) {
    cache.invalidate('Query', 'posts', fieldInfo.arguments || {})
  }
}

const client = createClient({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          posts: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          deletePost(_result, args, cache, info) {
            cache.invalidate({
              __typename: 'Post',
              id: (args as DeletePostMutationVariables).id,
            })
          },
          vote: (_result, args, cache, info) => {
            const { postId, value } = args as VoteMutationVariables

            const data = cache.readFragment(
              gql`
                fragment _ on Post {
                  id
                  points
                  voteStatus
                }
              `,
              { id: postId } as any
            )
            console.log('data', data)
            if (data) {
              if (data.voteStatus === args.value) return

              const newPoints =
                (data.points as number) + (!data.voteStatus ? 1 : 2) * value

              cache.writeFragment(
                gql`
                  fragment __ on Post {
                    points
                    voteStatus
                  }
                `,
                { id: postId, points: newPoints, voteStatus: value } as any
              )
            }
          },
          createPost: (_result, args, cache, info) => {
            invalidateAllPost(cache)
          },
          logout: (_result, args, cache, info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            )
          },
          login: (_result, args, cache, info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query
                }
                console.log('result', result)
                return {
                  me: result.login.user,
                }
              }
            )
            invalidateAllPost(cache)
          },

          register: (_result, args, cache, info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              {
                query: MeDocument,
              },
              _result,
              (result, query) => {
                if (result.register.errors) {
                  return query
                }
                return {
                  me: result.register.user,
                }
              }
            )
          },
        },
      },
    }),
    errorExchange,
    fetchExchange,
  ],
})

export default client
