import * as React from "react";
import { Grid, Row, PageHeader, Table, Col } from "react-bootstrap";
import { Folder } from "./Record/row";
import { Heading } from "./tableHeadings";
import IRecord from "./interfaces/IRecord";
import * as actionCreators from "./actionCreators";
import { createStore, applyMiddleware, compose, bindActionCreators, Dispatch } from "redux";
import { Upload } from "./modals/uploadFile";
import { TagFilter } from "./filters/tagFilter";
import { Navbar, Bar } from "./bar";
import { connect } from "react-redux";
import IUser from "./interfaces/IUser";
import { NameFilter } from "./filters/nameFilter";
import { IState } from "./interfaces/IState";
const mapStateToProps = (state: IState) => {
    return state;
};

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
    return {
        "actions": bindActionCreators(actionCreators as any, dispatch)
    };
};

interface IProps extends IState {
    actions: typeof actionCreators;
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
                    <TagFilter searchTag={props.actions.searchTag} />
                </Col>
                <Col lg={6}>
                    <NameFilter searchName={props.actions.searchName} />
                </Col>
            </Row>

            <Upload />
        </Grid>
    );
};
export const App = connect(mapStateToProps, mapDispatchToProps)(Main);