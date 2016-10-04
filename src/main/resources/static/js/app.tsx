import * as React from 'react';
import { Grid, Row, PageHeader, Table,Col } from 'react-bootstrap';
import { Folder } from './row';
import { Heading } from './tableHeadings';
import { IRecord } from './interfaces/IRecord';
import * as actionCreators from './actionCreators';
import { createStore, applyMiddleware, compose, bindActionCreators } from 'redux';
import { UploadModal } from './uploadFile';
import { TagSearch } from './tagFilter';
import { Navbar, Bar } from './bar';
import { connect } from 'react-redux';
import { IUser } from './interfaces/IUser';
import { NameSearch } from './searchFilter';

const mapStateToProps = (state: { children: IRecord[] }) => {
    return state;
}

const mapDispatchToProps = (dispatch: Redux.Dispatch<any>) => {
    return {
        'actions': bindActionCreators(actionCreators, dispatch)
    }
}

interface IProps {
    children: IRecord[];
    actions: typeof actionCreators;
    parent: number;
    user: IUser;
    modals: {upload:boolean}
}
const Root = (props: IProps) => {
    return (
        <Grid>
            <PageHeader><small>PI-Drive</small></PageHeader>
            <Row>
                <Bar />
            </Row>
            <Row>
                <Table striped>
                    <Heading />
                    <tbody>
                        {props.children.map((child, index) => {
                            return <Folder key={index} {...child} {...props.actions} />;
                        })}
                    </tbody>
                </Table>
            </Row>
            <Row>
                <Col lg={6}>
                    <TagSearch searchTag={props.actions.searchTag}></TagSearch>
                </Col>
                <Col lg={6}>
                    <NameSearch searchName={props.actions.searchName} />
                </Col>    
            </Row>
            <UploadModal show={props.modals.upload} hide={props.actions.closeFileUploadModal} uploadFile={props.actions.uploadFile} parent={props.parent}></UploadModal>
        </Grid>
    );
}
export const App = connect(mapStateToProps, mapDispatchToProps)(Root);