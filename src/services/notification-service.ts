import * as React from 'react'
import { toast, ToastContent, ToastOptions } from 'react-toastify'

class NotificationService {
    defaultOptions: ToastOptions = {
        position: 'bottom-right',
        hideProgressBar: true,
    }

    success(content: ToastContent, options?: ToastOptions): React.ReactText {
        return toast.success(content, { ...this.defaultOptions, ...options })
    }

    info(content: ToastContent, options?: ToastOptions): React.ReactText {
        return toast.info(content, { ...this.defaultOptions, ...options })
    }

    error(content: ToastContent, options?: ToastOptions): React.ReactText {
        return toast.error(content, { ...this.defaultOptions, ...options })
    }

    warning(content: ToastContent, options?: ToastOptions): React.ReactText {
        return toast.warning(content, { ...this.defaultOptions, ...options })
    }
}

export default new NotificationService()