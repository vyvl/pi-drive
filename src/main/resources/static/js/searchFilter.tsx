import * as React from 'react';
import { FormControl, Button, Form, FormGroup } from 'react-bootstrap';

interface IProps{
    searchName:Function
}

export const NameSearch = (props:IProps) => {
    let search = "";
    let input:HTMLInputElement = null;
    return (

        <Form inline>
            <FormGroup>
                <FormControl type="text" placeholder="search name" onChange={(e) => { search = (e.target as HTMLInputElement).value; input = (e.target as HTMLInputElement) } } />
                <Button onClick={() => { input && (input.value = ""); search !== "" && props.searchName(search) } }>Search Name</Button>
            </FormGroup>
        </Form>
    );
}