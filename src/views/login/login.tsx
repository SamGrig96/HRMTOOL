import React, { FormEvent, useState } from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'
import authService from 'services/auth-service'
import './login.scss'

type TRouterHistoryState = {
    from: {
        pathname: string
    }
}

const Login: React.FC<RouteComponentProps> = ({ history }) => {
    const [email, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)

    const onLogin = (event: FormEvent) => {
        event.preventDefault()
        setLoading(true)
        setErrorMessage('')

        authService.login(email, Password)
            .then(({ message, success }) => {
                setLoading(false)
                if (!success) {
                    setErrorMessage(message)
                } else {
                    const url = history.location.state
                        ? (history.location.state as TRouterHistoryState).from.pathname || '/dashboard'
                        : '/dashboard'
                    history.push(url)
                }
            })
            .catch(() => {
                setLoading(false)
                setErrorMessage(authService.defaultErrorMessage)
            })
    }

    return (
        <div className="login">
            <form className='login_form' onSubmit={onLogin}>
                {errorMessage && (
                    <div className='login_error-message'>{errorMessage}</div>
                )}
                <div className='login_form_content'>
                    <div className='login_form_content_input-container'>
                        <input
                            type='text'
                            name='login'
                            value={email}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <input
                            type='password'
                            name='password'
                            value={Password}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                    <button className='login_form_content_submit' type='submit' disabled={loading}>
                       Login
                    </button>
                    </div>
                <div className='your-password'>
                    <Link to='/reset-password' className='your-password-link'><span>Reset Your Password</span></Link>
                </div>
            </form>
        </div>
    )
}

export default Login