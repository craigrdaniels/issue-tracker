import { FormEvent, ReactElement, useState } from 'react'
import { useLoaderData, Link } from 'react-router-dom'
import clsx from 'clsx'
import { location, port } from '../utils/Server'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAlert } from '../hooks/useAlert'

export const newIssueLoader = async ({ params }) => {
  const response = await fetch(
    `http://${location}:${port}/projects/${params.id}`,
    {
      credentials: 'include',
    }
  )

  if (response.status === 401) {
    throw new Response('Not Authenticated', { status: 401 })
  }

  return response.json()
}

export const NewIssue = (): ReactElement => {
  const { addAlert } = useAlert()
  const project = useLoaderData()
  const [buttonLoader, setButtonLoader] = useState<boolean>(false)
  const [subjectContent, setSubjectContent] = useState<string>('')
  const [messageContent, setMessageContent] = useState<string>('')

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault()
    setButtonLoader(true)
    try {
      const response = await fetch(`http://${location}:${port}/issues`, {
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project: project._id,
          title: subjectContent,
          content: messageContent,
        }),
      })
      if (response.status === 200) {
        addAlert('alert-success', 'Issue successfully created.')
        setMessageContent('')
        setSubjectContent('')
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
            <li>
              <Link to={`/projects/${project._id}`}>{project.name}</Link>
            </li>
            <li>New Issue</li>
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
                placeholder="Subject"
                className="input w-full"
                value={subjectContent ?? ''}
                onChange={(e) => {
                  setSubjectContent(e.target.value)
                }}
              />
              <textarea
                className="textarea bg-base-100"
                placeholder="Describe the issue..."
                id="content"
                value={messageContent ?? ''}
                onChange={(e) => {
                  setMessageContent(e.target.value)
                }}
              ></textarea>
              <div className="flex w-full">
                <button
                  type="submit"
                  className={clsx(
                    'btn-primary btn-wide btn ml-auto place-self-end',
                    buttonLoader && 'loading',
                    (subjectContent === '' || messageContent === '') &&
                      'btn-disabled'
                  )}
                  aria-disabled={messageContent === ''}
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
