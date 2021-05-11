import { FieldError } from '../../generated/graphql'

export const toErrorMap = (errors: FieldError[]) => {
  const errorMap: Record<string, string> = {}

  errors.forEach(({ message, field }) => {
    errorMap[field] = message
  })
  return errorMap
}
