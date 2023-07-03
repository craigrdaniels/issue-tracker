import { Suspense, ReactElement, useEffect, useState } from 'react'
import {
  Await,
  useLoaderData,
  type Params,
  Form,
  Link,
  useParams,
  useActionData,
} from 'react-router-dom'
import { UserCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { useAlert } from '../hooks/useAlert'
import { Issue as TIssue, IssueResponse } from '../utils/Types'
import { useAuth } from '../hooks/useAuth'

export const Issue = (): ReactElement => {
  const { addAlert } = useAlert()
  const params = useParams<keyof Params>() as Params
  const { issue } = useLoaderData() as IssueResponse
  const data = useActionData()
  const { user } = useAuth()
  const [editing, setEditing] = useState<string | null>(null)

  useEffect(() => {
    if (data?.status === 200) {
      if (data?.method === 'PUT') {
        addAlert('alert-success', 'Message updated.')
        setEditing(null)
      }
      if (data?.method === 'POST') {
        addAlert('alert-success', 'Message added.')
        let theForm: HTMLFormElement = document.getElementById(
          'NewMessageForm'
        ) as HTMLFormElement
        theForm?.reset()
      }
    }

    if (data?.error) {
      addAlert('alert-error', data.error)
    }
  }, [data])

  const handleEditButtonClick = (e, message_id: string) => {
    e.preventDefault()

    editing === message_id ? setEditing(null) : setEditing(message_id)
  }

  const renderLoadingElements = () => {
    return (
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
    )
  }

  const renderIssueElements = (issue: TIssue) => {
    return (
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
              <Link to={`/projects/${issue.project?._id}/issues`}>Issues</Link>
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
                    <div className="flex w-full grow gap-1 rounded-t bg-base-300 px-2 py-1">
                      <span className="font-bold">
                        {message.created_by.username}
                      </span>
                      <span>
                        wrote{' '}
                        {formatDistanceToNow(new Date(message.created_at), {
                          includeSeconds: true,
                        })}{' '}
                        ago:
                      </span>
                      <div className="w-fit">&nbsp;</div>
                      <button
                        onClick={(e) => handleEditButtonClick(e, message._id)}
                        className="ml-auto flex h-5 w-5 justify-self-end"
                      >
                        {message.created_by._id === user._id && (
                          <PencilSquareIcon />
                        )}
                      </button>
                    </div>
                    {editing === message._id ? (
                      <Form
                        id="EditMessageForm"
                        action={`/issues/${params.id}`}
                        method="put"
                      >
                        <input
                          type="hidden"
                          name="issue_id"
                          value={issue._id}
                        />
                        <input
                          type="hidden"
                          name="message_id"
                          value={message._id}
                        />
                        <div className="flex w-full flex-col gap-2 px-2">
                          <textarea
                            className="textarea whitespace-pre-wrap bg-base-100"
                            name="message"
                            defaultValue={message.content}
                            required
                          ></textarea>
                          <div className="flex w-full">
                            <button
                              type="submit"
                              className="btn-primary btn-wide btn ml-auto place-self-end"
                            >
                              Update Comment
                            </button>
                          </div>
                        </div>
                      </Form>
                    ) : (
                      <div className="whitespace-pre-wrap  px-4 py-2">
                        {message.content}
                      </div>
                    )}
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
                    className="textarea whitespace-pre-wrap bg-base-100"
                    placeholder="Leave your comment"
                    name="message"
                    required
                  ></textarea>
                  <div className="flex w-full">
                    <button
                      type="submit"
                      className="btn-primary btn-wide btn ml-auto place-self-end"
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
    )
  }

  return (
    <>
      <Suspense fallback={renderLoadingElements()}>
        <Await resolve={issue as TIssue}>{renderIssueElements}</Await>
      </Suspense>
    </>
  )
}

export default Issue
