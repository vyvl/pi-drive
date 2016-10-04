import * as React from 'react';
import { Button, ButtonGroup,Glyphicon } from 'react-bootstrap';
import * as bootbox from 'bootbox';
import { IUser } from './interfaces/IUser';
import * as actionsCreators from './actionCreators';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
interface IProps{
    doFetch: Function;
    addRecord: Function;
    parent: Number;
    fileUploadModal: Function;
    getSharedRecords:Function
    getTrashedRecords:Function
    paste(id: Number, parent: Number, type: string):void;
    op: { id: Number, type: string };
    user: IUser;
}

let actions = {
    doFetch: actionsCreators.doFetch,
    addRecord: actionsCreators.addRecord,
    getSharedRecords: actionsCreators.getSharedRecords,
    getTrashedRecords: actionsCreators.getTrashedRecords,
    paste: actionsCreators.paste,
    fileUploadModal : actionsCreators.fileUploadModal
}

export const Navbar = (props: IProps) => {
    let paste = (props.op.id && props.parent) ? <Button onClick={() => { props.paste(props.op.id, props.parent, props.op.type) } }><Glyphicon glyph={"paste"}/>Paste</Button> : null;
    let addFolder = (props.parent) ? <Button onClick={() => {
        bootbox.prompt('Enter name of the folder',
            function (name) {
                name && props.addRecord(name, props.parent, true);
            }
        )
                
    } }> <Glyphicon glyph={"folder-open"}/> Add Folder </Button> : null;
    let addFile = (props.parent) ? <Button onClick={() => { props.fileUploadModal() } }><Glyphicon glyph={"upload"}/>Add File</Button> : null;
    return (
        <ButtonGroup bsClass={"pull-right "}>
            <Button onClick={() => {
                props.doFetch()
            } }><Glyphicon glyph={"level-up"}/>Return to Home</Button>
            {addFolder}
            {addFile}
            {paste}
            <Button onClick={() => { props.getSharedRecords() } }><Glyphicon glyph={"share"}/>Shared Files</Button>
            <Button onClick={() => { props.getTrashedRecords() } }><Glyphicon glyph={"trash"}/>Trashed Files</Button>
            <Button onClick={() => { window.location.href = "/logout" } }> <Glyphicon glyph={"off"}/>Log Out<sup> {props.user.username}</sup></Button>
        </ButtonGroup>
    );
}

const mapStateToProps = (state:any) => {
    return {
        parent: state.parent,
        op: state.op,
        user:state.user
    }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return bindActionCreators(actions, dispatch);
}

export const Bar = connect(mapStateToProps, mapDispatchToProps)(Navbar);