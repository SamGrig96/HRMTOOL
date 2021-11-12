import React from 'react'
import { Redirect } from 'react-router-dom'

import authService from 'services/auth-service'

const Logout = () => {
    authService.logout()

    return (
        <Redirect to='/login'/>
    )
}

export default Logout
