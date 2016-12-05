import * as React from "react";
import { Glyphicon, Button, ButtonGroup } from "react-bootstrap";
import { IFolderProps } from "../interfaces/RowInterfaces";

export const FolderRow = (props: IFolderProps) => {
    let tags = <ul>  {props.tags.sort().map((tag, i) => { return <li key={i}>{tag} <Glyphicon glyph={"minus"} onClick={() => { props.removeTag(props.id, tag); } }></Glyphicon></li>; })}  </ul>;
    let untrashButton = props.trashed ? <Button bsSize="xsmall" onClick={() => { props.untrashRecord(props.id); } } disabled={!props.trashed}><Glyphicon glyph={"check"} />Untrash</Button> : null;

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
                    <Button bsSize="xsmall" onClick={() => props.changeParent(props.id)}><Glyphicon glyph={"folder-open"} />Open</Button>
                    <Button bsSize="xsmall" onClick={() => { props.move(props.id); } }><Glyphicon glyph={"move"} />Move</Button>
                    <Button bsSize="xsmall" onClick={() => { props.shareRecord(props.id); } }><Glyphicon glyph={"share-alt"} /> Share</Button>
                    <Button bsSize="xsmall" onClick={() => props.rename(props.id)}><Glyphicon glyph={"edit"} />Rename</Button>
                    <Button bsSize="xsmall" onClick={(e) => { props.deleteRecord(props.id, props.trashed, props.parent); } }><Glyphicon glyph={"trash"} />Delete</Button>
                    <Button bsSize="xsmall" onClick={() => { props.addTag(props.id); } }><Glyphicon glyph={"plus"} /> Add Tag</Button>
                    {untrashButton}
                </ButtonGroup>
            </td>
        </tr>
    );

};
export default FolderRow;