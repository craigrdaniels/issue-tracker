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
    email: 'johnsmith@example.com',
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
    _id: Object('616f474ced6f1a1822b72cb1'),
    title: 'Login page not working',
    created_by: '61547f2a2e52c9b2c2d0d2c5',
    project: Object('616f474ced6f1a1822b72cb4'),
    assigned_users: ['61547f2a2e52c9b2c2d0d2c3'],
    is_open: true,
    tags: ['login', 'authentication']
  },
  {
    _id: Object('616f474ced6f1a1822b72cb2'),
    title: 'Button not clickable on mobile devices',
    created_by: '61547f2a2e52c9b2c2d0d2c3',
    project: Object('616f474ced6f1a1822b72cb5'),
    assigned_users: ['61547f2a2e52c9b2c2d0d2c5'],
    is_open: true,
    tags: ['UI', 'design']
  },
  {
    _id: Object('616f474ced6f1a1822b72cb3'),
    title: 'Access denied error for admin user',
    created_by: '61547f2a2e52c9b2c2d0d2c3',
    project: Object('616f474ced6f1a1822b72cb4'),
    assigned_users: [],
    is_open: false,
    tags: ['security', 'permissions']
  }
]

const projectsObj: IProjects[] = [
  {
    _id: Object('616f474ced6f1a1822b72cb5'),
    name: 'Project A',
    project_lead: Object('61547f2a2e52c9b2c2d0d2c4')
  },
  {
    _id: Object('616f474ced6f1a1822b72cb4'),
    name: 'Project B',
    project_lead: Object('61547f2a2e52c9b2c2d0d2c5')
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

export { usersObj, refreshTokensObj, issuesObj, projectsObj }
