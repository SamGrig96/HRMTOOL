import React, {useEffect, useState} from 'react'
import projectService, {TLogoData, TProject} from "../../services/project-service"
import {useHistory, useParams} from "react-router-dom"
import Button from "../button";
import "../styles/input.scss"
import notificationService from "../../services/notification-service";
import ValidateService from "../../services/validate-service";
import utils from "../../services/utils";
import  userService, { TUserData, TUser} from "../../services/user-service";


type TProjectData = {
    data: {
        getProjectResponse: TProject
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
    projectName: {
        name: "projectName",
        title: "Project name*",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    description: {
        name: "description",
        title: "Project description*",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    teamLead: {
        name: "teamLead",
        title: "Team lead*",
        type: "text",
        defaultValue: "",
        className: "container-addProject teamLead",
        selected: "",
    },
    logoPathId: {
        name: "logoPathId",
        title: "Project logo* (PNG, JPG, JPEG, max size 4MB)",
        type: "file",
        defaultValue: "",
        placeholder: "",
        className: "container-addProject logoPathId",
    },
    startDate: {
        name: "startDate",
        title: "Start date",
        type: "datetime-local",
        defaultValue: "",
        placeholder: "",
    },
    endDate: {
        name: "endDate",
        title: "End date",
        type: "datetime-local",
        defaultValue: "",
        placeholder: "",
    },
};

type TErrors = {
    [key: string]: string;
}

type TParams = {
    id: string;
};

export default function EditProject() {
    const {id} = useParams<TParams>();
    const history = useHistory();
    const [errors, setErrors] = useState<TErrors>({});
    const [file, setFile] = useState<any>({file: null})
    const [imageURL, setImageURL] = useState<any>({imgURL: ""})
    const [userData, setUserData] = useState<TUserData>({
        data: {total: 0, usersList: []},
        errors: null,
        success: false
    });
    const [projectData, setProjectData] = useState<any>({
            projectId: 0,
            projectName: "",
            description: "",
            logoPathId: 0,
            logoPath: "",
            startDate: "",
            endDate: "",
            teamLead: "",
            teamLeadId: 0,
            createdDate: "",
            createdBy: "",
            updatedDate: "",
            updatedBy: "",
        }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setProjectData((prevState: TProject) => ({...prevState, [name]: value}));
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

    useEffect(() => {
        const userId: number = Number(id);
        projectService.getProjectById(userId)
            .then((data: TProjectData) => {
                if (data.errors === null) {
                    setProjectData({
                        ...data.data.getProjectResponse,
                        startDate: (data.data.getProjectResponse.startDate) ? utils.changeDateFormatForInput(utils.dateFormatUTCToLocal(data.data.getProjectResponse.startDate)) : null,
                        endDate: (data.data.getProjectResponse.endDate) ? utils.changeDateFormatForInput(utils.dateFormatUTCToLocal(data.data.getProjectResponse.endDate)) : null,
                    })
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, [id]);

    useEffect(() => {
        userService.getAllUsersForProject()
            .then((data: TUserData) => {
                if (data.errors === null && data.data !== null) {
                    setUserData(data)
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, [])

    const editUser = () => {
        const tmpErrors: TErrors = ValidateService.projectInputValidation(projectData);
        setErrors(tmpErrors);
        if (Object.keys(tmpErrors).length === 0) {
            if (file.name) {
                if (file.size < 4e6) {
                    if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
                        const formData = new FormData()
                        formData.append('file', file)
                        projectService.addLogoId(formData)
                            .then((data: TLogoData) => {
                                    if (data.errors === null) {
                                        const tmpProject: TProject = {
                                            ...projectData,
                                            logoPathId: data.data.logoPathId.fileId,
                                            startDate: (projectData.startDate) ? utils.dateFormatLocalToUTC(projectData.startDate) : null,
                                            endDate: (projectData.endDate) ? utils.dateFormatLocalToUTC(projectData.endDate) : null,
                                        }
                                        projectService.editProject(tmpProject)
                                            .then((data: TProjectData) => {
                                                if (data.errors === null) {
                                                    notificationService.success('Project successfully updated')
                                                    history.push('/projects')
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
                const tmpProject: any = {
                    ...projectData,
                    startDate: (projectData.startDate) ? utils.dateFormatLocalToUTC(projectData.startDate) : null,
                    endDate: (projectData.endDate) ? utils.dateFormatLocalToUTC(projectData.endDate) : null,
                    teamLeadId: Number(projectData.teamLead),
                }
                projectService.editProject(tmpProject)
                    .then((data: TProjectData) => {
                        if (data.errors === null) {
                            notificationService.success('Project successfully updated')
                            history.push('/projects')
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
            <h3>Edit project</h3>
            {Object.keys(inputData).map((input) => {
                    return (
                        <div key={inputData[input].name}>
                            <div className="input-title"> {inputData[input].title}</div>
                            {inputData[input].name === "teamLead" ?
                                <select
                                    name={inputData[input].name}
                                    onChange={handleChange}
                                >
                                    <option>{""}</option>
                                    {userData?.data?.usersList.map((user: TUser) => (
                                            (user.userName === projectData.teamLead) ?
                                                <option key={user.id} value={user.id} selected>{user.userName} </option> :
                                                <option key={user.id} value={user.id}>{user.userName}</option>
                                        )
                                    )}
                                </select>
                                : inputData[input].name === "description" ?
                                    <textarea
                                        required
                                        name={inputData[input].name}
                                        value={projectData[input as keyof TProject]}
                                        className={inputData[input].className}
                                        onChange={handleChange}
                                    />
                                    : inputData[input].name === "logoPathId" ?
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
                                                    src={imageURL.imgURL ? imageURL.imgURL : (`http://${projectData.logoPath}`)}
                                                    className="img"
                                                    alt="Project logo"/>
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <input
                                                required
                                                name={inputData[input].name}
                                                placeholder={inputData[input].placeholder}
                                                value={projectData[input as keyof TProject] || ""}
                                                onChange={handleChange}
                                                type={inputData[input].type}
                                                disabled={inputData[input].disabled}
                                            />
                                        </div>
                            }
                            <div className="errorMassage">{errors[inputData[input].name]}</div>
                        </div>
                    );
                }
            )
            }

            <div>
                <div><span>Creation date:</span>
                    {(projectData.createdDate) ? utils.dateFormatUTCToLocal(projectData.createdDate) : null}
                </div>
                <div><span>Created by:</span> {projectData.createdBy}</div>
                <div>
                    <span>Update date:</span>{(projectData.updatedDate) ? utils.dateFormatUTCToLocal(projectData.updatedDate) : null}
                </div>
                <div><span>Updated by:</span> {projectData.updatedBy}</div>
            </div>

            <Button className="btn-form-save" onClick={editUser} value="Save"/>
            <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel"/>
        </div>
    )
}

