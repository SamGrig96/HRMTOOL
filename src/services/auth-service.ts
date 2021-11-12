import HttpService from './http-service'

export type TLoginResponse = {
    success: boolean
    message: string
}

class AuthService extends HttpService {
    loginEndpoint = '/Account/Login'
    logoutEndpoint = '/Account/Logout'
    ForgotPasswordEmail = '/Account/ForgotPasswordEmail'
    validToken = '/Account/ValidUrlToken'
    changePassword = '/Account/ResetPassword'
    userDataKey = `${this.appName}UserData`

    async login(email: string, Password: string): Promise<TLoginResponse> {
        this.removeCookie(this.authTokenKey)
        
        const response = await this.post(this.loginEndpoint, { email, Password }, false)

        if (response.status === 200) {
            const data = response.data
            if (data.errors != null) {
                return { success: false, message: data.errors }
            }

            if (data.data.roleId && data.data.token) {
            

                this.setCookie(this.authTokenKey, data.data.token, this.cookiesSessionInDays)
                this.setUserData(data.data.roleId, email)
                return { success: true, message: 'ok' }
            }
        }

        return { success: false, message: this.defaultErrorMessage }
    }



    logout() {
        this.post(this.logoutEndpoint).then(res => { });
        this.removePlayerData()
        this.removeCookie(this.authTokenKey)
    }


    async resetPassword(email: string) {
        const response = await this.post(this.ForgotPasswordEmail, { email }, false)
        if (response.status === 200) {
            const data = response.data
            if (data.errors != null) {
                return { success: false, message: data.errors }
            }
        }
        return { response }
    }


    async tokenValid(urlToken: string) {
        const response = await this.post(this.validToken, { urlToken }, false)
        if (response.status === 200) {
            const data = response.data
            if (data.errors != null) {
                return { success: false, message: data.errors }
            }
        }
        return { response }
    }


    async changesPassword(newPassword: string, urlToken: string) {
        const response = await this.post(this.changePassword, { newPassword, urlToken }, false)
        if (response.status === 200) {
            const data = response.data
            if (data.errors != null) {
                return { success: false, message: data.errors }
            }
        }
        return { response }
    }


    getUserData(): { username: string, userId: number } {
        return JSON.parse(
            localStorage.getItem(this.userDataKey) || '{"username":"","userId":0}',
        )
    }

    isUserLoggedIn(): boolean {
        const cookie = this.getCookie(this.authTokenKey)
        const userId = this.getUserData().userId

        return Boolean(cookie) && Boolean(userId)
    }

    private setUserData(userId: number, username: string) {
        localStorage.setItem(this.userDataKey, JSON.stringify({ userId, username }))
    }

    private removePlayerData() {
        localStorage.removeItem(this.userDataKey)
    }
}

export default new AuthService()
