import React from 'react'
import { Route, RouteProps } from 'react-router-dom'
import PrivateRoute from '../private-route'

type TCustomRouteProps = RouteProps & {
    isPrivate: boolean
}

const CustomRoute: React.FC<TCustomRouteProps> = ({ isPrivate, ...rest }) => {
    return (
        <>
            {isPrivate ? (
                <PrivateRoute {...rest}/>
            ) : (
                <Route {...rest}/>
            )}
        </>
    )
}

export default CustomRoute
