import React, {useState, useEffect} from 'react'
import "../styles/input.scss"
import {useHistory} from "react-router-dom";
import validateService from "../../services/validate-service";
import userService, {TProfilePictureData, TUser} from "../../services/user-service";
import Button from "../button";
import notificationService from "../../services/notification-service";
import departmentService, { TDepartment, TDepartmentData } from 'services/department-service'

type TEndpointInputData = {
    [key: string]: string;
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
        placeholder: ""
    },
    lastName: {
        name: "lastName",
        title: "Last name*",
        type: "text",
        defaultValue: "",
        placeholder: ""
    },
    profilePictureId: {
        name: "profilePictureId",
        title: "Profile picture (PNG, JPG, JPEG, max size 4MB)",
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
        placeholder: ""
    },
    departmentId: {
        name: "departmentId",
        title: "Department",
        type: "text",
        defaultValue: "",
        className: "container-addProject teamLead"
    },
    phoneNumber: {
        name: "phoneNumber",
        title: "Phone*",
        type: "text",
        defaultValue: "",
        placeholder: "+374 00 000 000"
    },
};

const initialInputData = {} as any;
for (let input in inputData) {
    if (inputData.hasOwnProperty(input)) {
        initialInputData[input as keyof TUser] = inputData[input].defaultValue;
    }
}

type TErrors = {
    [key: string]: string;
}

export default function AddUser() {
    const history = useHistory();
    const [errors, setErrors] = useState<TErrors>({});
    const [newUser, setNewUser] = useState<TUser>(initialInputData);
    const [file, setFile] = useState<any>({file: null})
    const [imageURL, setImageURL] = useState<any>({imgURL: ""})
    const [imagePreview, setImagePreview] = useState<boolean>(false)
    const [department, setDepartment] = useState<TDepartmentData>()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setNewUser((prevState) => ({...prevState, [name]: value}));
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
    }, [])

    const addNewUser = () => {
        const tmpErrors: TErrors = validateService.userInputValidation(newUser);
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
                                            ...newUser,
                                            profilePictureId: data.data.logoPathId.fileId,
                                            departmentId: (newUser.departmentId) ? Number(newUser.departmentId) : null
                                        }
                                         userService.addUser(tmpUser)
                                            .then((data) => {
                                                if (data.errors === null) {
                                                    notificationService.success('User successfully added')
                                                    history.push('/users');
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
                const tmpUser: TUser = {
                    ...newUser,
                    profilePictureId: null,
                    departmentId: (newUser.departmentId) ? Number(newUser.departmentId) : null
                }
                userService.addUser(tmpUser)
                    .then((data) => {
                        if (data.errors === null) {
                            notificationService.success('User successfully added')
                            history.push('/users');
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
            <h3>Create user</h3>
            {Object.keys(inputData).map((input) => {
                return (
                    <div key={inputData[input].name}>
                        <div className="input-title"> {inputData[input].title}</div>
                        {inputData[input].name === "departmentId" ?
                            <select
                                required
                                name={inputData[input].name}
                                onChange={handleChange}
                            >
                                <option>{""}</option>
                                {department?.data?.departmentsList.map((department:TDepartment) => (
                                    <option key={department.departmentId} value={department.departmentId}>{department.departmentName}</option>
                                )
                                )}
                            </select>
                            :
                            inputData[input].name === "profilePictureId" ?
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
                                        <img style={imagePreview ? { display: 'block' } : { display: "none" }}
                                            src={imageURL.imgURL}
                                             className="img"
                                            alt="Profile" />
                                    </div>
                                </div>
                            : <input
                                required
                                name={inputData[input].name}
                                placeholder={inputData[input].placeholder}
                                value={newUser[input as keyof TUser]}
                                onChange={handleChange}
                                type={inputData[input].type}
                                min={inputData[input].min}
                            />
                        }
                        <div className="validation-error-massage">{errors[inputData[input].name]}</div>
                    </div>
                );
            })}
            <div className="combine-btn">
                <Button className="btn-form-save" onClick={addNewUser} value="Save"/>
                <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel"/>
            </div>
        </div>
    )
}