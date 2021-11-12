
import { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { useHistory } from 'react-router';
import './new-password.scss'
import notificationService from 'services/notification-service';
import authService from 'services/auth-service';

type Inputs = {
    password: string,
    passwordretry: string
};

const NewPasswordExist = () => {
    const history = useHistory()
    const [urlToken, setToken] = useState('')
    const { register, handleSubmit } = useForm<Inputs>();

    useEffect(() => {
        const token = window.location.href
        const spliceToken = token.slice(40)
        setToken(spliceToken)


    }, []);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        if (data.password.length > 8 && data.password === data.passwordretry) {
            authService.changesPassword(data.password, urlToken)
                .then(function (response) {
                    if (response.response?.data.success) {
                        notificationService.success("Your Password Changes!")
                        history.push('/login')
                    } else {
                        notificationService.error('Passwords do not match')

                    }
                })
        }
        else {
            notificationService.error('Passwords do not match')
        }
    }


    return (
        <div className='logo'>
            <div className='form-pass'>
                <h3>Reset Password</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='password-input'>
                        <input
                            {...register("password", { required: true })}
                            placeholder='New Password'
                            className='reset-passwords'
                            type='password'
                        />
                        <input
                            {...register("passwordretry", { required: true })}
                            placeholder='Retry New Password'
                            className='reset-passwords'
                            type='password'
                        />
                    </div>
                    <input className='password-btn' type="submit" /><br />
                </form>
            </div>
        </div>

    )

}

export default NewPasswordExist