import { useState } from 'react'

interface cookieOptions {
  days?: number
  path?: string
  domain?: string
  SameSite?: 'none' | 'Lax' | 'Strict'
  Secure?: boolean
  HttpOnly?: boolean
}

interface updateItem {
  (value: string, options?: cookieOptions): void
}

const setCookie = (
  key: string,
  value: string,
  options?: cookieOptions
): void => {
  const optionsWithDefaults = {
    days: 7,
    path: '/',
    ...options,
  }

  const expires = new Date(
    Date.now() + optionsWithDefaults.days * 864e5
  ).toUTCString()

  document.cookie =
    key + '=' + encodeURIComponent(value) + '; expires=' + expires
  // + optionsWithDefaults
}

const getCookie = (key: string): string =>
  document.cookie.split('; ').reduce((total, currentCookie) => {
    const item = currentCookie.split('=')
    const itemKey = item[0]
    const itemValue = item[1]

    return itemKey === key ? decodeURIComponent(itemValue) : total
  }, '')

const useCookie = (
  key: string,
  defaultValue: string | null
): [string, updateItem] => {
  const [item, setItem] = useState<string | null>(
    () => getCookie(key) || defaultValue
  )

  const updateItem = (value: string, options?: cookieOptions) => {
    setItem(value)
    setCookie(key, value, options)
  }

  return [item, updateItem]
}

export default useCookie
