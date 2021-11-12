import React, {useEffect, useState} from 'react'
import userService, {TProfilePictureData, TUser} from "../../services/user-service"
import {useHistory, useParams} from "react-router-dom"
import Button from "../button";
import "../styles/input.scss"
import notificationService from "../../services/notification-service";
import ValidateService from "../../services/validate-service";
import utils from "../../services/utils";
import departmentService, {TDepartment, TDepartmentData} from 'services/department-service';

type TUserData = {
    data: {
        getUserByIdResponse: TUser
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
    firstName: {
        name: "firstName",
        title: "First name*",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    lastName: {
        name: "lastName",
        title: "Last name*",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    userName: {
        name: "userName",
        title: "Username*",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    profilePictureId: {
        name: "profilePictureId",
        title: "Profile picture* (PNG, JPG, JPEG, max size 4MB)",
        type: "file",
        defaultValue: "",
        placeholder: "",
        className: "container-addUser logoPathId",
    },
    defaultEmail: {
        name: "defaultEmail",
        title: "E-mail*",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    email: {
        name: "email",
        title: "Personal e-email",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    departmentId: {
        name: "departmentId",
        title: "Department*",
        type: "text",
        defaultValue: "",
        className: "container-addProject teamLead"
    },
    phoneNumber: {
        name: "phoneNumber",
        title: "Phone*",
        type: "text",
        defaultValue: "",
        disabled: false,
        placeholder: "",
    },
    password: {
        name: "password",
        title: "Password",
        type: "password",
        defaultValue: "",
        disabled: false,
        placeholder: "* * * * * * * *",
    },
};

type TErrors = {
    [key: string]: string;
}

type TParams = {
    id: string;
};

export default function EditUser() {
    const {id} = useParams<TParams>();
    const [department, setDepartment] = useState<TDepartmentData>()
    let history = useHistory();
    const [errors, setErrors] = useState<TErrors>({});
    const [file, setFile] = useState<any>({file: null})
    const [imageURL, setImageURL] = useState<any>({imgURL: ""})
    const [userData, setUserData] = useState<TUser>({
            id: 0,
            firstName: "",
            lastName: "",
            userName: "",
            defaultEmail: "",
            email: "",
            phoneNumber: "",
            password: "",
            createDate: "",
            departmentId: 0,
            departmentName: ''
        }
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setUserData((prevState: TUser) => ({...prevState, [name]: value}));
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
        userService.getUser(userId)
            .then((data: TUserData) => {
                departmentService.getDepartments()
                    .then((data: TDepartmentData) => {
                        if (data.errors === null && data.data !== null) {
                            setDepartment(data)
                        } else {
                            notificationService.error(data.errors?.[0])
                        }
                    })
                    .catch(() => {
                        notificationService.error("Something went wrong")
                    })
                if (data.errors === null) {
                    setUserData(data.data.getUserByIdResponse)
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, [id]);

    const editUser = () => {
        const tmpErrors: TErrors = ValidateService.userInputValidation(userData);
        setErrors(tmpErrors);
        if (Object.keys(tmpErrors).length === 0) {
            if (file.name) {
                if (file.size < 4e6) {
                    if (file.type === "image/png" || file.type === "image/jpg" || file.type === "image/jpeg") {
                        const formData = new FormData()
                        formData.append('file', file)
                        userService.addProfilePictureId(formData)
                            .then((data: TProfilePictureData) => {
                                    if (data.errors === null) {
                                        const tmpUser: TUser = {
                                            ...userData,
                                            profilePictureId: data.data.logoPathId.fileId,
                                            departmentId: Number(userData.departmentId),
                                        }
                                        userService.editUser(tmpUser)
                                            .then((data: TUserData) => {
                                                if (data.errors === null) {
                                                    notificationService.success('User data is successfully updated')
                                                    history.push('/users')
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
                const tmpProject: TUser = {
                    ...userData,
                    departmentId: Number(userData.departmentId),
                }
                userService.editUser(tmpProject)
                    .then((data: TUserData) => {
                        if (data.errors === null) {
                            notificationService.success('User successfully updated')
                            history.push('/users')
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
            <h3>Edit user</h3>
            {Object.keys(inputData).map((input) => {
                return (
                    <div key={inputData[input].name}>
                        <div className="input-title"> {inputData[input].title}</div>
                        {inputData[input].name === "departmentId" ?
                            <select
                                name={inputData[input].name}
                                onChange={handleChange}
                            >
                                <option>{""}</option>
                                {department?.data?.departmentsList.map((department: TDepartment) => (
                                        (department.departmentName === userData.departmentName) ?
                                            <option key={department.departmentId} value={department.departmentId}
                                                    selected>{department.departmentName} </option> :
                                            <option key={department.departmentId}
                                                    value={department.departmentId}>{department.departmentName}</option>
                                    )
                                )}
                            </select>
                            : inputData[input].name === "profilePictureId" ?
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
                                            src={imageURL.imgURL ? imageURL.imgURL : (`http://${userData.profilePicturePath}`)}
                                            className="img"
                                            alt="Project logo"/>
                                    </div>
                                </div>
                                :
                                <input
                                    required
                                    name={inputData[input].name}
                                    placeholder={inputData[input].placeholder}
                                    value={userData[input as keyof TUser] || ''}
                                    onChange={handleChange}
                                    type={inputData[input].type}
                                    disabled={inputData[input].disabled}
                                />
                        }
                        <div className="errorMassage">{errors[inputData[input].name]}</div>
                    </div>
                );
            })}
            <div>
                <div><span>Creation date:</span>
                    {(userData.createDate) ? utils.dateFormatUTCToLocal(userData.createDate) : null}
                </div>
            </div>
            <Button className="btn-form-save" onClick={editUser} value="Save"/>
            <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel"/>
        </div>
    )
}

