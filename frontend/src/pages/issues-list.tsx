import { ReactElement } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { Link, useLoaderData } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import {
  MinusCircleIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { location, port } from '../utils/Server'

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

export const issuesLoader = async () => {
  const response = await fetch(`http://${location}:${port}/issues`, {
    credentials: 'include',
  })

  if (response.status === 401) {
    throw new Response('Not Authenticated', { status: 401 })
  }

  return response.json()
}

export const Issues = (): ReactElement => {
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
      <main className="mx-2 mt-20 bg-base-200 shadow-md md:mx-8">
        <div className="mx-auto max-w-7xl rounded-md border border-primary-content/50">
          <div className="flex h-10 w-full items-center rounded-t-md bg-base-300">
            <button
              className="badge"
              onClick={() => handleClickSort('title', 'asc')}
            >
              sort
            </button>
            <button
              className="badge"
              onClick={() => handleClickSort('created_by.username', 'asc')}
            >
              Created By
            </button>
          </div>
          <ul>
            {issues?.map((issue) => (
              <li
                key={issue._id}
                className="flex grow flex-row border-b border-primary-content/50 py-2 last:border-0 hover:bg-base-300"
              >
                <div className="items-top px-4 pt-1">
                  {issue.is_open ? (
                    <MinusCircleIcon className="h-5 w-5 text-success" />
                  ) : (
                    <CheckCircleIcon className="h-5 w-5 text-secondary" />
                  )}
                </div>
                <div className="px-4">
                  <div className="flex flex-col gap-1 md:flex-row">
                    <h2>{issue.project.name} / </h2>
                    <h2>
                      <Link
                        to={issue._id}
                        className="transition-none hover:text-accent"
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
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}
