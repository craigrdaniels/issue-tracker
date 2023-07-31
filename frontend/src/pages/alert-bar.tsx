import { ReactElement, useEffect } from 'react'
import { useAlert } from '../hooks/useAlert'
import { XCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

const delay = 10

const AlertBar = (): ReactElement => {
  const { alert, removeAlert } = useAlert()

  useEffect(() => {
    const timer = setTimeout(() => {
      removeAlert()
    }, delay * 750)

    return () => clearTimeout(timer)
  }, [alert])

  const handleClose = (): void => {
    removeAlert()
  }

  return (
    <>
      <div
        className={clsx(
          'fixed z-auto w-4/5 self-center p-2 transition-all duration-500 md:w-1/2',
          alert ? 'translate-y-full opacity-100' : '-translate-y-0 opacity-0'
        )}
      >
        <div
          className={clsx(
            'alert flex flex-row content-center justify-between space-y-0.5',
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
          <span className="justify-self-center">{alert?.message || ' '}</span>
          <button onClick={handleClose}>
            <XCircleIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </>
  )
}

export default AlertBar
