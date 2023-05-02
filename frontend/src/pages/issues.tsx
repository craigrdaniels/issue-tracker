import { ReactElement, useEffect } from 'react'
import { useState } from 'react'

export interface IIssue {
  _id: string
  title: string
  created_at: Date
  created_by: string
  project: string
  is_open: boolean
}

const Issues = (): ReactElement => {
  const [issues, setIssues] = useState<IIssue[]>([])

  useEffect(() => {
    const location = window.location.hostname

    const fetchData = async () => {
      const response = await fetch(`http://${location}:3000/issues`, {
        credentials: 'include',
      })
      const data = await response.json()
      setIssues(data)
    }

    fetchData().catch(console.error)
  }, [])

  return (
    <>
      <ul>
        {issues?.map((issue) => (
          <li key={issue._id}>
            {issue.title} - {issue.is_open}
          </li>
        ))}
      </ul>
    </>
  )
}

export default Issues
