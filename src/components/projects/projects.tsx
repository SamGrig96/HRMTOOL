import { useEffect, useState, useCallback, useMemo } from 'react'
import "../styles/table.scss"
import "../styles/search.scss"
import { TProject, TProjectData } from "../../services/project-service";
import projectService from "../../services/project-service";
import notificationService from "../../services/notification-service";
import { Link } from "react-router-dom";
import Button from "../button";
import { BsTrash } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import utils from "../../services/utils";
import Modal from "../modal";
import PagePagination from "../page-pagination";
import { TPagePagination } from "../page-pagination/page-pagination";
import Loading from 'components/loading';

interface HandleChangeInterface {
    target: HTMLInputElement;
}

interface TSearchData {
    name: string;
    startDate: string;
    endDate: string;
}

const initialStateProjectData = {
    data: { total: 0, projectsList: [] },
    errors: null,
    success: false
}

const initialPaginationData = {
    pageSize: 5,
    pageNumber: 1
}

function Projects() {
    const debounce = require('lodash.debounce');
    const [id, setId] = useState<number>(0);
    const [total, setTotal] = useState<number>(0)
    const [projectData, setProjectData] = useState<TProjectData>(initialStateProjectData);
    const [show, setShow] = useState<boolean>(false);
    const [dbValue, saveToDb] = useState<TSearchData>({
        name: "",
        startDate: "",
        endDate: "",
    });
    const [paginationData, setPaginationData] = useState<TPagePagination>(initialPaginationData)
    const [spinner, setSpinner] = useState<boolean>(false)

    const loading = (
        <div style={{ width: 200, height: 200, margin: '32px auto 0' }}>
            <Loading />
        </div>
    )
    function showModal(id: number) {
        setShow(true);
        setId(id);
    }

    const getProjects = function (projectSearchData: any, paginationData: TPagePagination) {
        const toBackendFilters = {
            name: projectSearchData.name,
            startDate: (projectSearchData.startDate ? utils.dateFormatLocalToUTC(projectSearchData.startDate) : ""),
            endDate: (projectSearchData.endDate ? utils.dateFormatLocalToUTC(projectSearchData.endDate) : ""),
        }
        if (!toBackendFilters.name.length && !toBackendFilters.startDate.length && !toBackendFilters.endDate.length) {
            setSpinner(true)
            projectService.searchProject(toBackendFilters, paginationData)
                .then((data: TProjectData) => {
                    if (data.errors === null && data.data !== null) {
                        setSpinner(false)
                        setProjectData(data);
                        setTotal(data.data.total)
                    } else {
                        notificationService.error(data.errors?.[0])
                    }
                }
                )
                .catch(() => {
                    notificationService.error("Something went wrong")
                })
        } else {
            setSpinner(true)
            projectService.searchProject(toBackendFilters, initialPaginationData)
                .then((data: TProjectData) => {
                    if (data.errors === null && data.data !== null) {
                        setSpinner(false)
                        setProjectData(data);
                        setTotal(data.data.total)
                    } else {
                        notificationService.error(data.errors?.[0])
                    }
                }
                )
                .catch(() => {
                    notificationService.error("Something went wrong")
                })
        }

    }

    const debouncedSearch = useMemo(
        () =>
            debounce((value: any) => {
                saveToDb((prevState: any) => ({
                    ...prevState,
                    name: value.name,
                    startDate: value.startDate,
                    endDate: value.endDate
                }));
                getProjects(value, initialPaginationData)
            }
                , 1000), [saveToDb, debounce]
    )

    const handleProjectSearch = useCallback(
        (e: HandleChangeInterface) => {
            const { name, value } = e.target;
            debouncedSearch({ ...dbValue, [name]: value })
        }, [debouncedSearch, dbValue])

    const onPageChange = (pageNumber: number) => {
        setPaginationData(
            {
                ...paginationData,
                pageNumber
            }
        )
    }

    useEffect(() => {
        getProjects(dbValue, paginationData)

    }, [paginationData, debounce, dbValue])


    function deleteProject() {
        setShow(false);
        projectService.deleteProject(id)
            .then((data: TProjectData) => {
                if (data.errors === null) {
                    const tmpProjectsList = projectData?.data?.projectsList.filter((project) => project.projectId !== id)
                    setTotal(total - 1)
                    if (tmpProjectsList?.length) {
                        setProjectData({
                            ...projectData,
                            data: {
                                total: total - 1,
                                projectsList: tmpProjectsList
                            }
                        })
                    } else {
                        setProjectData(initialStateProjectData)
                    }
                    notificationService.success('Project successfully deleted')
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
                <Link to={`/add-project`}>
                    <Button className="btn-add" value="+ New project" />
                </Link>
            </div>
            <div className="search-wrapper">
                <span className='search-span'>Search by name</span>
                <input
                    className="search-item"
                    name="name"
                    type="search"
                    onChange={handleProjectSearch}
                />
                <span className='search-span'>Search by date</span>
                <input
                    className="search-item"
                    name="startDate"
                    type="datetime-local"
                    onChange={handleProjectSearch}
                />
                <input
                    className="search-item"
                    name="endDate"
                    type="datetime-local"
                    onChange={handleProjectSearch}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Logo</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Team lead</th>
                        <th>Created at</th>
                        <th>Created by</th>
                        <th>Updated at</th>
                        <th>Updated by</th>
                        <th colSpan={2}>Actions</th>
                    </tr>
                </thead>
                <tbody>{spinner ? null : <>
                    {projectData?.data?.projectsList.map((project: TProject, index: number) => (
                        <tr key={project.projectId}>
                            <td>{index + 1}</td>
                            <td>{project.projectName}</td>
                            <td>
                                <img className="table_img" src={project.logoPath} alt="Project logo" />
                            </td>
                            <td>{(project.startDate) ? utils.dateFormatUTCToLocal(project.startDate) : null}</td>
                            <td>{(project.endDate) ? utils.dateFormatUTCToLocal(project.endDate) : null}</td>
                            <td>{project.teamLead}</td>
                            <td>{(project.createdDate) ? utils.dateFormatUTCToLocal(project.createdDate) : null}</td>
                            <td>{project.createdBy}</td>
                            <td>{(project.updatedDate) ? utils.dateFormatUTCToLocal(project.updatedDate) : null}</td>
                            <td>{project.updatedBy}</td>
                            <td>
                                <Link to={`/edit-project/${project.projectId}?`}>
                                    <FaEdit className="faEdit" title="Edit" />
                                </Link>
                            </td>
                            <td>
                                <BsTrash className="bsTrash" title="Delete" onClick={() => {
                                    showModal(project.projectId)
                                }} />
                            </td>
                        </tr>
                    ))}
                </>}

                </tbody>
            </table>

            <div className="pagination" style={ spinner ? { display:'none'} : {display : 'block'} }>
                <PagePagination
                    totalRecords={total}
                    paginationData={paginationData}
                    paginatePage={onPageChange}
                /><br />
            </div>

            <div className="total-number">
                Total number of projects is {total}.
            </div>
            {spinner ? loading : null}
            <Modal show={show} closeModal={() => setShow(false)} deleteRow={deleteProject} />
        </div>
    )
}

export default Projects
