import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Loading from 'components/loading'
import CustomRoute from 'components/custom-route'
import { appRoutes } from 'routes'
import ResetPassword from 'components/reset-password'
import NewPassword from 'components/new-password/index'
import './app.scss'
import 'bootstrap/dist/css/bootstrap.min.css'


// Pages
const Login = React.lazy(() => import('views/login'))
const Logout = React.lazy(() => import('views/logout'))
const Page404 = React.lazy(() => import('views/page404/'))

const loading = (
    <div style={{ width: 200, height: 200, margin: '32px auto 0' }}>
        <Loading />
    </div>
)

function App() {
    return (
        <div className="app">
            <BrowserRouter>
                <React.Suspense fallback={loading}>
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/logout" component={Logout} />
                        <Route exact path="/404" component={Page404} />
                        <Route exact path='/reset-password' component={ResetPassword} />
                        <Route exact path='/new-password' component={NewPassword} />
                        {appRoutes.map((route) => (
                            <CustomRoute
                                key={route.path}
                                path={route.path}
                                exact={route.exact}
                                isPrivate={false}
                                component={route.component}
                            />
                        ))}
                    </Switch>
                </React.Suspense>
            </BrowserRouter>
            <ToastContainer />
        </div>
    )
}

export default App
