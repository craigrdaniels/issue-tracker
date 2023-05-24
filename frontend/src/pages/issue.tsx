import { ReactElement } from 'react'
import { useLoaderData, Link } from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { location, port } from '../utils/Server'

interface IMessage {
  _id: string
  content: string
  created_at: Date
  created_by: {
    _id: string
    username: string
  }
  last_edit: Date
}

interface IIssue {
  _id: string
  title: string
  created_at: Date
  created_by: {
    _id: string
    username: string
  }
  tags: string[]
  project: {
    _id: string
    name: string
  }
  is_open: boolean
  messages: IMessage[]
}

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

export const Issue = (): ReactElement => {
  const issue = useLoaderData()

  return (
    <>
      <main className="mx-2 mt-4 md:mx-8">
        <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
          <ul>
            <li>
              <Link to={'/projects'}>Projects</Link>
            </li>
            <li>
              <Link to={`/projects/${issue.project._id}`}>
                {issue.project.name}
              </Link>
            </li>
            <li>
              <Link to={`/projects/${issue.project._id}/issues`}>Issues</Link>
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
                  <div className="pb-2i flex w-full grow flex-col rounded-md border border-primary-content/50 bg-base-200 shadow-md hover:bg-base-300">
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
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}

export default Issue
