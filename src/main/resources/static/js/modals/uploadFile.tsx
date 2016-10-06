import * as React from 'react';
import { Modal, FormControl, Button } from 'react-bootstrap';

interface IProps{
    show: boolean;
    hide: Function;
    uploadFile: Function;
    parent:Number
}

export const UploadModal = (props:IProps) => {
    let file:File = null;
    return (
        <Modal show={props.show} onHide={props.hide}>
            <Modal.Header closeButton>
                Upload your file
            </Modal.Header>
            <Modal.Body>
                <FormControl type="file" placeholder="Upload File" onChange={(e) => { file = (e.target as HTMLInputElement).files[0];}}/>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => { props.uploadFile(props.parent, file); props.hide();}}>Upload</Button>
            </Modal.Footer>
        </Modal>
    );
}