import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import * as ajax from 'superagent';
import { Table, Grid, Row, Button, PageHeader } from 'react-bootstrap';
import { Folder } from './row';
import { Heading } from './tableHeadings';
import { IRecord } from './interfaces/IRecord';
import { reducers } from './reducers';
import { UploadModal } from './uploadFile';
import { ShareRecordModal } from './shareRecord';
import { Navbar } from './bar';
import * as actionCreators from './actionCreators';
import { TagSearch } from './tagFilter';



const enhancers = compose(applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

let store = createStore(reducers,enhancers);

store.dispatch(actionCreators.doFetch());


const mapStateToProps = (state: { children: IRecord[] }) => {
    return state;
}

const mapDispatchToProps = (dispatch:Redux.Dispatch<any>) => {
    return {
        'actions': bindActionCreators(actionCreators, dispatch)
    }
}
const Root = (props: { children: IRecord[], actions: typeof actionCreators, parent: number }) => {
    return (
        <Grid>
            <PageHeader><small>PI-Drive</small></PageHeader>
            <Row>
                <Table striped={true}>
                    <Heading />
                    <tbody>
                        {props.children.map((child, index) => {
                            return <Folder key={index} {...child} {...props.actions} />;
                        })}
                    </tbody>
                </Table>
            </Row>
            <Row>
                <Navbar home={props.actions.doFetch} addRecord={props.actions.addRecord}  parent={props.parent}
                    upload={props.actions.fileUploadModal} paste={props.actions.paste} op={props.op} getSharedRecords={props.actions.getSharedRecords} />
            </Row>
            <Row>
                <TagSearch searchTag={props.actions.searchTag}></TagSearch>
            </Row>
            <UploadModal show={props.modals.upload} hide={props.actions.closeFileUploadModal} uploadFile={props.actions.uploadFile} parent={props.parent}></UploadModal>
            <form action="/logout" method="post">
            <Button type="submit" value="Sign Out">Sign Out</Button>
        </form>
        </Grid>
    );
}
const App = connect(mapStateToProps, mapDispatchToProps)(Root);




const render = () => {
    ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));
}
render();
store.subscribe(render);
