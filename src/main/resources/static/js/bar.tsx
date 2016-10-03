import * as React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import * as bootbox from 'bootbox';


interface IProps{
    doFetch: Function;
    addRecord: Function;
    parent: Number;
    fileUploadModal: Function;
    getSharedRecords:Function
    getTrashedRecords:Function
    paste(id: Number, parent: Number, type: string):void;
    op: { id: Number, type: string };
}

export const Navbar = (props: IProps) => {
    let paste = (props.op.id) ? <Button onClick={() => { props.paste(props.op.id, props.parent, props.op.type) } }>Paste</Button> : null;
    return (
        <ButtonGroup bsClass={"pull-right"}>
            <Button onClick={() => {
                props.doFetch()
            } }>Return to Home</Button>
            <Button onClick={() => {
                bootbox.prompt('Enter name of the folder',
                    function(name) {
                        name && props.addRecord(name, props.parent, true);
                    }
                )          
                
            } }> Add Folder </Button>
            <Button onClick={() => { props.fileUploadModal() } }>Add File</Button>
            {paste}
            <Button onClick={() => { props.getSharedRecords() } }>Shared Files</Button>
            <Button onClick={() => { props.getTrashedRecords() } }>Trashed Files</Button>
            <Button onClick={() => { window.location.href = "/logout" } }>Log Out</Button>
        </ButtonGroup>
    );
}