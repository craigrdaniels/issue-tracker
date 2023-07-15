import { useState } from 'react'

interface FormError {
  [key: string]: string | undefined
}

const useFormErrorHandler = () => {
  const [error, setError] = useState<FormError>({})

  const setFormError = (keyName: string, value: string | undefined) => {
    setError((prevState) => ({
      ...prevState,
      [keyName]: value,
    }))
  }

  const clearFormError = (keyName: string) => {
    setError((prevState) => {
      const { [keyName]: value, ...rest } = prevState
      return rest
    })
  }

  return [error, setFormError, clearFormError] as const
}

export default useFormErrorHandler
