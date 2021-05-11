import { useParams } from 'react-router'
import { usePostQuery } from '../../generated/graphql'

type ParamsType = {
  postId: string
}
export const useGetPostFromUrl = () => {
  const { postId } = useParams<ParamsType>()
  const intId = typeof postId === 'string' ? parseInt(postId) : -1

  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  })
}
