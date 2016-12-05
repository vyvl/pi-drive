import * as React from "react";
import { Modal, FormControl, Button } from "react-bootstrap";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import { IState } from "../interfaces/IState";
import * as actionCreators from "../actionCreators";
interface IProps {
    show: boolean;
    hide(): any;
    uploadFile(parent: number, file: File): any;
    parent: number;
}

export const UploadModal = (props: IProps) => {
    let file: File = null;
    return (
        <Modal show={props.show} onHide={props.hide}>
            <Modal.Header closeButton>
                Upload your file
            </Modal.Header>
            <Modal.Body>
                <FormControl type="file" placeholder="Upload File" onChange={(e) => { file = (e.target as HTMLInputElement).files[0]; } } />
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => { props.uploadFile(props.parent, file); props.hide(); } }>Upload</Button>
            </Modal.Footer>
        </Modal>
    );
};

const mapStateToProps = (state: IState) => {
    return {
        parent: state.parent,
        show: state.modals.upload
    };
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        "uploadFile": bindActionCreators(actionCreators.uploadFile, dispatch),
        "hide": bindActionCreators(actionCreators.closeFileUploadModal, dispatch)
    };
};
export const Upload = connect(mapStateToProps, mapDispatchToProps)(UploadModal);