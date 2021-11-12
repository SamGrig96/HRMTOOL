import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import CustomRoute from 'components/custom-route'
import Header from 'components/header'
import Sidebar from 'components/sidebar'
import Page404 from 'views/page404'
import { layoutRoutes } from 'routes'

import './styles.scss'

const Layout = () => {
    const defaultPath = '/dashboard'

    return (
        <div className="layout">
            <Header />
            <div className="layout_container">
                <div className="layout_container_sidebar">
                    <Sidebar />
                </div>
                <div className="layout_container_content">
                    <Switch>
                        {layoutRoutes.map((route) => (
                            <CustomRoute
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                isPrivate={route.private || false}
                                component={route.component}
                            />
                        ))}
                        <Redirect from="/" to={defaultPath} />
                        <Route>
                            <Page404 />
                        </Route>
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default Layout