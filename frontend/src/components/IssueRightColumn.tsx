import { CSSProperties, ReactElement, Suspense, useState } from 'react'
import { useRouteLoaderData, Await, Form } from 'react-router-dom'
import { Issue, IssueResponse } from '../utils/Types'
import { XCircleIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

const IssueRightColumn = (): ReactElement => {
  const { issue } = useRouteLoaderData('issue') as IssueResponse
  const [editing, setEditing] = useState<boolean>(false)

  const renderRightColumn = (issue: Issue) => {
    return (
      <main className="mx-2 mt-20 h-52 w-56 flex-col rounded-md border border-primary-content/50 bg-base-200 hover:bg-base-300 md:mx-8">
        <div className="flex w-full justify-between rounded-md rounded-t-md bg-base-300 px-2 py-1">
          <h2>Tags</h2>
          <button onClick={() => setEditing((prevState) => !prevState)}>
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>
        <ul className="flex flex-row flex-wrap gap-1 p-2 pb-4">
          {issue.tags.map((tag) => (
            <Form method="put">
              <input name="issue_id" value={issue._id} hidden />
              <input name="tag_id" value={tag._id} hidden />
              <button
                name="intent"
                value="removeTag"
                key={tag.tag}
                disabled={!editing}
                style={
                  {
                    'background-color': tag.color + 'A0',
                  } as CSSProperties
                }
                className="flex items-center gap-1 rounded-full border border-neutral-900 px-2 text-sm text-neutral-900"
              >
                {tag.tag}
                {editing && <XCircleIcon className="h-4 w-4" />}
              </button>
            </Form>
          ))}
        </ul>
      </main>
    )
  }

  return (
    <>
      <Suspense fallback="<div>Loading...</div>">
        <Await resolve={issue as Issue}>{renderRightColumn}</Await>
      </Suspense>
    </>
  )
}

export default IssueRightColumn
