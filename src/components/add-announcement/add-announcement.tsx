import React, {useState} from 'react'
import EditorContainer from "../editor/editor"
import "../styles/input.scss"
import Button from "../button";
import {useHistory} from "react-router-dom";
import validateService from "../../services/validate-service";
import announcementService, {TBannerData, TAnnouncement} from "../../services/announcement-service";
import notificationService from "../../services/notification-service";
import {convertToRaw, EditorState} from 'draft-js';
import draftToHtml from "draftjs-to-html";

type TEndpointInputData = {
    [key: string]: string;
}

type TInputData = {
    [key: string]: TEndpointInputData;
}

type TErrors = {
    [key: string]: string;
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
    status: {
        name: "status",
        title: "Publish status",
        type: "checkbox",
    },
};

const initialInputData = {} as any;
for (let input in inputData) {
    if (inputData.hasOwnProperty(input)) {
        initialInputData[input as keyof TAnnouncement] = inputData[input].defaultValue;
    }
}

export default function AddAnnouncement() {
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const history = useHistory();
    const [errors, setErrors] = useState<TErrors>({});
    const [newAnnouncement, setNewAnnouncement] = useState<any>(initialInputData);
    const [file, setFile] = useState<File>()
    const [imageURL, setImageURL] = useState<any>({imgURL: ""})
    const [imagePreview, setImagePreview] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setNewAnnouncement((prevState: TAnnouncement) => ({...prevState, [name]: value}));
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
            setImagePreview(true)
        }
    }

    const handleCheckboxChange = (e: any) => {
        const {checked} = e.target;
        setNewAnnouncement((prevState: any) => ({...prevState, status: checked ? 1 : 0}))
    }

    const onEditorStateChange = (editorState: any) => {
        setEditorState(editorState)
        setNewAnnouncement((prevState: any) => ({
            ...prevState,
            description: draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }))
    }

    const addNewAnnouncement = () => {
        const tmpErrors: TErrors = validateService.announcementInputValidation(newAnnouncement);
        setErrors(tmpErrors);
        if (Object.keys(tmpErrors).length === 0) {
            if (file?.name) {
                if (file.size < 4e6) {
                    if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
                        const formData = new FormData()
                        formData.append('file', file)
                        announcementService.addAnnouncementBanner(formData)
                            .then((data: TBannerData) => {
                                    if (data.errors === null) {
                                        const tmpAnnouncement: TAnnouncement = {
                                            ...newAnnouncement,
                                            bannerPathId: data.data.fileUploadResponse.fileId,
                                            status: newAnnouncement.status ? newAnnouncement.status : 0,
                                        }
                                        announcementService.addAnnouncement(tmpAnnouncement)
                                            .then((data) => {
                                                if (data.errors === null) {
                                                    notificationService.success('Announcement successfully created')
                                                    history.push('/announcements');
                                                } else {
                                                    notificationService.error(data.errors[0])
                                                }
                                            })
                                            .catch(() => {
                                                notificationService.error("Something went wrong")
                                            })
                                    } else {
                                        notificationService.error(data.errors?.[0])
                                    }
                                }
                            )
                            .catch(() => {
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
                    ...newAnnouncement,
                    bannerPathId: null,
                    status: newAnnouncement.status ? newAnnouncement.status : 0,
                }
                announcementService.addAnnouncement(tmpAnnouncement)
                    .then((data) => {
                        if (data.errors === null) {
                            notificationService.success('Announcement successfully created')
                            history.push('/announcements');
                        } else {
                            notificationService.error(data.errors[0])
                        }
                    })
                    .catch(() => {
                        notificationService.error("Something went wrong")
                    })

            }
        }
    };

    return (
        <div className="input-container">
            <h3>Create announcement</h3>
            {Object.keys(inputData).map((input) => {
                    return (
                        <div key={inputData[input].name}>
                            <div className="input-title"> {inputData[input].title}</div>
                            {inputData[input].name === "bannerPathId" ?
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
                                        <img
                                            style={imagePreview ? {display: 'block'} : {display: "none"}}
                                            src={imageURL.imgURL}
                                            className="img"
                                            alt="Project logo"/>
                                    </div>
                                </div>
                                : inputData[input].name === "status" ?
                                    <input
                                        type={inputData[input].type}
                                        name={inputData[input].name}
                                        value={newAnnouncement[input as keyof TAnnouncement] || ""}
                                        className={inputData[input].className}
                                        onChange={handleCheckboxChange}
                                    />
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
                                            value={newAnnouncement[input as keyof TAnnouncement] || ""}
                                            className={inputData[input].className}
                                            onChange={handleChange}
                                            type={inputData[input].type}
                                            min={inputData[input].min}
                                        />
                            }
                            <div className="validation-error-massage">{errors[inputData[input].name]}</div>
                        </div>
                    );
                }
            )}
            <div className="combine-btn">
                <Button className="btn-form-save" onClick={addNewAnnouncement} value="Save"/>
                <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel"/>
            </div>
        </div>
    )
}
