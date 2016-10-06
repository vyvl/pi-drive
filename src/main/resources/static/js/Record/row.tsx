import * as React from 'react';
import IRecord from '../interfaces/IRecord';
import { Button, ButtonGroup, Glyphicon } from 'react-bootstrap';
import * as bootbox from 'bootbox';
import { IProps, IFileProps, IFolderProps } from '../interfaces/RowInterfaces';
import FileRow from './fileRow';
import FolderRow from './folderRow';




export const Folder = (props: IProps) => {

    function rename(id: number) {
        bootbox.prompt("Enter new name", (name) => { name && props.renameRecord(id, name) });
    }
    function addTag(id: number) {
        bootbox.prompt("Enter new tag",
            (tag) => { tag && props.addTag(id, tag) }
        );
    }

    function shareRecord(id: number) {
        bootbox.prompt("Enter User Name", (userName) => {
            props.shareRecord(id, userName, 1);
        })
    }
    if (!props.folder) {
        return (
            <FileRow name={props.name} id={props.id} rename={rename}
                trashed={props.trashed} untrashRecord={props.untrashRecord} deleteRecord={props.deleteRecord}
                addTag={addTag} tags={props.tags} removeTag={props.removeTag}
                shareRecord={shareRecord} copy={props.copy} move={props.move} parent={props.parent}></FileRow>
        );
    }
    else {
        return (
            <FolderRow name={props.name} id={props.id} rename={rename} children={props.children}
                trashed={props.trashed} untrashRecord={props.untrashRecord} deleteRecord={props.deleteRecord}
                addTag={addTag} tags={props.tags} removeTag={props.removeTag}
                shareRecord={shareRecord} move={props.move} changeParent={props.changeParent} parent={props.parent}
                ></FolderRow>
        );

    }
};




