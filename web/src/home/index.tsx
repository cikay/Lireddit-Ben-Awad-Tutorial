import { useState } from 'react'
import { Button } from 'react-bootstrap'
import { usePostsQuery } from '../generated/graphql'
import PostCard from '../shared/components/PostCard/PostCard'
type Variables = {
  limit: number
  cursor?: null | string
}
export default function Home() {
  const [variables, setVariables] = useState<Variables>({
    limit: 10,
  })
  const [{ data: postData, fetching }, _] = usePostsQuery({
    variables,
  })
  console.log('postData', postData)
  console.log(variables)
  if (!fetching && !postData) {
    return <>query failed </>
  }
  if (fetching) {
    return <>loding...</>
  }
  console.log(postData)
  return (
    <>
      <div className='mt-2'>
        {postData && (
          <>
            {postData.posts.posts.map(
              (post, index) => post && <PostCard key={post.id} post={post} />
            )}
            {postData.posts.hasMore ? (
              <div className='d-flex mt-2'>
                <Button
                  className='mx-auto'
                  onClick={() => {
                    setVariables({
                      limit: variables.limit,
                      cursor:
                        postData.posts.posts[postData.posts.posts.length - 1]
                          .createdAt,
                    })
                  }}
                >
                  Daha fazla
                </Button>
              </div>
            ) : (
              <div>Hepsi Bu kadar</div>
            )}
          </>
        )}
      </div>
    </>
  )
}
