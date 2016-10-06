import * as React from 'react';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import * as bootbox from 'bootbox';
import IUser from './interfaces/IUser';
import {IState} from './interfaces/IState';
import * as actionsCreators from './actionCreators';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
interface IProps {
    parent: number;
    op: { id: number, type: string };
    user: IUser;
    doFetch: Function;
    addRecord: Function;   
    fileUploadModal: Function;
    getSharedRecords: Function
    getTrashedRecords: Function
    paste(id: number, parent: number, type: string): void;

}

const actions = {
    doFetch: actionsCreators.doFetch,
    addRecord: actionsCreators.addRecord,
    getSharedRecords: actionsCreators.getSharedRecords,
    getTrashedRecords: actionsCreators.getTrashedRecords,
    paste: actionsCreators.paste,
    fileUploadModal: actionsCreators.fileUploadModal
}

const mapStateToProps = (state: IState) => {
    return {
        parent: state.parent,
        op: state.op,
        user: state.user
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return bindActionCreators(actions, dispatch);
}


export const Navbar = (props: IProps) => {
    let createFolder = () => {
        bootbox.prompt('Enter name of the folder',
            function (name) {
                name && props.addRecord(name, props.parent, true);
            }
        )
    }
    let paste = (props.op.id && props.parent) ? <Button onClick={() => { props.paste(props.op.id, props.parent, props.op.type) } }><Glyphicon glyph={"paste"} />Paste</Button> : null;
    let addFolder = (props.parent) ? <Button onClick={() => { createFolder() } }> <Glyphicon glyph={"folder-open"} /> Add Folder </Button> : null;
    let addFile = (props.parent) ? <Button onClick={() => { props.fileUploadModal() } }><Glyphicon glyph={"upload"} />Add File</Button> : null;
    return (
        <ButtonGroup className="pull-right ">
            <Button onClick={() => { props.doFetch() } }><Glyphicon glyph={"level-up"} />Return to Home</Button>
            {addFolder}
            {addFile}
            {paste}
            <Button onClick={() => { props.getSharedRecords() } }><Glyphicon glyph={"share"} />Shared Files</Button>
            <Button onClick={() => { props.getTrashedRecords() } }><Glyphicon glyph={"trash"} />Trashed Files</Button>
            <Button onClick={() => { window.location.href = "/logout" } }> <Glyphicon glyph={"off"} />Log Out<sup> {props.user.username}</sup></Button>
        </ButtonGroup>
    );
}


export const Bar = connect(mapStateToProps, mapDispatchToProps)(Navbar);