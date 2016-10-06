import * as React from 'react';
import { Grid, Row, PageHeader, Table, Col } from 'react-bootstrap';
import { Folder } from './Record/row';
import { Heading } from './tableHeadings';
import { IRecord } from './interfaces/IRecord';
import * as actionCreators from './actionCreators';
import { createStore, applyMiddleware, compose, bindActionCreators, Dispatch } from 'redux';
import { UploadModal } from './modals/uploadFile';
import { TagFilter } from './filters/tagFilter';
import { Navbar, Bar } from './bar';
import { connect } from 'react-redux';
import { IUser } from './interfaces/IUser';
import { NameFilter } from './filters/nameFilter';

const mapStateToProps = (state: { children: IRecord[] }) => {
    return state;
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        'actions': bindActionCreators(actionCreators as any, dispatch)
    }
}

interface IProps {
    children: IRecord[];
    actions: typeof actionCreators;
    parent: number;
    user: IUser;
    modals: { upload: boolean }
}
const Main = (props: IProps) => {
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
                    <TagFilter searchTag={props.actions.searchTag}></TagFilter>
                </Col>
                <Col lg={6} className="pull-right">
                    <NameFilter searchName={props.actions.searchName} />
                </Col>
            </Row>
            <UploadModal show={props.modals.upload} hide={props.actions.closeFileUploadModal} uploadFile={props.actions.uploadFile} parent={props.parent}></UploadModal>
        </Grid>
    );
}
export const App = connect(mapStateToProps, mapDispatchToProps)(Main);