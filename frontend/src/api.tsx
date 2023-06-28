import { location, port } from './utils/Server'

export const getIssues = async (projectID: string) => {
  const tail = projectID ? `/projects/${projectID}/issues` : '/issues'

  const res = await fetch(`http://${location}:${port}${tail}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw {
      message: 'Failed to fetch issues',
      statusText: res.statusText,
      status: res.status,
    }
  }

  const data = await res.json()
  return data
}

export const getIssue = async (issueID: string) => {
  const res = await fetch(`http://${location}:${port}/issues/${issueID}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw {
      message: 'Failed to fetch issue',
      statusText: res.statusText,
      status: res.status,
    }
  }

  const data = await res.json()
  return data
}

export const getProjects = async () => {
  const res = await fetch(`http://${location}:${port}/projects`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw {
      message: 'Failed to fetch projects',
      statusText: res.statusText,
      status: res.status,
    }
  }

  const data = await res.json()
  return data
}

export const getProject = async (projectID: string) => {
  if (projectID === undefined) return undefined
  const res = await fetch(`http://${location}:${port}/projects/${projectID}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw {
      message: 'Failed to fetch project',
      statusText: res.statusText,
      status: res.status,
    }
  }

  const data = await res.json()
  return data
}
