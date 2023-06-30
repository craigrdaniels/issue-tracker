import { Suspense, ReactElement } from 'react'
import {
  Await,
  defer,
  type LoaderFunction,
  type LoaderFunctionArgs,
  Link,
  useLoaderData,
  useParams,
} from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import {
  MinusCircleIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline'
import { getIssues, getProject } from '../api'

export const issuesLoader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  return defer({
    issues: getIssues(params.id),
    project: getProject(params.id),
  })
}

export const Issues = (): ReactElement => {
  const data = useLoaderData()
  const params = useParams()

  const renderLoadingElements = () => {
    return (
      <main className="mx-2 mt-4 md:mx-8">
        <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
          <ul>
            <li className="h-4 w-72 animate-pulse rounded-sm bg-base-200"> </li>
          </ul>
        </div>
        <div className="mx-auto max-w-7xl rounded-md border border-primary-content/50 shadow-md">
          <div className="flex h-10 w-full items-center rounded-t-md bg-base-300 px-2">
            <button className="badge w-24 animate-pulse border-none bg-base-200"></button>
            <button className="badge w-24 animate-pulse border-none bg-base-200"></button>
            <button className="btn-primary btn-sm btn ml-auto w-24 animate-pulse justify-self-end border-none bg-base-200"></button>
          </div>
          {Array.apply(null, { length: 4 }).map((e, i) => (
            <div
              key={i}
              className="flex grow flex-row border-b border-primary-content/50 py-2 last:rounded-b-md last:border-0"
            >
              <div className="px-4">
                <div className="flex flex-col gap-2">
                  <h2 className="h-4 w-80 animate-pulse rounded-sm bg-base-200">
                    {' '}
                  </h2>
                  <span className="h-4 w-24 animate-pulse rounded-sm bg-base-200">
                    {' '}
                  </span>
                  <span className="h-4 w-64 animate-pulse rounded-sm bg-base-200">
                    {' '}
                  </span>
                </div>
              </div>

              <div className="w-fit">&nbsp;</div>
              <div className="ml-auto mr-4 flex flex-row items-center gap-2 justify-self-end">
                <span className="h-4 w-4 animate-pulse rounded-sm bg-base-200">
                  {' '}
                </span>
                <span className="h-5 w-5 animate-pulse rounded-full bg-base-200"></span>
              </div>
            </div>
          ))}
        </div>
      </main>
    )
  }

  const renderIssueElements = (issues) => {
    return (
      <main className="mx-2 mt-4 md:mx-8">
        <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
          <ul>
            <li>
              <Link to={'/projects'}>Projects</Link>
            </li>
            <Suspense fallback={' '}>
              <Await resolve={data.project} errorElement={''}>
                {(project) => (
                  <li>
                    <Link to={`/projects/${project._id}`}>{project.name}</Link>
                  </li>
                )}
              </Await>
            </Suspense>
            <li>Issues</li>
          </ul>
        </div>
        <div className="mx-auto max-w-7xl rounded-md border border-primary-content/50 shadow-md">
          <div className="flex h-10 w-full items-center rounded-t-md bg-base-300 px-2">
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
            <button className="btn-primary btn-sm btn ml-auto justify-self-end">
              <Link to={`/projects/${params.id}/new`}>New issue</Link>
            </button>
          </div>
          {Object.keys(issues).length === 0 && (
            <div className="flex grow flex-row justify-center rounded-b-md py-2 hover:bg-base-300">
              No Issues
            </div>
          )}
          <ul>
            {issues.map((issue) => (
              <li
                key={issue._id}
                className="flex grow flex-row border-b border-primary-content/50 py-2 last:rounded-b-md last:border-0 hover:bg-base-300"
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
                    <h2>
                      <Link
                        to={`/projects/${issue.project?._id}/issues`}
                        className="transition-none hover:text-accent"
                      >
                        {issue.project?.name}
                      </Link>{' '}
                      /{' '}
                    </h2>
                    <h2>
                      <Link
                        to={`/issues/${issue._id}`}
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
                  to={`/issues/${issue._id}`}
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
    )
  }

  return (
    <>
      <Suspense fallback={renderLoadingElements()}>
        <Await resolve={data.issues}>{renderIssueElements}</Await>
      </Suspense>
    </>
  )
}
