import { useForm, SubmitHandler } from "react-hook-form";
import { useHistory } from 'react-router';
import authService from 'services/auth-service';
import notificationService from 'services/notification-service';

import './reset-password.scss'

type Inputs = {
    email: string,

};
const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);

const ResetPassword = () => {
    const history = useHistory()
    const { register, handleSubmit } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = (datas) => {
        if (pattern.test(datas.email)) {
            let email = datas.email
            authService.resetPassword(email)
                .then((response) => {
                    if (response.response?.data.success) {
                        notificationService.success('Please Check Your Email')
                        setTimeout(() => { history.push('/login') }, 5000);
                    } else {
                         notificationService.error(`${response.response?.data.errors[0]}`)
                    }
                })
        }
        else {
            notificationService.error('Invalid Email')
        }
    }

    return (
        <div className='logo'>
            <div className='form'>
                <h3>Reset Password</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("email", { required: true })} placeholder='Your Email' className='reset-email' type='email' />
                    <input className='password-btn' type="submit" /><br />
                
                </form>
            </div>
        </div>

    )

}

export default ResetPassword