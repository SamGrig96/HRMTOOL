import './styles.scss'

const Account = (props: any) => {

    return (
        <div className='account' style={{ display: props.show ? 'block' : 'none' }}>
            <div className="account_section_title">My Account</div>
            <div className="account_section">
            <button className={`account_section_item ${window.location.pathname ? 'active' : ''}`} onClick={props.editProfile} >
                    <span>Edit Profile</span>
                </button>
                <button className={`sidebar_section_item ${window.location.pathname ? 'active' : ''}`} onClick={props.logOut} >
                    <span>LogOut</span>
                </button>
                
            </div>

        </div>
    )
}

export default Account