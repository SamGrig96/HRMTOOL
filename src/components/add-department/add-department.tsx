import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import "../styles/input.scss"
import Button from "../button";
import { ErrorMessage } from "@hookform/error-message";
import departmentService from "services/department-service";
import notificationService from "services/notification-service";
import { useHistory } from "react-router-dom";

export type TDepartmentInfo = {
    departmentId?: number;
    departmentName?: string;
    description?: string;
    logoPath?: string;
    createdBy?: string;
    createdDate?: string;
    updatedDate?: string;
    updatedBy?: string;
    status?: number | boolean;
    logoPathId?: number;
    file?: any;
}
type Inputs = {
    name: string,
    description: string,
    status: Boolean,
    logo: string,
    picture: string
};

const AddDepartment = () => {
    const history = useHistory()
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const [imageURL, setImageURL] = useState<any>({ imgURL: "" })
    const [imagePreview, setImagePreview] = useState<boolean>(false)

    const handleFileChange = (e:any) => {
        console.log(e.target.files)
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

    const onSubmit: SubmitHandler<Inputs> = (data: any) => {
        const file: any = data.picture[0];
        if (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg') {
            if (file.size < 4194304) {
                const formData = new FormData()
                formData.append('file', file)
                departmentService.logoId(formData).then(id => {
                    if (id != null) {
                        const createData: TDepartmentInfo = {
                            departmentName: data.name,
                            description: data.description,
                            logoPathId: id.data.fileUploadResponse.fileId,
                            status: (data.status) ? 1 : 0
                        }
                        departmentService.createDepartment(createData).then(data => {
                            if (data) {
                                notificationService.info('Your department is created')
                                history.push('/departments')
                            } else {
                                notificationService.error(data.errors)
                            }
                        }
                        )
                    }
                }).catch(() => {
                    notificationService.error("Something went wrong")
                })

            } else {
                notificationService.error('The size of the picture is big')
            }
        } else {
            notificationService.error('Wrong Image format')
        }
    }

    return (
        <div className='input-container'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3>Create department</h3>
                <div className="input-title"> Department name*</div>
                <input
                    type='text'
                    {...register('name', { required: 'Please write name' })}
                />
                <ErrorMessage errors={errors} name="name" as="p" className="validation-error-massage" />
                <div className="input-title"> Department description*</div>
                <input
                    type='text'
                    {...register('description', { required: 'Please write description' })}
                />
                <ErrorMessage errors={errors} name="description" as="p" className="validation-error-massage" />
                <div>
                    <div className="input-title"> Department logo* (PNG, JPG, JPEG, max size 4MB)</div>
                    <input type='file'
                        {...register('picture', { required: "Please upload logo" })}
                        placeholder='Logo'
                        onChange={handleFileChange}
                    />
                    <div className="img-wrapper">
                        <img style={imagePreview ? { display: 'block' } : { display: "none" }}
                            src={imageURL.imgURL} className="img"
                            alt="Profile" />
                    </div>
                </div>
                <ErrorMessage errors={errors} name="picture" as="p" className="validation-error-massage" />
                <div className="input-title"> Department status</div>
                <input
                    type='checkbox'
                    {...register('status')}
                    placeholder="isActive"
                />
                <div className="combine-btn">
                    <Button className="btn-form-save" value="Create Department" />
                    <Button className="btn-form-cancel" onClick={history.goBack} value="Cancel" />
                </div>
            </form>
        </div>
    );
};

export default AddDepartment;