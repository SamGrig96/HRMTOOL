import React, {useState, useEffect} from 'react'
import "../styles/input.scss"
import {useHistory} from "react-router-dom";
import validateService from "../../services/validate-service";
import projectService, {TProject, TLogoData} from "../../services/project-service";
import Button from "../button";
import notificationService from "../../services/notification-service";
import utils from "../../services/utils";
import userService, {TUserData, TUser} from "../../services/user-service";

type TEndpointInputData = {
    [key: string]: string;
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
        placeholder: "",
        className: "container-addProject projectName"
    },
    description: {
        name: "description",
        title: "Project description*",
        defaultValue: "",
        placeholder: "",
        className: "container-addProject description",
    },
    teamLead: {
        name: "teamLead",
        title: "Team lead",
        type: "text",
        defaultValue: "",
        className: "container-addProject teamLead"
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
        className: "container-addProject startDate"
    },
    endDate: {
        name: "endDate",
        title: "End date",
        type: "datetime-local",
        defaultValue: "",
        placeholder: "",
        className: "container-addProject endDate"
    },
};

const initialInputData = {} as any;
for (let input in inputData) {
    if (inputData.hasOwnProperty(input)) {
        initialInputData[input as keyof TProject] = inputData[input].defaultValue;
    }
}

type TErrors = {
    [key: string]: string;
}

export default function AddProject() {
    const history = useHistory();
    const [errors, setErrors] = useState<TErrors>({});
    const [newProject, setNewProject] = useState<TProject>(initialInputData);
    const [file, setFile] = useState<any>({file: null})
    const [imageURL, setImageURL] = useState<any>({imgURL: ""})
    const [imagePreview, setImagePreview] = useState<boolean>(false)
    const [userData, setUserData] = useState<TUserData>({
        data: {total: 0, usersList: []},
        errors: null,
        success: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setNewProject((prevState) => ({...prevState, [name]: value}));
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

    const addNewProject = () => {
        const tmpErrors: TErrors = validateService.projectInputValidation(newProject);
        if (imageURL.imgURL !== "") {
            setErrors(
                tmpErrors
            );
        } else {
            setErrors({
                    ...tmpErrors,
                    logoPathId: "Project logo is required!",
                }
            )
        }

        if (Object.keys(tmpErrors).length === 0 && imageURL.imgURL !== "") {
            if (file.size < 4e6) {
                if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
                    const formData = new FormData()
                    formData.append('file', file)
                    projectService.addLogoId(formData)
                        .then((data: TLogoData) => {
                                if (data.errors === null) {
                                    const tmpProject: TProject = {
                                        ...newProject,
                                        logoPathId: data.data.logoPathId.fileId,
                                        startDate: (newProject.startDate) ? utils.dateFormatLocalToUTC(newProject.startDate) : null,
                                        endDate: (newProject.endDate) ? utils.dateFormatLocalToUTC(newProject.endDate) : null,
                                        teamLeadId: (newProject.teamLead) ? Number(newProject.teamLead) : null,
                                    }
                                    projectService.addProject(tmpProject)
                                        .then((data) => {
                                            if (data.errors === null) {
                                                notificationService.success('Project successfully added')
                                                history.push('/projects');
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
        }
    }

    return (
        <div className="input-container">
            <h3>Create project</h3>
            {Object.keys(inputData).map((input) => {
                    return (
                        <div key={inputData[input].name}>
                            <div className="input-title"> {inputData[input].title}</div>
                            {inputData[input].name === "teamLead" ?
                                <select
                                    required
                                    name={inputData[input].name}
                                    onChange={handleChange}
                                >
                                    <option>{""}</option>
                                    {userData?.data?.usersList.map((user: TUser) => (
                                            <option key={user.id} value={user.id}>{user.userName}</option>
                                        )
                                    )}
                                </select>
                                : inputData[input].name === "description" ?
                                    <textarea
                                        required
                                        name={inputData[input].name}
                                        value={newProject[input as keyof TProject] || ""}
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
                                                    style={imagePreview ? {display: 'block'} : {display: "none"}}
                                                     src={imageURL.imgURL}
                                                     className="img"
                                                     alt="Project logo"/>
                                            </div>
                                        </div>
                                        :
                                        <input
                                            required
                                            name={inputData[input].name}
                                            placeholder={inputData[input].placeholder}
                                            value={newProject[input as keyof TProject] || ""}
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
                <Button className="btn-form-save" onClick={addNewProject} value="Save"/>
                <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel"/>
            </div>
        </div>
    )
}