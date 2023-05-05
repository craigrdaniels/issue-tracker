import jsonwebtoken from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config({ path: '.env.development' })

interface IUser {
  _id: string
  username: string
  password: string
  email: string
  role?: string
  projects?: string[]
}

interface IRefreshToken {
  email: string
  token: string
}

interface IIssues {
  _id: string
  title: string
  created_at?: string
  created_by: string
  project: string
  assigned_users?: string[]
  is_open: boolean
  tags?: string[]
}

interface IProjects {
  _id: string
  name: string
  project_lead: string
}

interface IMessages {
  created_by: string
  issue: string
  created_at: string
  last_edit: string
  content: string
}
const usersObj: IUser[] = [
  {
    _id: '61547f2a2e52c9b2c2d0d2c5',
    username: 'devuser',
    password: bcrypt.hashSync('password', 10),
    email: 'devuser@email.com'
  },
  {
    _id: '61547f2a2e52c9b2c2d0d2c6',
    username: 'johnsmith',
    password: '$2b$10$l5f5TVqbGQyRHg/vn6q3D.e1zhfB1rZ6UvZ6Pruh6bwYRlW.DgTbi',
    email: 'testuser@email.com',
    role: '61547f2a2e52c9b2c2d0d2c3',
    projects: ['61547f2a2e52c9b2c2d0d2c4']
  },
  {
    _id: '61547f2a2e52c9b2c2d0d2c4',
    username: 'janedoe',
    password: '$2b$10$Mjap8V7LDuZvD.1A9uX9b.4/dI4p81w80V7R4jKOp2S5A5etPb5Se',
    email: 'janedoe@example.com',
    role: '61547f2a2e52c9b2c2d0d2c3',
    projects: ['61547f2a2e52c9b2c2d0d2c4', '61547f2a2e52c9b2c2d0d2c5']
  },
  {
    _id: '61547f2a2e52c9b2c2d0d2c3',
    username: 'bobsmith',
    password: '$2b$10$bxU06R9stx4RL4y1C.sNG.4RjKk9X17ZPUOtIjv6MSNSce6UbdhNK',
    email: 'bobsmith@example.com',
    role: '61547f2a2e52c9b2c2d0d2c4',
    projects: ['61547f2a2e52c9b2c2d0d2c5', '61547f2a2e52c9b2c2d0d2c6']
  }
]

const issuesObj: IIssues[] = [
  {
    _id: '616f474ced6f1a1822b72cb1',
    title: 'Login page not working',
    created_by: '61547f2a2e52c9b2c2d0d2c5',
    project: '616f474ced6f1a1822b72cb4',
    assigned_users: ['61547f2a2e52c9b2c2d0d2c3'],
    is_open: true,
    tags: ['login', 'authentication']
  },
  {
    _id: '616f474ced6f1a1822b72cb2',
    title: 'Button not clickable on mobile devices',
    created_by: '61547f2a2e52c9b2c2d0d2c3',
    project: '616f474ced6f1a1822b72cb5',
    assigned_users: ['61547f2a2e52c9b2c2d0d2c5'],
    is_open: true,
    tags: ['UI', 'design']
  },
  {
    _id: '616f474ced6f1a1822b72cb3',
    title: 'Access denied error for admin user',
    created_by: '61547f2a2e52c9b2c2d0d2c3',
    project: '616f474ced6f1a1822b72cb4',
    assigned_users: [],
    is_open: false,
    tags: ['security', 'permissions']
  }
]

const projectsObj: IProjects[] = [
  {
    _id: '616f474ced6f1a1822b72cb5',
    name: 'Project A',
    project_lead: '61547f2a2e52c9b2c2d0d2c4'
  },
  {
    _id: '616f474ced6f1a1822b72cb4',
    name: 'Project B',
    project_lead: '61547f2a2e52c9b2c2d0d2c5'
  }
]

const messagesObj: IMessages[] = [
  {
    created_by: '61547f2a2e52c9b2c2d0d2c5',
    issue: '616f474ced6f1a1822b72cb1',
    created_at: '2023-05-02T09:15:00Z',
    last_edit: '2023-05-03T10:30:00Z',
    content:
      "I'm unable to log in to the system. When I enter my username and password on the login page, nothing happens. The page just refreshes and the fields are cleared. Can you please investigate and fix this issue?"
  },

  {
    created_by: '61547f2a2e52c9b2c2d0d2c3',
    issue: '616f474ced6f1a1822b72cb3',
    created_at: '2023-05-04T14:30:00Z',
    last_edit: '2023-05-04T14:35:00Z',
    content:
      "As an admin user, I'm getting an access denied error when I try to access the user management page. This was working fine earlier. Can you please investigate and fix this issue?"
  },
  {
    created_by: '61547f2a2e52c9b2c2d0d2c3',
    issue: '616f474ced6f1a1822b72cb2',
    created_at: '2023-05-05T10:00:00Z',
    last_edit: '2023-05-05T10:05:00Z',
    content:
      "I'm unable to click the button on my mobile device. It seems to work fine on desktop. Can you please look into this issue?"
  }
]

const refreshTokensObj: IRefreshToken[] = []

usersObj.forEach((user) => {
  const rToken = {
    email: user.email,
    token: jsonwebtoken.sign(
      { email: user.email },
      // eslint-disable-next-line
      process.env.JWT_REFRESH_KEY!
    )
  }
  refreshTokensObj.push(rToken)
})

export { usersObj, refreshTokensObj, issuesObj, projectsObj, messagesObj }
