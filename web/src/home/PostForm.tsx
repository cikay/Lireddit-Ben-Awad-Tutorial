import { Form, Formik } from 'formik'
import { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import {
  useCreatePostMutation,
  useMeQuery,
  useUpdatePostMutation,
} from '../generated/graphql'
import CenteredContainer from '../shared/components/CenteredContainer'
import InputField from '../shared/components/InputField'
import Layout from '../shared/components/Layout'
import { useGetPostFromUrl } from '../shared/hooks/useGetPostFromUrl'

export default function PostForm() {
  const [, createPost] = useCreatePostMutation()
  console.log('post form')
  const [, updatePost] = useUpdatePostMutation()
  const [
    { data: postData, error, fetching: postFetching },
  ] = useGetPostFromUrl()
  console.log('postData', postData)
  const [{ data: meData, fetching: meFetching }] = useMeQuery()
  const history = useHistory()
  console.log('history', history)
  useEffect(() => {
    if (!meFetching && !meData?.me) {
      history.push(`/login?${history.location.pathname}`)
    }
  }, [meFetching, meData, history])
  if (postFetching) {
    return (
      <Layout>
        <div>Loadind...</div>
      </Layout>
    )
  }
  return (
    <Layout>
      <CenteredContainer>
        <Formik
          initialValues={{
            title: postData?.post?.title || '',
            text: postData?.post?.text || '',
          }}
          onSubmit={async (values, { setErrors }) => {
            console.log('values', values)
            if (postData?.post) {
              await updatePost({
                id: postData.post.id,
                ...values,
              })
            } else {
              await createPost({ input: values })
              console.log('err', error)
            }
            console.log('history', history)
            history.goBack()
          }}
        >
          <Form>
            <InputField type='text' name='title' placeholder='Başlık' />
            <InputField type='text' name='text' placeholder='İçerik' textarea />
            <Button variant='primary' type='submit'>
              Oluştur
            </Button>
          </Form>
        </Formik>
      </CenteredContainer>
    </Layout>
  )
}
