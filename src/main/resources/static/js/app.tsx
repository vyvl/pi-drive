import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ajax from 'superagent';
import {Record} from './record';
import {Table} from 'react-bootstrap';
import {Grid} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {IRecord} from './interfaces/IRecord';

class TestGet extends React.Component<any,{path:string,records:IRecord[]}>{
    constructor(){
        super();
        this.state = {
            path:'list',
            records : []
        }
        this.update = this.update.bind(this);
        this.reset = this.reset.bind(this);
    }
    update(e){
      this.setState({
          path:`${e}/children`,records:[]
      },this.fillPage);
      
    }
    reset(){
        this.setState({
            path:'list',
            records : []
        },this.fillPage);
    }
    componentWillMount(){
        this.fillPage();
    }

    fillPage(){
        console.log('start' + " " + this.state.path);
        ajax.get('/files/' + this.state.path).end((err,response)=>{
            if(!err && response){
                this.setState({"path":this.state.path,records:JSON.parse(response.text)})
            }
            else{
                console.log(err);
            }
        })
    }
    render(){
        let files =  this.state.records.map(rec => {
            return <Record key={rec.id} data={rec} c={this.update}></Record>;
        })
        return (
           <Grid>
            <Table>
            <thead>
            <tr>
                <th>Name</th>
                <th>Children</th>
                <th>Type</th>
                <th>Trashed</th>
            </tr>    
            </thead>
            <tbody>
                {files}
            </tbody>    
            </Table>
               <Button onClick={this.reset}>
               Home
               </Button> 
            
           </Grid>
        );
    }
}

ReactDOM.render(<TestGet/>,document.getElementById("app"));