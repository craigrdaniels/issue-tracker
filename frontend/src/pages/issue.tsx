import { ReactElement, useEffect, useState } from 'react'
import {
  useLoaderData,
  Form,
  Link,
  useParams,
  useActionData,
  useNavigation,
} from 'react-router-dom'
import clsx from 'clsx'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { location, port } from '../utils/Server'
import { useAlert } from '../hooks/useAlert'

export const issueLoader = async ({ params }) => {
  const response = await fetch(
    `http://${location}:${port}/issues/${params.id}`,
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

  const message = formData.get('message')

  try {
    const response = await fetch(
      `http://${location}:${port}/issues/${params.id}/messages`,
      {
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message }),
      }
    )

    return { status: response.status, response }
  } catch (err: Error) {
    return {
      error: err.message,
    }
  }
}

export const Issue = (): ReactElement => {
  const { state } = useNavigation()
  const { addAlert } = useAlert()
  const params = useParams()
  const issue = useLoaderData()
  const [buttonLoader, setButtonLoader] = useState<boolean>(false)
  const data = useActionData()

  useEffect(() => {
    if (data?.status === 200) {
      addAlert('alert-success', 'Message added.')
      let theForm: HTMLFormElement = document.getElementById(
        'NewMessageForm'
      ) as HTMLFormElement
      theForm.reset()
    }

    if (data?.error) {
      addAlert('alert-error', data.error)
    }
  }, [data])

  return (
    <>
      {state === 'loading' ? (
        <main className="mx-2 mt-4 md:mx-8">
          <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
            <ul>
              <li className="h-4 w-72 animate-pulse bg-base-200"> </li>
            </ul>
          </div>
          <div className="mx-auto max-w-7xl flex-col gap-4">
            {Array.apply(null, { length: 4 }).map((e, i) => (
              <div key={i} className="flex gap-4 pb-4 last:pt-4">
                <div className="h-12 w-12 animate-pulse rounded-full bg-base-200"></div>
                <div className="h-24 w-full animate-pulse rounded-md bg-base-200 shadow-md"></div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="mx-2 mt-4 md:mx-8">
          <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
            <ul>
              <li>
                <Link to={'/projects'}>Projects</Link>
              </li>
              <li>
                <Link to={`/projects/${issue.project?._id}`}>
                  {issue.project?.name}
                </Link>
              </li>
              <li>
                <Link to={`/projects/${issue.project?._id}/issues`}>
                  Issues
                </Link>
              </li>
              <li>{issue.title}</li>
            </ul>
          </div>
          <div className="mx-auto max-w-7xl">
            <ul className="flex flex-col gap-4">
              {issue?.messages?.map((message) => (
                <li key={message._id}>
                  <div className="flex flex-row gap-4">
                    <div className="h-12 w-12">
                      <UserCircleIcon />
                    </div>
                    <div className="flex w-full grow flex-col rounded-md border border-primary-content/50 bg-base-200 pb-2 shadow-md hover:bg-base-300">
                      <div className="rounded-t bg-base-300 px-2 py-1">
                        <span className="font-bold">
                          {message.created_by.username}
                        </span>{' '}
                        wrote{' '}
                        {formatDistanceToNow(new Date(message.created_at), {
                          includeSeconds: true,
                        })}{' '}
                        ago:
                      </div>
                      <div className="px-4 py-2">{message.content}</div>
                    </div>
                  </div>
                </li>
              ))}{' '}
            </ul>
            <div className="mt-8 flex flex-col gap-4">
              <Form
                id="NewMessageForm"
                action={`/issues/${params.id}`}
                method="post"
              >
                <div className="flex flex-row gap-4">
                  <div className="h-12 w-12">
                    <UserCircleIcon />
                  </div>
                  <div className="flex w-full grow flex-col gap-2 rounded-md border border-primary-content/50 bg-base-200 p-2 shadow-md hover:bg-base-300">
                    <textarea
                      className="textarea bg-base-100"
                      placeholder="Leave your comment"
                      name="message"
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
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </main>
      )}
    </>
  )
}

export default Issue
