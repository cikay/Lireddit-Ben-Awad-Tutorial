import { InputHTMLAttributes } from 'react'
import { useField } from 'formik'
import { Form } from 'react-bootstrap'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  type: string
  name: string
  label?: string
  placeholder: string
  textarea?: boolean
}

export default function InputField({
  label,
  placeholder,
  textarea,
  size: _,
  ...props
}: Props) {
  const [field, { error }] = useField(props)
  console.log('error input field', error)
  return (
    <Form.Group>
      {label && <Form.Label>{label}</Form.Label>}
      {
        <Form.Control
          as={textarea ? 'textarea' : 'input'}
          isInvalid={!!error}
          placeholder={placeholder}
          {...field}
          {...props}
        />
      }
      {error && <Form.Text className='text-danger'>{error}</Form.Text>}
    </Form.Group>
  )
}
