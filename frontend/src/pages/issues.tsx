import { ReactElement } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { Link, useLoaderData } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import {
  MinusCircleIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline'

export interface IIssue {
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
  message_count: number
}

const location = import.meta.env.SERVER
  ? process.env.SERVER?.split(':')[0]
  : window.location.hostname

const port = import.meta.env.SERVER?.split(':')[1]
  ? process.env.SERVER?.split(':')
  : '3000'

const issuesLoader = async () => {
  const response = await fetch(`http://${location}:${port}/issues`, {
    credentials: 'include',
  })

  if (response.status === 401) {
    throw new Response('Not Authenticated', { status: 401 })
  }

  return response.json()
}

const Issues = (): ReactElement => {
  const issues = useLoaderData()
  const [sortField, setSortField] = useState<string | null>()
  const [sortOrder, setSortOrder] = useState<string | null>()

  const handleClickSort = (sortField: string, sortOrder: string) => {
    const order = 1 * (sortOrder === 'asc' ? 1 : -1)

    const sorted = [...issues].sort((a, b) => {
      if (a[sortField] < b[sortField]) {
        return -1 * order
      }
      if (a[sortField] > b[sortField]) {
        return 1 * order
      }
      return 0
    })
    setIssues(sorted)
  }

  return (
    <>
      <main className="mx-2 mt-8 dark:bg-zinc-900 dark:bg-opacity-50 md:mx-8">
        <div className="mx-auto max-w-7xl rounded-md border dark:border-zinc-500/50">
          <div className="flex h-10 w-full bg-zinc-200 dark:bg-zinc-800">
            <button onClick={() => handleClickSort('title', 'asc')}>
              sort
            </button>
            <button
              onClick={() => handleClickSort('created_by.username', 'asc')}
            >
              Created By
            </button>
          </div>
          <ul>
            {issues?.map((issue) => (
              <li
                key={issue._id}
                className="flex grow flex-row border-b py-2 last:border-0 hover:bg-zinc-200 dark:border-zinc-500/50 dark:hover:bg-zinc-800"
              >
                <div className="items-top px-4 pt-1">
                  <MinusCircleIcon
                    className={clsx(
                      'navicon',
                      issue.is_open
                        ? 'text-green-500 dark:text-green-500'
                        : 'text-purple-500 dark:text-purple-500'
                    )}
                  />
                </div>
                <div className="px-4">
                  <div className="flex flex-col gap-1 md:flex-row">
                    <h2 className="text-zinc-500 dark:text-zinc-400">
                      {issue.project.name} /{' '}
                    </h2>
                    <h2>
                      <Link
                        to={issue._id}
                        className="transition-none hover:text-cyan-600 hover:dark:text-cyan-600"
                      >
                        {issue.title}
                      </Link>
                    </h2>
                  </div>
                  <ul className="flex flex-row gap-1">
                    {issue.tags?.map((tag) => (
                      <li
                        key={tag}
                        className="flex rounded-sm border px-1 text-sm dark:bg-zinc-600"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <span className="text-sm dark:text-zinc-300">
                    Created by {issue.created_by.username}
                  </span>
                  <span className="text-sm before:content-['_'] dark:text-zinc-300">
                    {formatDistanceToNow(new Date(issue.created_at), {
                      includeSeconds: true,
                    })}{' '}
                    ago
                  </span>
                </div>
                <div className="w-fit">&nbsp;</div>
                <Link
                  to={issue._id}
                  className="ml-auto mr-4 flex flex-row items-center gap-2 justify-self-end"
                >
                  {/** show number of comments ignoring first message by issue creator**/}
                  {issue.message_count > 1 && issue.message_count - 1}
                  <ChatBubbleLeftIcon className="navicon" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}

export { Issues, issuesLoader }
