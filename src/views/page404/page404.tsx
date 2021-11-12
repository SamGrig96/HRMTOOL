import React from 'react'

import './styles.scss'


const Page404 = () => (
    <div className='page-404'>
        <div className='page-404_content'>
            <h2 className='page-404_content_title'>Oops! You're lost!</h2>
            <p className='page-404_content_description'>The page you are looking for was not found.</p>
            <a className='page-404_content_button' href='/'>Back to home</a>
        </div>
    </div>
)

export default Page404
