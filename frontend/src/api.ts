import { location, port } from './utils/Server'

export const getIssues = async (projectID: string | undefined) => {
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

export const getIssue = async (issueID: string | undefined) => {
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

export const getProject = async (projectID: string | undefined) => {
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

export const updateIssue = async (issueID: string, body) => {
  const res = await fetch(`http://${location}:${port}/issues/${issueID}`, {
    credentials: 'include',
    method: 'PUT',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  console.log(JSON.stringify(body))

  if (!res.ok) {
    throw {
      message: 'Erorr updating Isuse',
      statusText: res.statusText,
      status: res.status,
    }
  }
  const data = await res.json()
  return data
}

export const getUser = async (userID: string) => {
  const res = await fetch(`http://${location}:${port}/users/${userID}`, {
    credentials: 'include',
  })
  if (!res.ok) {
    throw {
      message: 'Failed to fetch user',
      statusText: res.statusText,
      status: res.status,
    }
  }

  const data = await res.json()
  return data
}
