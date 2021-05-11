import { UsernamePasswordInput } from './UsernamePasswordInput'

export default function validateRegister(options: UsernamePasswordInput) {
  const { username, email, password } = options

  let field: string, message: string
  if (!email.includes('@')) {
    field = 'email'
    message = 'invalid email'
    return structureErrors(field, message)
  }

  if (password.length <= 3) {
    field = 'password'
    message = 'password length must be grater than 3'
    return structureErrors(field, message)
  }
  if (username.length <= 2) {
    field = 'username'
    message = 'username length must be grater than 2'
    return structureErrors(field, message)
  }
  if (username.includes('@')) {
    field = 'username'
    message = 'username can not include @'
    return structureErrors(field, message)
  }

  return null
}

function structureErrors(field: string, message: string) {
  return [{ field, message }]
}
