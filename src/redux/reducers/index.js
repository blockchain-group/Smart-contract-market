import { combineReducers } from 'redux';
import marketplaceOperationsReducer from "./marketplaceReducer";
import {routerReducer} from "react-router-redux";
import accountsReducer from "./accountsReducer";

const appReducer = combineReducers({
	marketplaceOperationsReducer,
	accountsReducer,
	routing: routerReducer
});

const rootReducer = (state, action) => {
	return appReducer(state, action);
};

export default rootReducer;
