import clsx from 'clsx'
import { ReactElement } from 'react'
import { Link } from 'react-router-dom'

const Navigation = ({ navigation }): ReactElement => {
  return (
    <nav className={clsx('text-base lg:text-sm')}>
      <ul role="list" className="flex flex-row space-x-4">
        {navigation.map((section) => (
          <li key={section.title}>
            <Link to={section.href}>{section.title}</Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Navigation
