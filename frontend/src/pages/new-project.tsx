import { FormEvent, ReactElement, useState } from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { location, port } from '../utils/Server'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export const NewProject = (): ReactElement => {
  const [buttonLoader, setButtonLoader] = useState<boolean>(false)
  const [nameContent, setNameContent] = useState<string>('')

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setButtonLoader(true)
    try {
      const response = await fetch(`http://${location}:${port}/projects`, {
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nameContent,
        }),
      })
      if (response.status === 200) {
        setNameContent('')
      }
    } catch (err: Error) {
      console.log(err.message)
    }
    setButtonLoader(false)
  }

  return (
    <>
      <main className="mx-2 mt-4 md:mx-8">
        <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
          <ul>
            <li>
              <Link to={'/projects'}>Projects</Link>
            </li>
            <li>New Project</li>
          </ul>
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-row gap-4">
            <div className="h-12 w-12">
              <UserCircleIcon />
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex w-full grow flex-col gap-2 rounded-md border border-primary-content/50 bg-base-200 p-2 shadow-md hover:bg-base-300"
            >
              <input
                type="text"
                placeholder="Project Name"
                className="input w-full"
                value={nameContent ?? ''}
                onChange={(e) => {
                  setNameContent(e.target.value)
                }}
              />
              <div className="flex w-full">
                <button
                  type="submit"
                  className={clsx(
                    'btn-primary btn-wide btn ml-auto place-self-end',
                    buttonLoader && 'loading',
                    nameContent === '' && 'btn-disabled'
                  )}
                  aria-disabled={nameContent === ''}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  )
}
