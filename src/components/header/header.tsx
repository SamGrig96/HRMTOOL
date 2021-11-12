import React, { useState, useEffect } from 'react'
import authService from 'services/auth-service'
import logo from 'images/logo.gif'
import { useHistory } from 'react-router';
import './styles.scss'
import userService from 'services/user-service';
import notificationService from 'services/notification-service';
import MyAccount from 'components/account'

type TUserInfo = {
    defaultEmail: string
    email: string
    firstName: string
    lastName: string
    phoneNumber: string
    profilePicturePath: string
    userName: string
}


const Header = React.memo(() => {
    const [userData] = useState<{ username: string, userId: number }>(authService.getUserData())
    const history = useHistory()
    const [userInfo, setUserInfo] = useState<TUserInfo>()
    const [showAccount, setShowAccount] = useState<boolean>(false)

    const logOut = () => {
        authService.logout()
        history.push('/login')
        setShowAccount(false)
    }
    const editProfile = () => {
        history.push('/edit-profile')
        setShowAccount(false)
    }


    const showAccountModal = () => {
        setShowAccount(!showAccount)
    }

    useEffect(() => {
        userService.getUserInfo()
            .then((data: TUserInfo) => {
                if (data) {
                    setUserInfo(data)
                }

                else {
                    notificationService.error("Something went wrong")
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, []);


    return (
        <div className="header">
            <div className="header_left">
                <a href={'/'} className="header_logo">
                    <img src={logo} alt="Images" />
                </a>
            </div>
            <div className="header_right">
                <div className="header_right_username">
                    <span className="header_right_username_role" />
                    <span className="header_right_username_name">Welcome {userData.username}!</span>
                </div>

                <button className="header_right_account " onClick={showAccountModal} >  <img src={(`${userInfo?.profilePicturePath}`)} alt={(`${userInfo?.userName}`)} /></button>
                <MyAccount show={showAccount} editProfile={editProfile} logOut={logOut} />
            </div>

        </div>
    )
})

export default Header