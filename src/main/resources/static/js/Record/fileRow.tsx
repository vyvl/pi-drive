import * as React from 'react';
import { Glyphicon, Button, ButtonGroup } from 'react-bootstrap';
import { IFileProps } from '../interfaces/RowInterfaces';

export const FileRow = (props: IFileProps) => {
    let tags = <ul>  {props.tags.sort().map((tag, i) => { return <li key={i}>{tag} <Glyphicon glyph={"minus"} onClick={() => { props.removeTag(props.id, tag) } }></Glyphicon></li> })}  </ul>
    let untrashButton = props.trashed ? <Button bsSize="xsmall" onClick={() => { props.untrashRecord(props.id) } } disabled={!props.trashed}><Glyphicon glyph={"check"} />Untrash</Button> : null;
    return (
        <tr>
            <td>
                <Glyphicon glyph={"file"} />
                {props.name}
            </td>
            <td >Children: 0</td>
            <td>{props.trashed ? "yes" : "no"}</td>
            <td>
                {tags}
            </td>
            <td>
                <ButtonGroup>
                    <Button bsSize="xsmall" onClick={() => { window.open(`/files/${props.id}/content`); } }><Glyphicon glyph={"download-alt"} />Download</Button>
                    <Button bsSize="xsmall" onClick={() => { props.move(props.id) } }><Glyphicon glyph={"move"} />Move</Button>
                    <Button bsSize="xsmall" onClick={() => { props.shareRecord(props.id) } }><Glyphicon glyph={"share-alt"} />Share</Button>
                    <Button bsSize="xsmall" onClick={() => props.rename(props.id)}><Glyphicon glyph={"edit"} />Rename</Button>
                    <Button bsSize="xsmall" onClick={() => { props.copy(props.id) } }><Glyphicon glyph={"duplicate"} />Copy</Button>
                    <Button bsSize="xsmall" onClick={(e) => { props.deleteRecord(props.id, props.trashed, props.parent) } }><Glyphicon glyph={"trash"} />Delete</Button>
                    <Button bsSize="xsmall" onClick={() => { props.addTag(props.id) } }><Glyphicon glyph={"plus"} /> Add Tag</Button>
                    {untrashButton}
                </ButtonGroup>

            </td>
        </tr>
    );

}

export default FileRow;