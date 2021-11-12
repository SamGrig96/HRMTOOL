import { useForm } from "react-hook-form";
import Button from "../button";
import { useHistory } from "react-router-dom"
import "../styles/input.scss"
import './style.scss'
import notificationService from "services/notification-service";
import userService from "services/user-service";

export type ChanchgesPassword = {
    currentpassword: string,
    newpassword: string,
    retrypassword?: string,
}


const PasswordChanges = () => {
    const { register, handleSubmit } = useForm<any>();
    const history = useHistory();

    const editPassword = (data: ChanchgesPassword) => {
        if (data.newpassword.length >= 8) {
            if (data.newpassword === data.retrypassword) {
                const passwords: ChanchgesPassword = {
                    currentpassword: data.currentpassword,
                    newpassword: data.newpassword
                }
                userService.passwordChanges(passwords).then(data => {
                    if (data.errors === null) {
                        notificationService.info('Your Password is Change')
                        history.push('/dashboard')
                    } else {
                        notificationService.error(data.errors)
                    }
                })

            } else { notificationService.error("Something went wrong") }
        }
        //  else {
        //     notificationService.error('Password length does not match')
        // }

    }
    return (
        <div className="input-container edit-password">
            <div className='edit-department'>
                <h3>Edit Password</h3>
                <form onSubmit={handleSubmit(editPassword)}>
                    <div>Current Password*</div>
                    <input type='password' {...register("currentpassword")} />
                    <div>New  Password*</div>
                    <input type='password' {...register("newpassword")} />
                    <div>Retry Password*</div>
                    <input type='password' {...register("retrypassword")} />
                    <div className="combine-btn">
                        <Button className="btn-form-save" value="Save" />
                        <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel" />
                    </div>
                </form>
            </div>
        </div>
    )

}
export default PasswordChanges
