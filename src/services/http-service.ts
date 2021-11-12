import axios, { Method } from 'axios'


class HttpService {
    appName = 'AX_HR_TOOL_'
    baseUrl = ''
    timeout = 0
    authTokenKey = ''
    axiosInstance
    defaultHeaders = {}
    defaultErrorMessage = 'Something went wrong! Try later!'
    cookiesSessionInDays = 1

    constructor() {
        this.baseUrl = BASE_URL
        this.timeout = TIMEOUT
        this.appName = APP_NAME
        this.authTokenKey = `${this.appName}AuthToken`


        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            timeout: this.timeout,
        })
    }

    async get(url: string, data = null, withAuthToken = true) {
        return this.request(url, 'get', data, withAuthToken)
    }

    async post(url: string, data = {}, withAuthToken = true) {
        return this.request(url, 'post', data, withAuthToken)
    }

    async put(url: string, data = {}, withAuthToken = true) {
        return this.request(url, 'put', data, withAuthToken)
    }

    async delete(url: string, data = {}, withAuthToken = true) {
        return this.request(url, 'delete', data, withAuthToken)
    }

    async request(url: string, method: Method, data: any, withToken: boolean) {
        const headers: { [key: string]: string } = {
            ...this.defaultHeaders,
        }

        if (withToken) {
            headers.Authorization = `Bearer ${this.getCookie(this.authTokenKey)}`
        }

        return this.axiosInstance.request({
            url,
            method,
            data,
            headers,
        })
    }

    sleep(ms = 2000) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    setCookie(name: string, value: string, days: number) {
        let expires = ''
        if (days) {
            const date = new Date()
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
            expires = '; expires=' + date.toUTCString()
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/'
    }

    getCookie(name: string) {
        const nameEQ = name + '='
        const ca = document.cookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) === ' ') c = c.substring(1, c.length)
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
        }
        return null
    }

    getAuthToken(): string {
        return this.getCookie(this.authTokenKey) || ''
    }

    removeCookie(name: string) {
        document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
}
export default HttpService;

