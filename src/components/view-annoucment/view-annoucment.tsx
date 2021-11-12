import { useState } from "react";
import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import announcementService, { TAnnouncement } from "services/announcement-service";
import notificationService from "services/notification-service";
import { TParams } from "components/edit-announcement/edit-announcement";
import Button from "../button";
import utils from "services/utils";
import './styles.scss';


const AnnoucmentView = () => {
    type TAnnouncementData = {
        data: {
            getAnnouncementResponse: TAnnouncement
        };
        errors?: null | string[];
        success?: boolean
    }

    const { id } = useParams<TParams>();
    const history = useHistory();
    const [announcement, setAnnouncement] = useState<any>({
        projectId: 0,
        bannerPathId: 0,
        title: "",
        description: "",
        bannerPath: "",
        createdByName: "",
        publishedDate: "",
    }
    )
    function createMarkup() {
        return { __html: announcement.description };
    }

    useEffect(() => {
        const announcementId: number = Number(id);
        announcementService.getAnnouncementById(announcementId)
            .then((data: TAnnouncementData) => {
                if (data.errors === null) {
                    setAnnouncement({
                        ...data.data.getAnnouncementResponse,
                    })
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch((error) => {
                notificationService.error("Something went wrong")
            })
    }, [id]);

    return (
        <div className="input-container">
            <h1>Annoucment View</h1>
            <div>
                <label>Banner</label>
                <p>{announcement.bannerPath &&
                    <img className="table_img view-image" src={(`${announcement.bannerPath}`)} alt="logo" />}</p>
                <label>Title</label>
                <p>{announcement.title}</p>
                <label>Description</label>
                <div dangerouslySetInnerHTML={createMarkup()} />
                <label>CreatedBy</label>
                <p className='announcmente-image'>{announcement.createdByPicture &&
                    <img className="view-image" src={(`${announcement.createdByPicture}`)} alt="logo" />}</p>
                {announcement.publishedDate && (
                    <>
                        <label>publishedAt</label>
                        <p>{(announcement.publishedDate) ? utils.dateFormatUTCToLocal(announcement.publishedDate) : null}</p>
                    </>
                )}
            </div>
            <Button className="btn-form-cancel" onClick={history.goBack} value="Back" />
        </div>
    )
}
export default AnnoucmentView