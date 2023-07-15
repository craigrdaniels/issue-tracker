export const isValidEmail = (email: string): boolean => {
  if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z0-9.-]{2,}$/i.test(email))
    return true
  return false
}

export const isStrongPassword = (password: string): boolean => {
  if (
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(
      password
    )
  )
    return true
  return false
}
