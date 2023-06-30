import { ReactElement, useEffect } from 'react'
import {
  type ActionFunction,
  type ActionFunctionArgs,
  useNavigate,
  Form,
  Link,
  useActionData,
  useNavigation,
} from 'react-router-dom'
import { location, port } from '../utils/Server'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { useAlert } from '../hooks/useAlert'

export const action: ActionFunction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData()

  const name = formData.get('name')

  try {
    const response = await fetch(`http://${location}:${port}/projects`, {
      credentials: 'include',
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
      }),
    })

    const json = await response.json()
    return { status: response.status, response: json }
  } catch (err: Error) {
    return {
      error: err.message,
    }
  }
}

export const NewProject = (): ReactElement => {
  const { state } = useNavigation()
  const { addAlert } = useAlert()
  const navigate = useNavigate()
  const data = useActionData()

  useEffect(() => {
    if (data?.status === 200) {
      addAlert('alert-success', 'Project added')

      // navigate to new project
      navigate(`/projects/${data.response.id}`)
    }

    if (data?.error) {
      addAlert('alert-error', data.error)
    }
  }, [data])

  return (
    <>
      {state === 'loading' ? (
        <main className="mx-2 mt-4 md:mx-8">
          <div className="-max-w-7xl breadcrumbs mx-auto mt-4 text-base">
            <ul>
              <li className="h-4 w-48 animate-pulse bg-base-200"> </li>
            </ul>
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-row gap-4">
              <div className="h-12 w-12 animate-pulse rounded-full bg-base-200"></div>
              <div className="h-24 w-full animate-pulse rounded-md bg-base-200 p-2 shadow-md"></div>
            </div>
          </div>
        </main>
      ) : (
        <main className="mx-2 mt-4 md:mx-8">
          <div className="breadcrumbs mx-auto mt-4 max-w-7xl text-base">
            <ul>
              <li>
                <Link to={'/projects'}>Projects</Link>
              </li>
              <li>New Project</li>
            </ul>
          </div>
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-row gap-4">
              <div className="h-12 w-12">
                <UserCircleIcon />
              </div>
              <Form
                action="/projects/new"
                method="post"
                className="flex w-full grow flex-col gap-2 rounded-md border border-primary-content/50 bg-base-200 p-2 shadow-md hover:bg-base-300"
              >
                <input
                  type="text"
                  placeholder="Project Name"
                  className="input w-full"
                  name="name"
                  required
                />
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
      )}
    </>
  )
}
