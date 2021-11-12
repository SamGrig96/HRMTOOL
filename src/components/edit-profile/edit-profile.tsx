import { useForm } from "react-hook-form";
import Button from "../button";
import { useHistory } from "react-router-dom"
import "../styles/input.scss"
import './style.scss'
import { useEffect } from "react";
import userService from "services/user-service";
import notificationService from "services/notification-service";
import PasswordChanges from "./password-changes";
import { TUsersEdit, } from "services/department-service";
export type TData = {
    defaultEmail?: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    userName: string,
    errors?: string
    profilePicturePath?:string
}
const EditProfile = () => {
    const { register, handleSubmit, reset } = useForm<TUsersEdit>();
    const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    const history = useHistory();

    const editProfile = (localdata: TData) => {
        if (localdata.email.length > 0) {
            if (pattern.test(localdata.email)) {
                const editData: TData = {
                    firstName: localdata.email,
                    lastName: localdata.lastName,
                    userName: localdata.userName,
                    email: localdata.email,
                    phoneNumber: localdata.phoneNumber,
                }
                userService.editProfile(editData).then(data => {
                    if (data.errors === null) {
                        notificationService.info("Your Profile is Changes")
                        history.push('/dashboard')
                    }
                }).catch(() => {
                    notificationService.error("Something went wrong")
                })
            }

        } else {
            const editData: TData = {

                firstName: localdata.email,
                lastName: localdata.lastName,
                userName: localdata.userName,
                email: '',
                phoneNumber: localdata.phoneNumber,
            }
            userService.editProfile(editData).then(data => {
                if (data.errors === null) {
                    notificationService.info("Your Profile is Changes")
                    history.push('/dashboard')
                }
            }).catch(() => {
                notificationService.error("Something went wrong")
            })
        }

    }


    useEffect(() => {
        userService.getUserInfo()
            .then((data: TData) => {
               
                if (data) {
                    reset(data)
                } else {
                    notificationService.error("Something went wrong")
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, [reset]);


    return (
        <div className='edit-profile'>
            <div className="input-container">
                <div className='edit-department'>
                    <h3>Edit Profile</h3>
                    <form onSubmit={handleSubmit(editProfile)}>
                        <div>First name*</div>
                        <input type='text' {...register("firstName")} />
                        <div>Last name*</div>
                        <input type='text' {...register("lastName")} />
                        <div>Display name*</div>
                        <input type='text' {...register("userName")} />
                        <div>Email*</div>
                        <input type='email' {...register("email")} />
                        <div>Default Email*</div>
                        <input type='email' {...register("defaultEmail")} disabled={true} />
                        <div>Phone*</div>
                        <input type='text' {...register("phoneNumber")} />
                        <div className="combine-btn">
                            <Button className="btn-form-save" value="Save" />
                            <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel" />
                        </div>
                    </form>
                </div>

            </div>
            <PasswordChanges />
        </div>

    )
}

export default EditProfile
