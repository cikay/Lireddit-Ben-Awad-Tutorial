import { Formik, Form } from 'formik'
import { useState } from 'react'
import { Button, Alert } from 'react-bootstrap'
import { useForgotPasswordMutation } from '../generated/graphql'
import CenteredContainer from '../shared/components/CenteredContainer'
import InputField from '../shared/components/InputField'
import { toErrorMap } from '../shared/utils/toErrorMap'

export default function ForgotPassword() {
  const [, forgotPassword] = useForgotPasswordMutation()
  const [isSent, setIsSent] = useState(false)
  return (
    <CenteredContainer>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values, { setErrors }) => {
          console.log('values', values)
          const { data } = await forgotPassword(values)
          if (data?.forgotPassword.errors) {
            setErrors(toErrorMap(data.forgotPassword.errors))
          } else {
            setIsSent(true)
          }
        }}
      >
        {isSent ? (
          <Alert variant='primary'>Mail adresiniz kontrol edin</Alert>
        ) : (
          <Form>
            <InputField
              type='email'
              name='email'
              placeholder='Email adresinizi girin'
            />
            <Button variant='primary' type='submit'>
              Reset
            </Button>
          </Form>
        )}
      </Formik>
    </CenteredContainer>
  )
}
