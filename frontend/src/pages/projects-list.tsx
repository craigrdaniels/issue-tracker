import { ReactElement } from 'react'
import { useState } from 'react'
import clsx from 'clsx'
import { Link, useLoaderData } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { location, port } from '../utils/Server'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

export const projectsLoader = async () => {
  const response = await fetch(`http://${location}:${port}/projects`, {
    credentials: 'include',
  })

  if (response.status === 401) {
    throw new Response('Not Authenticated', { status: 401 })
  }

  return response.json()
}

export const Projects = (): ReactElement => {
  const projects = useLoaderData()

  const handleClickSort = (sortField: string, sortOrder: string) => {}

  return (
    <>
      <main className="mx-2 mt-4 md:mx-8">
        <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base ">
          <ul>
            <li>
              <Link to={'/projects'}>Projects</Link>
            </li>
          </ul>
        </div>
        <div className="mx-auto max-w-7xl rounded-md border border-primary-content/50 shadow-md">
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
            {projects?.map((project) => (
              <li
                key={project._id}
                className="flex grow flex-row border-b border-primary-content/50 py-2 last:border-0 hover:bg-base-300"
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
    </>
  )
}
