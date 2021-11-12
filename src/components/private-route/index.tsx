import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router-dom'
import authService from 'services/auth-service'

const PrivateRoute = ({ component, location, path, ...rest }: RouteProps) => {
    const isLoggedIn = Boolean(authService.isUserLoggedIn())
    // const hasAccess = true

    if (!isLoggedIn) {
        component = () => (
            <Redirect
                to={{
                    pathname: '/login',
                    state: { from: location },
                }}
            />
        )
    }

    // if (!hasAccess) {
    //     component = () => (
    //         <Redirect to={'/'}/>
    //     )
    // }

    return (
        <Route
            component={component}
            location={location}
            path={path}
            {...rest}
        />
    )
}

export default PrivateRoute
