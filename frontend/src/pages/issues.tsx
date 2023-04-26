import { ReactElement, useEffect } from 'react'
import { useState } from 'react'

const Issues = (): ReactElement => {
  const [issues, setIssues] = useState<string[]>([])

  useEffect(() => {
    const location = window.location.hostname

    const fetchData = async () => {
      const response = await fetch(`http://${location}:3000/issues`, {
        credentials: 'include',
      })
      const data = await response.json()
      console.log(data)
    }

    fetchData().catch(console.error)
  }, [])

  return <div>Issues</div>
}

export default Issues
