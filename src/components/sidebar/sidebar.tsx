import React from 'react'
import { useHistory } from 'react-router-dom'

import './styles.scss'

const routes = [
    {
        name: 'Main menu',
        children: [
            { name: 'Dashboard', url: '/dashboard' },
            { name: 'Users', url: '/users' },
            { name: 'Projects', url: '/projects' },
            { name: 'Departments', url: '/departments' },
            { name: 'Announcements' , url: '/announcements'}
        ],
    },
    {
        name: 'Another menu',
        children: [
        ],
    },
]

const Sidebar = () => {
    const history = useHistory()
    const onClick = (event: React.MouseEvent<HTMLAnchorElement>, url: string) => {
        event.preventDefault()

        history.push(url)
    }

    return (
        <div className="sidebar">
            {routes.map(({ name, children }) => (
                <div key={name} className="sidebar_section">
                    <div className="sidebar_section_title">{name}</div>
                    {children.map(({ name, url }) => (
                        <a
                            key={name}
                            href={url}
                            className={`sidebar_section_item ${window.location.pathname.startsWith(url) ? 'active' : ''}`}
                            onClick={event => onClick(event, url)}
                        >
                            {name}
                        </a>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Sidebar