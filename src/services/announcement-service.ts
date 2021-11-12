import { TPagePagination } from 'components/page-pagination/page-pagination';
import HttpService from './http-service'
import { TUser } from "./user-service";

export type TAnnouncement = {
    title?: string;
    description?: string;
    bannerPathId?: number | null;
    status?: number | boolean;
    createdDate?: string;
    createdByName?: string;
    updatedDate?: string;
    publishedDate?: string;
    id: number;
    createdByPicture?: string
}

export type TAnnouncementData = {
    data: null | {
        total: number;
        announcementsList: TUser[] | [];
    }
    errors: null | string[];
    success: boolean
}

export type TBannerData = {
    data: {
        fileUploadResponse: {
            fileId: number;
            filePath: string;
        }
    };
    errors: null | string[];
    success: boolean;
}

class AnnouncementService extends HttpService {
    addBannerEndpoint = '/FileUpload/LogoFileUpload'
    addAnnouncementEndpoint = `/Announcement`
    getAnnouncementByIdEndpoint = '/Announcement/ById'
    editAnnouncementEndpoint = `/Announcement`
    deleteAnnouncementEndpoint = `/Announcement`
    getAnnouncementPaginationEndpoint = '/Announcement'
    getPublishAnnouncementEndpoint = '/Announcement/Published'
    searchAnnouncementEndPoint = 'Announcement/Filter'
    searchUserAnnouncementEndPoint = 'Announcement/MyAnnouncementsFilter'
    publishAnnouncementUpdateEndPoint = 'Announcement/PublishAnnouncement'

    async addAnnouncementBanner(file: any) {
        const response = await this.post(this.addBannerEndpoint, file)
        if (response.status === 200) {
            return response.data
        }
    }

    async addAnnouncement(announcementData: TAnnouncement) {
        const response = await this.post(this.addAnnouncementEndpoint, announcementData, true)
        if (response.status === 200) {
            return response.data
        }
    }

    async getAnnouncementById(id: number) {
        const response = await this.get(`${this.getAnnouncementByIdEndpoint}?AnnouncementId=${id}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async editAnnouncement(data: any) {
        const response = await this.put(this.editAnnouncementEndpoint, data)
        if (response.status === 200) {
            return response.data
        }
    }

    async getAnnouncementsPagination(paginationData: TPagePagination) {
        const response = await this.get(`${this.getPublishAnnouncementEndpoint}?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async getAnnouncementsScroll(pageCount: number,paginationData: TPagePagination) {
        const response = await this.get(`${this.getPublishAnnouncementEndpoint}?PageSize=${paginationData.pageSize}&PageNumber=${pageCount}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async deleteAnnouncements(announcementId: number) {
        const response = await this.delete(this.deleteAnnouncementEndpoint, { announcementId })
        if (response.status === 200) {
            if (response.data.success) {
                return response.data
            }
        }
    }

   

    
    async getAnnouncementsWithPagination(data: string, paginationData: TPagePagination) {

        const response = await this.get(`${this.searchAnnouncementEndPoint}?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}&Name=${data}`)
        if (response.status === 200) {
            return response.data
        }
    }

    async getAnnouncementsUserWithPagination(data: string, paginationData: TPagePagination) {

        const response = await this.get(`${this.searchUserAnnouncementEndPoint}?PageSize=${paginationData.pageSize}&PageNumber=${paginationData.pageNumber}&Name=${data}`)
        if (response.status === 200) {
            return response.data
        }
    }
    async publishUpdate(announcementId:number) {
        const response = await this.post(this.publishAnnouncementUpdateEndPoint, {announcementId})
        if (response.status === 200) {
            return response.data
        }
    }
}

export default new AnnouncementService()
