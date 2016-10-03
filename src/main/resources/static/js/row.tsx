import * as React from 'react';
import { IRecord } from './interfaces/IRecord';
import { Button, ButtonGroup,Glyphicon } from 'react-bootstrap';
import { ShareRecordModal } from './shareRecord';
import * as bootbox from 'bootbox';
import { IProps,IFileProps,IFolderProps } from './interfaces/RowInterfaces';


const style = {
    
}

export const Folder = (props: IProps) => {

    function rename(id: number) {
        bootbox.prompt("Enter new name", (name) => { name && props.renameRecord(id, name) });
    }
    function addTag(id: Number) {
        bootbox.prompt("Enter new tag",
            (tag) => { tag && props.addTag(id, tag) }
        );
    }

    function shareRecord(id:Number) { 
         bootbox.prompt("Enter User Name", (userName) => {
                        props.shareRecord(id, userName, 1);
                    })
    }
    if (!props.folder) {
        return (
            <FileRow name={props.name} id={props.id} rename={rename}
                trashed={props.trashed} untrashRecord={props.untrashRecord} deleteRecord={props.deleteRecord}
                addTag={addTag} tags={props.tags} removeTag={props.removeTag}
                shareRecord={shareRecord} copy={props.copy} move={props.move}></FileRow>
        );
    }
    else {
        return (
            <FolderRow name={props.name} id={props.id} rename={rename} children={props.children}
                trashed={props.trashed} untrashRecord={props.untrashRecord} deleteRecord={props.deleteRecord}
                addTag={addTag} tags={props.tags} removeTag={props.removeTag}
                shareRecord={shareRecord} move={props.move} changeParent={props.changeParent}
                ></FolderRow>
        );

    }
};

const FileRow = (props: IFileProps) => {
    let tags = <ul>  {props.tags.sort().map((tag, i) => { return <li key={i}>{tag} <Glyphicon glyph={"minus"} onClick={() => { props.removeTag(props.id, tag) } }></Glyphicon></li> })}  </ul>
    let untrashButton = props.trashed ? <Button bsSize="xsmall" onClick={() => { props.untrashRecord(props.id) } } disabled={!props.trashed}><Glyphicon glyph={"check"} />Untrash</Button> : null;
    return (
        <tr>
            <td>
                <Glyphicon glyph={"file"}/>
                {props.name}
            </td>
            <td >Children: 0</td>
            <td>{props.trashed ? "yes" : "no"}</td>
            <td>
                {tags}                
            </td>
            <td>
                <ButtonGroup>
                    <Button bsSize="xsmall" onClick={() => { window.open(`/files/${props.id}/content`); } }><Glyphicon glyph={"download-alt"}/>Download</Button>
                    <Button bsSize="xsmall" onClick={() => { props.move(props.id) } }><Glyphicon glyph={"move"}/>Move</Button>                                      
                    <Button bsSize="xsmall" onClick={() => { props.shareRecord(props.id) } }><Glyphicon glyph={"share-alt"}/>Share</Button>
                    <Button bsSize="xsmall" onClick={() => props.rename(props.id)}><Glyphicon glyph={"edit"}/>Rename</Button>                   
                    <Button bsSize="xsmall" onClick={() => { props.copy(props.id) } }><Glyphicon glyph={"duplicate"}/>Copy</Button>
                    <Button bsSize="xsmall" onClick={(e) => { props.deleteRecord(props.id, props.trashed) } }><Glyphicon glyph={"trash"}/>Delete</Button>
                    <Button bsSize="xsmall" onClick={() => { props.addTag(props.id) } }><Glyphicon glyph={"plus"} /> Add Tag</Button>
                    {untrashButton}
                </ButtonGroup>

            </td>
        </tr>
    );

}

const FolderRow = (props: IFolderProps) => {
    let tags = <ul>  {props.tags.sort().map((tag, i) => { return <li key={i}>{tag} <Glyphicon glyph={"minus"} onClick={() => { props.removeTag(props.id, tag) } }></Glyphicon></li> })}  </ul>
    let untrashButton = props.trashed ? <Button bsSize="xsmall" onClick={() => { props.untrashRecord(props.id) } } disabled={!props.trashed}><Glyphicon glyph={"check"} />Untrash</Button> : null;
    
    return (
        <tr>
            <td>
                <Glyphicon glyph={"folder-close"} />
                <label>
                    {props.name}
                </label>    
            </td>
            <td >Children: {props.children}</td>
            <td>{props.trashed ? "yes" : "no"}</td>
            <td>
                {tags}
            </td>
            <td>
                <ButtonGroup>
                    <Button bsSize="xsmall" onClick={() => props.changeParent(props.id)}><Glyphicon glyph={"folder-open"}/>Open</Button>
                    <Button bsSize="xsmall" onClick={() => { props.move(props.id) } }><Glyphicon glyph={"move"}/>Move</Button>
                    <Button bsSize="xsmall" onClick={() => { props.shareRecord(props.id) } }><Glyphicon glyph={"share-alt"}/> Share</Button>
                    <Button bsSize="xsmall"  onClick={() => props.rename(props.id)}><Glyphicon glyph={"edit"}/>Rename</Button>                    
                    <Button bsSize="xsmall" onClick={(e) => { props.deleteRecord(props.id, props.trashed) } }><Glyphicon glyph={"trash"}/>Delete</Button>
                    <Button bsSize="xsmall" onClick={() => { props.addTag(props.id) } }><Glyphicon glyph={"plus"} /> Add Tag</Button>
                    {untrashButton}
                </ButtonGroup>
            </td>
        </tr>
    );

}
