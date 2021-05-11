import React from 'react'
import { useParams } from 'react-router'
import { usePostQuery } from '../generated/graphql'
import Layout from '../shared/components/Layout'
import PostCard from '../shared/components/PostCard/PostCard'
import { useGetPostFromUrl } from '../shared/hooks/useGetPostFromUrl'

type ParamsType = {
  postId: string
}

export default function SinglePost() {
  const { postId } = useParams<ParamsType>()

  const [{ data, fetching }, _] = useGetPostFromUrl()

  if (fetching) {
    return (
      <Layout>
        <div>....Loading</div>
      </Layout>
    )
  }

  if (!data?.post) {
    return (
      <Layout>
        <div className='mx-auto my-auto'>Could not find post</div>
      </Layout>
    )
  }

  return <Layout>{data.post && <PostCard post={data.post} />}</Layout>
}
