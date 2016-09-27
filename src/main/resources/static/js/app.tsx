import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore} from 'redux';
import * as ajax from 'superagent';
import { Record } from './record';
import { Table } from 'react-bootstrap';
import { Grid } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { ButtonGroup } from 'react-bootstrap';
import { Modal } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap';
import { FormControl } from 'react-bootstrap';
import { ControlLabel } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { IRecord } from './interfaces/IRecord';
import { File } from './file';
import { NewFile } from './newFile';

interface IState {
    path: string, records: IRecord[], parent: number,copied?:String
}
class TestGet extends React.Component<any, IState>{
    constructor() {
        super();
        this.state = {
            path: 'list',
            records: [],
            parent: null,
            copied:null
        }
        this.update = this.update.bind(this);
        this.reset = this.reset.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.fillPage = this.fillPage.bind(this);
        this.createRecordModal = this.createRecordModal.bind(this);
        this.createNewRecord = this.createNewRecord.bind(this);
        this.paste = this.paste.bind(this);
    }

    paste() {
        
    }
    update(e: IRecord) {
        if (e.folder) {
            this.setState({
                path: `${e.id}/children`, records: [], parent: e.id
            }, this.fillPage);
        }
    }
    reset() {
        this.setState({
            path: 'list',
            records: [],
            parent: null
        }, this.fillPage);
    }

    deleteRecord(data: IRecord) {
        let getUrl = `files/${data.id}`;
        if (data.trashed) {
            getUrl = `${getUrl}/trash`;
        }
        ajax.delete(getUrl).end(function (err: any, res: ajax.Response) {
            this.fillPage();
        }.bind(this))
    }
    componentWillMount() {
        this.fillPage();
    }

    fillPage() {
        ajax.get('/files/' + this.state.path).end(
            function (err: any, response: ajax.Response) {
                let newRecords = JSON.parse(response.text);

                if (!err && response) {

                    this.setState({ "path": this.state.path, records: newRecords });


                }
                else {
                    console.log(err);
                }
            }.bind(this))
    }

    createRecordModal() {
        ReactDOM.render(<NewFile click={this.createNewRecord} />, document.getElementById('modal'));
    }

    createNewRecord(data: any) {
        data.parent = this.state.parent;
        ajax.post('/files')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(data)).end(function (err: any, res: ajax.Response) {
                if (err) return;
                ReactDOM.unmountComponentAtNode(document.getElementById('modal'));
                this.fillPage();
            }.bind(this))
    }

    moveRecord(id: number, newParent: number) {
        ajax.post(`/files/${id}/move`)
            .set('Content-Type', 'application/json')
            .send(JSON.stringify({ newParent }))
            .end(
            function (err: any, res: ajax.Response) {
                if (err) return;
                this.fillPage();
            }.bind(this)
            )
    }
    render() {
        let files = this.state.records.map(rec => {
            // return <File key={rec.id} id={rec.id}/>
            return <Record key={rec.id} data={rec} click={this.update} delete={this.deleteRecord}></Record>;
        });
        let pasteButton = this.state.copied ? <Button onClick={this.paste}></Button> : null;

        return (
            <Grid>
                <Table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Children</th>
                            <th>Type</th>
                            <th>Trashed</th>
                            <th>Delete</th>
                            <th>Tags</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files}
                    </tbody>
                </Table>
                <ButtonGroup>
                    <Button onClick={this.reset}>Home</Button>
                    <Button onClick={this.createRecordModal}>Add</Button>
                    {pasteButton}
                </ButtonGroup>
                <div id="modal"></div>


            </Grid>
        );
    }
}

const render = () => {
    ReactDOM.render(<TestGet />, document.getElementById("app"));
}

render();