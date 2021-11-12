import HttpService from './http-service'
import {TPagePagination} from "../components/page-pagination/page-pagination";

export type ChanchgesPassword = {
    currentpassword: string,
    newpassword: string,
    retrypassword?: string,
}

export type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    userName: string;
    defaultEmail: string;
    email?: string;
    phoneNumber: string;
    password?: string;
    createDate: string;
    departmentId?: any;
    departmentName?: string;
    profilePicturePath?: string;
    profilePictureId?: number | null;
}

export type TUserData = {
    data: null | {
        total: number;
        usersList: TUser[] | [];
    }
    errors: null | string[];
    success: boolean
}

export type TProfilePictureData = {
    data: {
        logoPathId: {
            fileId: number;
            filePath: string;
        }
    };
    errors: null | string[];
    success: boolean;
}

export type TSearchUserData = {
    name: string;
    DepartmentId: string | number[];
}

export type TData = {
    defaultEmail?: string,
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    userName: string,
    errors?: string
}

class UserService extends HttpService {
    addProfilePictureEndpoint = '/FileUpload/LogoFileUpload'
    getUsersEndpoint = `/Users`
    getSingleUserEndpoint = '/Users/ById'
    addUserEndpoint = `/Users`
    editUserEndpoint = `/Users`
    deleteUserEndpoint = '/Users'
    searchUserEndpoint = '/Users/Filter'
    getUserInfoEndpoint = '/Users/Info'
    editProfileEditUserEndpoint = '/Users/EditProfile'
    passwordChangesEndpoint = '/Users/EditPassword'

    async addProfilePictureId(file: any) {
        const response = await this.post(this.addProfilePictureEndpoint, file)
        if (response.status === 200) {
            return response.data
        }
    }

    async deleteUser(id: number) {
        const response = await this.delete(this.deleteUserEndpoint, {id: id})
        if (response.status === 200) {
            return response.data
        }
    }

    async getUsers(data: any, paginationData: TPagePagination) {
        let queryName = "";
        let queryDepartmentId = "";
        let query;
        if (data.name) {
            queryName += `Name=${data.name}`
        }
        if (data.DepartmentId.length) {
            for (let i = 0; i < data.DepartmentId.length; i++) {
                if (i === 0) {
                    queryDepartmentId += `DepartmentId=${data.DepartmentId[i]}`
                } else {
                    queryDepartmentId += `&DepartmentId=${data.DepartmentId[i]}`
                }
            }
        }
        if (data.name && data.DepartmentId.length) {
            query = `?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}&${queryName}&${queryDepartmentId}`;
        } else if (data.name) {
            query = `?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}&${queryName}`
        } else if (data.DepartmentId.length) {
            query = `?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}&${queryDepartmentId}`
        } else {
            query = `?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}`
        }
        const response = await this.get(`${this.searchUserEndpoint}${query}`)
        if (response.status === 200) {
            return response.data
        }
    }

    // async getUsers(paginationData: {
    //     pageSize: number,
    //     pageNumber: number
    // }) {
    //     const response = await this.get(`${this.getUsersEndpoint}?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}`)
    //     if (response.status === 200) {
    //         return response.data
    //     }
    // }

    async getAllUsersForProject() {
        const response = await this.get(`${this.getUsersEndpoint}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async getUser(userId: number) {
        const response = await this.get(`${this.getSingleUserEndpoint}?UserId=${userId}`)
        if (response.status === 200) {
            return {
                ...response.data,
                data: {
                    ...response.data.data,
                    password: "",
                }
            }
        }
    }

    async addUser(userdata: TUser) {
        const response = await this.post(this.addUserEndpoint, userdata, true)
        if (response.status === 200) {
            return response.data
        }
    }

    async editUser(userdata: TUser) {
        const response = await this.put(this.editUserEndpoint, userdata, true)
        if (response.status === 200) {
            return response.data
        }
    }

    async getUserInfo() {
        const response = await this.get(this.getUserInfoEndpoint)
        if (response.status === 200) {
            return response.data.data
        }
    }

    async editProfile(editData: TData) {
        const response = await this.put(this.editProfileEditUserEndpoint, editData)
        if (response.status === 200) {
            return response.data
        }
    }

    async passwordChanges(passwords: ChanchgesPassword) {
        const response = await this.put(this.passwordChangesEndpoint, passwords)
        if (response.status === 200) {
            return response.data
        }
    }
}

export default new UserService()