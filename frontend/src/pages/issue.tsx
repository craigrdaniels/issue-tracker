import { ReactElement, useEffect } from 'react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'

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

const location = import.meta.env.SERVER
  ? process.env.SERVER?.split(':')[0]
  : window.location.hostname

const port = import.meta.env.SERVER?.split(':')[1]
  ? process.env.SERVER?.split(':')
  : '3000'

const Issue = (): ReactElement => {
  const [issue, setIssue] = useState<IIssue | null>()
  const { id } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://${location}:${port}/issues/${id}`, {
        credentials: 'include',
      })
      const data = await response.json()
      setIssue(data)
    }

    fetchData().catch(console.error)
  }, [])

  return (
    <>
      <main className="mx-2 mt-8 dark:bg-zinc-900 dark:bg-opacity-50 md:mx-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-10 w-full">
            <h1>
              {issue?.project.name} / {issue?.title}
            </h1>
          </div>
          <ul className="flex flex-col gap-4">
            {issue?.messages?.map((message) => (
              <li key={message._id}>
                <div className="flex flex-row gap-4">
                  <div className="h-12 w-12">
                    <UserCircleIcon />
                  </div>
                  <div className="flex w-full grow flex-col rounded-md border pb-2 first:border-blue-400 dark:border-zinc-500/50 first:dark:border-blue-500/50 dark:hover:bg-zinc-800">
                    <div className="rounded-t bg-zinc-200 px-2 py-1 dark:bg-zinc-800">
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
