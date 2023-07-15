import { useState } from 'react'

interface FormValue {
  [key: string]: string | undefined
}

const useFormValues = () => {
  const [value, setValue] = useState<FormValue>({})

  const setInputValue = (keyName: string, value: string | undefined) => {
    setValue((prevState) => ({
      ...prevState,
      [keyName]: value,
    }))
  }

  const clearInputValue = (keyName: string) => {
    setValue((prevState) => {
      const { [keyName]: value, ...rest } = prevState
      return rest
    })
  }

  return [value, setInputValue, clearInputValue] as const
}

export default useFormValues
