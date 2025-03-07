import { Suspense, ReactElement, useEffect } from 'react'
import {
  Await,
  useLoaderData,
  useNavigate,
  Form,
  Link,
  useParams,
  useActionData,
} from 'react-router-dom'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAlert } from '../hooks/useAlert'
import { Project, ProjectResponse } from '../utils/Types'

export const NewIssue = (): ReactElement => {
  const { addAlert } = useAlert()
  const navigate = useNavigate()
  const params = useParams()
  const { project } = useLoaderData() as ProjectResponse
  const data = useActionData()

  useEffect(() => {
    if (data?.status === 200) {
      addAlert('alert-success', 'Issue added.')
      // navigate away
      navigate(`/issues/${data.response.id}`)
    }

    if (data?.error) {
      addAlert('alert-error', data.error)
    }
  }, [data])

  const renderLoadingElements = () => {
    return (
      <ul>
        <li className="h-4 w-72 animate-pulse bg-base-200"> </li>
      </ul>
    )
  }

  return (
    <>
      <main className="mx-2 mt-4 md:mx-8">
        <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
          <Suspense fallback={renderLoadingElements()}>
            <Await resolve={project as Project}>
              {(project: Project) => (
                <ul>
                  <li>
                    <Link to={'/projects'}>Projects</Link>
                  </li>
                  <li>
                    <Link to={`/projects/${project._id}`}>{project.name}</Link>
                  </li>
                  <li>New Issue</li>
                </ul>
              )}
            </Await>
          </Suspense>
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-row gap-4">
            <div className="h-12 w-12">
              <UserCircleIcon />
            </div>
            <Form
              action={`/projects/${params.id}/new`}
              method="post"
              className="flex w-full grow flex-col gap-2 rounded-md border border-primary-content/50 bg-base-200 p-2 shadow-md hover:bg-base-300"
            >
              <input
                type="text"
                placeholder="Subject"
                name="subject"
                className="input w-full"
                required
              />
              <textarea
                className="textarea bg-base-100"
                placeholder="Describe the issue..."
                name="content"
                required
              ></textarea>
              <div className="flex w-full">
                <button
                  type="submit"
                  className="btn-primary btn-wide btn ml-auto place-self-end"
                >
                  Submit
                </button>
              </div>
            </Form>
          </div>
        </div>
      </main>
    </>
  )
}
