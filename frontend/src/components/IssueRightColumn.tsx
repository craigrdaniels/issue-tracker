import {
  CSSProperties,
  ReactElement,
  Suspense,
  useState,
  FormEvent,
} from 'react'
import { useSubmit, useRouteLoaderData, Await, Form } from 'react-router-dom'
import { Issue, IssueResponse } from '../utils/Types'
import {
  XCircleIcon,
  PencilSquareIcon,
  TagIcon,
} from '@heroicons/react/24/outline'

const IssueRightColumn = (): ReactElement => {
  const submit = useSubmit()
  const { issue } = useRouteLoaderData('issue') as IssueResponse
  const [tagField, setTagField] = useState<string>('')
  const [editing, setEditing] = useState<boolean>(false)

  const handleChangeTagField = (event: FormEvent<HTMLInputElement>) => {
    setTagField(event.currentTarget.value)
  }

  const handleSubmitTag = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      const theForm: HTMLFormElement = document.getElementById(
        'addTagForm'
      ) as HTMLFormElement
      submit(theForm)
      setTagField('')
    }
  }

  const renderRightColumn = (issue: Issue) => {
    return (
      <main className="h-52 w-56 flex-col rounded-md border border-primary-content/50 bg-base-200 hover:bg-base-300">
        <div className="flex w-full justify-between rounded-md rounded-t-md bg-base-300 px-2 py-1">
          <h2>Tags</h2>
          <button onClick={() => setEditing((prevState) => !prevState)}>
            <PencilSquareIcon className="h-5 w-5" />
          </button>
        </div>
        <div
          onBlur={(e) => e.relatedTarget === null && setEditing(false)}
          onFocus={() => setEditing(true)}
          className="flex h-44 flex-row flex-wrap content-start gap-1 p-2 text-base text-base-content"
        >
          <Form method="put" id="addTagForm" className="w-full place-self-end">
            <input name="issue_id" defaultValue={issue._id} hidden />
            <input name="intent" value="addTag" readOnly hidden />
            <input
              name="tag"
              placeholder="Add new.."
              onKeyDown={(e) => handleSubmitTag(e)}
              onChange={(e) => handleChangeTagField(e)}
              value={tagField}
              className="input h-8 w-full"
            />
          </Form>
          {issue.tags.map((tag) => (
            <Form key={tag.tag} method="put">
              <input name="issue_id" defaultValue={issue._id} hidden />
              <input name="tag_id" defaultValue={tag._id} hidden />
              <button
                name="intent"
                value="removeTag"
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
        </div>
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
