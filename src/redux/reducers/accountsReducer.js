import {FETCH_ACCOUNTS} from "../actions/types";

const initialState = {
	accounts: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case FETCH_ACCOUNTS:
			return {
				...state,
				accounts: action.accounts
			};
		default:
			return state
	}
}