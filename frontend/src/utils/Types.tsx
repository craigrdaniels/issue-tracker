export type Issue = {
  _id: string
  title: string
  created_by: User
  project: Project
  assigned_users: User[]
  messages: Message[]
  created_at: Date
  tags: Tag[]
  is_open: boolean
  message_count: number
}

export type Tag = {
  _id: string
  tag: string
  color: string
}

export type User = {
  _id: string
  username: string
}

export type Project = {
  _id: string
  name: string
  project_lead: User
  open_issues: number
}

export type Message = {
  _id: string
  created_by: User
  created_at: Date
  last_edit: Date
  content: string
}

export type IssueResponse = {
  issue: Issue
}

export type IssuesResponse = {
  issues: Issue[]
  project: Project
}

export type ProjectResponse = {
  project: Project
}

export type ProjectsResponse = {
  projects: Project[]
}

export type ActionDataResponse = {
  status: number
  response: Response
  method: string
  error: Error
}
