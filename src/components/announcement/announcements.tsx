import React from 'react'
import { useState, useEffect, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import "./styles.scss"
import "../styles/table.scss"
import "../styles/search.scss"
import Button from "../button";
import { FaEdit } from "react-icons/fa";
import { BsTrash } from "react-icons/bs";
import notificationService from "../../services/notification-service";
import utils from 'services/utils';
import PagePagination from 'components/page-pagination';
import Modal from "../modal";
import announcementService, { TAnnouncementData } from 'services/announcement-service';
import { TPagePagination } from 'components/page-pagination/page-pagination';
import Loading from 'components/loading';
import { TAnnouncement } from 'components/dashboard/announcement-list';

const debounce = require('lodash.debounce');

const initialStateAnnouncementData = {
    data: { total: 0, announcementsList: [] },
    errors: null,
    success: false
}

const initialPaginationData = {
    pageSize: 5,
    pageNumber: 1
}

const Announcements = () => {

    const [announcement, setAnnouncement] = useState<TAnnouncementData>(
        initialStateAnnouncementData
    );
    const history = useHistory()
    const [show, setShow] = useState<boolean>(false)
    const [id, setId] = useState<number>(0);
    const [total, setTotal] = useState<number>(0)
    const [dbValue, saveToDb] = useState<string>('');
    const [paginationData, setPaginationData] = useState<TPagePagination>(initialPaginationData)
    const [spinner, setSpinner] = useState<boolean>(false)

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
            announcementService.getAnnouncementsPagination(paginationData)
                .then((data: TAnnouncementData) => {
                    if (data.errors === null && data.data !== null) {
                        setSpinner(false)
                        setAnnouncement(data)
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
            announcementService.getAnnouncementsUserWithPagination(query, initialPaginationData)
                .then((data: TAnnouncementData) => {
                    if (data.errors === null && data.data !== null) {
                        setSpinner(false)
                        setAnnouncement(data)
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
    }, [dbValue, delayedQuery, paginationData]);



    const onPageChange = (pageNumber: number) => {
        setPaginationData(
            {
                ...paginationData,
                pageNumber
            }
        )
    }

    const deleteAnnouncements = () => {
        setShow(false);
        announcementService.deleteAnnouncements(id)
            .then((data: TAnnouncementData) => {
                if (data.errors === null) {
                    const tmpUsersList = announcement?.data?.announcementsList.filter((user) => user.id !== id)
                    setTotal(total - 1)
                    if (tmpUsersList?.length) {
                        setAnnouncement({
                            ...announcement,
                            data: {
                                total: total - 1,
                                announcementsList: tmpUsersList
                            }
                        })
                    } else {
                        setAnnouncement(initialStateAnnouncementData)
                    }
                    notificationService.success('Announcement successfully deleted')
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

            <div className='button-section'>
                <Button className="btn-add" value="Go Back" onClick={history.goBack} />
                <Link to={`/add-announcement`}>
                    <Button className="btn-add" value="+ New Announcement" />
                </Link>
                <Link to={`/my-announcement`}>
                    <Button className="btn-add" value="My Announcements" />
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
                        <th>Created Pciture</th>
                        <th>Announcements</th>
                        <th>createdAt</th>
                        <th>createdBy</th>
                        <th>Publish Date</th>
                        <th>updatedAt</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>{spinner ? null : <>
                    {announcement?.data?.announcementsList.map((announcements: TAnnouncement, index: number) => (
                        <tr key={announcements.id}>
                            <td>{index + 1}</td>
                            <td>  {announcements.createdByPicture ? <img className="table_img" src={(`${announcements.createdByPicture}`)} alt="logo" /> : null}</td>
                            <td>
                                {announcements.title}
                            </td>
                            <td> {(announcements.createdDate) ? utils.dateFormatUTCToLocal(announcements.createdDate) : null}</td>
                            <td>{announcements.createdByName}</td>
                            <td>{(announcements.publishedDate) ? utils.dateFormatUTCToLocal(announcements.publishedDate) : null}</td>
                            <td>{(announcements.updatedDate) ? utils.dateFormatUTCToLocal(announcements.updatedDate) : null}</td>
                            <td>
                                <Link to={`/edit-announcement/${announcements.id}`}>
                                    <FaEdit className="faEdit" title="Edit" />
                                </Link>
                            </td>
                            <td style={{ cursor: 'pointer' }}>
                                <BsTrash className="bsTrash" title="Delete" onClick={() => {
                                    showModal(announcements.id)
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
                Total number of Announcements is {total}.
            </div>
            {spinner ? loading : null}
            <Modal show={show} closeModal={() => setShow(false)} deleteRow={deleteAnnouncements} />
        </div>
    )
}

export default Announcements