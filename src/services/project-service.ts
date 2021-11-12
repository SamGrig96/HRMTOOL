import HttpService from './http-service'
import {TPagePagination} from "../components/page-pagination/page-pagination";

export type TProject = {
    projectId: number,
    logoPathId: number;
    logoPath: string;
    projectName: string;
    description: string;
    startDate: string | null;
    endDate: string | null;
    teamLead: string;
    teamLeadId?: number | string | null;
    createdDate: string;
    createdBy: string;
    updatedDate: string;
    updatedBy: string;
}

export type TProjectData = {
    data: null | {
        total: number;
        projectsList: TProject[] | [];
    };
    errors: null | string[];
    success: boolean;
}

export type TLogoData = {
    data: {
        logoPathId: {
            fileId: number;
            filePath: string;
        }
    };
    errors: null | string[];
    success: boolean;
}

class ProjectService extends HttpService {
    addLogoEndpoint = '/FileUpload/LogoFileUpload'
    getProjectsEndpoint = '/Project'
    getSingleProjectEndpoint = '/Project/ById'
    addProjectEndpoint = '/Project'
    editProjectEndpoint = '/Project'
    deleteProjectEndpoint = '/Project'
    searchProjectEndpoint = '/Project/Filter'

    async addLogoId(file: any) {
        const response = await this.post(this.addLogoEndpoint, file)
        if (response.status === 200) {
            return response.data
        }
    }

    async addProject(projectData: TProject) {
        const response = await this.post(this.addProjectEndpoint, projectData, true)
        if (response.status === 200) {
            return response.data
        }
    }

    async getProjects(paginationData: {
        pageSize: number,
        pageNumber: number
    }) {
        const response = await this.get(`${this.getProjectsEndpoint}?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async getProjectById(id: number) {
        const response = await this.get(`${this.getSingleProjectEndpoint}?ProjectId=${id}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async editProject(data: any) {
        const response = await this.put(this.editProjectEndpoint, data)
        if (response.status === 200) {
            return response.data
        }
    }

    async deleteProject(id: number) {
        const response = await this.delete(this.deleteProjectEndpoint, {projectId: id})
        if (response.status === 200) {
            return response.data
        }
    }

    async searchProject(data: any, paginationData: TPagePagination) {
        const response = await this.get(`${this.searchProjectEndpoint}?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}&Name=${data.name}&StartDate=${data.startDate}&EndDate=${data.endDate}`)
        if (response.status === 200) {
            return response.data
        }
    }


}

export default new ProjectService()
