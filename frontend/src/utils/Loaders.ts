import type {
  ActionFunction,
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
} from 'react-router-dom'
import { defer } from 'react-router-dom'
import { getIssue, getIssues, getProject, getProjects } from '../api'
import { location, port } from './Server'

export const issueLoader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  return defer({
    issue: getIssue(params.id),
  })
}

export const issueAction: ActionFunction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData()
  const message = formData.get('message')

  switch (request.method) {
    case 'POST': {
      try {
        const response = await fetch(
          `http://${location}:${port}/issues/${params.id}/messages`,
          {
            credentials: 'include',
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message }),
          }
        )

        return { status: response.status, response }
      } catch (err: Error) {
        return {
          error: err.message,
        }
      }
    }
    case 'PUT': {
      const issue_id = formData.get('issue_id')
      const message_id = formData.get('message_id')
      try {
        const response = await fetch(
          `http://${location}:${port}/issues/${issue_id}/messages/${message_id}`,
          {
            credentials: 'include',
            method: 'PUT',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              content: message,
            }),
          }
        )
        const json = await response.json()
        return { status: response.status, response: json }
      } catch (err: Error) {
        return {
          error: err.message,
        }
      }
    }
  }
}

export const issuesLoader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  return defer({
    issues: getIssues(params.id),
    project: getProject(params.id),
  })
}

export const projectLoader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  return defer({
    project: getProject(params.id),
  })
}

export const projectsLoader: LoaderFunction = async () => {
  return defer({
    projects: getProjects(),
  })
}

export const newIssueLoader: LoaderFunction = async ({
  params,
}: LoaderFunctionArgs) => {
  return defer({
    project: getProject(params.id),
  })
}

export const newIssueAction: ActionFunction = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  const formData = await request.formData()

  const project = params.id
  const title = formData.get('subject')
  const content = formData.get('content')

  switch (request.method) {
    case 'POST': {
      try {
        const response = await fetch(`http://${location}:${port}/issues`, {
          credentials: 'include',
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project,
            title,
            content,
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
  }
}

export const newProjectAction: ActionFunction = async ({
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
