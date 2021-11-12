import {TDepartmentInfo} from 'components/add-department/add-department'
import HttpService from './http-service'
import {TPagePagination} from "../components/page-pagination/page-pagination";

export type TUserResponse = {
    message: string
}

export type TUsersEdit ={
    defaultEmail?: string,
    email:string,
    firstName:string,
    lastName:string,
    phoneNumber:string,
    userName:string,
    errors?:string
}

export type TUserEdit = {
    data : {
        defaultEmail: string,
        email:string,
        firstName:string,
        lastName:string,
        phoneNumber:string,
        userName:string,
        errors?:string ;
        profilePicturePath?:string
    }
    errors: null | string[];
    success: boolean
}

export type TDepartment = {
    departmentId: number;
    departmentName?: string;
    description?: string;
    logoPath?: string;
    createdBy?: string;
    createdDate?: string;
    updatedDate?: string;
    updatedBy?: string;
    status?: number | boolean;
    logoPathId?: number;
    file?: any;
}

export type TDepartmentData = {
    data: null | {
        total: number;
        departmentsList: TDepartment[] | [];
    }
    errors: null | string[];
    success: boolean
}

class DepartmentService extends HttpService {

    logoEndpoint = '/FileUpload/LogoFileUpload'
    departmentEndpoint = '/Department'
    getDepartmentEndpoint = '/Department'
    deleteDepartmentEndpoint = '/Department'
    getDepartmentByIdEndpoint = '/Department/ById'
    editDepartmentEndpoint = '/Department'
    searchDepartmentEndPoint = '/Department/Filter'

    async logoId(file: any) {
       
        const response = await this.post(this.logoEndpoint, file)
        if (response.status === 200) {
            return response.data
        }
    }

    async createDepartment(data: TDepartmentInfo) {
       
        const response = await this.post(this.departmentEndpoint, data)
        if (response.status === 200) {
        
            if (response.data.success) {
                return response.data.success
            }
        }
    }


    async getDepartments() {
        const response = await this.get(this.getDepartmentEndpoint)
        if (response.status === 200) {
            return response.data
        }
    }

    async deleteDepartment(departmentId: number) {
        const response = await this.delete(this.deleteDepartmentEndpoint, { departmentId })
        if (response.status === 200) {
            if (response.data.success) {
                return response.data
            }
        }
    }

    async getDepartmentById(id: number) {
        const response = await this.get(this.getDepartmentByIdEndpoint + `?DepartmentId=${id}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async editDepartment(tmpProject: TDepartment) {
        const response = await this.put(this.editDepartmentEndpoint, tmpProject)
        if (response.status === 200) {
            if (response.data.success === true) {
                return response.data
            }
        }
    }

    async getDepartmentsWithPagination(data: string, paginationData: TPagePagination) {
        const response = await this.get(`${this.searchDepartmentEndPoint}?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}&Name=${data}`)
        if (response.status === 200) {
            return response.data
        }
    }
}

export default new DepartmentService()
