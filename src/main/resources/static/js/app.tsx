import * as React from 'react';
import * as ReactDOM from 'react-dom';

class TestGet extends React.Component<any,any>{
    render(){
        return <div>Hello World</div>
    }
}

ReactDOM.render(<TestGet/>,document.getElementById("app"));