import { FormEvent, ReactElement } from 'react'
import { useAlert } from '../hooks/useAlert'
import clsx from 'clsx'

const AlertBar = (): ReactElement => {
  const { alert, removeAlert } = useAlert()

  const handleClose = (): void => {
    removeAlert()
  }

  return (
    <>
      {alert && (
        <div className="p-2">
          <div className={clsx('alert', alert.type)}>
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
            <span className="justify-self-center">{alert.message}</span>
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
      )}
    </>
  )
}

export default AlertBar
