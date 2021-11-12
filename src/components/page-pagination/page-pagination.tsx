import React from 'react'
import './styles.scss';

export interface TPagePagination {
    pageSize: number;
    pageNumber: number;
}

function PagePagination({paginationData, totalRecords, paginatePage}:any) {
    const pages = [];
    for (let i = 1; i <= Math.ceil(totalRecords / paginationData.pageSize); i++) {
        pages.push(i);
    }




    return(
        <ul className="pagination-wrapper">
            {pages.map((number:number) => (
                <span key={number} onClick={()=> paginatePage(number)} className="page-item">
                        {number}
                </span>
            ))}
        </ul>

    )
}

export default PagePagination