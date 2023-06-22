import { ReactElement, useEffect, useState } from 'react'
import {
  useLoaderData,
  useNavigate,
  Form,
  Link,
  useParams,
  useActionData,
} from 'react-router-dom'
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

export const action = async ({ params, request }) => {
  const formData = await request.formData()

  const project = params.id
  const title = formData.get('subject')
  const content = formData.get('content')

  try {
    const response = await fetch(`http://${location}:${port}/issues`, {
      credentials: 'include',
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        project,
        title,
        content,
      }),
    })

    const json = await response.json()
    return { status: response.status, response: json }
  } catch (err: Error) {
    return {
      error: err.message,
    }
  }
}

export const NewIssue = (): ReactElement => {
  const { addAlert } = useAlert()
  const navigate = useNavigate()
  const params = useParams()
  const project = useLoaderData()
  const [buttonLoader, setButtonLoader] = useState<boolean>(false)
  const data = useActionData()

  useEffect(() => {
    if (data?.status === 200) {
      addAlert('alert-success', 'Issue added.')

      // navigate away
      navigate(`/issues/${data.response.id}`)
    }

    if (data?.error) {
      addAlert('alert-error', data.error)
    }
  }, [data])

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
            <Form
              action={`/projects/${params.id}/new`}
              method="post"
              className="flex w-full grow flex-col gap-2 rounded-md border border-primary-content/50 bg-base-200 p-2 shadow-md hover:bg-base-300"
            >
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                className="input w-full"
                required
              />
              <textarea
                className="textarea bg-base-100"
                placeholder="Describe the issue..."
                name="content"
                required
              ></textarea>
              <div className="flex w-full">
                <button
                  type="submit"
                  className={clsx(
                    'btn-primary btn-wide btn ml-auto place-self-end',
                    buttonLoader && 'loading'
                  )}
                >
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </>
  )
}
