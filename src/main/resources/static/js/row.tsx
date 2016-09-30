import * as React from 'react';
import { IRecord } from './interfaces/IRecord';
import { Button, ButtonGroup,Glyphicon } from 'react-bootstrap';
import { ShareRecordModal } from './shareRecord';
import * as bootbox from 'bootbox';



interface IProps {
    id: number;
    name: string;
    folder: Boolean;
    trashed: Boolean;
    children: number;
    tags: string[];
    changeParent(id: Number): void;
    deleteRecord(id: Number, trashed: Boolean): void;
    renameRecord(id: Number, newName: String): void;
    untrashRecord(id: number): void;
    addTag(id: Number, tag: String): void;
    removeTag(id: Number, tag: String): void;
    shareRecord(id: Number, userName: String, permission: Number): void;
    copy(id: Number): void;
    move(id: Number): void;
}

interface IFileProps {
    name:string
    id: Number;
    rename(id: Number): void;
    trashed: Boolean;
    untrashRecord(id: Number): void;
    deleteRecord(id: Number, trashed: Boolean): void;
    addTag(id: Number): void;
    tags: String[];
    removeTag(id: Number, tag: String): void;
    copy(id: Number): void;
    move(id: Number): void;
    shareRecord(id: Number): void;
}

interface IFolderProps {
    name:string
    id: Number;
    rename(id: Number): void;
    children: Number;
    trashed: Boolean;
    untrashRecord(id: Number): void;
    deleteRecord(id: Number, trashed: Boolean): void;
    addTag(id: Number): void;
    tags: String[];
    removeTag(id: Number, tag: String): void;
    move(id: Number): void;
    shareRecord(id: Number): void;
    changeParent(id: Number): void;
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
    let tags = <ul>  {props.tags.sort().map((tag, i) => {return <li key={i}>{tag} <Glyphicon glyph={"minus"} onClick={() => { props.removeTag(props.id, tag) } }></Glyphicon></li> })}  </ul>
    return (
        <tr>
            <td>
                <Glyphicon glyph={"file"}/>
                {props.name}
            </td>
            <td >Children: 0</td>
            <td onClick={() => props.trashed && props.untrashRecord(props.id)}>{props.trashed ? "yes" : "no"}</td>
            <td>
                {tags}                
            </td>
            <td>
                <ButtonGroup>
                    <Button bsSize="xsmall" onClick={() => { props.move(props.id) } }>Move</Button>                                      
                    <Button bsSize="xsmall" onClick={() => { props.shareRecord(props.id) } }>Share</Button>
                    <Button bsSize="xsmall" onClick={() => props.rename(props.id)}>Rename</Button>
                    <a href={`/files/${props.id}/content`} target={'_blank'}> <Button bsSize="xsmall" >Download</Button></a>
                    <Button bsSize="xsmall" onClick={() => { props.copy(props.id) } }>Copy</Button>
                    <Button bsSize="xsmall" onClick={(e) => { props.deleteRecord(props.id, props.trashed) } }>Delete</Button>
                    <Button bsSize="xsmall" onClick={() => { props.addTag(props.id) } }><Glyphicon glyph={"plus"}/> Add Tag</Button>
                </ButtonGroup>

            </td>
        </tr>
    );

}

const FolderRow = (props: IFolderProps) => {
    let tags = <ul>  {props.tags.sort().map((tag, i) => { return <li key={i}>{tag} <Glyphicon glyph={"minus"} onClick={() => { props.removeTag(props.id, tag) } }></Glyphicon></li> })}  </ul>
    return (
        <tr>
            <td>
                <Glyphicon glyph={"folder-close"} />
                <label>
                    {props.name}
                </label>    
            </td>
            <td >Children: {props.children}</td>
            <td onClick={() => props.trashed && props.untrashRecord(props.id)}>{props.trashed ? "yes" : "no"}</td>
            <td>
                {tags}
            </td>
            <td>
                <ButtonGroup>
                    <Button bsSize="xsmall" onClick={() => { props.move(props.id) } }>Move</Button>
                    <Button bsSize="xsmall" onClick={() => { props.shareRecord(props.id) } }>Share</Button>
                    <Button bsSize="xsmall"  onClick={() => props.rename(props.id)}>Rename</Button>
                    <Button bsSize="xsmall" onClick={() => props.changeParent(props.id)}>Open</Button>
                    <Button bsSize="xsmall" onClick={(e) => { props.deleteRecord(props.id, props.trashed) } }>Delete</Button>
                    <Button bsSize="xsmall" onClick={() => { props.addTag(props.id) } }><Glyphicon glyph={"plus"}/> Add Tag</Button>
                </ButtonGroup>
            </td>
        </tr>
    );

}
