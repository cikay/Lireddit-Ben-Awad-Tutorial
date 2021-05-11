import { Formik, Form } from 'formik'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useLoginMutation } from '../generated/graphql'
import CenteredContainer from '../shared/components/CenteredContainer'
import InputField from '../shared/components/InputField'
import { toErrorMap } from '../shared/utils/toErrorMap'

export default function Login() {
  const [_, login] = useLoginMutation()

  const history = useHistory()
  console.log('history', history)
  return (
    <CenteredContainer>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log('values', values)
          const res = await login(values)
          const { data } = res
          console.log(res)
          if (data?.login.errors) {
            setErrors(toErrorMap(data.login.errors))
            return
          }
          console.log('history.location.search ', history.location.search)
          history.push('/')
        }}
      >
        <Form>
          <InputField
            type='text'
            name='usernameOrEmail'
            placeholder='Kullanıcı Adı ya da Email'
          />
          <InputField type='password' name='password' placeholder='Şifre' />
          <Button variant='primary' type='submit'>
            Giriş yap
          </Button>
        </Form>
      </Formik>
    </CenteredContainer>
  )
}
