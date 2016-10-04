import * as React from 'react';
import { FormControl, FormGroup, ControlLabel, Button, Row, Grid, Col } from 'react-bootstrap';
import * as ajax from 'superagent';
import * as bootbox from 'bootbox';
export const Register = () => {
    let username = "";
    let password = "";
    let register = (username: string, password: string) => {
        let formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        return ajax.post('/users')
            .send(formData).end((err, res) => {
                if (!err && res) {
                    bootbox.alert('User registered successfully.');
                }
                else {
                    bootbox.alert('Failed registering user. Check username');
                }
            })
    }
    return (
        <form action="" method="post">
            <h3>Register an account</h3>
            <FormGroup>
                <ControlLabel>Enter Username</ControlLabel>
                <FormControl type="text" placeholder="Enter username" name="username" onChange={(e) => { username=(e.target as HTMLInputElement).value}}></FormControl>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Enter Password</ControlLabel>
                <FormControl type="password" placeholder="password" name="password" onChange={(e) => { password = (e.target as HTMLInputElement).value } }></FormControl>
            </FormGroup>
            <Button onClick={() => { register(username, password); } }>Register</Button>
        </form>
    );
}

export const Login = () => {
    return (
        <form action="/login" method="post">
            <h3>Login</h3>
            <FormGroup>
                <ControlLabel>Enter Username</ControlLabel>
                <FormControl type="text" placeholder="Enter username" name="username"></FormControl>
            </FormGroup>
            <FormGroup>
                <ControlLabel>Enter Password</ControlLabel>
                <FormControl type="password" placeholder="password" name="password"></FormControl>
            </FormGroup>
            <Button type="submit">Login</Button>
        </form>
    );
}

export const LoginPage = () => {
    return (
        <Grid>
            <Row>
                <Col lg={6}>
                    <Login></Login>
                    </Col>
                <Col lg={6}>
                    <Register></Register>
                    </Col>
            </Row>
        </Grid>
    );
} 