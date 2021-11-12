import React from 'react';
import {convertToRaw} from 'draft-js';
import {Editor} from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// import './styles.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const EditorContainer =({editorState, onEditorStateChange}:any) => {

    // handleKeyCommand(command:any, editorState:any) {
    //     const newState = RichUtils.handleKeyCommand(editorState, command);
    //
    //     if (newState) {
    //         this.onEditorStateChange(newState);
    //         return 'handled';
    //     }
    //
    //     return 'not-handled';
    // }

    // uploadImageCallBack(file:any) {
    //     return new Promise(
    //         (resolve, reject) => {
    //             const xhr = new XMLHttpRequest();
    //             xhr.open('POST', 'https://api.imgur.com/3/image');
    //             xhr.setRequestHeader('Authorization', 'Client-ID 917ef1c53d1ec30');
    //             const data = new FormData();
    //             data.append('image', file);
    //             xhr.send(data);
    //             xhr.addEventListener('load', () => {
    //                 const response = JSON.parse(xhr.responseText);
    //                 resolve({data: {link: response.url}})
    //             });
    //             xhr.addEventListener('error', () => {
    //                 const error = JSON.parse(xhr.responseText);
    //                 reject(error);
    //             });
    //         }
    //     );
    // }

        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={onEditorStateChange}
                    placeholder="Type here . . ."
                />
                <textarea
                    disabled
                    value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
                />
            </div>
        )
    }

export default EditorContainer