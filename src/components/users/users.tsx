import React, {useCallback, useMemo} from 'react'
import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import "../styles/table.scss"
import "../styles/search.scss"
import userService from "../../services/user-service";
import PagePagination from "../page-pagination";
import Button from "../button";
import {FaEdit} from "react-icons/fa";
import {BsTrash} from "react-icons/bs";
import notificationService from "../../services/notification-service";
import utils from "../../services/utils";
import {TUser, TUserData, TSearchUserData} from "../../services/user-service";
import {TPagePagination} from "../page-pagination/page-pagination";
import departmentService, {TDepartmentData} from "../../services/department-service";
import Modal from "../modal";
import {Multiselect} from "multiselect-react-dropdown";
import Loading from 'components/loading';

export type TDepartment = {
    departmentId: number;
    departmentName: string;
    description: string;
    logoPath: string;
    createdBy: string;
    createdDate: string;
    updatedDate: string,
    updatedBy: string;
}

const initialStateUserData = {
    data: {total: 0, usersList: []},
    errors: null,
    success: false
}

const initialStateDepartmentData = {
    data: {total: 0, departmentsList: []},
    errors: null,
    success: false
}

const initialPaginationData = {
    pageSize: 5,
    pageNumber: 1
}

function Users() {
    const debounce = require('lodash.debounce');
    const [id, setId] = useState<number>(0);
    const [userData, setUserData] = useState<TUserData>(initialStateUserData);
    const [departmentData, setDepartmentData] = useState<TDepartmentData>(initialStateDepartmentData);
    const [total, setTotal] = useState<number>(0)
    const [show, setShow] = useState<boolean>(false)
    const [spinner ,setSpinner] = useState<boolean>(false)
    const [dbValue, saveToDb] = useState<TSearchUserData>({
        name: "",
        DepartmentId: "",
    });
    const [dbArr, setDbArr] = useState<number[]>([])
    const [paginationData, setPaginationData] = useState<TPagePagination>(initialPaginationData)

    const loading = (
        <div style={{ width: 200, height: 200, margin: '32px auto 0' }}>
            <Loading />
        </div>
    )

    function showModal(id: number) {
        setShow(true);
        setId(id);
    }

    const getUsers = function(searchName:string, searchDepartment:number[], paginationData:TPagePagination) {
        const toBackendFilters = {
            name: searchName,
            DepartmentId: searchDepartment
        }
        if(toBackendFilters.DepartmentId.length===0 && toBackendFilters.name.length===0){
            setSpinner(true)
            userService.getUsers(toBackendFilters, paginationData)
            .then((data: TUserData) => {
                if (data.errors === null && data.data !== null) {
                    setSpinner(false)
                    setUserData(data)
                    setTotal(data.data.total)
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
        }else{
            setSpinner(true)
            userService.getUsers(toBackendFilters, initialPaginationData)
            .then((data: TUserData) => {
                if (data.errors === null && data.data !== null) {
                    setSpinner(false)
                    setUserData(data)
                    setTotal(data.data.total)
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
        }
      
    }

    useEffect(() => {
            getUsers(dbValue.name, dbArr, paginationData)
        }
        , [paginationData,dbArr,dbValue]
    )

    useEffect(() => {
        departmentService.getDepartments()
            .then((data: TDepartmentData) => {
                if (data.errors === null && data.data !== null) {
                    setDepartmentData(data)
                } else {
                    notificationService.error(data.errors?.[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }, [])

    const onPageChange = (pageNumber: number) => {
        setPaginationData(
            {
                ...paginationData,
                pageNumber
            }
        )
    }

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                saveToDb((prevState) => ({...prevState, name: value}));
                getUsers(value, dbArr, initialPaginationData);
            }, 1000), [saveToDb, dbArr,debounce])

    const handleUserSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLSelectElement>
        ) => {
            const {value} = e.target;
            debouncedSearch(value)
        }, [debouncedSearch])

    const onSelect = (selectedList: TDepartment[]) => {
        const tmpArr = selectedList.map((item: TDepartment) => item.departmentId);
        setDbArr(tmpArr);
        getUsers(dbValue.name, tmpArr, initialPaginationData)
    }

    const onRemove = (selectedList: TDepartment[]) => {
        const tmpArr = selectedList.map((item: TDepartment) => item.departmentId);
        setDbArr(tmpArr);
        getUsers(dbValue.name, tmpArr, initialPaginationData)
    }

    function deleteUser() {
        setShow(false);
        userService.deleteUser(id)
            .then((data: TUserData) => {
                    if (data.errors === null) {
                        const tmpUsersList = userData?.data?.usersList.filter((user) => user.id !== id)
                        setTotal(total - 1)
                        if (tmpUsersList?.length) {
                            setUserData({
                                ...userData,
                                data: {
                                    total: total - 1,
                                    usersList: tmpUsersList
                                }
                            })
                        } else {
                            setUserData(initialStateUserData)
                        }
                        notificationService.success('User successfully deleted')
                    } else {
                        notificationService.error(data.errors[0])
                    }
                }
            )
            .catch(() => {
                notificationService.error("Something went wrong")
            })
    }

    return (
        <div className="table-container">
            <div className="add-button">
                <Link to={`/add-user`}>
                    <Button className="btn-add" value="+ New user"/>
                </Link>
            </div>
            <div className="search-wrapper">
                <span className='search-span'>Search by name or email</span>
                <input
                    className="search-item"
                    name="name"
                    type="search"
                    onChange={handleUserSearch}
                />
                <span className='search-span'>Search by department</span>
                <Multiselect
                    options={departmentData?.data?.departmentsList}
                    displayValue='departmentName'
                    onSelect={onSelect}
                    onRemove={onRemove}
                />
            </div>

            <table>
                <thead>
                <tr>
                    <th>#</th>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Username</th>
                    <th>Profile picture</th>
                    <th>E-mail</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Created at</th>
                    <th colSpan={2}>Actions</th>
                </tr>
                </thead>
                <tbody>{spinner?null:<>
                    {userData?.data?.usersList.map((user: TUser, index: number) => (
                    <tr key={user.id}>
                        <td>{index + 1}</td>
                        <td>{user.firstName}</td>
                        <td>{user.lastName}</td>
                        <td>{user.userName}</td>
                        <td>
                            <div>
                            {user.profilePicturePath && <img
                                    src={(`${user.profilePicturePath}`)}
                                    className="table_img"
                                    alt="User"/>}
                            </div>
                        </td>
                        <td>{user.defaultEmail}</td>
                        <td>{user.phoneNumber}</td>
                        <td>{user.departmentName}</td>
                        <td>{(user.createDate) ? utils.dateFormatUTCToLocal(user.createDate) : null}</td>
                        <td>
                            <Link to={`/edit-user/${user.id}?`}>
                                <FaEdit className="faEdit" title="Edit"/>
                            </Link>
                        </td>
                        <td>
                            <BsTrash className="bsTrash" title="Delete" onClick={() => {
                                showModal(user.id)
                            }}/>
                        </td>
                    </tr>
                ))}
                </>}
                
                </tbody>
            </table>


            <div className="pagination"    style={ spinner ? { display:'none'} : {display : 'block'} }  >
                <PagePagination
                    totalRecords={total}
                    paginationData={paginationData}
                    paginatePage={onPageChange}
                />
            </div><br />

            <div className="total-number" >
                Total number is {total}.
            </div>
            {spinner?loading:null}
            <Modal show={show} closeModal={() => setShow(false)} deleteRow={deleteUser}/>
        </div>
    )
}

export default Users