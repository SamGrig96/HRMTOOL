
import './styles.scss';

function Modal({ show, closeModal, deleteRow }: any) {
    return (
        <div className='modal-style' style={{ display: show ? "block" : "none" }}>
            <div className="modal-wrapper visible" data-keyboard="false" data-backdrop="static" style={{ display: show ? "block" : "none" }}>
                <div className="modal-content">
                    <div className="modal-body">
                        <p>Sure you want to delete?</p>
                    </div>
                    <div className="modal-footer">
                        <button onClick={deleteRow} className="btn-confirm">Yes</button>
                        <button onClick={closeModal} className="btn-cancel">No</button>
                    </div>
                </div>
            </div>
        </div>
    )


}

export default Modal
