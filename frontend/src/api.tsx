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

  //  .then((res) => {
  //    if (res.status === 401) {
  //      // throw new Response('Not Authenticated', { status: 401 })
  //      return {
  //        isRedirect: true,
  //        status: res.status,
  //        location: res.headers.get('Location'),
  //      }
  //    }
  //    return res.json()
  //  })
}

export const getProject = async (projectID: string) => {
  return await fetch(`http://${location}:${port}/projects/${projectID}`, {
    credentials: 'include',
  }).then((res) => {
    if (res.status === 401) {
      return {
        isRedirect: true,
        status: res.status,
        location: res.headers.get('Location'),
      }
    }
    return res.json()
  })
}
