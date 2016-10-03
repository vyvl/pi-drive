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

const enhancers = compose(applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

let store = createStore(reducers, enhancers);
    store.dispatch(actionCreators.doFetch(null));
const Home = () => {
    return <Provider store={store}><App /></Provider>;
};
const RouteRender = () => {
    ReactDOM.render((
        <Router history={browserHistory}>
            <Route path="/" component={Home} />
            <Route path="/register" component={LoginPage} />
        </Router>), document.getElementById('app'));
}
const render = () => {
    ReactDOM.render(<Home />, document.getElementById('app'));
}
// render();
// store.subscribe(render);
RouteRender();
store.subscribe(RouteRender);
