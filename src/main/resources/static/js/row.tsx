import * as React from 'react';
import { IRecord } from './interfaces/IRecord';
import { Button } from 'react-bootstrap';
import { ShareRecordModal } from './shareRecord';
import * as bootbox from 'bootbox';



interface IProps {
    id: number;
    name: string;
    folder: boolean;
    trashed: boolean;
    children: number;
    tags: string[];
    changeParent(id: Number) :void;
    deleteRecord(id: Number, trashed: boolean) :void;
    renameRecord(id: Number,newName:String) :void;
    untrashRecord(id: number): void;
    addTag(id: Number, tag: String): void;
    removeTag(id: Number, tag: String): void;
    shareRecord(id: Number, userName: String,permission:Number): void;
    copy(id: Number): void;
    move(id: Number): void;
}
export const Folder = (props: IProps) => (
    <tr >
        <td onClick={() => {bootbox.prompt("Enter new name",(name)=>{name && props.renameRecord(props.id,name)}); } }>{props.name}</td>
        <td onClick={() => props.changeParent(props.id)}>Children: {props.children}</td>
        <td>{props.folder ? "folder" : "file"}</td>
        <td onClick={() => props.trashed && props.untrashRecord(props.id)}>{props.trashed ? "yes" : "no"}</td>
        <td><a href="#" onClick={(e) => { props.deleteRecord(props.id, props.trashed) } }>Delete</a></td>
        <td>
            <Button bsSize="xsmall" onClick={ () => {bootbox.prompt("Enter new tag",(tag)=>{tag && props.addTag(props.id,tag)}); }}>Add Tag</Button>
            <ul>{
                props.tags.sort().map((tag, index) => { return <li key={index}>{tag} <Button bsSize="xsmall" onClick={() => { props.removeTag(props.id, tag) } }>-</Button></li> })
            }</ul>

        </td>
        <td>
            <Button onClick={() => { props.move(props.id) } }>Move</Button>
            {props.folder ? null : <Button onClick={() => { props.copy(props.id) } }>Copy</Button>}
            {props.folder ? null : <a href={`/files/${props.id}/content`} target={'_blank'}> <Button >Download</Button></a>}
            <Button onClick={() => {
                    bootbox.prompt("Enter User Name", (userName) => { 
                    props.shareRecord(props.id, userName, 1);
                })
            }}>Share</Button>
        </td>

    </tr>
);
