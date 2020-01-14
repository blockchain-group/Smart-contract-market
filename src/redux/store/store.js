import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index'
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
// import market from '../reducers/marketplaceReducer'

const defaultState = {};

const enhancers = compose(
	applyMiddleware(thunk),
	window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
);

const store = createStore(rootReducer, defaultState, enhancers);

export const history = syncHistoryWithStore(createBrowserHistory(), store);

export default store;
