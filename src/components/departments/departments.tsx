import React from 'react'
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/table.scss"
import "../styles/search.scss"
import departmentService, { TDepartment, TDepartmentData } from 'services/department-service';
import Button from "../button";
import { FaEdit } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import notificationService from "../../services/notification-service";
import utils from 'services/utils';
import PagePagination from 'components/page-pagination';
import Modal from "../modal";
import { TPagePagination } from "../page-pagination/page-pagination";
import Loading from 'components/loading';

const debounce = require('lodash.debounce');
const initialStateUserData = {
    data: { total: 0, departmentsList: [] },
    errors: null,
    success: false
}

const initialPaginationData = {
    pageSize: 5,
    pageNumber: 1
}

const Departments = () => {
    const [departmentData, setDepartmentData] = useState<TDepartmentData>(
        initialStateUserData
    );
    const [show, setShow] = useState<boolean>(false)
    const [id, setId] = useState<number>(0);
    const [total, setTotal] = useState<number>(0)
    const [dbValue, saveToDb] = useState<string>('');
    const [spinner, setSpinner] = useState<boolean>(false)
    const [paginationData, setPaginationData] = useState<TPagePagination>(initialPaginationData)

    const loading = (
        <div style={{ width: 200, height: 200, margin: '32px auto 0' }}>
            <Loading />
        </div>
    )
    const showModal = (id: number) => {
        setShow(true);
        setId(id);
    }


    const updateQuery = () => sendQuery(dbValue);

    const sendQuery = (query: string) => {
        if (dbValue.length === 0) {
            setSpinner(true)
            departmentService.getDepartmentsWithPagination(query, paginationData)
                .then((data: TDepartmentData) => {
                    if (data.errors === null && data.data !== null) {
                        setSpinner(false)
                        setDepartmentData(data)
                        setTotal(data.data.total)
                    } else {
                        notificationService.error(data.errors?.[0])
                    }
                })
                .catch(() => {
                    notificationService.error("Something went wrong")
                })
        } else {
            setSpinner(true)
            departmentService.getDepartmentsWithPagination(query, initialPaginationData)
                .then((data: TDepartmentData) => {
                    if (data.errors === null && data.data !== null) {
                        setSpinner(false)
                        setDepartmentData(data)
                        setTotal(data.data.total)
                    } else {
                        notificationService.error(data.errors?.[0])
                    }
                })
                .catch(() => {
                    notificationService.error("Something went wrong")
                })
        }

    };

    //eslint-disable-next-line
    const delayedQuery = useCallback(debounce(updateQuery, 1000), [dbValue, paginationData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        saveToDb(e.target.value);
    };
    useEffect(() => {
        delayedQuery();
        return delayedQuery.cancel;
    }, [dbValue, delayedQuery]);


    const onPageChange = (pageNumber: number) => {
        setPaginationData(
            {
                ...paginationData,
                pageNumber
            }
        )
    }

    const deleteDepartment = () => {
        setShow(false);
        departmentService.deleteDepartment(id)
            .then((data: TDepartmentData) => {
                if (data.errors === null) {
                    const tmpUsersList = departmentData?.data?.departmentsList.filter((user) => user.departmentId !== id)
                    setTotal(total - 1)
                    if (tmpUsersList?.length) {
                        setDepartmentData({
                            ...departmentData,
                            data: {
                                total: total - 1,
                                departmentsList: tmpUsersList
                            }
                        })
                    } else {
                        setDepartmentData(initialStateUserData)
                    }

                } else {
                    notificationService.error(data.errors[0])
                }
            })
            .catch(() => {
                notificationService.error("Something went wrong")
            })

    }
    return (
        <div className="table-container">
            <div className='add-button'>
                <Link to={`/add-department`}>
                    <Button className="btn-add" value="+ New Department" />
                </Link>
            </div>

            <div className="search-wrapper">
                <span className='search-span'>Search by name</span>
                <input
                    className="search-item"
                    name="search"
                    type="search"
                    onChange={handleChange}
                />
            </div>

            <table className="users-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Department</th>
                        <th>Logo</th>
                        <th>createdAt</th>
                        <th>createdBy</th>
                        <th>updatedAt</th>
                        <th>updatedBy</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>{spinner ? null : <>
                    {departmentData?.data?.departmentsList.map((department: TDepartment, index: number) => (
                        <tr key={department.departmentId}>
                            <td>{index + 1}</td>
                            <td>{department.departmentName}</td>
                            <td>
                                {department.logoPath && <img className="table_img" src={(`${department.logoPath}`)} alt="logo" />}
                            </td>
                            <td> {(department.createdDate) ? utils.dateFormatUTCToLocal(department.createdDate) : null}</td>
                            <td>{department.createdBy}</td>
                            <td>{(department.updatedDate) ? utils.dateFormatUTCToLocal(department.updatedDate) : null}</td>
                            <td>{department.updatedBy}</td>
                            <td>
                                <Link to={`/edit-department/${department.departmentId}`}>
                                    <FaEdit className="faEdit" title="Edit" />
                                </Link>
                            </td>
                            <td style={{ cursor: 'pointer' }}>
                                <BsTrash className="bsTrash" title="Delete" onClick={() => {
                                    showModal(department.departmentId)
                                }} />
                            </td>
                        </tr>
                    ))}
                </>}
                 
                </tbody>
            </table>
            <div className="pagination" style={spinner ? { display: 'none' } : { display: 'block' }}>
                <PagePagination
                    totalRecords={total}
                    paginationData={paginationData}
                    paginatePage={onPageChange}
                />
            </div><br />
            <div className="total-number">
                Total number of Department is {total}.
            </div>
            {spinner ? loading : null}
            <Modal show={show} closeModal={() => setShow(false)} deleteRow={deleteDepartment} />
        </div>
    )
}

export default Departments