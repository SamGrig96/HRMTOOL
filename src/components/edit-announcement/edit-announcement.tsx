import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from "react-router-dom"
import Button from "../button";
import "../styles/input.scss"
import notificationService from "../../services/notification-service";
import ValidateService from "../../services/validate-service";
import utils from "../../services/utils";
import announcementService, {TAnnouncement, TBannerData} from "../../services/announcement-service";
import EditorContainer from "../editor/editor";
import {convertToRaw, EditorState} from "draft-js";
import draftToHtml from "draftjs-to-html";

type TAnnouncementData = {
    data: {
        getAnnouncementResponse: TAnnouncement
    };
    errors?: null | string[];
    success?: boolean
}
type TEndpointInputData = {
    [key: string]: any;
}
type TInputData = {
    [key: string]: TEndpointInputData;
}
const inputData: TInputData = {
    title: {
        name: "title",
        title: "Title*",
        type: "text",
        defaultValue: "",
        placeholder: "",
    },
    bannerPathId: {
        name: "bannerPathId",
        title: "Banner (PNG, JPG, JPEG, max size 4MB)",
        type: "file",
        defaultValue: "",
        placeholder: "",
    },
    description: {
        name: "description",
        title: "Description*",
        type: "text",
        defaultValue: "",
        placeholder: "",
    },
   
};
type TErrors = {
    [key: string]: string;
}
export type TParams = {
    id: string;
};
export default function EditAnnouncement() {
    //editor state
    const stateFromHTML = require('draft-js-import-html').stateFromHTML;

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const {id} = useParams<TParams>();
    const history = useHistory();
    const [errors, setErrors] = useState<TErrors>({});
    const [file, setFile] = useState<any>({file: null})
    const [imageURL, setImageURL] = useState<any>({imgURL: ""})
    const [announcement, setAnnouncement] = useState<any>({
            announcementId: 0,
            bannerPathId: 0,
            title: "",
            description: "",
            bannerPath: "",
            createdByName: "",
            publishedDate: "",
        }
    )
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setAnnouncement((prevState: TAnnouncement) => ({...prevState, [name]: value}));
    };

    const handleFileChange = (e: any) => {
        let reader = new FileReader();
        setFile(e.target.files[0])
        reader.onload = () => {
            setImageURL({
                imgURL: reader.result
            })
        };
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
    }
  
    const onEditorStateChange = (editorState: EditorState) => {
        setEditorState(editorState)
        setAnnouncement((prevState: any) => ({
            ...prevState,
            description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }))
    }

    useEffect(() => {
        const announcementId: number = Number(id);
        announcementService.getAnnouncementById(announcementId)
            .then((data: TAnnouncementData) => {
                if (data.errors === null) {
                    setAnnouncement(data.data.getAnnouncementResponse)
                    
                    setEditorState(EditorState.createWithContent(stateFromHTML(data.data.getAnnouncementResponse.description)))
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, [id,stateFromHTML]);

    const editAnnouncement = () => {
        const tmpErrors: TErrors = ValidateService.announcementInputValidation(announcement);
        setErrors(tmpErrors);
        if (Object.keys(tmpErrors).length === 0) {
            if (file.name) {
                if (file.size < 4e6) {
                    if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
                        const formData = new FormData()
                        formData.append('file', file)
                        announcementService.addAnnouncementBanner(formData)
                            .then((data: TBannerData) => {
                                    if (data.errors === null) {
                                        const tmpAnnouncement: TAnnouncement = {
                                            ...announcement,
                                            announcementId: announcement.id,
                                            bannerPathId: data.data.fileUploadResponse.fileId,
                                        }
                                        announcementService.editAnnouncement(tmpAnnouncement)
                                            .then((data: TAnnouncementData) => {
                                                if (data.errors === null) {
                                                    notificationService.success('Announcement successfully updated')
                                                    history.push('/announcements')
                                                } else {
                                                    notificationService.error(data.errors?.[0])
                                                }
                                            })
                                            .catch(() => {
                                                notificationService.error("Something went wrong")
                                            })
                                    } else {
                                        notificationService.error(data.errors?.[0])
                                    }
                                }
                            ).catch(() => {
                                notificationService.error("Something went wrong")
                            }
                        )
                    } else {
                        notificationService.error('Invalid picture format')
                    }
                } else {
                    notificationService.error('Invalid picture size')
                }
            } else {
                const tmpAnnouncement: TAnnouncement = {
                    ...announcement,
                    announcementId: announcement.id,
                }
                announcementService.editAnnouncement(tmpAnnouncement)
                    .then((data: TAnnouncementData) => {
                        if (data.errors === null) {
                            notificationService.success('Announcement successfully updated')
                            history.push('/announcements')
                        } else {
                            notificationService.error(data.errors?.[0])
                        }
                    })
                    .catch(() => {
                        notificationService.error("Something went wrong")
                    })
            }
        }
    }
    return (
        <div className="input-container">
            <h3>Edit announcement</h3>
            {Object.keys(inputData).map((input) => {
                    return (
                        <div key={inputData[input].name}>
                            <div> {inputData[input].title}</div>
                            {
                                inputData[input].name === "bannerPathId" ?
                                    <div>
                                        <input
                                            required
                                            name={inputData[input].name}
                                            placeholder={inputData[input].placeholder}
                                            className={inputData[input].className}
                                            onChange={handleFileChange}
                                            type={inputData[input].type}
                                            min={inputData[input].min}
                                        />
                                        <div className="img-wrapper">
                                            {announcement.bannerPath &&   <img
                                                src={imageURL.imgURL ? imageURL.imgURL : announcement.bannerPath}
                                                className="img"
                                                alt="Project logo"/>}
                                        </div>
                                    </div>
                                  
                                    : inputData[input].name === "description" ?
                                        <div>
                                            <EditorContainer
                                                editorState={editorState}
                                                setEditorState={setEditorState}
                                                onEditorStateChange={onEditorStateChange}
                                            />
                                        </div> :
                                        <input
                                            required
                                            name={inputData[input].name}
                                            placeholder={inputData[input].placeholder}
                                            value={announcement[input as keyof TAnnouncement] || ""}
                                            className={inputData[input].className}
                                            onChange={handleChange}
                                            type={inputData[input].type}
                                            min={inputData[input].min}
                                        />
                            }
                            <div className="errorMassage">{errors[inputData[input].name]}</div>
                        </div>
                    );
                }
            )
            }
            <div>
                <div><span>Creation date:</span>
                    {(announcement.createdDate) ? utils.dateFormatUTCToLocal(announcement.createdDate) : null}
                </div>
                <div><span>Created by:</span> {announcement.createdByName}</div>
                <div>
                    <span>Update date:</span>{(announcement.updatedDate) ? utils.dateFormatUTCToLocal(announcement.updatedDate) : null}
                </div>
                <div><span>Publication date:</span>
                    {(announcement.publishedDate) ? utils.dateFormatUTCToLocal(announcement.publishedDate) : null}
                </div>
            </div>
            <Button className="btn-form-save" onClick={editAnnouncement} value="Save"/>
            <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel"/>
        </div>
    )
}