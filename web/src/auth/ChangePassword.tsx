import { Form, Formik } from 'formik'
import { useState } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { useHistory, useParams } from 'react-router'
import { useChangePasswordMutation } from '../generated/graphql'
import CenteredContainer from '../shared/components/CenteredContainer'
import InputField from '../shared/components/InputField'
import { toErrorMap } from '../shared/utils/toErrorMap'

interface ParamTypes {
  token: string
}
export default function ChangePassword() {
  const { token } = useParams<ParamTypes>()
  const history = useHistory()
  const [tokenError, setTokenError] = useState('')
  const [, changePassword] = useChangePasswordMutation()
  return (
    <>
      <CenteredContainer>
        <Formik
          initialValues={{ newPassword: '', confirmNewPassword: '' }}
          onSubmit={async (values, { setErrors }) => {
            console.log('values', values)
            const { newPassword, confirmNewPassword } = values

            if (newPassword !== confirmNewPassword) {
              setErrors(
                toErrorMap([
                  {
                    field: 'confirmNewPassword',
                    message: 'Passwords not match',
                  },
                ])
              )
              return
            }
            const { data } = await changePassword({
              newPassword,
              token,
            })

            if (data?.changePassword.errors) {
              const errorMap = toErrorMap(data.changePassword.errors)
              if ('token' in errorMap) {
                setTokenError(errorMap.token)
              }

              setErrors(errorMap)
            } else {
              history.push('/')
            }
          }}
        >
          <Form>
            {tokenError && <Alert variant='danger'>{tokenError}</Alert>}

            <InputField
              type='password'
              name='newPassword'
              placeholder='Yeni şifre'
            />
            <InputField
              type='password'
              name='confirmNewPassword'
              placeholder='Yeni şifre onay'
            />
            <Button variant='primary' type='submit'>
              Reset
            </Button>
          </Form>
        </Formik>
      </CenteredContainer>
    </>
  )
}
