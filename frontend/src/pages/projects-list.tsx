import { Suspense, ReactElement } from 'react'
import { Await, defer, Link, useLoaderData } from 'react-router-dom'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { getProjects } from '../api'

export const projectsLoader = async () => {
  return defer({
    projects: getProjects(),
  })
}

export const Projects = (): ReactElement => {
  const data = useLoaderData()

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
                  <h2 className="h-4 w-64 animate-pulse rounded-sm bg-base-200">
                    {' '}
                  </h2>
                  <span className="h-4 w-72 animate-pulse rounded-sm bg-base-200">
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

  const renderProjectsElements = (projects) => {
    return (
      <main className="mx-2 mt-4 md:mx-8">
        <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base ">
          <ul>
            <li>
              <Link to={'/projects'}>Projects</Link>
            </li>
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
              <Link to={'/projects/new'}>New project</Link>
            </button>
          </div>
          <ul>
            {projects?.map((project) => (
              <li
                key={project._id}
                className="flex grow flex-row border-b border-primary-content/50 py-2 last:rounded-b-md last:border-0 hover:bg-base-300"
              >
                <div className="px-4">
                  <div className="flex flex-col gap-1 md:flex-row">
                    <h2>
                      <Link
                        to={project._id}
                        className="transition-none hover:text-accent"
                      >
                        {project.name}
                      </Link>
                    </h2>
                  </div>
                  <span className="text-sm text-base-content/80">
                    Project lead: {project.project_lead.username}
                  </span>
                </div>

                <div className="w-fit">&nbsp;</div>
                <Link
                  to={project._id}
                  className="ml-auto mr-4 flex flex-row items-center gap-2 justify-self-end"
                >
                  {project.open_issues || 0}
                  <ExclamationCircleIcon className="h-5 w-5" />
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
        <Await resolve={data.projects}>{renderProjectsElements}</Await>
      </Suspense>
    </>
  )
}
