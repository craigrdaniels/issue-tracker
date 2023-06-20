import { ReactElement, useEffect } from 'react'
import { useAlert } from '../hooks/useAlert'
import clsx from 'clsx'

const delay = 10

const AlertBar = (): ReactElement => {
  const { alert, removeAlert } = useAlert()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeAlert()
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [alert])

  const handleClose = (): void => {
    removeAlert()
  }

  return (
    <>
      <div
        className={clsx(
          'fixed inset-x-1/4 w-1/2 p-2 transition-all duration-500',
          alert ? 'translate-y-0 opacity-100' : 'h-0 -translate-y-5 opacity-0'
        )}
      >
        <div
          className={clsx(
            'alert flex flex-row content-center space-y-0.5',
            alert?.type
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="justify-self-center">{alert?.message}</span>
          <button
            onClick={handleClose}
            className="btn-outline btn-info btn-xs btn-circle btn border-base-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 stroke-base-300"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </>
  )
}

export default AlertBar
