import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose, bindActionCreators } from 'redux';
import { Provider, connect } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { reducers } from './reducers';
import * as actionCreators from './actionCreators';
import { LoginPage } from './register';
import { App } from './app';
import { Router, Route, IndexRoute, hashHistory, browserHistory } from 'react-router';

declare let window: any;

const enhancers = compose(applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

let store = createStore(reducers, enhancers);

class Home extends React.Component<any, any>{

    componentWillMount() {
        store.dispatch(actionCreators.doFetch(null));
        store.dispatch(actionCreators.getLoggedInUser());
    }
    render() {
        return <Provider store={store}><App /></Provider>;
    }

}

const RouteRender = () => {
    ReactDOM.render((
        <Router history={browserHistory}>
            <Route path="/" component={Home} />
            <Route path="/register" component={LoginPage} />
        </Router>), document.getElementById('app'));
}

RouteRender();
//store.subscribe(RouteRender);
