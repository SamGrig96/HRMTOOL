import { useEffect, useState } from 'react'
import { useHistory, useParams } from "react-router-dom"
import Button from "../button";
import "../styles/input.scss"
import { useForm } from "react-hook-form";
import notificationService from "../../services/notification-service";
import departmentService, { TDepartment } from 'services/department-service';

type TDepartmentData = {
    data: {
        getDepartmentResponse: TDepartment
    };
    errors?: null | string[];
    success?: boolean
}

type TParams = {
    id: string;
};

const EditDepartment = () => {
    const { id } = useParams<TParams>();
    const [imageURL, setImageURL] = useState<any>({ imgURL: "" })
    const { register, handleSubmit, reset } = useForm<TDepartment>();
    const [imagePreview, setImagePreview] = useState<boolean>(false)
    const [department, setDepartment] = useState<TDepartment>({
        file: '',
        logoPathId: 0,
        logoPath: '',
        departmentName: '',
        description: '',
        status: false,
        departmentId: 0,
    })
    const history = useHistory();

    const handleFileChange = (e: any) => {
        let reader = new FileReader();
        reader.onload = () => {
            setImageURL({
                ...imageURL,
                imgURL: reader.result
            })
        };
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
            setImagePreview(true)
        }
    }

    const onSubmit = (data: TDepartment) => {
        //@ts-ignore
        if (data.file.length > 0) {
            //@ts-ignore
            if ((data.file[0].type === "image/png" || data.file[0].type === "image/jpg" || data.file[0].type === "image/jpeg") && data.file[0].size < 4e6) {
                const reader = new FileReader();
                //@ts-ignore
                const file: any = data.file[0];
                reader.readAsDataURL(file)
                const formData = new FormData()
                formData.append('file', file)
                departmentService.logoId(formData).then((logoData) => {
                    if (logoData.errors === null) {
                        const tmpData: TDepartment = {
                            departmentId: department.departmentId,
                            departmentName: data.departmentName,
                            description: data.description,
                            logoPathId: logoData.data.fileUploadResponse.fileId,
                            status: (data.status) ? 1 : 0
                        }
                        if (data.departmentName?.length !== 0 && data.description?.length !== 0) {
                            departmentService.editDepartment(tmpData).then(() => {
                                notificationService.success('Department is Changes')
                                history.push('/departments')
                            }
                            )
                        } else {
                            notificationService.error('Department Name or Description is Empty ')
                        }

                    }
                })
            } else {
                notificationService.error('Wrong format image')
            }
        } else {
            const tmpData: TDepartment = {
                departmentId: department.departmentId,
                departmentName: data.departmentName,
                description: data.description,
                logoPathId: department.logoPathId,
                status: (data.status) ? 1 : 0
            }
            if (data.departmentName?.length !== 0 && data.description?.length !== 0) {
                departmentService.editDepartment(tmpData).then((changedata: TDepartmentData) => {
                    if (changedata.success) {
                        notificationService.info('Department is Changes')
                        history.push('/departments')
                    }
                }).catch(() => {
                    notificationService.error("Something went wrong")
                })
            } else { notificationService.error('Department Name or Description is Empty ') }
        }
    }
    useEffect(() => {
        const userId: number = Number(id);
        departmentService.getDepartmentById(userId)
            .then((data: TDepartmentData) => {
                if (data.errors === null) {
                    reset(data?.data?.getDepartmentResponse)
                    setDepartment(data?.data?.getDepartmentResponse)
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, [id, reset]);

    return (
        <div className="input-container">
            <div className='edit-department'>
                <h3>Edit Department</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="input-title">Department name*</div>
                    <input type='text' {...register("departmentName")} />
                    <div className="input-title">Department description*</div>
                    <input type='text' {...register("description")} />
                    <div>
                        <div className="input-title">Department logo* (PNG, JPG, JPEG, max size 4MB)</div>
                        <input {...register("file")}
                            type='file'
                            onChange={handleFileChange}
                        />
                        <div className="img-wrapper">
                           {department.logoPath && <img
                                src={imagePreview ? `${imageURL.imgURL}` : `${department.logoPath}`}
                                className="img"
                                alt="Department"
                            />}
                        </div>
                    </div>
                    <div className="input-title">Department status</div>
                    <input {...register("status")} type='checkbox' />
                    <div className="combine-btn">
                        <Button className="btn-form-save" value="Save" />
                        <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel" />
                    </div>
                </form>
            </div>
        </div>
    )
}
export default EditDepartment