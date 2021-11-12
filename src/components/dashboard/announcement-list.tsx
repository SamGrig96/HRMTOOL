import { Link } from "react-router-dom";
import { useState, useRef } from 'react'
import announcementService from 'services/announcement-service'
import './styles.scss'
import InfiniteScroll from "react-infinite-scroller";
import { TPagePagination } from "components/page-pagination/page-pagination";



export type TAnnouncement = {
    title?: string;
    description?: string;
    bannerPathId?: number | null;
    status?: number | boolean;
    createdDate?: string;
    createdByName?: string;
    updatedDate?: string;
    publishedDate?: string;
    id: number;
    createdByPicture?: string
}

const initialPaginationData = {
    pageSize: 5,
    pageNumber: 1
}


const AnnouncementList = () => {
    const [responseData, setResponseData] = useState<ReadonlyArray<TAnnouncement>>([]);
    const scrollerRef = useRef<HTMLElement | null>(null);
    const [paginationData] = useState<TPagePagination>(initialPaginationData)

    const loadMore = (page: number) => {
        announcementService.getAnnouncementsScroll(page,paginationData)
            .then(res => { setResponseData([...responseData, ...res.data.announcementsList]) })
    };
    return (
        <div className="dashboard">
            <div className='announcement-section'>
                <div className='header'> <h1>Annoucment list!</h1></div>
                <div>
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={responseData.length < 5.1}
                        loader={
                            <div className="loader" key={0}>
                                Loading ...
                            </div>
                        }
                        useWindow={false}
                        getScrollParent={() => scrollerRef.current}
                    >

                        {responseData.map((data: any, index: number) => (
                            <Link className='link-section' to={`/announcements/${data.id}`} key={index} >
                                <div className='info-section' key={index} >
                                    <div className='left-content'>{data.createdByName} <br />{data.title}
                                    </div>
                                    <div className='rigth-content'>{data.createdByPicture && <img className="table_img" src={(`${data.createdByPicture}`)}
                                        title={`${data.createdByName}`}
                                        alt='logo' />}</div>
                                </div></Link>
                        ))}
                    </InfiniteScroll>
                </div>

            </div >
        </div >

    )
}

export default AnnouncementList