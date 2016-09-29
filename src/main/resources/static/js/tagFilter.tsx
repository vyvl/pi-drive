import * as React from 'react';
import { FormControl, Button, Form, FormGroup } from 'react-bootstrap';

interface IProps{
    searchTag:Function
}

export const TagSearch = (props:IProps) => {
    let searchTag = "";
    let input:HTMLInputElement = null;
    return (

        <Form inline>
            <FormGroup>
                <FormControl type="text" bsSize={"sm"} placeholder="search tag" onChange={(e) => { searchTag = (e.target as HTMLInputElement).value; input = (e.target as HTMLInputElement) } } />
                <Button onClick={() => { input && (input.value = ""); searchTag !== "" && props.searchTag(searchTag) } }>Search Tag</Button>
            </FormGroup>
        </Form>
    );
}