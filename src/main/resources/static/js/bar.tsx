import * as React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import * as bootbox from 'bootbox';


interface IProps{
    home: Function;
    addRecord: Function;
    parent: Number;
    upload: Function;
    getSharedRecords:Function
    paste(id: Number, parent: Number, type: string):void;
    op: { id: Number, type: string };
}

export const Navbar = (props:IProps) => {
    return (
        <ButtonGroup>
            <Button onClick={() => {
                props.home()
            } }>Return to Home</Button>
            <Button onClick={() => {
                bootbox.prompt('Enter name of the folder',
                    function(name) {
                        name && props.addRecord(name, props.parent, true);
                    }
                )          
                
            } }> Add Folder </Button>
            <Button onClick={() => { props.upload() } }>Add File</Button>
            <Button onClick={() => { props.paste(props.op.id, props.parent, props.op.type) } }>Paste</Button>
            <Button onClick={()=>{props.getSharedRecords()}}>Shared Files</Button>
        </ButtonGroup>
    );
}