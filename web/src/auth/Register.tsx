import { Formik, Form } from 'formik'
import React from 'react'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'
import { useRegisterMutation } from '../generated/graphql'
import CenteredContainer from '../shared/components/CenteredContainer'
import InputField from '../shared/components/InputField'
import { toErrorMap } from '../shared/utils/toErrorMap'

export default function Register() {
  const [_, register] = useRegisterMutation()

  const history = useHistory()
  return (
    <CenteredContainer>
      <Formik
        initialValues={{
          username: '',
          password: '',
          passwordConfirm: '',
          email: '',
        }}
        onSubmit={async (values, { setErrors }) => {
          console.log('values', values)
          const { password, passwordConfirm, username, email } = values
          if (password !== passwordConfirm) {
            setErrors(
              toErrorMap([
                {
                  field: 'passwordConfirm',
                  message: 'Passwords not matching',
                },
              ])
            )
            return
          }
          const payload = {
            username,
            password,
            email,
          }
          const res = await register({ options: payload })
          const { data } = res
          console.log(res)
          if (data?.register.errors) {
            setErrors(toErrorMap(data.register.errors))
          } else {
            history.push('/')
          }
        }}
      >
        <Form>
          <InputField type='text' placeholder='Kullanıcı Adı' name='username' />
          <InputField type='text' placeholder='Email' name='email' />
          <InputField type='password' name='password' placeholder='Şifre' />
          <InputField
            type='password'
            name='passwordConfirm'
            placeholder='Şifre onayı'
          />
          <Button variant='primary' type='submit'>
            Kaydol
          </Button>
        </Form>
      </Formik>
    </CenteredContainer>
  )
}
