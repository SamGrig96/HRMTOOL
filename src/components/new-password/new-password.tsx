import Loading from 'components/loading';
import { useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router';
import authService from 'services/auth-service';
import notificationService from 'services/notification-service';
import NewPasswordExist from './new-password-exist';
import './new-password.scss'



const NewPassword: React.FC<RouteComponentProps> = ({ location }) => {
    const history = useHistory()
    const [passwordChange, setPasswordChange] = useState(false)


    useEffect(() => {
        
        const urlToken = location.search.replace('?hash=', '')
        
        authService.tokenValid(urlToken)
            .then(function (response) {
                if (response.response?.data.success) {
                    notificationService.success("Please Wait")
                    setPasswordChange(true)
                } else {
                    notificationService.error('Your Token Invalid')
                    history.push('/login')
                }
            })
    }, [ history, location.search]);
    return (
        <div className='form-pass'>
            {passwordChange ? <NewPasswordExist /> : <Loading />}
        </div>
    )


}

export default NewPassword