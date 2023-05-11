import { ReactElement, useEffect } from 'react'
import { useState } from 'react'
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

const Issues = (): ReactElement => {
  const [issues, setIssues] = useState<IIssue[]>([])
  const [sortField, setSortField] = useState<string | null>()
  const [sortOrder, setSortOrder] = useState<string | null>()

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://${location}:${port}/issues`, {
        credentials: 'include',
      })
      const data = await response.json()
      setIssues(data)
    }

    fetchData().catch(console.error)
  }, [])

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
      <main className="mx-8 mt-12 dark:bg-zinc-900 dark:bg-opacity-50">
        <div className="mx-auto max-w-7xl rounded-md border dark:border-zinc-500/50">
          <div className="flex h-10 w-full dark:bg-zinc-800">
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
                className="flex grow flex-row border-b py-2 last:border-0 dark:border-zinc-500/50 dark:hover:bg-zinc-800"
              >
                <div className="items-top px-4 pt-1">
                  <MinusCircleIcon className="navicon" />
                </div>
                <div className="px-4">
                  <h2>
                    {issue.project.name} / {issue.title}
                  </h2>
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
                    at {issue.created_at.toString()}
                  </span>
                </div>
                <div className="w-fit">&nbsp;</div>
                <div className="ml-auto mr-4 justify-self-end">
                  {/** show number of comments ignoring first message by issue creator**/}
                  {issue.message_count > 1 && issue.message_count - 1}
                  <ChatBubbleLeftIcon className="navicon" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  )
}

export default Issues
